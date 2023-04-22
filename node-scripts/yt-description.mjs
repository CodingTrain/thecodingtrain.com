// Coding Train YouTube Description Generator

// Usage:
// npm run yt-desc
// npm run yt-desc https://thecodingtrain.com/path/to/video/page
// npm run yt-desc ./path/to/index.json
// npm run yt-desc ./path/to/index.json -- -c # copy desc to clipboard

// Output files are saved to `./_descriptions` directory

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import clipboard from 'clipboardy';

const videos = [];

/**
 * Searches for `index.json` files in a given directory and returns an array of parsed files.
 * @param {string} dir Name of directory to search for files
 * @param {?any[]} arrayOfFiles Array to store the parsed JSON files
 * @returns {any[]}
 */
function findContentFilesRecursive(dir) {
  const files = globSync(`${dir}/**/index.json`);
  return files;
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
    // TODO fix (only checking first video)
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
 * Parses index.json and pushes to videos array
 *
 * Note: has side effects, must be called only once per file
 * @param {string} file File to parse
 */
function getVideoData(file) {
  const content = fs.readFileSync(`./${file}`, 'utf-8');
  const video = JSON.parse(content);

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

  const slug = url[url.length - 1];

  if (!url || url.length == 0) {
    throw new Error(
      'Something went wrong in parsing this file: ' + filePath.join('/')
    );
  }

  if (video.parts && video.parts.length > 0) {
    // Multipart Coding Challenge
    // https://github.com/CodingTrain/thecodingtrain.com/issues/420#issuecomment-1218529904

    for (const part of video.parts) {
      // copy all info from base object
      const partInfo = JSON.parse(JSON.stringify(video));
      delete partInfo.parts;

      // copy videoId, title, timestamps from parts
      partInfo.videoId = part.videoId;
      partInfo.timestamps = part.timestamps;
      partInfo.challengeTitle = video.title;
      partInfo.partTitle = part.title;
      partInfo.title = video.title + ' - ' + part.title;

      const videoData = {
        pageURL: url.join('/'),
        data: partInfo,
        filePath: file,
        isMultipartChallenge: true,
        slug: slug
      };
      videos.push(videoData);
    }
  } else {
    video.challengeTitle = video.title;
    const videoData = {
      pageURL: url.join('/'),
      data: video,
      filePath: file,
      slug: slug
    };
    videos.push(videoData);
  }
}

/**
 * Creates and resets a temporary directory
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
 * Retrieves YouTube video/playlist url from relative website path
 * @param {string} url original relative url
 * @returns {string} resolved url
 */
function resolveYTLink(url) {
  if (/https?:\/\/.*/.test(url)) return url;

  const location = url.startsWith('/') ? url.substring(1, url.length) : url;
  const urlchunks = location.split('/');
  if (!['challenges', 'tracks'].includes(urlchunks[0])) {
    // not linking to video page
    return `https://thecodingtrain.com/${location}`;
  }
  if (urlchunks[0] === 'tracks' && urlchunks.length === 2) {
    // track page
    // try to get playlist id from track's index.json
    const track = allTracks.find((t) => t.trackName === urlchunks[1]);
    if (track && track.data.playlistId) {
      const playlistId = track.data.playlistId;
      return `https://www.youtube.com/playlist?list=${playlistId}`;
    } else {
      console.warn('Warning: YT Playlist not found for track:', urlchunks[1]);
      return `https://thecodingtrain.com/${location}`;
    }
  }

  let page;
  try {
    page = videos.find((vid) => vid.pageURL === location).data;
  } catch (err) {
    console.warn('Warning: Could not resolve to YT video:', url);
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
  description += ` Code: https://thecodingtrain.com/${pageURL}`;

  description += '\n';

  // Watch on Nebula
  const nebulaURL = `https://nebula.tv/videos/`;
  const nebulaSlug = video.data.nebulaSlug;
  if (nebulaSlug) {
    description += `\n🚀 Watch this video ad-free on Nebula ${nebulaURL}${nebulaSlug}`;
    description += '\n';
  }

  // Code Examples:

  // Github Standalone Repo Link
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

  // Other Parts of this Coding Challenge

  if (video.isMultipartChallenge) {
    const otherParts = videos.filter(
      (vid) => vid.slug === video.slug && vid !== video
    );

    if (otherParts.length > 0) {
      description += '\nOther Parts of this Challenge:';
      for (const part of otherParts) {
        description += `\n📺 ${part.data.partTitle}: https://youtu.be/${part.data.videoId}`;
      }
      description += '\n';
    }
  }

  // Previous Video / Next Video / All Videos

  if (video.pageURL.startsWith('challenges/')) {
    const i = +video.data.videoNumber;
    const previousVideo = videos.find((vid) => vid.data.videoNumber == i - 1);
    const nextVideo = videos.find((vid) => vid.data.videoNumber == i + 1);

    description += '\n';

    if (previousVideo)
      description += `🎥 Previous video: https://youtu.be/${previousVideo.data.videoId}?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH\n`;

    if (nextVideo)
      description += `🎥 Next video: https://youtu.be/${nextVideo.data.videoId}?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH\n`;
    description +=
      '🎥 All videos: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH\n';
  } else {
    const path = video.pageURL.split('/');
    const videoDir = path.slice(2).join('/');
    // Find playlist id from main track only
    // TODO: check in side tracks as well
    const track = mainTracks.find((track) =>
      track.videoList.includes(videoDir)
    );
    if (track && track.data.playlistId) {
      description += '\n';
      let id = track.videoList.indexOf(videoDir);

      const previousPath = track.videoList[id - 1];
      const previousVideo = videos.find(
        (vid) => vid.pageURL == 'tracks/' + track.trackName + '/' + previousPath
      );

      const nextPath = track.videoList[id + 1];
      const nextVideo = videos.find(
        (vid) => vid.pageURL == 'tracks/' + track.trackName + '/' + nextPath
      );

      if (previousVideo)
        description += `🎥 Previous video: https://youtu.be/${previousVideo.data.videoId}?list=${track.data.playlistId}\n`;

      if (nextVideo)
        description += `🎥 Next video: https://youtu.be/${nextVideo.data.videoId}?list=${track.data.playlistId}\n`;

      description += `🎥 All videos: https://www.youtube.com/playlist?list=${track.data.playlistId}\n`;
    }
  }

  // Group Links (References / Videos / ...)

  if (data.groupLinks) {
    for (let group of data.groupLinks) {
      description += `\n${group.title}:\n`;
      for (const link of group.links) {
        link.icon = link.icon || (group.title === 'Videos' ? '🎥' : '🔗');
        const url = link.url;
        if (/https?:\/\/.*/.test(url)) {
          // Starts with http:// or https://
          description += `${link.icon} ${link.title}: ${url}\n`;
        } else {
          // assume relative link in thecodingtrain.com
          // try to get YT link instead of website link
          description += `${link.icon} ${link.title}: ${resolveYTLink(url)}\n`;
        }
      }
    }
  }

  // Related Challenges

  if (data.relatedChallenges && data.relatedChallenges.length > 0) {
    description += `\nRelated Coding Challenges:\n`;
    for (const challenge of data.relatedChallenges) {
      const challengeData = videos.find(
        (vid) => vid.pageURL === `challenges/${challenge}`
      );
      if (challengeData) {
        const { videoNumber, challengeTitle } = challengeData.data;
        const url = challengeData.pageURL;
        description +=
          `🚂 ${videoNumber} ${challengeTitle}: ${resolveYTLink(url)}` + '\n';
      } else {
        console.log(`Challenge ${challenge} not found`);
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

  // Credits
  const defaultCredits = `Editing by Mathieu Blanchette
Animations by Jason Heglund
Music from Epidemic Sound`;
  if (data.credits) {
    description += `\n${data.credits
      .map((c) =>
        c.url ? `${c.title} by ${c.name} (${c.url})` : `${c.title} by ${c.name}`
      )
      .join('\n')}\n`;
    description += `Music from Epidemic Sound\n`;
  } else {
    description += `\n${defaultCredits}\n`;
  }

  // General Links
  description += `
🚂 Website: https://thecodingtrain.com/
👾 Share Your Creation! https://thecodingtrain.com/guides/passenger-showcase-guide
🚩 Suggest Topics: https://github.com/CodingTrain/Suggestion-Box
💡 GitHub: https://github.com/CodingTrain
💬 Discord: https://thecodingtrain.com/discord
💖 Membership: http://youtube.com/thecodingtrain/join
🛒 Store: https://standard.tv/codingtrain
🖋️ Twitter: https://twitter.com/thecodingtrain
📸 Instagram: https://www.instagram.com/the.coding.train/

🎥 Coding Challenges: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH
🎥 Intro to Programming: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA

🔗 p5.js: https://p5js.org
🔗 p5.js Web Editor: https://editor.p5js.org/
🔗 Processing: https://processing.org

📄 Code of Conduct: https://github.com/CodingTrain/Code-of-Conduct

This description was auto-generated. If you see a problem, please open an issue: https://github.com/CodingTrain/thecodingtrain.com/issues/new`;

  // Hashtags
  const hashtags = [...data.topics, ...data.languages].map(
    (tag) => '#' + tag.match(/\w+/g).join('').toLowerCase()
  );
  description += `\n\n${hashtags.join(' ')}`;

  const videoSlug = video.slug;
  let filename = videoSlug + '_' + data.videoId;
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

(async () => {
  console.log('💫 Generating YouTube Descriptions 💫');

  const args = process.argv.slice(2);
  const video = args.filter((arg) => !arg.startsWith('-'))[0];
  const copyToClipboard = args.includes('-c');

  const directory = 'content/videos';

  const files = findContentFilesRecursive(directory);
  primeDirectory('./_descriptions');

  for (const file of files) {
    getVideoData(file);
  }

  if (video) {
    let specifiedVideos = [];
    try {
      // coding train website url
      const pathName = new URL(video).pathname;
      specifiedVideos = videos.filter(
        (data) => '/' + data.pageURL === pathName
      );
    } catch (e) {
      // local index.json path
      let filePath = video;
      if (!filePath.endsWith('index.json')) filePath = filePath + '/index.json';
      filePath = path.normalize(filePath);
      specifiedVideos = videos.filter((data) => data.filePath === filePath);
    }

    for (const video of specifiedVideos) {
      const description = writeDescription(video);
      console.log('=====================================================');
      console.log(description);
      console.log('=====================================================');

      if (copyToClipboard) {
        try {
          await clipboard.write(description);
          console.log('\n📋 Copied to clipboard');
        } catch (e) {
          console.log('\n❌ Failed to copy to clipboard');
        }
      }
    }
  } else {
    videos.forEach(writeDescription);
  }
  console.log('\n✅ Wrote descriptions to  ./_descriptions/');
})();
