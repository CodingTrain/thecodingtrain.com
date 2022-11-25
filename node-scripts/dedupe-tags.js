const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

/**
 * Searches for `index.json` files in a given directory and returns an array of parsed files.
 * @param {string} dir Name of directory to search for files
 * @param {?any[]} arrayOfFiles Array to store the parsed JSON files
 * @returns {any[]}
 */
function findContentFilesRecursive(dir, opt = {}) {
  const files = glob.sync(`${dir}/**/index.json`, opt);
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
 * @param {string} file File to parse
 */
function getVideoData(file) {
  const content = fs.readFileSync(`./${file}`, 'utf-8');
  const video = JSON.parse(content);

  const filePath = file.split(path.sep).slice(2);
  // console.log('[Parsing File]:', filePath.join('/'));

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

      return {
        data: partInfo,
        filePath: file,
        isMultipartChallenge: true
      };
    }
  } else {
    video.challengeTitle = video.title;
    return {
      data: video,
      filePath: file
    };
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

function main() {
  const challenges = findContentFilesRecursive('./content/videos/challenges');
  const otherVideos = findContentFilesRecursive('./content/videos', {
    ignore: './content/videos/challenges/**/index.json'
  });
  console.log(challenges.length, 'challenges found');
  console.log(otherVideos.length, 'other videos found');

  const challengesData = challenges.map((file) => getVideoData(file));
  const otherVideosData = otherVideos.map((file) => getVideoData(file));

  console.log('=================================');
  console.log('Coding Challenges:');
  console.log('=================================');
  console.log('Languages:');
  console.table(
    [...new Set(challengesData.map((c) => c.data.languages).flat())].sort()
  );

  console.log('=================================');
  console.log('Other Videos:');
  console.log('=================================');
  console.log('Languages:');
  console.table(
    [...new Set(otherVideosData.map((c) => c.data.languages).flat())].sort()
  );
}

main();
