import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { toSlug, paginate, extractTags } from './utils.mjs';

const ITEMS_PER_PAGE = 50; // tracks and challenges
const SHOWCASE_ITEMS_PER_PAGE = 51; // showcase has 3 cols

/**
 * Creates Gatsby slices
 * @param {function} createSlice - Gatsby's createSlice function
 */
const createSlices = async (createSlice) => {
  createSlice({
    id: `TopBar`,
    component: path.resolve(`./src/components/TopBar.js`)
  });

  createSlice({
    id: `Footer`,
    component: path.resolve(`./src/components/Footer.js`)
  });
};

/**
 * Creates single Challenge pages for all loaded Challenge nodes
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
const createChallengesPages = async (graphql, createPage) => {
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
      component: path.resolve(`./src/templates/challenge.js`),
      context: {
        id: challenge.id,
        slug: challenge.slug
      }
    });
  });

  const component = path.resolve(`./src/templates/challenges.js`);

  paginate({
    createPage,
    itemsTotal: challenges.nodes.length,
    itemsPerPage: ITEMS_PER_PAGE,
    pathPrefix: '/challenges',
    component,
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
        itemsTotal: filteredChallenges.length,
        itemsPerPage: ITEMS_PER_PAGE,
        pathPrefix: `/challenges/lang/${
          !language ? 'all' : toSlug(language)
        }/topic/${!topic ? 'all' : toSlug(topic)}`,
        component,
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
const createTracksPages = async (graphql, createPage) => {
  const component = path.resolve(`./src/templates/tracks.js`);

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
    itemsTotal: tracks.nodes.length,
    itemsPerPage: ITEMS_PER_PAGE,
    pathPrefix: '/tracks',
    component,
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
        itemsTotal: filteredTracks.length,
        itemsPerPage: ITEMS_PER_PAGE,
        pathPrefix: `/tracks/lang/${
          !language ? 'all' : toSlug(language)
        }/topic/${!topic ? 'all' : toSlug(topic)}`,
        component,
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
const createTrackVideoPages = async (graphql, createPage) => {
  const component = path.resolve(`./src/templates/track-video.js`);

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
      component,
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
            component,
            context: {
              isTrackPage: false,
              trackId: track.id,
              videoId: video.id,
              videoSlug: video.slug,
              source: video.source,
              trackPosition: { chapterIndex, videoIndex }
            }
          });
        });
      });
    } else {
      // Context is passed so that front-end correctly loads related data
      track.videos.forEach((video, videoIndex) => {
        createPage({
          path: `tracks/${track.slug}/${video.slug}`,
          component,
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
const createGuidePages = async (graphql, createPage) => {
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

  const template = path.resolve(`./src/templates/guide.js`);

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

/**
 * Creates single Showcase pages for all loaded Showcase nodes
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
const createShowcasePages = async (graphql, createPage) => {
  const component = path.resolve(`./src/templates/showcases.js`);

  const {
    data: { contributions }
  } = await graphql(`
    query {
      contributions: allContribution {
        nodes {
          id
          author {
            name
          }
        }
      }
    }
  `);

  const authors = extractTags(contributions.nodes, 'author.name');

  await writeFile(
    './public/filters-contributions.json',
    JSON.stringify({ authors })
  );

  paginate({
    createPage,
    itemsTotal: contributions.nodes.length,
    itemsPerPage: SHOWCASE_ITEMS_PER_PAGE,
    pathPrefix: '/showcase',
    component,
    context: {
      author: '',
      authorSlug: ''
    }
  });

  for (let author of [...authors, '']) {
    const authorSlug = toSlug(author);

    const {
      data: { filteredContributions }
    } = await graphql(`
        query {
          filteredContributions: contributionsPaginatedFilteredByTags(authorSlug: "${authorSlug}")  {
            id
          }
        }
      `);

    paginate({
      createPage,
      itemsTotal: filteredContributions.length,
      itemsPerPage: SHOWCASE_ITEMS_PER_PAGE,
      pathPrefix: `/showcase/author/${!author ? 'all' : authorSlug}`,
      component,
      context: { author, authorSlug }
    });
  }
};

// ---

export const createPages = async function ({ actions, graphql }) {
  const { createPage, createSlice } = actions;

  await createSlices(createSlice);

  await createTrackVideoPages(graphql, createPage);
  await createTracksPages(graphql, createPage);
  await createChallengesPages(graphql, createPage);
  await createGuidePages(graphql, createPage);
  await createShowcasePages(graphql, createPage);
};
