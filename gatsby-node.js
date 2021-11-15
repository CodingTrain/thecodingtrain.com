const { schema } = require('./node-scripts/schema');
const {
  createChallengeRelatedNode
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

  // /**
  //   Turn lesson json files into Lesson nodes
  // **/
  // if (
  //   owner === 'gatsby-transformer-json' &&
  //   parent.sourceInstanceName === 'lessons'
  // ) {
  //   console.log('LessonsJson');
  //   const parent = getNode(node.parent);
  //   const slug = parent.name;
  //   const data = getJson(node);
  //   const timestamps = (data.timestamps ?? []).map((timestamp) => ({
  //     ...timestamp,
  //     seconds: parseTimestamp(timestamp.time)
  //   }));

  //   const newNode = Object.assign({}, data, {
  //     id: createNodeId(slug),
  //     slug,
  //     timestamps,
  //     codeExamples: data.codeExamples ?? [],
  //     groupLinks: data.groupLinks ?? [],
  //     canContribute: data.canContribute ?? false,
  //     contributions: data.contributions ?? [],
  //     internal: {
  //       type: `Lesson`,
  //       contentDigest: createContentDigest(data)
  //     }
  //   });
  //   console.log({ newNode });
  //   createNode(newNode);
  // }

  // /**
  //   Turn track json files into Track and Chapter nodes
  // **/
  // if (node.internal.type === 'TracksJson') {
  //   console.log('TracksJson');
  //   // Make basic info for track
  //   const parent = getNode(node.parent);
  //   const slug = parent.name;
  //   const id = createNodeId(slug);
  //   let numVideos = 0;

  //   // Make Chapter nodes
  //   const chapters = [];
  //   if (node.chapters) {
  //     for (let i = 0; i < node.chapters.length; i++) {
  //       const chapter = node.chapters[i];
  //       const data = omit(chapter, ['videos']);
  //       const newNode = Object.assign({}, data, {
  //         id: createNodeId(data.title),
  //         track: id,
  //         videos: chapter.videos.map((videoSlug) => createNodeId(videoSlug)),
  //         internal: {
  //           type: `Chapter`,
  //           contentDigest: createContentDigest(data)
  //         }
  //       });
  //       chapters.push(newNode);
  //       numVideos += chapter.videos.length;
  //     }
  //   }

  //   // Make and create Track node
  //   const data = getJson(node);
  //   const newNode = Object.assign({}, data, {
  //     id,
  //     slug,
  //     chapters: chapters.map((ch) => ch.id),
  //     numVideos,
  //     internal: {
  //       type: `Track`,
  //       contentDigest: createContentDigest(data)
  //     }
  //   });
  //   // console.log({ newNode });
  //   createNode(newNode);

  //   // Create Chapter nodes
  //   for (let i = 0; i < chapters.length; i++) {
  //     createNode(chapters[i]);
  //   }
  // }
};

exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions;
  await createTrackVideoPages(graphql, createPage);
  await createChallengePages(graphql, createPage);
};
