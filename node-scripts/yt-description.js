const fs = require('fs');
const path = require('path');

const videos = [];

/**
 * Searches for `index.json` files in a given directory and returns an array of parsed files.
 * @param {string} dir Name of directory to search for files
 * @param {?any[]} arrayOfFiles Array to store the parsed JSON files
 * @returns {any[]}
 */
function findContentFilesRecursive(dir, arrayOfFiles = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      arrayOfFiles = findContentFilesRecursive(`${dir}/${file}`, arrayOfFiles);
    } else {
      if (file === 'index.json') {
        arrayOfFiles.push(path.join(dir, '/', file));
      }
    }
  }

  return arrayOfFiles;
}

/**
 * Parse a track file
 * @param {string} track track's `index.json` file
 */
function parseTrack(track) {
  let trackName = path.dirname(track);
  trackName = trackName.slice(trackName.lastIndexOf(path.sep) + 1);
  const content = fs.readFileSync(`./${track}`, 'utf-8');
  const parsed = JSON.parse(content);

  let trackFolder, videoList;
  if (parsed.chapters) {
    // Main Track
    let video = parsed.chapters[0].videos[0];
    trackFolder = video.split('/').slice(0, -2);

    videoList = parsed.chapters.map((chap) => chap.videos).flat();
  } else {
    // Side Track
    let video = parsed.videos[0];
    trackFolder = video.split('/').slice(0, -1);

    // ignore track with coding challenge videos
    if (trackFolder[0] === 'challenges') return null;

    videoList = parsed.videos;
  }

  return {
    trackName,
    trackFolder: trackFolder.join('/'),
    videoList,
    data: parsed
  };
}

/**
 * Gets
 * @param {string} file File to parse
 * @returns
 */
function getVideoData(file) {
  const content = fs.readFileSync(`./${file}`, 'utf-8');
  const parsed = JSON.parse(content);

  const filePath = file.split(path.sep).slice(2);
  // console.log('[Parsing File]:', filePath.join('/'));
  let url;

  if (filePath[0] === 'challenges') {
    url = filePath.slice(0, 2);
  } else {
    for (let track of allTracks) {
      if (filePath.join('/').includes(track.trackFolder)) {
        url = ['tracks', track.trackName, ...filePath.slice(0, -1)];
        break;
      }
    }
  }

  if (!url || url.length == 0)
    throw new Error(
      'Something went wrong in parsing this file: ' + filePath.join('/')
    );
  const videoData = {
    pageURL: url.join('/'),
    data: parsed,
    filePath: file
  };
  videos.push(videoData);
  return videoData;
}

/**
 * Creates and resets temporary directory
 * @param {string} dir Directory Name
 */
function primeDirectory(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  fs.rmSync(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });

  fs.mkdirSync(dir, (err) => {
    if (err) {
      throw err;
    }
  });
}

/**
 * Retrieves YouTube video url from relative website path
 * @param {string} url original url
 * @returns
 */
function getVideoURL(url) {
  if (/https?:\/\/.*/.test(url)) return url;

  const location = url.substring(1, url.length);
  let page;
  try {
    page = videos.find((vid) => vid.pageURL === location).data;
  } catch (err) {
    console.error('Warning: Page not found -', location);
    return `https://thecodingtrain.com${url}`;
  }

  return `https://youtu.be/${page.videoId}`;
}

/**
 * Creates YT description for a video and writes to `_description/***.txt`
 * @param {any} video video data
 */
