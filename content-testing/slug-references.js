const video = {
  name: 'video',
  getSlugs: (video) => video.relatedJourneys ?? [],
  relativePath: './content/videos/journeys'
};

const mainTrack = {
  name: 'main track',
  getSlugs: (track) => {
    let slugs = [];
    (track.chapters ?? []).forEach((chapter) => {
      slugs = [...slugs, ...chapter.videos];
    });
    return slugs;
  },
  relativePath: './content/videos'
};
const sideTrack = {
  name: 'side track',
  getSlugs: (track) => track.videos ?? [],
  relativePath: './content/videos'
};

module.exports = {
  video,
  mainTrack,
  sideTrack
};
