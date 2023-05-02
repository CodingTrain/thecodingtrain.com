const { schema } = require('./node-scripts/schema');
const {
  createVideoRelatedNode,
  createTrackRelatedNode,
  createTalkRelatedNode,
  createFAQRelatedNode,
  createFAQImageNode,
  createVideoCoverImageNode,
  createTrackCoverImageNode,
  createTalkCoverImageNode,
  createGuideRelatedNode,
  createGuideCoverImageNode,
  createHomepageRelatedNodes,
  createAboutPageRelatedNodes,
  create404PageRelatedNodes,
  createTracksPageRelatedNodes,
  createChallengesPageRelatedNodes,
  createShowcasePageRelatedNodes,
  createGuidesPageRelatedNodes,
  createAboutPageCoverImageNode
} = require('./node-scripts/node-generation');
const {
  createSlices,
  createTrackVideoPages,
  createTracksPages,
  createChallengesPages,
  createGuidePages,
  createShowcasePages
} = require('./node-scripts/page-generation');
const set = require('lodash/set');
const { toSlug } = require('./node-scripts/utils');

exports.createSchemaCustomization = ({ actions }) =>
  actions.createTypes(schema);

exports.onCreateNode = ({
  node,
  actions,
  createNodeId,
  createContentDigest,
  getNode
}) => {
  const { createNode, createNodeField } = actions;
  const { owner, mediaType } = node.internal;
  const parent = getNode(node.parent);

  if (owner === 'gatsby-transformer-json') {
    /**
      Turn JSON files into Tracks, Video and Showcase Contribution nodes
    **/
    if (parent.sourceInstanceName === 'challenges')
      createVideoRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent,
        'Challenge'
      );
    else if (parent.sourceInstanceName === 'guest-tutorials')
      createVideoRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent,
        'GuestTutorial'
      );
    else if (parent.sourceInstanceName === 'videos')
      createVideoRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent,
        'Video'
      );
    else if (
      parent.sourceInstanceName === 'main-tracks' ||
      parent.sourceInstanceName === 'side-tracks'
    )
      createTrackRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent,
        parent.sourceInstanceName
      );
    else if (parent.sourceInstanceName === 'faqs')
      createFAQRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'talks')
      createTalkRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'homepage-data')
      createHomepageRelatedNodes(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'about-page-data')
      createAboutPageRelatedNodes(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === '404-page-data')
      create404PageRelatedNodes(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'tracks-page-data')
      createTracksPageRelatedNodes(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'showcase-page-data')
      createShowcasePageRelatedNodes(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'challenges-page-data')
      createChallengesPageRelatedNodes(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'guides')
      createGuidesPageRelatedNodes(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
  } else if (
    owner === 'gatsby-plugin-mdx' &&
    parent.sourceInstanceName === 'guides'
  ) {
    createGuideRelatedNode(
      createNode,
      createNodeId,
      createContentDigest,
      node,
      parent
    );

    // no more slugs in mdx v2
    createNodeField({
      node,
      name: 'slug',
      value: parent.name
    });
  } else if (
    owner === 'gatsby-source-filesystem' &&
    mediaType !== undefined &&
    mediaType.includes('image')
  ) {
    /**
      Turn image files into CoverImages for Tracks, Video and Showcase Contribution nodes
    **/

    if (
      node.sourceInstanceName === 'videos' ||
      node.sourceInstanceName === 'guest-tutorials' ||
      node.sourceInstanceName === 'challenges'
    ) {
      createVideoCoverImageNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        node.sourceInstanceName
      );
    } else if (
      node.sourceInstanceName === 'main-tracks' ||
      node.sourceInstanceName === 'side-tracks'
    ) {
      createTrackCoverImageNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        node.sourceInstanceName
      );
    } else if (node.sourceInstanceName === 'faqs') {
      createFAQImageNode(createNode, createNodeId, createContentDigest, node);
    } else if (node.sourceInstanceName === 'talks') {
      createTalkCoverImageNode(
        createNode,
        createNodeId,
        createContentDigest,
        node
      );
    } else if (node.sourceInstanceName === 'guides') {
      createGuideCoverImageNode(
        createNode,
        createNodeId,
        createContentDigest,
        node
      );
    } else if (node.sourceInstanceName === 'about-page-data') {
      createAboutPageCoverImageNode(
        createNode,
        createNodeId,
        createContentDigest,
        node
      );
    }
  }
};

exports.createPages = async function ({ actions, graphql }) {
  const { createPage, createSlice } = actions;

  await createSlices(createSlice);
  await createTrackVideoPages(graphql, createPage);
  await createTracksPages(graphql, createPage);
  await createChallengesPages(graphql, createPage);
  await createGuidePages(graphql, createPage);
  await createShowcasePages(graphql, createPage);
};

const tagResolver = async (source, context, type) => {
  const tags = new Set();

  // track.videos
  let videoIds = source.videos ?? [];

  // track.chapters.videos
  if (source.chapters) {
    const chapters = await context.nodeModel.getNodesByIds({
      ids: source.chapters,
      type: 'Chapter'
    });

    for (let chapter of chapters) {
      if (chapter.videos) {
        videoIds = [...videoIds, ...chapter.videos];
      }
    }
  }

  // fetch all video nodes we found
  const allVideos = await context.nodeModel.getNodesByIds({
    ids: videoIds,
    type: 'Video'
  });

  // extract and dedupe tags
  for (let video of allVideos) {
    if (video[type]) {
      video[type].forEach((v) => tags.add(v));
    }
  }

  return [...tags];
};

