/**
 * Creates single Challenge pages for all loaded Challenge nodes
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
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
    // Passes context variables for querying corresponding
    // challenge, contributions and images in front-end
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

/**
 * Creates individual Video pages nested from the loaded tracks
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
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
    // Determine the corresponding first video of the track
    // Main => First chapter's first lesson
    // Side => First video
    const firstVideo =
      track.type === 'main' ? track.chapters[0].lessons[0] : track.videos[0];

    // Create track intro page with first video
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
    // For a main track, each lesson has it's own URL and page
    // Context is passed so that front-end correctly loads related data
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
      // Similarly, in a side track, each video has it's own URL and page
      // Context is passed so that front-end correctly loads related data
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

/**
 * Creates single Guide pages for all loaded MDX nodes
 * @param {function} graphql - Gatsby's graphql function
 * @param {function} createPage - Gatsby's createPage function
 */
exports.createGuidePages = async (graphql, createPage) => {
  const { data } = await graphql(`
    query {
      mdxs: allMdx {
        nodes {
          slug
        }
      }
    }
  `);

  data.mdxs.nodes.forEach((mdx) => {
    createPage({
      path: `guides/${mdx.slug}`,
      component: require.resolve(`../src/templates/guide.js`),
      context: {
        slug: mdx.slug
      }
    });
  });
};
