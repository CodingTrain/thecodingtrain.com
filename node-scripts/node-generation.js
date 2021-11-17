const omit = require('lodash/omit');
const fs = require('fs');

function camelCaseToDash(str) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

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
  schemaType
) => {
  const type = camelCaseToDash(schemaType);
  if (parent.relativePath.includes('/contributions/')) {
    const data = getJson(node);
    const name = parent.name;
    const newNode = Object.assign({}, data, {
      id: createNodeId(`${type}s/${parent.relativePath}`),
      name,
      video: createNodeId(
        `${type}s/${parent.relativeDirectory.replace('/contributions', '')}`
      ),
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
      canContribute: data.canContribute ?? schemaType === 'Challenge',
      contributions: contributions.map((file) => createNodeId(file)),
      internal: {
        type: schemaType,
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

exports.createGuestTutorialRelatedNode = (
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
    'GuestTutorial'
  );

exports.createTrackRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const slug = parent.name;
  const id = createNodeId(`tracks/${slug}`);
  const data = getJson(node);
  const { type } = data;
  let numVideos = 0;

  if (type === 'main') {
    // Make Chapter nodes
    const chapters = [];
    if (node.chapters) {
      for (let i = 0; i < node.chapters.length; i++) {
        const chapter = node.chapters[i];
        const data = omit(chapter, ['lessons']);
        const newNode = Object.assign({}, data, {
          id: createNodeId(`${slug}/${data.title}`),
          track: id,
          lessons: chapter.lessons.map((lessonSlug) =>
            createNodeId(`lessons/${lessonSlug}`)
          ),
          internal: {
            type: `Chapter`,
            contentDigest: createContentDigest(data)
          }
        });
        chapters.push(newNode);
        numVideos += chapter.lessons.length;
      }
    }

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
    createNode(newNode);

    // Create Chapter nodes
    for (let i = 0; i < chapters.length; i++) {
      createNode(chapters[i]);
    }
  } else if (type === 'side') {
    numVideos += data.videos.length;
    const newNode = Object.assign({}, data, {
      id,
      slug,
      videos: data.videos.map((videoSlug) => createNodeId(videoSlug)),
      numVideos,
      internal: {
        type: `Track`,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  }
};
