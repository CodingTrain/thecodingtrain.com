const video = {
  name: 'video',
  getSlugs: (video) => video.relatedChallenges ?? [],
  relativePath: './content/videos/challenges'
};

const trackOrder = {
  name: 'trackOrder',
  getSlugs: (file) => [...file.trackOrder],
  relativePath: './content/tracks'
};

const track = {
  name: 'track',
  getSlugs: (track) => {
    let slugs = [];
    (track.chapters ?? []).forEach((chapter) => {
      slugs = [...slugs, ...chapter.videos];
    });
    slugs = [...slugs, ...(track.videos ?? [])];
    return slugs;
  },
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
  relativePath: './content/pages/faqs'
};

module.exports = {
  video,
  track,
  trackOrder,
  faqsOrder
};
