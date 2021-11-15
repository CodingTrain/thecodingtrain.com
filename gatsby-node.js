const { schema } = require('./node-scripts/schema');
const {
  createLessonRelatedNode,
  createChallengeRelatedNode,
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
    Turn challenge json files into Challenge nodes
  **/
  if (
    owner === 'gatsby-transformer-json' &&
    parent.sourceInstanceName === 'challenges'
  ) {
    createChallengeRelatedNode(
      createNode,
      createNodeId,
      createContentDigest,
      node,
      parent
    );
  }

  /**
    Turn lesson json files into Lesson nodes
  **/
  if (
    owner === 'gatsby-transformer-json' &&
    parent.sourceInstanceName === 'lessons'
  ) {
    createLessonRelatedNode(
      createNode,
      createNodeId,
      createContentDigest,
      node,
      parent
    );
  }

  /**
    Turn track json files into Track and Chapter nodes
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
