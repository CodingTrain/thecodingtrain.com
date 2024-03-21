// Coding Train YouTube Description Generator

// Usage:
// npm run yt-desc
// npm run yt-desc https://thecodingtrain.com/path/to/video/page
// npm run yt-desc https://youtube.com/watch?v=videoId
// npm run yt-desc ./path/to/index.json
// npm run yt-desc ./path/to/index.json -- -c # copy to clipboard

// Output files are saved to `./_descriptions` directory

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import clipboard from 'clipboardy';

const videos = [];

/**
 * @typedef {object} VideoInfo
 * @property {string} title
 * @property {string} description
 * @property {string} videoNumber
 * @property {string} videoId
 * @property {string} date
 * @property {string[]} languages
 * @property {string} nebulaSlug
 * @property {string[]} topics
 * @property {boolean} canContribute
 * @property {string[]} relatedChallenges
 * @property {{time: number, title: string}[]} timestamps
 * @property {{time: number, title: string}[]} corrections
 * @property {{title: string, description: string, image: string, urls: object}[]} codeExamples
 * @property {{title: string, links: {title: string, url: string, description: string}[]}[]} groupLinks
 */

/**
 * A Coding Train Video
 */
class Video {
  constructor(
    data,
    parentTracks,
    urls,
    filePath,
    canonicalTrack,
    slug,
    canonicalURL,
    isMultipartChallenge = false
  ) {
    /** @type {VideoInfo} */
    this.data = data;
    this.parentTracks = parentTracks;
    this.urls = urls;
    this.filePath = filePath;
    this.canonicalTrack = canonicalTrack;
    this.slug = slug;
    this.canonicalURL = canonicalURL;
    this.isMultipartChallenge = isMultipartChallenge;
  }
}

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

  let trackFolder, videoList, videoDirs;
  if (parsed.chapters) {
    // Main Track
    videoDirs = parsed.chapters
      .map((chap) =>
        chap.videos.map((video) => video.split('/').slice(0, -1).join('/'))
      )
      .flat()
      .filter((dir) => dir !== 'challenges');

    videoList = parsed.chapters.map((chap) => chap.videos).flat();
  } else {
    // Side Track
    videoDirs = parsed.videos
      .map((video) => video.split('/').slice(0, -1).join('/'))
      .filter((dir) => dir !== 'challenges');

    videoList = parsed.videos;
  }

  if (videoDirs.length == 0) {
    // ignore tracks with only challenges
    return null;
  } else if (videoDirs.length == 1) {
    trackFolder = videoDirs[0];
  } else {
    // find max used directory
    trackFolder = findMaxOccurences(videoDirs);
  }

  return {
    trackName,
    trackFolder,
    videoList,
    data: parsed
  };
}

/**
 * Parses index.json and returns an array
 * @param {string} file File to parse
 */
