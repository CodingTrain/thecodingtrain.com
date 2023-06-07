const { globSync } = require('glob');
const fs = require('fs');

describe('challenge videos should never have a canonicalTrack property', () => {
  const challengeVideos = getChallengeVideos();

  for (const [path, content] of challengeVideos) {
    test(`${path}`, () => {
      expect(content).not.toHaveProperty('canonicalTrack');
    });
  }
});

describe('track videos `canonicalTrack`', () => {
  const tracks = getTracks();
  const trackVideos = getTrackVideos();

  describe('track referenced does not exist', () => {
    for (const [path, _, content] of trackVideos) {
      if (content.canonicalTrack) {
        test(`${path}`, () => {
          expect(tracks.has(content.canonicalTrack)).toEqual(true);
        });
      }
    }
  });

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

function getChallengeVideos() {
  return globSync('content/videos/challenges/**/index.json').map((file) => {
    const content = JSON.parse(fs.readFileSync(file));
    return [file, content];
  });
}

function getTrackVideos() {
  return globSync('content/videos/**/index.json', {
    ignore: 'content/videos/challenges/**'
  }).map((file) => {
    const content = JSON.parse(fs.readFileSync(file));
    const slug = file.split('content/videos/')[1].split('/index.json')[0];
    return [file, slug, content];
  });
}

function getTracks() {
  const refs = globSync('content/tracks/**/index.json').map((file) => {
    const content = JSON.parse(fs.readFileSync(file));

    // pluck out video slugs from main and side tracks for convenience
    const videos = [];
    content.chapters?.forEach((chapter) => videos.push(...chapter.videos));
    content.videos?.forEach((video) => videos.push(video));

    return [file, content, videos];
  });

  const m = new Map();
  for (const ref of refs) {
    const parts = ref[0].split('/');
    const slug = parts[parts.length - 2];
    m.set(slug, ref);
  }
  return m;
}

function getTracksReferringToVideo(tracks, videoSlug) {
  const res = [];
  tracks.forEach(([path, content, videoSlugs], trackSlug) => {
    if (videoSlugs.includes(videoSlug)) {
      res.push(path);
    }
  });
  return res;
}
