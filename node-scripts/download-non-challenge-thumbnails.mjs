import { paths } from '../content-testing/content.js';
import path from 'node:path';
import fs from 'node:fs';

// Thumbnails for non-challenge videos can just use the YouTube thumbnail.
// They are never displayed on the site directly, only when sharing links on social media.

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getImage(url) {
  const response = await fetch(url);

  if (!response.ok) return;

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

console.log(`Downloading ${paths.videos.length} thumbnails`);

for (const jsonPath of paths.videos) {
  const baseDir = path.join(path.dirname(jsonPath));

  // remove existing thumnails (co-located with index.json files if they exist)
  ['index.jpg', 'index.png'].forEach((filename) => {
    fs.rmSync(path.join(baseDir, filename), { force: true });
  });

  const video = JSON.parse(fs.readFileSync(jsonPath));
  const isMultiPart = !!video.parts;
  let videoId = isMultiPart ? video.parts[0].videoId : video.videoId;

  // download thumbnail from YouTube CDN
  const thumbnailResolutions = [
    'maxresdefault', // 1280x720 - may not be available for 720p videos
    'sddefault', // 640x480
    'hqdefault', // 480x360
    'mqdefault', // 320x180
    'default' // 120x90
  ];

  let buffer;
  let resolution;
  for (const thumbnailResolution of thumbnailResolutions) {
    resolution = thumbnailResolution;

    // const thumbnailPath = `https://img.youtube.com/vi_webp/${videoId}/${resolution}.webp`;
    const thumbnailPath = `https://img.youtube.com/vi/${videoId}/${resolution}.jpg`;
    buffer = await getImage(thumbnailPath);
    if (buffer) break;

    console.warn(
      videoId,
      `🟠`,
      resolution,
      `| missing, trying lower resolution...`
    );
  }

  if (!buffer) {
    console.error(
      `🔴 Failed to locate a thumbnail for ${videoId} - process aborted.`
    );
    process.exit(1);
  }

  console.log(videoId, '🟢', resolution, '\n');

  // write file to disk
  fs.writeFileSync(path.join(baseDir, 'index.jpg'), buffer);

  // sleep for a bit to avoid spamming / getting blocked
  await sleep(100 + Math.random() * 300);
}
