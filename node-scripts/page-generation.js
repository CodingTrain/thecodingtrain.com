exports.createChallengePages = async (graphql, createPage) => {
  const { data } = await graphql(`
    query {
      challenges: allChallenge {
        nodes {
          id
          slug
          contributionsPath
        }
      }
    }
  `);

  data.challenges.nodes.forEach((challenge) => {
    createPage({
      path: `challenges/${challenge.slug}`,
      component: require.resolve(`../src/templates/challenge.js`),
      context: {
        id: challenge.id,
        contributionsPath: challenge.contributionsPath,
        slug: challenge.slug
      }
    });
  });
};

exports.createTrackVideoPages = async (graphql, createPage) => {
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
              videoId
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
                language
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
    console.log({ track });
    track.chapters.forEach((chapter, chapterIndex) => {
      chapter.videos.forEach((video, videoIndex) => {
        createPage({
          path: `tracks/${track.slug}/${video.slug}`,
          component: require.resolve(`../src/pages/tracks/{Track.slug}.js`),
          context: { track, video, trackPosition: { chapterIndex, videoIndex } }
        });
      });
    });
  });
};
