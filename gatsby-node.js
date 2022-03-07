const { schema } = require('./node-scripts/schema');
const {
  createVideoRelatedNode,
  createTrackRelatedNode,
  createTalkRelatedNode,
  createCollaboratorNodes,
  createVideoCoverImageNode,
  createTrackCoverImageNode,
  createTalkCoverImageNode,
  createGuideRelatedNode,
  createGuideCoverImageNode
} = require('./node-scripts/node-generation');
const {
  createTrackVideoPages,
  createTracksPages,
  createJourneyPages,
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
      Turn JSON files into Tracks, Video and Contribution nodes
    **/
    if (parent.sourceInstanceName === 'journeys')
      createVideoRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent,
        'Journey'
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
    else if (parent.sourceInstanceName === 'talks')
      createTalkRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'collaborators')
      createCollaboratorNodes(
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
      Turn image files into CoverImages for Tracks, Video and Contribution nodes
    **/

    if (
      node.sourceInstanceName === 'videos' ||
      node.sourceInstanceName === 'guest-tutorials' ||
      node.sourceInstanceName === 'journeys'
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
    }
  }
};

exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions;
  await createTrackVideoPages(graphql, createPage);
  await createTracksPages(graphql, createPage);
  await createJourneyPages(graphql, createPage);
  await createGuidePages(graphql, createPage);
};
