const omit = require('lodash/omit');
const fs = require('fs');

/**
 * Transform camel case str to dash case
 * @param {string} str - Camel case string
 */
function camelCaseToDash(str) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

/**
 * Returns filtered object that omits Gatsby node properties
 * @param {object} node - Node object
 */
const getJson = (node) => {
  return omit(node, ['id', 'children', 'parent', 'internal']);
};

/**
 * String timestamp parser to amount of seconds
 * @param {string} timeString - Timestamp string
 */
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

/**
 * Creates Video and Contribution nodes from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 * @param {string} schemaType - Specific Video node type
 */
exports.createVideoRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent,
  schemaType
) => {
  const type = camelCaseToDash(schemaType);
  const slugPrefix = type === 'video' ? '' : `${type}s/`;
  // Loaded node may be a JSON file for a contribution or a video
  if (parent.relativePath.includes('/contributions/')) {
    const data = getJson(node);
    const name = parent.name;
    const newNode = Object.assign({}, data, {
      id: createNodeId(`${slugPrefix}${parent.relativePath}`),
      parent: node.id,
      name,
      video: createNodeId(
        `--videos/${slugPrefix}${parent.relativeDirectory.replace(
          '/contributions',
          ''
        )}`
      ),
      cover: createNodeId(
        `cover-image/${slugPrefix}${parent.relativeDirectory}/${parent.name}`
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
    // If folder present, it reads every contribution file present in the
    // video folder so that we can get the corresponding ID's to link them
    const contributions = fs.existsSync(`${parent.dir}/contributions`)
      ? fs
          .readdirSync(`${parent.dir}/contributions`)
          .filter((file) => file.includes('.json'))
          .map(
            (file) =>
              `${slugPrefix}${parent.relativeDirectory}/contributions/${file}`
          )
      : [];
    const timestamps = (data.timestamps ?? []).map((timestamp) => ({
      ...timestamp,
      seconds: parseTimestamp(timestamp.time)
    }));
    const languages = data.languages ?? [];
    const topics = data.topics ?? [];
    const newNode = Object.assign({}, data, {
      id: createNodeId(`--videos/${slugPrefix}${slug}`),
      parent: node.id,
      slug,
      languages,
      languagesFlat: languages.join(),
      topics,
      topicsFlat: topics.join(),
      timestamps,
      codeExamples: (data.codeExamples ?? []).map((example) => ({
        ...example,
        image: createNodeId(
          `cover-image/${
            type === 'video' ? 'videos' : ''
          }/${slugPrefix}${slug}/images/${example.image}`
        )
      })),
      groupLinks: data.groupLinks ?? [],
      canContribute: data.canContribute ?? schemaType === 'Challenge',
      contributions: contributions.map((file) => createNodeId(file)),
      relatedJourneys: (data.relatedJourneys ?? []).map((slug) =>
        createNodeId(
          `--videos/${slug.includes('journeys') ? slug : `journeys/${slug}`}`
        )
      ),
      cover: createNodeId(`cover-image/${slugPrefix}${slug}`),
      source: `${type}s`,
      internal: {
        type: schemaType,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);

    for (let tag of newNode.languages) {
      const content = {
        id: createNodeId(`--tag/${tag}`),
        parent: node.id,
        type: 'language',
        value: tag
      };
      createNode({
        ...content,
        internal: {
          type: 'Tag',
          contentDigest: createContentDigest(content)
        }
      });
    }
    for (let tag of newNode.topics) {
      const content = {
        id: createNodeId(`--tag/${tag}`),
        parent: node.id,
        type: 'topic',
        value: tag
      };
      createNode({
        ...content,
        internal: {
          type: 'Tag',
          contentDigest: createContentDigest(content)
        }
      });
    }
  }
};

const computeTrackTags = (trackDirectory, type) => {
  const languages = new Set();
  const topics = new Set();
  const trackPath = `../content/tracks/${type}/${trackDirectory}/index.json`;

  let trackData;
  try {
    trackData = require(trackPath);
  } catch (error) {
    console.log(`Couldn't tag load of track ${trackPath}`);
  }
  if (trackData !== undefined) {
    let videos = [];
    if (type === 'main-tracks') {
      trackData.chapters.forEach((chapter) => {
        chapter.videos.forEach((video) => videos.push(video));
      });
    } else {
      videos = trackData.videos;
    }
    videos = videos.map((slug) => `../content/videos/${slug}/index.json`);
    for (let video of videos) {
      try {
        const videoData = require(video);
        videoData.languages.forEach((lang) => languages.add(lang));
        videoData.topics.forEach((topic) => topics.add(topic));
      } catch (e) {
        console.log(`Couldn't read tags of video ${video}`);
      }
    }
  }

  return [languages, topics].map((s) => [...s]);
};

/**
 * Creates Track node from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createTrackRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent,
  trackType
) => {
  const slug = parent.relativeDirectory;
  const id = createNodeId(`--tracks/${slug}`);
  const data = getJson(node);
  const type = trackType.replace('-tracks', '');
  let numVideos = 0;

  if (type === 'main') {
    // Make Chapter nodes for only main tracks
    const chapters = [];
    if (node.chapters) {
      for (let i = 0; i < node.chapters.length; i++) {
        const chapter = node.chapters[i];
        const data = omit(chapter, ['videos']);

        const newNode = Object.assign({}, data, {
          id: createNodeId(`${slug}/${data.title}`),
          parent: id,
          track: id,
          videos: chapter.videos.map((videoSlug) =>
            createNodeId(`--videos/${videoSlug}`)
          ),
          internal: {
            type: `Chapter`,
            contentDigest: createContentDigest(data)
          }
        });
        chapters.push(newNode);
        numVideos += chapter.videos.length;
      }
    }
    const [languages, topics] = computeTrackTags(
      parent.relativeDirectory,
      trackType
    );
    const newNode = Object.assign({}, data, {
      id,
      parent: node.id,
      type,
      slug,
      chapters: chapters.map((ch) => ch.id),
      numVideos,
      cover: createNodeId(`cover-image/main-tracks/${slug}`),
      languages,
      languagesFlat: languages.join(),
      topics,
      topicsFlat: topics.join(),
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
    // Side tracks only reference videos by slug
    numVideos += data.videos.length;
    const [languages, topics] = computeTrackTags(
      parent.relativeDirectory,
      trackType
    );
    const newNode = Object.assign({}, data, {
      id,
      parent: node.id,
      slug,
      type,
      videos: data.videos.map((videoSlug) =>
        createNodeId(`--videos/${videoSlug}`)
      ),
      numVideos,
      cover: createNodeId(`cover-image/side-tracks/${slug}`),
      languages,
      languagesFlat: languages.join(),
      topics,
      topicsFlat: topics.join(),
      internal: {
        type: `Track`,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  }
};

/**
 * Creates Talk node from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createTalkRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const { name } = parent;
  const data = getJson(node);

  const newNode = Object.assign({}, data, {
    id: createNodeId('--talk/' + name),
    parent: node.id,
    slug: name,
    internal: {
      type: `Talk`,
      contentDigest: createContentDigest(data)
    },
    cover: createNodeId(`cover-image/talks/${name}`)
  });
  createNode(newNode);
};

/**
 * Creates FAQ node from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createFAQRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const { name } = parent;
  const data = getJson(node);
  if (name !== 'index') {
    const newNode = Object.assign({}, data, {
      id: createNodeId('--faqs/' + name),
      parent: node.id,
      slug: name,
      internal: {
        type: `FAQ`,
        contentDigest: createContentDigest(data)
      },
      answer: {
        text: data.answer.text,
        list: data.answer.list,
        image: createNodeId(`cover-image/faqs/${name}`)
      }
    });
    createNode(newNode);
  } else {
    const sections = [];
    for (let index = 0; index < data.sections.length; index++) {
      const section = data.sections[index];
      const sectionNode = Object.assign(
        {},
        {
          id: createNodeId(`--faqSections/${index}`),
          parent: node.id,
          title: section.title,
          questions: section.questions.map((q) => createNodeId(`--faqs/${q}`)),
          internal: {
            type: `FAQSection`,
            contentDigest: createContentDigest(section)
          }
        }
      );
      createNode(sectionNode);
      sections.push(sectionNode);
    }

    const newNode = Object.assign(
      {},
      {
        id: createNodeId('--faqOrder'),
        parent: node.id,
        sections: sections.map((s) => s.id),
        internal: {
          type: `FAQOrder`,
          contentDigest: createContentDigest(data)
        }
      }
    );
    createNode(newNode);
  }
};

/**
 * Creates Guide node from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createGuideRelatedNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const { name } = parent;
  const data = getJson(node);

  const newNode = Object.assign({}, data, {
    id: createNodeId('--guide/' + name),
    parent: node.id,
    mdx: node.id,
    cover: createNodeId(`cover-image/guides/${name}`),
    internal: {
      type: `Guide`,
      contentDigest: createContentDigest(data)
    }
  });
  createNode(newNode);
};

/**
 * Creates Collaborator nodes from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createCollaboratorNodes = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const slug = parent.name;
  const data = getJson(node);
  const { team, contributors } = data;

  for (let index = 0; index < team.length; index++) {
    const newNode = Object.assign({}, team[index], {
      id: createNodeId(slug + `team-${index}`),
      parent: node.id,
      type: 'team',
      internal: {
        type: `Collaborator`,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  }

  for (let index = 0; index < contributors.length; index++) {
    const newNode = Object.assign({}, contributors[index], {
      id: createNodeId(slug + `contributors-${index}`),
      parent: node.id,
      type: 'contributor',
      internal: {
        type: `Collaborator`,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  }
};

/**
 * Creates CoverImage node from image file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} fileNode - JSON file node
 * @param {string} id - String ID for new CoverImage node
 */
const createCoverImageNode = (
  createNode,
  createContentDigest,
  fileNode,
  id
) => {
  const newNode = {
    id,
    parent: fileNode.id,
    file: fileNode.id,
    internal: {
      type: `CoverImage`,
      contentDigest: createContentDigest(fileNode)
    }
  };
  createNode(newNode);
};

/**
 * Creates CoverImage node related to a video or contribution from image file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {string} source - Parent node of node
 */
exports.createVideoCoverImageNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  source
) => {
  const { name, relativeDirectory, extension } = node;
  if (name === 'placeholder') return;
  const slug = relativeDirectory;
  const postfixSlug = relativeDirectory.endsWith('/contributions')
    ? `/${name}`
    : relativeDirectory.endsWith('/images')
    ? `/${name}.${extension}`
    : '';
  const id = createNodeId(`cover-image/${source}/${slug}${postfixSlug}`);
  createCoverImageNode(createNode, createContentDigest, node, id);
};

/**
 * Creates CoverImage node related to a track from image file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {string} type - Parent node of node
 */
exports.createTrackCoverImageNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  type
) => {
  const { name, relativeDirectory } = node;
  if (name === 'placeholder') return;
  const slug = relativeDirectory;
  const id = createNodeId(`cover-image/${type}/${slug}`);
  createCoverImageNode(createNode, createContentDigest, node, id);
};

/**
 * Creates CoverImage node related to a talk from image file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 */
exports.createTalkCoverImageNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node
) => {
  const { name } = node;
  if (name === 'placeholder') return;
  const id = createNodeId(`cover-image/talks/${name}`);
  createCoverImageNode(createNode, createContentDigest, node, id);
};

/**
 * Creates CoverImage node related to a faq answer from image file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 */
exports.createFAQImageNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node
) => {
  const { name } = node;
  const id = createNodeId(`cover-image/faqs/${name}`);
  createCoverImageNode(createNode, createContentDigest, node, id);
};

/**
 * Creates CoverImage node related to a guide from image file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 */
exports.createGuideCoverImageNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node
) => {
  const { name } = node;
  if (name === 'placeholder') return;
  const id = createNodeId(`cover-image/guides/${name}`);
  createCoverImageNode(createNode, createContentDigest, node, id);
};