const filterByTagsResolver = async (
  args,
  context,
  type,
  tagBasePath,
  sortFields,
  sortOrders
) => {
  const { language, topic, skip, limit } = args;

  const query = {};

  set(query, 'sort.fields', sortFields);
  set(query, 'sort.order', sortOrders);

  if (language) set(query, `${tagBasePath}.languages.eq`, language);
  if (topic) set(query, `${tagBasePath}.topics.eq`, topic);
  if (skip) set(query, 'skip', skip);
  if (limit) set(query, 'limit', limit);

  const { entries } = await context.nodeModel.findAll({
    type,
    query
  });

  return entries;
};

const filterByAuthorSlugResolver = async (args, context) => {
  const { authorSlug, skip, limit } = args;

  const query = {};

  set(query, 'sort.fields', ['submittedOn', 'title']);
  set(query, 'sort.order', ['DESC', 'ASC']);

  if (authorSlug) set(query, `filter.author.nameSlug.eq`, authorSlug);
  if (skip) set(query, 'skip', skip);
  if (limit) set(query, 'limit', limit);

  const { entries } = await context.nodeModel.findAll({
    type: 'Contribution',
    query
  });

  return entries;
};

const showcaseResolver = async (source, args, context, info) => {
  const query = {};

  set(query, 'filter.video.id.eq', source.id);
  set(query, 'sort.order', ['ASC']);
  set(query, 'sort.fields', ['name']);

  const { entries } = await context.nodeModel.findAll({
    type: 'Contribution',
    query
  });

  return entries;
};

const videoCanonicalTrackResolver = async (source, args, context, info) => {
  // we need a pointer from a video to its canonical track for the showcase page

  // challenge videos can't have a canonical track (their challenge page is canon)
  if (source.source === 'Challenges') return;

  // a canonical track might've been explicitly set in the Gatsby node creation phase
  if (source.canonicalTrack) {
    return await context.nodeModel.getNodeById({ id: source.canonicalTrack });
  }

  // find tracks referencing this video
  const queries = [
    set({}, 'filter.videos.elemMatch.id.eq', source.id),
    set({}, 'filter.chapters.elemMatch.videos.elemMatch.id.eq', source.id)
  ];

  for (const query of queries) {
    const track = await context.nodeModel.findOne({ type: 'Track', query });
    if (track) return track;
  }

  // it shouldn't be possible to get here - non-challenge videos should have at least one track referencing them
  return;
};

const contributionSubmittedOnResolver = async (source, args, context, info) => {
  // normalizes values to provide a stable sorting order for the showcase page

  if (typeof source.submittedOn === 'string') {
    // normalize to ISO 8601 since some dates are in `yyyy-mm-dd` format
    return new Date(source.submittedOn).toISOString();
  } else {
    // the contribution doesn't have a `submittedOn` property, let's derive one for sorting purposes

    // extract the sequential number from the source JSON filename
    const [seqNumber] = source.name.match(/\d+/g);

    // edge case where the sequential number is actually a timestamp yet `submittedOn` was not set
    if (seqNumber.length > 6) return new Date(+seqNumber).toISOString();

    // NOTE: not all source.video nodes are of type `Video`. They all have a `date` property though so it's OK here.
    const { date } = await context.nodeModel.getNodeById({ id: source.video });
    const dateObj = new Date(date);

    // treat the sequential number as seconds and add them to the Coding Train video publish date
    // ex: published date of "2017-05-18", contribution filename of "contribution16.json" -> 2017-05-18T00:00:16.000Z
    dateObj.setSeconds(dateObj.getSeconds() + seqNumber);

    return dateObj.toISOString();
  }
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Track: {
      topics: {
        type: ['String'],
        resolve: async (source, args, context, info) =>
          await tagResolver(source, context, 'topics')
      },
      languages: {
        type: ['String'],
        resolve: async (source, args, context, info) =>
          await tagResolver(source, context, 'languages')
      }
    },
    Challenge: {
      showcase: {
        type: ['Contribution'],
        resolve: showcaseResolver
      }
    },
    Video: {
      showcase: {
        type: ['Contribution'],
        resolve: showcaseResolver
      },
      canonicalTrack: {
        type: 'Track',
        resolve: videoCanonicalTrackResolver
      }
    },
    Contribution: {
      submittedOn: {
        type: 'String',
        resolve: contributionSubmittedOnResolver
      }
    },
    Author: {
      nameSlug: {
        type: 'String',
        resolve: (source) => toSlug(source.name)
      }
    },
    Query: {
      tracksPaginatedFilteredByTags: {
        type: ['Track'],
        resolve: async (source, args, context, info) =>
          await filterByTagsResolver(
            args,
            context,
            'Track',
            'filter',
            ['order'],
            ['ASC']
          )
      },
      challengesPaginatedFilteredByTags: {
        type: ['Challenge'],
        resolve: async (source, args, context, info) =>
          await filterByTagsResolver(
            args,
            context,
            'Challenge',
            'filter',
            ['date'],
            ['DESC']
          )
      },
      contributionsPaginatedFilteredByTags: {
        type: ['Contribution'],
        resolve: async (source, args, context, info) =>
          await filterByAuthorSlugResolver(args, context)
      }
    }
  };
  createResolvers(resolvers);
};
