const omit = require('lodash/omit');
const fs = require('fs');

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

const createVideoRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent,
  type
) => {
  if (parent.relativePath.includes('/contributions/')) {
    const data = getJson(node);
    const name = parent.name;
    const newNode = Object.assign({}, data, {
      id: createNodeId(`${type}s/${parent.relativePath}`),
      name,
      internal: {
        type: `Contribution`,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  } else {
    const slug = parent.relativeDirectory;
    const data = getJson(node);
    const contributions = fs.existsSync(`${parent.dir}/contributions`)
      ? fs
          .readdirSync(`${parent.dir}/contributions`)
          .filter((file) => file.includes('.json'))
          .map(
            (file) =>
              `${type}s/${parent.relativeDirectory}/contributions/${file}`
          )
      : [];
    const timestamps = (data.timestamps ?? []).map((timestamp) => ({
      ...timestamp,
      seconds: parseTimestamp(timestamp.time)
    }));

    const newNode = Object.assign({}, data, {
      id: createNodeId(`${type}s/${slug}`),
      slug,
      contributionsPath: `${slug}/contributions`,
      timestamps,
      codeExamples: data.codeExamples ?? [],
      groupLinks: data.groupLinks ?? [],
      canContribute: data.canContribute ?? false,
      contributions: contributions.map((file) => createNodeId(file)),
      internal: {
        type,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  }
};

exports.createChallengeRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) =>
  createVideoRelatedNode(
    createNode,
    createNodeId,
    createContentDigest,
    node,
    parent,
    'Challenge'
  );

exports.createLessonRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) =>
  createVideoRelatedNode(
    createNode,
    createNodeId,
    createContentDigest,
    node,
    parent,
    'Lesson'
  );

exports.createTrackRelatedNode = () => {};
