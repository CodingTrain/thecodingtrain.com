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

exports.createChallengeRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  if (parent.relativePath.includes('/contributions/')) {
    const data = getJson(node);
    const slug = parent.name;
    const newNode = Object.assign({}, data, {
      id: createNodeId(slug),
      slug,
      internal: {
        type: `Contribution`,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  } else {
    const slug = parent.relativeDirectory;
    const contributions = fs
      .readdirSync(`${parent.dir}/contributions`)
      .filter((file) => file.includes('.json'))
      .map((file) => file.replace('.json', ''));
    const data = getJson(node);
    const timestamps = (data.timestamps ?? []).map((timestamp) => ({
      ...timestamp,
      seconds: parseTimestamp(timestamp.time)
    }));

    const newNode = Object.assign({}, data, {
      id: createNodeId(slug),
      slug,
      timestamps,
      contributionsPath: `${parent.relativeDirectory}/contributions`,
      codeExamples: data.codeExamples ?? [],
      groupLinks: data.groupLinks ?? [],
      contributions: contributions
        ? contributions.map((file) => createNodeId(file))
        : [],
      internal: {
        type: `Challenge`,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  }
};
