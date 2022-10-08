const { paginate } = require('gatsby-awesome-pagination');
const { toSlug } = require('./utils');

const ITEMS_PER_PAGE = 50;

/**
 * Creates single Challenge pages for all loaded Challenge nodes
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
exports.createChallengesPages = async (graphql, createPage) => {
  const {
    data: { challenges }
  } = await graphql(`
    query {
      challenges: allChallenge {
        nodes {
          id
          slug
        }
      }
    }
  `);

  challenges.nodes.forEach((challenge) => {
    // Passes context variables for querying corresponding
    // challenge, contributions and images in front-end
    createPage({
      path: `challenges/${challenge.slug}`,
      component: require.resolve(`../src/templates/challenge.js`),
      context: {
        id: challenge.id,
        slug: challenge.slug
      }
    });
  });

  paginate({
    createPage,
    items: challenges.nodes,
    itemsPerPage: ITEMS_PER_PAGE,
    pathPrefix: '/challenges',
    component: require.resolve(`../src/templates/challenges.js`),
    context: {
      topic: '',
      topicRegex: '/.*.*/',
      language: '',
      languageRegex: '/.*.*/'
    }
  });

  const {
    data: { languages, topics }
  } = await graphql(`
    query {
      languages: allTag(filter: { type: { eq: "language" } }) {
        nodes {
          value
        }
      }
      topics: allTag(filter: { type: { eq: "topic" } }) {
        nodes {
          value
        }
      }
    }
  `);

  [...languages.nodes, { value: '' }].forEach(async ({ value: language }) => {
    const languageRegex = `/.*${language}.*/`;
    [...topics.nodes, { value: '' }].forEach(async ({ value: topic }) => {
      const topicRegex = `/.*${topic}.*/`;
      const {
        data: { filteredChallenges }
      } = await graphql(`
        query {
          filteredChallenges: allChallenge (
            filter: {
              languagesFlat: {regex: "${languageRegex}"}
              topicsFlat: {regex: "${topicRegex}"}
            }
          ) {
            nodes {
              id
              slug
            }
          }
        }
      `);

      paginate({
        createPage,
        items: filteredChallenges.nodes,
        itemsPerPage: ITEMS_PER_PAGE,
        pathPrefix: `/challenges/lang/${
          language !== '' ? toSlug(language) : 'all'
        }/topic/${topic !== '' ? toSlug(topic) : 'all'}`,
        component: require.resolve(`../src/templates/challenges.js`),
        context: {
          topic,
          topicRegex,
          language,
          languageRegex
        }
      });
    });
  });
};

/**
 * Creates tracks pages for all loaded Tracks nodes
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
exports.createTracksPages = async (graphql, createPage) => {
  const {
    data: { tracks }
  } = await graphql(`
    query {
      tracks: allTrack {
        nodes {
          id
          slug
        }
      }
    }
  `);

  paginate({
    createPage,
    items: tracks.nodes,
    itemsPerPage: ITEMS_PER_PAGE,
    pathPrefix: '/tracks',
    component: require.resolve(`../src/templates/tracks.js`),
    context: {
      topic: '',
      topicRegex: '/.*.*/',
      language: '',
      languageRegex: '/.*.*/'
    }
  });

  const {
    data: { languages, topics }
  } = await graphql(`
    query {
      languages: allTag(filter: { type: { eq: "language" } }) {
        nodes {
          value
        }
      }
      topics: allTag(filter: { type: { eq: "topic" } }) {
        nodes {
          value
        }
      }
    }
  `);

  [...languages.nodes, { value: '' }].forEach(async ({ value: language }) => {
    const languageRegex = `/.*${language}.*/`;
    [...topics.nodes, { value: '' }].forEach(async ({ value: topic }) => {
      const topicRegex = `/.*${topic}.*/`;
      const {
        data: { filteredTracks }
      } = await graphql(`
        query {
          filteredTracks: allTrack (
            filter: {
              languagesFlat: {regex: "${languageRegex}"}
              topicsFlat: {regex: "${topicRegex}"}
            }
          ) {
            nodes {
              id
              slug
            }
          }
        }
      `);

      paginate({
        createPage,
        items: filteredTracks.nodes,
        itemsPerPage: ITEMS_PER_PAGE,
        pathPrefix: `/tracks/lang/${
          language !== '' ? toSlug(language) : 'all'
        }/topic/${topic !== '' ? toSlug(topic) : 'all'}`,
        component: require.resolve(`../src/templates/tracks.js`),
        context: {
          topic,
          topicRegex,
          language,
          languageRegex
        }
      });
    });
  });
};

/**
 * Creates individual Video pages nested from the loaded tracks
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
exports.createTrackVideoPages = async (graphql, createPage) => {
  const { data } = await graphql(`
    query {
      tracks: allTrack {
        nodes {
          id
          slug
          type
          videos {
            id
            slug
            source
          }
          chapters {
            videos {
              id
              slug
              source
            }
          }
        }
      }
    }
  `);
  data.tracks.nodes.forEach((track) => {
    // Determine the corresponding first video of the track
    const firstVideo = track.chapters
      ? track.chapters[0].videos[0]
      : track.videos[0];

    // Create track intro page with first video

    createPage({
      path: `tracks/${track.slug}`,
      component: require.resolve(`../src/templates/track-video.js`),
      context: {
        isTrackPage: true,
        trackId: track.id,
        videoId: firstVideo.id,
        videoSlug: firstVideo.slug,
        source: firstVideo.source,
        trackPosition: { chapterIndex: 0, videoIndex: 0 }
      }
    });
    // For a main track, each video has it's own URL and page
    // Context is passed so that front-end correctly loads related data
    if (track.chapters) {
      track.chapters.forEach((chapter, chapterIndex) => {
        chapter.videos.forEach((video, videoIndex) => {
          createPage({
            path: `tracks/${track.slug}/${video.slug}`,
            component: require.resolve(`../src/templates/track-video.js`),
            context: {
              isTrackPage: false,
              trackId: track.id,
              videoId: video.id,
              videoSlug: video.slug,
              source: video.source,
              trackPosition: { chapterIndex, videoIndex: videoIndex }
            }
          });
        });
      });
    } else {
      // Context is passed so that front-end correctly loads related data
      track.videos.forEach((video, videoIndex) => {
        createPage({
          path: `tracks/${track.slug}/${video.slug}`,
          component: require.resolve(`../src/templates/track-video.js`),
          context: {
            isTrackPage: false,
            trackId: track.id,
            videoId: video.id,
            videoSlug: video.slug,
            source: video.source,
            trackPosition: { chapterIndex: 0, videoIndex }
          }
        });
      });
    }
  });
};

/**
 * Creates single Guide pages for all loaded MDX nodes
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
exports.createGuidePages = async (graphql, createPage) => {
  const { data } = await graphql(`
    query {
      mdxs: allMdx {
        nodes {
          slug
        }
      }
    }
  `);

  data.mdxs.nodes.forEach((mdx) => {
    createPage({
      path: `guides/${mdx.slug}`,
      component: require.resolve(`../src/templates/guide.js`),
      context: {
        slug: mdx.slug
      }
    });
  });
};
