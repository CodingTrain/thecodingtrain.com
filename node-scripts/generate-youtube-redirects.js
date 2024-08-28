const fs = require('node:fs');
const { paths, toSlug } = require('../content-testing/content');

// Generates a JSON file that maps YouTube IDs to their challenge or track URL
// Priority: challenge > canonical track > track

const redirects = {};

for (const path of paths.challenges) {
  const slug = toSlug.videosAndChallenges(path);
  const video = JSON.parse(fs.readFileSync(path));
  const parts = video.parts ?? [video];

  parts.forEach((part, i) => {
    const partAnchor = i > 0 ? `#part-${i + 1}` : '';
    redirects[part.videoId] = `/${slug}${partAnchor}`;
  });
}

const slugToVideo = new Map();
for (const path of paths.videos) {
  const slug = toSlug.videosAndChallenges(path);
  const video = JSON.parse(fs.readFileSync(path));
  slugToVideo.set(slug, video);
}

for (const path of paths.tracks) {
  const trackSlug = toSlug.tracks(path);
  const track = JSON.parse(fs.readFileSync(path));

  const chaptersOrVideos =
    track.videos ?? track.chapters.flatMap((c) => c.videos);

  for (const slug of chaptersOrVideos) {
    if (!slugToVideo.has(slug)) continue;

    const video = slugToVideo.get(slug);
    const parts = video.parts ?? [video];
    const isCanonicalTrack = video.canonicalTrack === trackSlug;

    parts.forEach((part, i) => {
      if (!redirects[part.videoId] || isCanonicalTrack) {
        const partAnchor = i > 0 ? `#part-${i + 1}` : '';
        redirects[part.videoId] = `/tracks/${trackSlug}/${slug}${partAnchor}`;
      }
    });
  }
}

fs.writeFileSync(
  'netlify/edge-functions/yt/redirects.json',
  JSON.stringify(redirects)
);

console.log(
  `${Object.keys(redirects).length} YouTube redirects were generated.`
);