function getVideoData(file) {
  const videoList = [];
  const content = fs.readFileSync(`./${file}`, 'utf-8');
  const videoData = JSON.parse(content);

  const filePath = file.split(path.sep).slice(2);
  const videoPath = filePath.slice(0, -1).join('/');
  // console.log('[Parsing File]:', filePath.join('/'));
  let urls = [],
    canonicalTrack,
    canonicalURL;
  const parentTracks = [];

  if (filePath[0] === 'challenges') {
    urls.push(filePath.slice(0, 2).join('/'));
    canonicalURL = urls[0];
    for (let track of allTracks) {
      if (track.videoList.includes(videoPath)) {
        urls.push(['tracks', track.trackName, videoPath].join('/'));
        parentTracks.push(track.trackName);
      }
    }
  } else {
    if (videoData.canonicalTrack) {
      canonicalTrack = videoData.canonicalTrack;
      canonicalURL = ['tracks', canonicalTrack, videoPath].join('/');
      for (let track of allTracks) {
        if (track.videoList.includes(videoPath)) {
          urls.push(['tracks', track.trackName, videoPath].join('/'));
          parentTracks.push(track.trackName);
        }
      }
    } else {
      for (let track of allTracks) {
        if (track.videoList.includes(videoPath)) {
          canonicalTrack = track.trackName;
          urls.push(['tracks', track.trackName, videoPath].join('/'));
          parentTracks.push(track.trackName);
        }
      }
      canonicalURL = urls[0];
    }
  }

  if (urls.length == 0) {
    console.log(
      '⚠️  Warning: Could not find this video: ' +
        videoPath +
        ' in any track or challenge!'
    );
    return [];
  }

  const slug = urls[0].split('/').at(-1);

  if (videoData.parts && videoData.parts.length > 0) {
    // Multipart Coding Challenge
    // https://github.com/CodingTrain/thecodingtrain.com/issues/420#issuecomment-1218529904

    for (const part of videoData.parts) {
      // copy all info from base object
      const partInfo = JSON.parse(JSON.stringify(videoData));
      delete partInfo.parts;

      // copy videoId, title, timestamps from parts
      partInfo.videoId = part.videoId;
      partInfo.timestamps = part.timestamps;
      partInfo.challengeTitle = videoData.title;
      partInfo.partTitle = part.title;
      partInfo.title = videoData.title + ' - ' + part.title;

      const video = new Video(
        partInfo,
        parentTracks,
        urls,
        file,
        canonicalTrack,
        slug,
        canonicalURL,
        true
      );

      videoList.push(video);
    }
  } else {
    videoData.challengeTitle = videoData.title;
    const video = new Video(
      videoData,
      parentTracks,
      urls,
      file,
      canonicalTrack,
      slug,
      canonicalURL
    );

    videoList.push(video);
  }
  return videoList;
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

const playlistWarnings = new Set();
/**
 * Retrieves YouTube video/playlist url from relative website path
 * @param {string} url original relative url
 * @returns {string} resolved url
 */
function resolveCTLink(url) {
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
      if (!playlistWarnings.has(urlchunks[1])) {
        console.warn(
          '⚠️  Warning: YT Playlist not found for track:',
          urlchunks[1]
        );
        playlistWarnings.add(urlchunks[1]);
      }
      return `https://thecodingtrain.com/${location}`;
    }
  }

  let page;
  try {
    page = videos.find((vid) => vid.urls.includes(location)).data;
  } catch (err) {
    console.warn('⚠️  Warning: Could not resolve to YT video:', url);
    return `https://thecodingtrain.com${url}`;
  }

  return `https://youtu.be/${page.videoId}`;
}

/**
 * Retrieves Coding Train video for a given YT link
 * @param {URL} url YT video url
 * @returns {video} video object
 */
function resolveYTLink(url) {
  // youtube.com or youtu.be
  if (
    url.hostname.includes('youtube.com') ||
    url.hostname.includes('youtu.be')
  ) {
    const videoId = url.searchParams.get('v') || url.pathname.slice(1);
    const video = videos.find((vid) => vid.data.videoId === videoId);
    if (video) {
      return video;
    }
  }
  return null;
}

/**
 * Finds the most occuring item in an array
 * @param {string[]} arr array of items
 */
function findMaxOccurences(arr) {
  const counts = {};
  for (const item of arr) {
    if (counts[item]) {
      counts[item]++;
    } else {
      counts[item] = 1;
    }
  }
  const max = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  );
  return max;
}

/**
 * Creates YT description for a video and writes to `_description/***.txt`
 * @param {any} video video data
 */
