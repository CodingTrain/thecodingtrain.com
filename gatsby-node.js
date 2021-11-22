const { schema } = require('./node-scripts/schema');
const {
  createLessonRelatedNode,
  createChallengeRelatedNode,
  createGuestTutorialRelatedNode,
  createTrackRelatedNode
} = require('./node-scripts/node-generation');
const {
  createTrackVideoPages,
  createChallengePages
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
    Turn JSON files into Video and Contribution nodes
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
    else if (parent.sourceInstanceName === 'lessons')
      createLessonRelatedNode(
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
  }

  /**
    Turn track JSON files into Track and Chapter nodes
  **/
  if (node.internal.type === 'TracksJson') {
    createTrackRelatedNode(
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
};
