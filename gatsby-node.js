const omit = require('lodash/omit');
const { schema } = require('./node-scripts/schema');
const {
  createTrackVideoPages,
  createChallengePages
} = require('./node-scripts/page-generation');

exports.createSchemaCustomization = ({ actions }) =>
  actions.createTypes(schema);

let contributionIds = {};

exports.onCreateNode = ({
  node,
  actions,
  createNodeId,
  createContentDigest,
  getNode
}) => {
  const { createNode } = actions;

  // if (
  //   node.internal.type === 'File' &&
  //   node.sourceInstanceName === 'challenges'
  // ) {
  //   console.log('File - Challenge');
  //   console.log(node.relativePath);
  //   console.log(node);

  //   console.log(getNode(node.parent).name);
  // }

  if (
    node.internal.owner === 'gatsby-transformer-json' &&
    getNode(node.parent).sourceInstanceName === 'challenges'
  ) {
    // console.log(node.relativePath);
    // console.log(node);
    // console.log(getNode(node.parent).relativePath);
    // console.log(getNode(node.parent).sourceInstanceName);
    // console.log(getNode(node.parent));

    if (getNode(node.parent).relativePath.includes('/contributions/')) {
      // console.log('CONTRIBUTIONS');
      // console.log(node);
      if (getNode(node.parent).relativePath in contributionIds) {
        contributionIds[getNode(node.parent).relativePath] += 1;
      } else {
        contributionIds[getNode(node.parent).relativePath] = 1;
      }
      // console.log(getNode(node.parent).relativePath);
      const data = getJson(node);
      const slug = getNode(node.parent).relativePath.replace(
        '/contributions/index.json',
        ''
      );
      const index = contributionIds[getNode(node.parent).relativePath];
      const newNode = Object.assign({}, data, {
        id: createNodeId(`${slug}-${index}`),
        internal: {
          type: `Contribution`,
          contentDigest: createContentDigest(data)
        }
      });
      // console.log({ newNode });
      createNode(newNode);
    } else {
      // console.log('CHALLENGE');

      const parent = getNode(node.parent);

      const slug = parent.relativeDirectory;
      const contributions = require(`${parent.dir}/contributions/index.json`);
      // console.log({ contributions });
      const data = getJson(node);
      const timestamps = (data.timestamps ?? []).map((timestamp) => ({
        ...timestamp,
        seconds: parseTimestamp(timestamp.time)
      }));

      const newNode = Object.assign({}, data, {
        id: createNodeId(slug),
        slug,
        timestamps,
        contributionsPath: parent.relativeDirectory + '/contributions',
        codeExamples: data.codeExamples ?? [],
        groupLinks: data.groupLinks ?? [],
        contributions: contributions
          ? contributions.map((_, index) => createNodeId(`${slug}-${index}`))
          : [],
        internal: {
          type: `Challenge`,
          contentDigest: createContentDigest(data)
        }
      });
      // console.log({ newNode });
      createNode(newNode);
    }
  }

  /**
    Turn track json files into Track and Chapter nodes
  **/
  if (node.internal.type === 'TracksJson') {
    console.log('TracksJson');
    // Make basic info for track
    const parent = getNode(node.parent);
    const slug = parent.name;
    const id = createNodeId(slug);
    let numVideos = 0;

    // Make Chapter nodes
    const chapters = [];
    if (node.chapters) {
      for (let i = 0; i < node.chapters.length; i++) {
        const chapter = node.chapters[i];
        const data = omit(chapter, ['videos']);
        const newNode = Object.assign({}, data, {
          id: createNodeId(data.title),
          track: id,
          videos: chapter.videos.map((videoSlug) => createNodeId(videoSlug)),
          internal: {
            type: `Chapter`,
            contentDigest: createContentDigest(data)
          }
        });
        chapters.push(newNode);
        numVideos += chapter.videos.length;
      }
    }

    // Make and create Track node
    const data = getJson(node);
    const newNode = Object.assign({}, data, {
      id,
      slug,
      chapters: chapters.map((ch) => ch.id),
      numVideos,
      internal: {
        type: `Track`,
        contentDigest: createContentDigest(data)
      }
    });
    // console.log({ newNode });
    createNode(newNode);

    // Create Chapter nodes
    for (let i = 0; i < chapters.length; i++) {
      createNode(chapters[i]);
    }
  }

  /**
    Turn video json files into Video nodes
  **/
  if (node.internal.type === 'VideosJson') {
    console.log('VideosJson');
    const parent = getNode(node.parent);
    const slug = parent.name;
    const data = getJson(node);
    const timestamps = (data.timestamps ?? []).map((timestamp) => ({
      ...timestamp,
      seconds: parseTimestamp(timestamp.time)
    }));

    const newNode = Object.assign({}, data, {
      id: createNodeId(slug),
      slug,
      timestamps,
      codeExamples: data.codeExamples ?? [],
      groupLinks: data.groupLinks ?? [],
      canContribute: data.canContribute ?? false,
      contributions: data.contributions ?? [],
      internal: {
        type: `Video`,
        contentDigest: createContentDigest(data)
      }
    });
    // console.log({ newNode });
    createNode(newNode);
  }

  /**
    Turn video json files into Video nodes
  **/
  // if (node.internal.type === 'ChallengesJson') {
  //   console.log('ChallengesJson');
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
  //     contributions: data.contributions ?? [],
  //     internal: {
  //       type: `Challenge`,
  //       contentDigest: createContentDigest(data)
  //     }
  //   });
  //   // console.log({ newNode });
  //   createNode(newNode);
  // }
};

exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions;
  await createTrackVideoPages(graphql, createPage);
  await createChallengePages(graphql, createPage);
};

const getJson = (node) => {
  return omit(node, ['id', 'children', 'parent', 'internal']);
};

const parseTimestamp = (timeString) => {
  const splitted = timeString.split(':');
  let secondTotal = 0;
  for (let index = splitted.length - 1; index >= 0; index--) {
    const number =
      parseInt(splitted[index]) * Math.pow(60, splitted.length - 1 - index);
    secondTotal += number;
  }
  return secondTotal;
};
