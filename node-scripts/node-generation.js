const omit = require('lodash/omit');
const fs = require('fs');
const { cleanUp } = require('./utils');

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
 * Add computed seconds to an array of Timestamp objets (creates a new array).
 *
 * @param {{ time: string, title: string }[]} timestamps
 * @returns the timestamps with computed seconds
 */
const timestampsWithSeconds = (timestamps) => {
  return timestamps.map((t) => ({ ...t, seconds: parseTimestamp(t.time) }));
};

/**
 * Creates Video and Showcase Contribution nodes from JSON file node
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
  if (parent.relativePath.includes('/showcase/')) {
    const data = getJson(node);
    const name = parent.name;
    const newNode = Object.assign({}, data, {
      id: createNodeId(`${slugPrefix}${parent.relativePath}`),
      parent: node.id,
      name,
      video: createNodeId(
        `--videos/${slugPrefix}${parent.relativeDirectory.replace(
          '/showcase',
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
    const showcase = fs.existsSync(`${parent.dir}/showcase`)
      ? fs
          .readdirSync(`${parent.dir}/showcase`)
          .filter((file) => file.includes('.json'))
          .map(
            (file) =>
              `${slugPrefix}${parent.relativeDirectory}/showcase/${file}`
          )
      : [];
    const timestamps = timestampsWithSeconds(data.timestamps ?? []);
    const parts = (data.parts ?? []).map((part) => ({
      ...part,
      timestamps: timestampsWithSeconds(part.timestamps ?? [])
    }));

    const languages = cleanUp(data.languages ?? []);
    const topics = cleanUp(data.topics ?? []);

    const newNode = Object.assign({}, data, {
      id: createNodeId(`--videos/${slugPrefix}${slug}`),
      parent: node.id,
      slug,
      languages,
      topics,
      timestamps,
      parts,
      codeExamples: (data.codeExamples ?? []).map((example) => ({
        ...example,
        image: createNodeId(
          `cover-image/${slugPrefix}${slug}/images/${example.image}`
        )
      })),
      groupLinks: data.groupLinks ?? [],
      canContribute: data.canContribute ?? schemaType === 'Challenge',
      showcase: showcase.map((file) => createNodeId(file)),
      relatedChallenges: (data.relatedChallenges ?? []).map((slug) =>
        createNodeId(
          `--videos/${
            slug.includes('challenges') ? slug : `challenges/${slug}`
          }`
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
  }
};

const trackOrderPath = './content/tracks/index.json';

const getTrackOrder = (trackSlug, trackType) => {
  if (!fs.existsSync(trackOrderPath)) return 99999;

  try {
    const trackOrderJSON = JSON.parse(fs.readFileSync(trackOrderPath));

    for (let index = 0; index < trackOrderJSON.trackOrder.length; index++) {
      if (trackOrderJSON.trackOrder[index] === `${trackType}/${trackSlug}`)
        return index;
    }
  } catch (error) {
    console.log(`Error loading track order file: ${trackOrderPath}`);
    console.error(error);
  }

  return 99999;
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
  const chapters = [];

  // Make Chapter nodes if there are chapters defined
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
  } else {
    numVideos += data.videos.length;
  }

  const order = getTrackOrder(slug, trackType);

  const newNode = Object.assign({}, data, {
    id,
    parent: node.id,
    type,
    slug,
    numVideos,
    order,
    cover: createNodeId(`cover-image/${trackType}/${slug}`),
    internal: {
      type: `Track`,
      contentDigest: createContentDigest(data)
    },
    ...{
      [chapters.length > 0 ? 'chapters' : 'videos']:
        chapters.length > 0
          ? chapters.map((ch) => ch.id)
          : data.videos.map((videoSlug) =>
              createNodeId(`--videos/${videoSlug}`)
            )
    }
  });
  createNode(newNode);

  if (chapters.length > 0) {
    // Create Chapter nodes
    for (let i = 0; i < chapters.length; i++) {
      createNode(chapters[i]);
    }
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
        ...data.answer,
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

    const newNode = Object.assign(data, {
      id: createNodeId('--faqPage'),
      parent: node.id,
      sections: sections.map((s) => s.id),
      internal: {
        type: `FAQPage`,
        contentDigest: createContentDigest(data)
      }
    });
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
 * Creates Homepage nodes from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createHomepageRelatedNodes = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const data = getJson(node);
  const newNode = Object.assign({}, data, {
    id: createNodeId(`--homepage`),
    parent: node.id,
    tracks: {
      ...data.tracks,
      featured: data.tracks.featured.map((slug) =>
        createNodeId(`--tracks/${slug}`)
      )
    },
    challenges: {
      ...data.challenges,
      featured: data.challenges.featured.map((slug) =>
        createNodeId(`--videos/challenges/${slug}`)
      )
    },
    passengerShowcase: {
      ...data.passengerShowcase,
      featured: data.passengerShowcase.featured.map((showcasePath) =>
        createNodeId(showcasePath)
      )
    },
    internal: {
      type: `HomepageInfo`,
      contentDigest: createContentDigest(data)
    }
  });
  createNode(newNode);
};

/**
 * Creates About Page nodes from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createAboutPageRelatedNodes = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const data = getJson(node);
  const newNode = Object.assign({}, data, {
    id: createNodeId(`--about-page`),
    parent: node.id,
    covers: data.covers.map((cover) =>
      createNodeId(`cover-image/about-page/${cover}`)
    ),
    featured: data.featured.map((f) => ({
      ...f,
      thumbnail: createNodeId(`cover-image/about-page/${f.thumbnail}`)
    })),
    internal: {
      type: `AboutPageInfo`,
      contentDigest: createContentDigest(data)
    }
  });
  createNode(newNode);
};

/**
 * Creates Guides Page Data nodes from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createGuidesPageRelatedNodes = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const data = getJson(node);
  const newNode = Object.assign({}, data, {
    id: createNodeId(`--guides-page-info`),
    parent: node.id,
    source: parent.sourceInstanceName,
    internal: {
      type: `GuidesPageInfo`,
      contentDigest: createContentDigest(data)
    }
  });
  createNode(newNode);
};

/**
 * Creates Tracks Page Data nodes from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createTracksPageRelatedNodes = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const data = getJson(node);
  const newNode = Object.assign({}, data, {
    id: createNodeId(`--tracks-page-info`),
    parent: node.id,
    internal: {
      type: `TracksPageInfo`,
      contentDigest: createContentDigest(data)
    }
  });
  createNode(newNode);
};

/**
 * Creates Challenges Page Data nodes from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.createChallengesPageRelatedNodes = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const data = getJson(node);
  const newNode = Object.assign({}, data, {
    id: createNodeId(`--challenges-page-info`),
    parent: node.id,
    featuredChallenge: createNodeId(
      `--videos/challenges/${data.featuredChallenge}`
    ),
    internal: {
      type: `ChallengesPageInfo`,
      contentDigest: createContentDigest(data)
    }
  });
  createNode(newNode);
};

/**
 * Creates 404 Page Data nodes from JSON file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 * @param {object} parent - Parent node of node
 */
