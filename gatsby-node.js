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
  createAboutPageRelatedNodes,
  create404PageRelatedNodes,
  createTracksPageRelatedNodes,
  createChallengesPageRelatedNodes,
  createGuidesPageRelatedNodes,
  createAboutPageCoverImageNode
} = require('./node-scripts/node-generation');
const {
  createTrackVideoPages,
  createTracksPages,
  createChallengesPages,
  createGuidePages
} = require('./node-scripts/page-generation');

exports.createSchemaCustomization = ({ actions }) =>
  actions.createTypes(schema);

exports.onCreateNode = ({
  node,
  actions,
  createNodeId,
  createContentDigest,
  getNode
}) => {
  const { createNode } = actions;
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
  const { createPage } = actions;
  await createTrackVideoPages(graphql, createPage);
  await createTracksPages(graphql, createPage);
  await createChallengesPages(graphql, createPage);
  await createGuidePages(graphql, createPage);
};
