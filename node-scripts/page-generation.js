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
          id
          slug
          type
          videos {
            id
            slug
            contributionsPath
          }
          chapters {
            lessons {
              id
              slug
              contributionsPath
            }
          }
        }
      }
    }
  `);

  data.tracks.nodes.forEach((track) => {
    const firstVideo =
      track.type === 'main' ? track.chapters[0].lessons[0] : track.videos[0];
    createPage({
      path: `tracks/${track.slug}`,
      component: require.resolve(`../src/templates/track-video.js`),
      context: {
        isTrackPage: true,
        trackId: track.id,
        videoId: firstVideo.id,
        videoSlug: firstVideo.slug,
        contributionsPath: firstVideo.contributionsPath,
        trackPosition: { chapterIndex: 0, videoIndex: 0 }
      }
    });
    if (track.type === 'main') {
      track.chapters.forEach((chapter, chapterIndex) => {
        chapter.lessons.forEach((lesson, lessonIndex) => {
          createPage({
            path: `tracks/${track.slug}/${lesson.slug}`,
            component: require.resolve(`../src/templates/track-video.js`),
            context: {
              isTrackPage: false,
              trackId: track.id,
              videoId: lesson.id,
              videoSlug: lesson.slug,
              contributionsPath: lesson.contributionsPath,
              trackPosition: { chapterIndex, videoIndex: lessonIndex }
            }
          });
        });
      });
    } else {
      track.videos.forEach((video, videoIndex) => {
        createPage({
          path: `tracks/${track.slug}/${video.slug}`,
          component: require.resolve(`../src/templates/track-video.js`),
          context: {
            isTrackPage: false,
            trackId: track.id,
            videoId: video.id,
            videoSlug: video.slug,
            contributionsPath: video.contributionsPath,
            trackPosition: { chapterIndex: 0, videoIndex }
          }
        });
      });
    }
  });
};