exports.create404PageRelatedNodes = (
  createNode,
  createNodeId,
  createContentDigest,
  node,
  parent
) => {
  const data = getJson(node);
  const newNode = Object.assign({}, data, {
    id: createNodeId(`--page-info/404`),
    parent: node.id,
    internal: {
      type: `NotFoundInfo`,
      contentDigest: createContentDigest(data)
    }
  });
  createNode(newNode);
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
  const prefixSlug = source === 'videos' ? '' : `${source}/`;
  const postfixSlug = relativeDirectory.endsWith('/showcase')
    ? `/${name}`
    : relativeDirectory.endsWith('/images')
    ? `/${name}.${extension}`
    : '';
  const id = createNodeId(`cover-image/${prefixSlug}${slug}${postfixSlug}`);
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
  const { name, relativePath, relativeDirectory } = node;
  if (name === 'placeholder') return;
  const id = createNodeId(
    `cover-image/guides/${relativeDirectory === '' ? name : relativePath}`
  );
  createCoverImageNode(createNode, createContentDigest, node, id);
};

/**
 * Creates CoverImage node related to the About page from image file node
 * @param {function} createNode - Gatsby's createNode function
 * @param {function} createNodeId - Gatsby's createNodeId function
 * @param {function} createContentDigest - Gatsby's createContentDigest function
 * @param {object} node - JSON file node
 */
exports.createAboutPageCoverImageNode = (
  createNode,
  createNodeId,
  createContentDigest,
  node
) => {
  const { name, extension } = node;
  const id = createNodeId(`cover-image/about-page/${name}.${extension}`);
  createCoverImageNode(createNode, createContentDigest, node, id);
};
