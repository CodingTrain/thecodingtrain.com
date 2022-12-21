const { paginate } = require('gatsby-awesome-pagination');
const { toSlug } = require('./utils');
const { writeFile } = require('fs/promises');

const ITEMS_PER_PAGE = 50;

const extractTags = (nodes, pluckKey) => {
  const set = new Set();
  nodes.forEach((node) => {
    node[pluckKey].forEach((val) => set.add(val));
  });

  return [...set].sort((a, b) => {
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  });
};

/**
 * Creates Gatsby slices
 * @param {function} createSlice - Gatsby's createSlice function
 */
exports.createSlices = async (createSlice) => {
  createSlice({
    id: `TopBar`,
    component: require.resolve(`../src/components/TopBar.js`)
  });

  createSlice({
    id: `Footer`,
    component: require.resolve(`../src/components/Footer.js`)
  });
};

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
          languages
          topics
        }
      }
    }
  `);

  const languages = extractTags(challenges.nodes, 'languages');
  const topics = extractTags(challenges.nodes, 'topics');

  await writeFile(
    './public/filters-challenges.json',
    JSON.stringify({ languages, topics })
  );

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
      language: ''
    }
  });

  for (let language of [...languages, '']) {
    for (let topic of [...topics, '']) {
      const {
        data: { filteredChallenges }
      } = await graphql(`
        query {
          filteredChallenges: challengesPaginatedFilteredByTags(language: "${language}", topic: "${topic}")  {
            id
          }
        }
      `);

      paginate({
        createPage,
        items: filteredChallenges,
        itemsPerPage: ITEMS_PER_PAGE,
        pathPrefix: `/challenges/lang/${
          !language ? 'all' : toSlug(language)
        }/topic/${!topic ? 'all' : toSlug(topic)}`,
        component: require.resolve(`../src/templates/challenges.js`),
        context: { topic, language }
      });
    }
  }
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
          languages
          topics
        }
      }
    }
  `);

  const languages = extractTags(tracks.nodes, 'languages');
  const topics = extractTags(tracks.nodes, 'topics');

  await writeFile(
    './public/filters-tracks.json',
    JSON.stringify({ languages, topics })
  );

  paginate({
    createPage,
    items: tracks.nodes,
    itemsPerPage: ITEMS_PER_PAGE,
    pathPrefix: '/tracks',
    component: require.resolve(`../src/templates/tracks.js`),
    context: {
      topic: '',
      language: ''
    }
  });

  for (let language of [...languages, '']) {
    for (let topic of [...topics, '']) {
      const {
        data: { filteredTracks }
      } = await graphql(`
      query {
        filteredTracks: tracksPaginatedFilteredByTags(language: "${language}", topic: "${topic}")  {
          id
        }
      }
      `);

      paginate({
        createPage,
        items: filteredTracks,
        itemsPerPage: ITEMS_PER_PAGE,
        pathPrefix: `/tracks/lang/${
          !language ? 'all' : toSlug(language)
        }/topic/${!topic ? 'all' : toSlug(topic)}`,
        component: require.resolve(`../src/templates/tracks.js`),
        context: { topic, language }
      });
    }
  }
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
          fields {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  const template = require.resolve(`../src/templates/guide.js`);

  data.mdxs.nodes.forEach((mdx) => {
    createPage({
      path: `guides/${mdx.fields.slug}`,
      component: `${template}?__contentFilePath=${mdx.internal.contentFilePath}`,
      context: {
        slug: mdx.fields.slug
      }
    });
  });
};
