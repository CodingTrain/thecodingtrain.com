const video = {
  name: 'video',
  getSlugs: (video) => video.relatedChallenges ?? [],
  relativePath: './content/videos/challenges'
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

const faqsOrder = {
  name: 'faq order',
  getSlugs: (order) => {
    let slugs = [];
    (order.sections ?? []).forEach((section) => {
      slugs = [...slugs, ...section.questions];
    });
    return slugs.map((s) => `${s}.json`);
  },
  relativePath: './content/faqs'
};

module.exports = {
  video,
  mainTrack,
  sideTrack,
  faqsOrder
};
