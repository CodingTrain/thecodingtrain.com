const video = {
  name: 'video',
  getSlugs: (video) => video.relatedChallenges ?? [],
  relativePath: '../content/videos/challenges'
};

const mainTrack = {
  name: 'main track',
  getSlugs: (track) => {
    let slugs = [];
    (track.chapters ?? []).forEach((chapter) => {
      slugs = [...slugs, ...chapter.lessons];
    });
    return slugs;
  },
  relativePath: '../content/videos/lessons'
};
const sideTrack = {
  name: 'side track',
  getSlugs: (track) => track.videos ?? [],
  relativePath: '../content/videos'
};

module.exports = {
  video,
  mainTrack,
  sideTrack
};
