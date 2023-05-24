import { timestampsWithSeconds, toSlug, createDefaults } from './utils.mjs';

/**
 * Creates Video and Showcase Contribution nodes from JSON file node
 */
const createVideoRelatedNode = ({
  createNode,
  createNodeId,
  node,
  parent,
  instanceName
}) => {
  const slugPrefix = instanceName === 'videos' ? '' : 'challenges/';

  // Loaded node may be a JSON file for a contribution or a video
  const isShowcaseContribution = parent.relativePath.includes('/showcase/');

  if (isShowcaseContribution) {
    // showcase Contribution

    const newNode = {
      ...createDefaults('Contribution', node),

      id: createNodeId(`${slugPrefix}${parent.relativePath}`),
      name: parent.name,
      author: { ...node.author, nameSlug: toSlug(node.author.name) },
      video: createNodeId(
        `--videos/${slugPrefix}${parent.relativeDirectory.replace(
          '/showcase',
          ''
        )}`
      ),
      cover: createNodeId(
        `cover-image/${slugPrefix}${parent.relativeDirectory}/${parent.name}`
      )
    };
    createNode(newNode);
  } else {
    // Video or Challenge
    const schemaType = instanceName === 'videos' ? 'Video' : 'Challenge';
    const slug = parent.relativeDirectory;

    const timestamps = timestampsWithSeconds(node.timestamps);
    const parts = (node.parts ?? []).map((part) => ({
      ...part,
      timestamps: timestampsWithSeconds(part.timestamps)
    }));

    // note: there's also a resolver for this property if no track slug is set in source JSON
    const canonicalTrack = node.canonicalTrack
      ? createNodeId(`--tracks/${node.canonicalTrack}`)
      : undefined;

    const newNode = {
      ...createDefaults(schemaType, node),

      id: createNodeId(`--videos/${slugPrefix}${slug}`),
      slug,
      timestamps,
      parts,
      codeExamples: (node.codeExamples ?? []).map((example) => ({
        ...example,
        image: createNodeId(
          `cover-image/${slugPrefix}${slug}/images/${example.image}`
        )
      })),
      groupLinks: node.groupLinks ?? [],
      canContribute: node.canContribute ?? schemaType === 'Challenge',
      relatedChallenges: (node.relatedChallenges ?? []).map((slug) =>
        createNodeId(
          `--videos/${
            slug.includes('challenges') ? slug : `challenges/${slug}`
          }`
        )
      ),
      cover: createNodeId(`cover-image/${slugPrefix}${slug}`),
      source: instanceName,
      canonicalTrack
    };
    createNode(newNode);
  }
};

/**
 * Creates TracksOrder node from JSON file node
 */
const createTracksOrderRelatedNode = ({ createNode, createNodeId, node }) => {
  const newNode = {
    ...createDefaults('TracksOrder', node),

    id: createNodeId(`tracks-order`)
  };
  createNode(newNode);
};

/**
 * Creates Track node from JSON file node
 */
const createTrackRelatedNode = ({
  createNode,
  createNodeId,
  node,
  parent,
  instanceName
}) => {
  const slug = parent.relativeDirectory;
  const id = createNodeId(`--tracks/${slug}`);
  const type = instanceName.replace('-tracks', ''); // main or side
  let numVideos = 0;
  let chapters;
  let videos;

  // Make Chapter nodes if there are chapters defined
  if (node.chapters) {
    chapters = node.chapters.map((chapter) => {
      const newNode = {
        ...createDefaults('Chapter', chapter),

        id: createNodeId(`${slug}/${chapter.title}`),
        parent: id,
        track: id,
        videos: chapter.videos.map((videoSlug) =>
          createNodeId(`--videos/${videoSlug}`)
        )
      };
      createNode(newNode);

      numVideos += chapter.videos.length;

      return newNode.id;
    });
  } else {
    videos = node.videos.map((videoSlug) =>
      createNodeId(`--videos/${videoSlug}`)
    );

    numVideos += node.videos.length;
  }

  const newNode = {
    ...createDefaults('Track', node),

    id,
    type,
    slug,
    numVideos,
    chapters,
    videos,
    cover: createNodeId(`cover-image/${instanceName}/${slug}`)
  };
  createNode(newNode);
};

/**
 * Creates FAQ node from JSON file node
 */
