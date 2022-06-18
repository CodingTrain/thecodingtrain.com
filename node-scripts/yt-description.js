const fs = require('fs');
const path = require('path');

const videos = [];

function findVideoFilesRecursive(dir, arrayOfFiles = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      arrayOfFiles = findVideoFilesRecursive(`${dir}/${file}`, arrayOfFiles);
    } else {
      if (file === 'index.json') {
        arrayOfFiles.push(path.join(dir, '/', file));
      }
    }
  }

  return arrayOfFiles;
}

function parseTracks(dir) {
  const tracks = findVideoFilesRecursive(dir);
  const trackInfo = [];
  for (const track of tracks) {
    let trackName = path.dirname(track);
    trackName = trackName.slice(trackName.lastIndexOf(path.sep) + 1);
    const content = fs.readFileSync(`./${track}`, 'utf-8');
    const parsed = JSON.parse(content);

    let dirPath, videoList;
    if (parsed.chapters) {
      // main track
      let video = parsed.chapters[0].videos[0];
      dirPath = video.split('/').slice(0, -2);

      videoList = parsed.chapters.map((chap) => chap.videos).flat();
    } else {
      // side track
      let video = parsed.videos[0];
      dirPath = video.split('/').slice(0, -1);

      if (dirPath[0] === 'challenges') continue;

      videoList = parsed.videos;
    }

    trackInfo.push({
      name: trackName,
      dirName: dirPath.join('/'),
      videoList,
      data: parsed
    });
  }
  return trackInfo;
}

function getVideoData() {
  const directory = 'content/videos';

  const files = findVideoFilesRecursive(directory);

  for (const file of files) {
    const content = fs.readFileSync(`./${file}`, 'utf-8');
    const parsed = JSON.parse(content);

    const filePath = file.split(path.sep).slice(2);
    console.log(filePath.join('/'));
    let url;

    if (filePath[0] === 'challenges') {
      url = filePath.slice(0, 2);
    } else {
      for (let track of allTracks) {
        if (filePath.join('/').includes(track.dirName)) {
          url = ['tracks', track.name, ...filePath.slice(0, -1)];
        }
      }
    }

    if (!url || url.length == 0)
      throw new Error(
        'Something went wrong in parsing this file: ' + filePath.join('/')
      );
    videos.push({
      pageURL: url.join('/'),
      data: parsed
    });
  }
  // console.log(videos);
  return videos;
}

function primeDirectory(dir) {
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

function getVideoID(url) {
  if (/https?:\/\/.*/.test(url)) return url;

  const location = url.substring(1, url.length);
  let page;
  try {
    page = videos.find((vid) => vid.pageURL === location).data;
  } catch (err) {
    console.error(location);
    return url;
  }

  return `https://youtu.be/${page.videoId}`;
}

function writeDescriptions(videos) {
  primeDirectory('./_descriptions');

  for (const video of videos) {
    const data = video.data;
    const pageURL = video.pageURL;

    let description = '';

    // Description
    let content = data.description;
    description += `${content.trim()}`;
    description += `\n💻 Video Webpage: https://thecodingtrain.com/${pageURL}`;

    description += '\n';

    // Web Editor Links
    const sketchUrls = data.codeExamples?.filter(
      (ex) => ex.urls.p5 && ex.urls.p5.includes('editor.p5js.org')
    );
    if (sketchUrls && sketchUrls.length > 0) {
      if (sketchUrls.length > 1) {
        description += '\np5.js Web Editor Sketches:\n';
        for (const sketch of sketchUrls) {
          description += `🕹️ ${sketch.title}: ${sketch.urls.p5}\n`;
        }
      } else {
        description += `\n🕹️ p5.js Web Editor Sketch: ${sketchUrls[0].urls.p5}\n`;
      }
    }

    // console.log(videos);

    if (video.pageURL.startsWith('challenges/')) {
      const i = +video.data.videoNumber;
      const previousVideo = videos.find((vid) => vid.data.videoNumber == i - 1);
      const nextVideo = videos.find((vid) => vid.data.videoNumber == i + 1);

      description += '\n';

      if (previousVideo) {
        description += `🎥 Previous video: https://youtu.be/${previousVideo.data.videoId}\n`;
      }
      if (nextVideo) {
        description += `🎥 Next video: https://youtu.be/${nextVideo.data.videoId}\n`;
      }
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

          const track = allTracks.find((track) => track.dirName.includes(pl));
          // console.log(path, track.videoList);
          let id = track.videoList.indexOf(path.slice(2).join('/'));

          const previousPath = track.videoList[id - 1];
          const previousVideo = videos.find(
            (vid) => vid.pageURL == 'tracks/' + track.name + '/' + previousPath
          );

          const nextPath = track.videoList[id + 1];
          const nextVideo = videos.find(
            (vid) => vid.pageURL == 'tracks/' + track.name + '/' + nextPath
          );

          if (previousVideo) {
            description += `🎥 Previous video: https://www.youtube.com/watch?v=${previousVideo.data.videoId}&list=${playlistIds[pl]}\n`;
          }
          if (nextVideo) {
            description += `🎥 Next video: https://www.youtube.com/watch?v=${nextVideo.data.videoId}&list=${playlistIds[pl]}\n`;
          }
          description +=
            '🎥 All videos: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH\n';
        }
      }
    }

    const links = data.groupLinks?.find(
      (group) => group.title === 'References'
    );
    const videosR = data.groupLinks?.find((group) => group.title === 'Videos');

    // Links
    if (links && links.links.length > 0) {
      description += '\nLinks discussed in this video:\n';
      for (const link of links.links) {
        const url = link.url;
        if (/https?:\/\/.*/.test(url)) {
          // starts with http:// or https://
          description += `🔗 ${link.title}: ${url}\n`;
        } else {
          // assume relative link in thecodingtrain.com
          description += `🔗 ${link.title}: https://thecodingtrain.com${url}\n`;
        }
      }
    }

    // Videos
    if (videosR && videosR.links.length > 0) {
      description += '\nOther videos mentioned in this video:\n';
      for (const video of videosR.links) {
        if (
          video.url.includes('youtu.be') ||
          video.url.includes('youtube.com')
        ) {
          description += `🎥 ${video.title}: ${video.url}\n`;
        } else {
          description += `🎥 ${video.title}: ${getVideoID(video.url)}\n`;
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

    //fs.writeFileSync(`_descriptions/${data.video_id}.txt`, description);
    // console.log(pageURL);
    let filename = /\/((?:.(?!\/))+)$/.exec(pageURL)[1];
    fs.writeFileSync(`_descriptions/${filename}.txt`, description);
  }
}

// (() => {
console.log('💫 Generating YouTube Descriptions 💫');

// know about tracks beforehand
const mainTracks = parseTracks('content/tracks/main-tracks');
const sideTracks = parseTracks('content/tracks/side-tracks');
const allTracks = [...mainTracks, ...sideTracks];

writeDescriptions(getVideoData());
// })();
