const omit = require('lodash/omit');
const { schema } = require('./schema');

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
    console.log({ newNode });
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
              link
              description
              languages
              topics
              timestamps {
                title
                time
                seconds
              }
              codeExamples {
                title
                type
                codeURL
                githubURL
                editorURL
              }
              groupLinks {
                title
                links {
                  title
                  url
                  author
                }
              }
              canContribute
              contributions {
                title
                url
                author {
                  name
                  url
                }
              }
            }
          }
        }
      }
    }
  `);

  data.tracks.nodes.forEach((track) => {
    // console.log({ track });
    track.chapters.forEach((chapter, chapterIndex) => {
      // console.log({ chapter });
      chapter.videos.forEach((video, videoIndex) => {
        // console.log({ video });
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