const createFAQRelatedNode = ({ createNode, createNodeId, node, parent }) => {
  const slug = parent.name;

  if (slug !== 'index') {
    const newNode = {
      ...createDefaults('FAQ', node),

      id: createNodeId('--faqs/' + slug),
      slug,
      answer: {
        ...node.answer,
        image: createNodeId(`cover-image/faqs/${slug}`)
      }
    };
    createNode(newNode);
  } else {
    const sections = node.sections.map((section, index) => {
      const sectionNode = {
        ...createDefaults('FAQSection', section),

        id: createNodeId(`--faqSections/${index}`),
        parent: node.id,
        title: section.title,
        questions: section.questions.map((q) => createNodeId(`--faqs/${q}`))
      };
      createNode(sectionNode);
      return sectionNode.id;
    });

    const newNode = {
      ...createDefaults('FAQPage', node),

      id: createNodeId('--faqPage'),
      sections
    };
    createNode(newNode);
  }
};

/**
 * Creates Guide node from JSON file node
 */
const createGuideRelatedNode = ({ createNode, createNodeId, node, parent }) => {
  const { name } = parent;

  const newNode = {
    ...createDefaults('Guide', node),

    id: createNodeId('--guide/' + name),
    mdx: node.id,
    cover: createNodeId(`cover-image/guides/${name}`)
  };
  createNode(newNode);
};

/**
 * Creates Homepage nodes from JSON file node
 */
const createHomepageRelatedNodes = ({ createNode, createNodeId, node }) => {
  const newNode = {
    ...createDefaults('HomepageInfo', node),

    id: createNodeId(`--homepage`),
    tracks: {
      ...node.tracks,
      featured: node.tracks.featured.map((slug) =>
        createNodeId(`--tracks/${slug}`)
      )
    },
    challenges: {
      ...node.challenges,
      featured: node.challenges.featured.map((slug) =>
        createNodeId(`--videos/challenges/${slug}`)
      )
    },
    passengerShowcase: {
      ...node.passengerShowcase,
      featured: node.passengerShowcase.featured.map((showcasePath) =>
        createNodeId(showcasePath)
      )
    }
  };
  createNode(newNode);
};

/**
 * Creates About Page nodes from JSON file node
 */
const createAboutPageRelatedNodes = ({ createNode, createNodeId, node }) => {
  const newNode = {
    ...createDefaults('AboutPageInfo', node),

    id: createNodeId(`--about-page`),
    covers: node.covers.map((cover) =>
      createNodeId(`cover-image/about-page/${cover}`)
    ),
    featured: node.featured.map((f) => ({
      ...f,
      thumbnail: createNodeId(`cover-image/about-page/${f.thumbnail}`)
    }))
  };
  createNode(newNode);
};

/**
 * Creates Guides Page Data nodes from JSON file node
 */
const createGuidesPageRelatedNodes = ({
  createNode,
  createNodeId,
  node,
  parent
}) => {
  const newNode = {
    ...createDefaults('GuidesPageInfo', node),

    id: createNodeId(`--guides-page-info`),
    source: parent.sourceInstanceName
  };
  createNode(newNode);
};

/**
 * Creates Tracks Page Data nodes from JSON file node
 */
const createTracksPageRelatedNodes = ({ createNode, createNodeId, node }) => {
  const newNode = {
    ...createDefaults('TracksPageInfo', node),

    id: createNodeId(`--tracks-page-info`)
  };
  createNode(newNode);
};

/**
 * Creates Showcase Page Data nodes from JSON file node
 */
const createShowcasePageRelatedNodes = ({ createNode, createNodeId, node }) => {
  const newNode = {
    ...createDefaults('ShowcasePageInfo', node),

    id: createNodeId(`--showcase-page-info`)
  };
  createNode(newNode);
};

/**
 * Creates Challenges Page Data nodes from JSON file node
 */
const createChallengesPageRelatedNodes = ({
  createNode,
  createNodeId,
  node
}) => {
  const newNode = {
    ...createDefaults('ChallengesPageInfo', node),

    id: createNodeId(`--challenges-page-info`),
    featuredChallenge: createNodeId(
      `--videos/challenges/${node.featuredChallenge}`
    )
  };
  createNode(newNode);
};

/**
 * Creates 404 Page Data nodes from JSON file node
 */
const create404PageRelatedNodes = ({ createNode, createNodeId, node }) => {
  const newNode = {
    ...createDefaults('NotFoundInfo', node),

    id: createNodeId(`--page-info/404`)
  };
  createNode(newNode);
};

// --- Images ---

/**
 * Helper function to create CoverImage node from image file node
 */
