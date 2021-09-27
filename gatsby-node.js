const omit = require('lodash/omit');

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;

  // We don't necessarily need to add every field here, since
  // Gatsby will auto-generate the fields when created. This is
  // just to make sure that certain fields are set to certain types.
  createTypes(`
    type Track implements Node {
      title: String!
      slug: String!
      type: String!
      description: String!
      chapters: [Chapter] @link
      numVideos: Int!
    }

    type Chapter implements Node {
      title: String
      track: Track! @link
      videos: [Video] @link
    }

    type Video implements Node {
      title: String!
      topics: [String]
      languages: [String]
    }
  `);
};

exports.onCreateNode = ({
  node,
  actions,
  createNodeId,
  createContentDigest,
  getNode
}) => {
  const { createNode } = actions;

  /**
    Turn track json files into Track and Chapter nodes
  **/
  if (node.internal.type === 'TracksJson') {
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
    const parent = getNode(node.parent);
    const slug = parent.name;
    const data = getJson(node);
    const newNode = Object.assign({}, data, {
      id: createNodeId(slug),
      slug,
      internal: {
        type: `Video`,
        contentDigest: createContentDigest(data)
      }
    });
    createNode(newNode);
  }
};

exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions;
  const { data } = await graphql(`
    query {
      tracks: allTrack {
        nodes {
          title
          slug
          description
          numVideos
          type
          chapters {
            title
            videos {
              title
              slug
              description
              languages
              topics
            }
          }
        }
      }
    }
  `);

  data.tracks.nodes.forEach((track) => {
    track.chapters.forEach((chapter, chapterIndex) => {
      chapter.videos.forEach((video, videoIndex) => {
        createPage({
          path: `tracks/${track.slug}/${video.slug}`,
          component: require.resolve(`./src/pages/tracks/{Track.slug}.js`),
          context: { track, video, trackPosition: { chapterIndex, videoIndex } }
        });
      });
    });
  });
};

const getJson = (node) => {
  return omit(node, ['id', 'children', 'parent', 'internal']);
};
