const { schema } = require('./node-scripts/schema');
const {
  createLessonRelatedNode,
  createChallengeRelatedNode,
  createGuestTutorialRelatedNode,
  createTrackRelatedNode,
  createTalkRelatedNode,
  createCollaboratorNodes
} = require('./node-scripts/node-generation');
const {
  createTrackVideoPages,
  createChallengePages,
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
  const { owner } = node.internal;
  const parent = getNode(node.parent);

  /**
    Turn JSON files into Tracks, Video and Contribution nodes
  **/
  if (owner === 'gatsby-transformer-json') {
    if (parent.sourceInstanceName === 'challenges')
      createChallengeRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'guest-tutorials')
      createGuestTutorialRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
      );
    else if (parent.sourceInstanceName === 'lessons')
      createLessonRelatedNode(
        createNode,
        createNodeId,
        createContentDigest,
        node,
        parent
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
  }
};

exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions;
  await createTrackVideoPages(graphql, createPage);
  await createChallengePages(graphql, createPage);
  await createGuidePages(graphql, createPage);
};