const createCoverImageNodeHelper = (createNode, fileNode, id) => {
  const { internal } = createDefaults('CoverImage', fileNode);

  const newNode = {
    id,
    parent: fileNode.id,
    file: fileNode.id,
    internal
  };

  createNode(newNode);
};

/**
 * Creates CoverImage node related to a video or contribution from image file node
 */
const createVideoCoverImageNode = ({
  createNode,
  createNodeId,
  node,
  instanceName
}) => {
  const { name, relativeDirectory, extension } = node;
  if (name === 'placeholder') return;

  const prefixSlug = instanceName === 'videos' ? '' : `challenges/`;
  const slug = relativeDirectory;
  const postfixSlug = relativeDirectory.endsWith('/showcase')
    ? `/${name}`
    : relativeDirectory.endsWith('/images')
    ? `/${name}.${extension}`
    : '';

  const id = createNodeId(`cover-image/${prefixSlug}${slug}${postfixSlug}`);
  createCoverImageNodeHelper(createNode, node, id);
};

/**
 * Creates CoverImage node related to a track from image file node
 */
const createTrackCoverImageNode = ({
  createNode,
  createNodeId,
  node,
  instanceName
}) => {
  const { name, relativeDirectory } = node;
  if (name === 'placeholder') return;

  const id = createNodeId(`cover-image/${instanceName}/${relativeDirectory}`);
  createCoverImageNodeHelper(createNode, node, id);
};

/**
 * Creates CoverImage node related to a faq answer from image file node
 */
const createFAQImageNode = ({ createNode, createNodeId, node }) => {
  const { name } = node;
  const id = createNodeId(`cover-image/faqs/${name}`);
  createCoverImageNodeHelper(createNode, node, id);
};

/**
 * Creates CoverImage node related to a guide from image file node
 */
const createGuideCoverImageNode = ({ createNode, createNodeId, node }) => {
  const { name, relativePath, relativeDirectory } = node;
  if (name === 'placeholder') return;

  const id = createNodeId(
    `cover-image/guides/${relativeDirectory === '' ? name : relativePath}`
  );
  createCoverImageNodeHelper(createNode, node, id);
};

/**
 * Creates CoverImage node related to the About page from image file node
 */
const createAboutPageCoverImageNode = ({ createNode, createNodeId, node }) => {
  const { name, extension } = node;
  const id = createNodeId(`cover-image/about-page/${name}.${extension}`);
  createCoverImageNodeHelper(createNode, node, id);
};

// ----

// router maps plugin and instance names (defined in gatsby-config) to node creation functions
const router = {
  'gatsby-transformer-json': {
    videos: createVideoRelatedNode,
    challenges: createVideoRelatedNode,
    'main-tracks': createTrackRelatedNode,
    'side-tracks': createTrackRelatedNode,
    'tracks-order': createTracksOrderRelatedNode,
    'showcase-page-data': createShowcasePageRelatedNodes,
    faqs: createFAQRelatedNode,
    'homepage-data': createHomepageRelatedNodes,
    'about-page-data': createAboutPageRelatedNodes,
    '404-page-data': create404PageRelatedNodes,
    'tracks-page-data': createTracksPageRelatedNodes,
    'challenges-page-data': createChallengesPageRelatedNodes,
    guides: createGuidesPageRelatedNodes
  },

  'gatsby-plugin-mdx': {
    guides: createGuideRelatedNode
  },

  'gatsby-source-filesystem': {
    videos: createVideoCoverImageNode,
    challenges: createVideoCoverImageNode,
    'main-tracks': createTrackCoverImageNode,
    'side-tracks': createTrackCoverImageNode,
    faqs: createFAQImageNode,
    guides: createGuideCoverImageNode,
    'about-page-data': createAboutPageCoverImageNode
  }
};

export const onCreateNode = ({ node, actions, createNodeId, getNode }) => {
  const { createNode, createNodeField } = actions;
  const { owner, mediaType } = node.internal;
  const parent = getNode(node.parent);

  // determine instance name based on owner and media type
  const instanceName =
    owner === 'gatsby-source-filesystem' && mediaType?.includes('image')
      ? node.sourceInstanceName
      : parent?.sourceInstanceName;

  // invoke appropriate node creation function from the router
  router[owner]?.[instanceName]?.({
    createNode,
    createNodeId,
    node,
    parent,
    instanceName
  });

  // add our own slug field to `mdx` nodes (MDX v2 removed them)
  // this needs to happen after we created our nodes
  if (owner === 'gatsby-plugin-mdx') {
    createNodeField({ node, name: 'slug', value: parent.name });
  }
};