function writeDescription(video) {
  const data = video.data;
  const pageURL = video.pageURL;

  let description = '';

  // Description
  description += `${data.description.trim()}`;
  description += ` https://thecodingtrain.com/${pageURL}`;

  description += '\n';

  // Code Examples:

  // Github Repo Link
  const repoLink = data.codeExamples
    ?.map((ex) => Object.values(ex.urls))
    .flat()
    .find(
      (url) =>
        url.startsWith('https://github.com/CodingTrain') &&
        !url.slice(31).includes('/')
    );
  if (repoLink) {
    description += `\n💻 Github Repo: ${repoLink}`;
  }

  // Web Editor Links
  const sketchUrls = data.codeExamples?.filter(
    (ex) => ex.urls.p5 && ex.urls.p5.includes('editor.p5js.org')
  );
  if (sketchUrls && sketchUrls.length > 0) {
    if (sketchUrls.length > 1) {
      if (repoLink) description += '\n';
      description += '\np5.js Web Editor Sketches:';
      for (const sketch of sketchUrls) {
        description += `\n🕹️ ${sketch.title}: ${sketch.urls.p5}`;
      }
    } else {
      description += `\n🕹️ p5.js Web Editor Sketch: ${sketchUrls[0].urls.p5}`;
    }
  }
  if (repoLink || sketchUrls?.length > 0) description += '\n';

  // Previous Video / Next Video / All Videos
  if (video.pageURL.startsWith('challenges/')) {
    const i = +video.data.videoNumber;
    const previousVideo = videos.find((vid) => vid.data.videoNumber == i - 1);
    const nextVideo = videos.find((vid) => vid.data.videoNumber == i + 1);

    description += '\n';

    if (previousVideo)
      description += `🎥 Previous video: https://www.youtube.com/watch?v=${previousVideo.data.videoId}&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH\n`;

    if (nextVideo)
      description += `🎥 Next video: https://www.youtube.com/watch?v=${nextVideo.data.videoId}&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH\n`;
    description +=
      '🎥 All videos: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH\n';
  } else {
    const playlistIds = {
      noc: 'PLRqwX-V7Uu6ZV4yEcW3uDwOgGXKUUsPOM',
      code: 'PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA'
    };

    const path = video.pageURL.split('/');
    for (let pl in playlistIds) {
      if (path.includes(pl)) {
        description += '\n';
        const track = allTracks.find((track) => track.trackFolder.includes(pl));
        let id = track.videoList.indexOf(path.slice(2).join('/'));

        const previousPath = track.videoList[id - 1];
        const previousVideo = videos.find(
          (vid) =>
            vid.pageURL == 'tracks/' + track.trackName + '/' + previousPath
        );

        const nextPath = track.videoList[id + 1];
        const nextVideo = videos.find(
          (vid) => vid.pageURL == 'tracks/' + track.trackName + '/' + nextPath
        );

        if (previousVideo)
          description += `🎥 Previous video: https://www.youtube.com/watch?v=${previousVideo.data.videoId}&list=${playlistIds[pl]}\n`;

        if (nextVideo)
          description += `🎥 Next video: https://www.youtube.com/watch?v=${nextVideo.data.videoId}&list=${playlistIds[pl]}\n`;

        description += `🎥 All videos: https://www.youtube.com/playlist?list=${playlistIds[pl]}\n`;
      }
    }
  }

  // Group Links (References / Videos / ...)
  if (data.groupLinks) {
    const glIcons = {
      'Links discussed': '🔗',
      Links: '🔗',
      References: '🔗',
      Videos: '🎥'
    };
    for (let group of data.groupLinks) {
      description += `\n${group.title}:\n`;
      for (const link of group.links) {
        link.icon = link.icon || glIcons[group.title] || '';
        const url = link.url;
        if (/https?:\/\/.*/.test(url)) {
          // Starts with http:// or https://
          description += `${link.icon} ${link.title}: ${url}`.trim() + '\n';
        } else {
          // assume relative link in thecodingtrain.com
          description +=
            `${link.icon} ${link.title}: https://thecodingtrain.com${url}`.trim() +
            '\n';
        }
      }
    }
  }

  // Timestamps
  if (data.timestamps && data.timestamps.length > 0) {
    description += '\nTimestamps:\n';
    for (const topic of data.timestamps) {
      description += `${topic.time} ${topic.title}\n`;
    }
  }

  // General Links
  description += `
Editing by Mathieu Blanchette
Animations by Jason Heglund
Music from Epidemic Sound

🚂 Website: http://thecodingtrain.com/
👾 Share Your Creation! https://thecodingtrain.com/guides/passenger-showcase-guide
🚩 Suggest Topics: https://github.com/CodingTrain/Suggestion-Box
💡 GitHub: https://github.com/CodingTrain
💬 Discord: https://discord.gg/hPuGy2g
💖 Membership: http://youtube.com/thecodingtrain/join
🛒 Store: https://standard.tv/codingtrain
📚 Books: https://www.amazon.com/shop/thecodingtrain
🖋️ Twitter: https://twitter.com/thecodingtrain
📸 Instagram: https://www.instagram.com/the.coding.train/

🎥 Coding Challenges: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH
🎥 Intro to Programming: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA

🔗 p5.js: https://p5js.org
🔗 p5.js Web Editor: https://editor.p5js.org/
🔗 Processing: https://processing.org

📄 Code of Conduct: https://github.com/CodingTrain/Code-of-Conduct

This description was auto-generated. If you see a problem, please open an issue: https://github.com/CodingTrain/thecodingtrain.com/issues/new`;

  let filename = /\/((?:.(?!\/))+)$/.exec(pageURL)[1];
  fs.writeFileSync(`_descriptions/${filename}.txt`, description);

  return description;
}

// know about tracks beforehand
const mainTracks = findContentFilesRecursive('content/tracks/main-tracks')
  .map(parseTrack)
  .filter((x) => x);
const sideTracks = findContentFilesRecursive('content/tracks/side-tracks')
  .map(parseTrack)
  .filter((x) => x);
const allTracks = [...mainTracks, ...sideTracks];

(() => {
  console.log('💫 Generating YouTube Descriptions 💫');

  const args = process.argv.slice(2);
  const video = args[0];

  const directory = 'content/videos';

  const files = findContentFilesRecursive(directory);
  primeDirectory('./_descriptions');

  if (video) {
    const fileName = path.join(
      'content',
      'videos',
      ...video.split('/'),
      'index.json'
    );

    for (const file of files) {
      getVideoData(file);
    }

    const videoInfo = videos.find((data) => data.filePath === fileName);

    const description = writeDescription(videoInfo);
    console.log('=====================================================');
    console.log(description);
    console.log('=====================================================');
  } else {
    for (const file of files) {
      getVideoData(file);
    }
    videos.forEach(writeDescription);
  }
  console.log('\n✅ Wrote descriptions to  ./_descriptions/');
})();