function writeDescription(video) {
  const data = video.data;
  const pageURL = video.canonicalURL;
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

  // Other Code Examples
  const getURL = (urls) =>
    urls.p5 || urls.processing || urls.node || urls.other;
  const otherCodeExamples = data.codeExamples?.filter(
    (ex) =>
      !ex.urls.p5 &&
      getURL(ex.urls) !== repoLink &&
      !sketchUrls.includes(getURL(ex.urls))
  );
  if (otherCodeExamples && otherCodeExamples.length > 0) {
    if (otherCodeExamples.length > 1) {
      if (sketchUrls?.length > 0 || repoLink) description += '\n';
      description += '\nCode Examples:';
      for (const ex of otherCodeExamples) {
        description += `\n💻 ${ex.title}: ${getURL(ex.urls)}`;
      }
    } else {
      const ex = otherCodeExamples[0];
      description += `\n💻 Code Example: ${getURL(ex.urls)}`;
    }
  }
  if (repoLink || sketchUrls?.length > 0 || otherCodeExamples?.length > 0)
    description += '\n';

  // Other Parts of this Coding Challenge

  if (video.isMultipartChallenge) {
    const otherParts = videos.filter(
      (vid) => vid.slug === video.slug && vid !== video
    );

    if (otherParts.length > 0) {
      description += '\nOther Parts of this Challenge:';
      for (const part of otherParts) {
        description += `\n📺 https://youtu.be/${part.data.videoId}`;
      }
      description += '\n';
    }
  }

  // Previous Video / Next Video / All Videos

  if (video.canonicalURL.startsWith('challenges/')) {
    const i = +video.data.videoNumber;
    const previousVideo = videos.find((vid) => vid.data.videoNumber == i - 1);
    const nextVideo = videos.find((vid) => vid.data.videoNumber == i + 1);
    const challengePL = 'PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH';

    description += '\n';

    if (previousVideo)
      description += `🎥 Previous: https://youtu.be/${previousVideo.data.videoId}?list=${challengePL}\n`;

    if (nextVideo)
      description += `🎥 Next: https://youtu.be/${nextVideo.data.videoId}?list=${challengePL}\n`;
    description += `🎥 All: https://www.youtube.com/playlist?list=${challengePL}\n`;
  } else {
    const path = video.canonicalURL.split('/');
    const videoDir = path.slice(2).join('/');

    const track = allTracks.find((t) => t.trackName === video.canonicalTrack);

    if (track) {
      description += '\n';
      let id = track.videoList.indexOf(videoDir);

      const previousPath = track.videoList[id - 1];
      const previousVideo = videos.find((vid) =>
        vid.urls.includes('tracks/' + track.trackName + '/' + previousPath)
      );

      const nextPath = track.videoList[id + 1];
      const nextVideo = videos.find((vid) =>
        vid.urls.includes('tracks/' + track.trackName + '/' + nextPath)
      );
      const plId = track.data.playlistId
        ? `?list=${track.data.playlistId}`
        : '';

      if (previousVideo)
        description += `🎥 Previous: https://youtu.be/${previousVideo.data.videoId}${plId}\n`;

      if (nextVideo)
        description += `🎥 Next: https://youtu.be/${nextVideo.data.videoId}${plId}\n`;

      if (track.data.playlistId)
        description += `🎥 All: https://www.youtube.com/playlist${plId}\n`;
    }
  }

  // Group Links (References / Videos / ...)

  if (data.groupLinks) {
    for (let group of data.groupLinks) {
      description += `\n${group.title}:\n`;
      for (const link of group.links) {
        link.icon = link.icon || (group.title === 'Videos' ? '🎥' : '🔗');
        let url;
        if (/https?:\/\/.*/.test(link.url)) {
          // Starts with http:// or https://
          url = link.url;
        } else {
          // assume relative link in thecodingtrain.com
          // try to get YT link instead of website link
          url = resolveCTLink(link.url);
        }
        // if it's a youtube link, don't add the title (#1280)
        if (
          new URL(url).hostname.includes('youtube') ||
          new URL(url).hostname.includes('youtu.be')
        ) {
          description += `${link.icon} ${url}\n`;
        } else {
          description += `${link.icon} ${link.title}: ${url}\n`;
        }
      }
    }
  }

  // Related Challenges
  if (data.relatedChallenges && data.relatedChallenges.length > 0) {
    description += `\nRelated Coding Challenges:\n`;
    for (const challenge of data.relatedChallenges) {
      const challengeData = videos.find((vid) =>
        vid.urls.includes(`challenges/${challenge}`)
      );
      if (challengeData) {
        const url = challengeData.canonicalURL;
        description += `🚂 ${resolveCTLink(url)}` + '\n';
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

  // Corrections
  if (data.corrections && data.corrections.length > 0) {
    description += '\nCorrections: \n';
    for (const correction of data.corrections) {
      description += `${correction.time} ${correction.title}\n`;
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

🎥 https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH
🎥 https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA

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
  const copyToClipboard = args.includes('-c') || args.includes('--copy');

  const directory = 'content/videos';

  const files = findContentFilesRecursive(directory);
  primeDirectory('./_descriptions');

  for (const file of files) {
    videos.push(...getVideoData(file));
  }

  if (video) {
    let specifiedVideos = [];
    try {
      // coding train website url
      const url = new URL(video);
      if (url.hostname == 'thecodingtrain.com') {
        const pathName = url.pathname;
        specifiedVideos = videos.filter((data) =>
          data.urls.includes(pathName.slice(1))
        );
      } else {
        const video = resolveYTLink(url);
        if (video) {
          specifiedVideos = [video];
        } else {
          console.log('❌ Could not find video for', url.href);
          return;
        }
      }
    } catch (e) {
      // local index.json path
      let filePath = video;
      specifiedVideos = videos.filter((data) =>
        data.filePath.startsWith(filePath)
      );
    }

    if (specifiedVideos.length === 0) {
      console.log(`❌ No video found for ${video}`);
      return;
    }

    for (const video of specifiedVideos) {
      const description = writeDescription(video);
      if (specifiedVideos.length == 1) {
        console.log('=====================================================');
        console.log(description);
        console.log('=====================================================');
      }

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
