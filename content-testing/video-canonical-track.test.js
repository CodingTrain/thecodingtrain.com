const fs = require('fs');
const { paths, toSlug } = require('./content');

describe('track videos `canonicalTrack`', () => {
  const tracks = getTracks();
  const trackVideos = getTrackVideos();

  describe('video is not used in the referenced track', () => {
    for (const [videoPath, videoSlug, content] of trackVideos) {
      if (content.canonicalTrack && tracks.has(content.canonicalTrack)) {
        const [trackPath, _, trackVideos] = tracks.get(content.canonicalTrack);

        test(`track: ${trackPath} | video: ${videoPath}`, () => {
          expect(trackVideos).toContain(videoSlug);
        });
      }
    }
  });

  describe('canonicalTrack requirement', () => {
    for (const [videoPath, videoSlug, content] of trackVideos) {
      const trackRefs = getTracksReferringToVideo(tracks, videoSlug);

      if (trackRefs.length > 1) {
        test(`video is referenced by ${trackRefs.length} tracks but doesn't have a canonicalTrack property ${videoPath} | Tracks: ${trackRefs}`, () => {
          expect(content).toHaveProperty('canonicalTrack');
        });
      } else {
        test(`video is referenced by at most one track and should not have a canonicalTrack property ${videoPath}`, () => {
          expect(content).not.toHaveProperty('canonicalTrack');
        });
      }
    }
  });
});

// ---

function getTrackVideos() {
  return paths.videos.map((file) => {
    const content = JSON.parse(fs.readFileSync(file));
    const slug = toSlug.videosAndChallenges(file);
    return [file, slug, content];
  });
}

function getTracks() {
  const refs = paths.tracks.map((file) => {
    const content = JSON.parse(fs.readFileSync(file));

    // pluck out video slugs from main and side tracks for convenience
    const videos = [];
    content.chapters?.forEach((chapter) => videos.push(...chapter.videos));
    content.videos?.forEach((video) => videos.push(video));

    return [file, content, videos];
  });

  const m = new Map();
  for (const ref of refs) {
    const file = ref[0];
    const slug = toSlug.tracks(file);
    m.set(slug, ref);
  }
  return m;
}

function getTracksReferringToVideo(tracks, videoSlug) {
  const res = [];
  tracks.forEach(([path, _, videoSlugs]) => {
    if (videoSlugs.includes(videoSlug)) {
      res.push(path);
    }
  });
  return res;
}
