import set from 'lodash/set.js';

const tagResolver = async (source, context, type) => {
  // track.videos
  let videoIds = source.videos ?? [];

  // track.chapters.videos
  if (source.chapters) {
    const chapters = await context.nodeModel.getNodesByIds({
      ids: source.chapters,
      type: 'Chapter'
    });

    for (let chapter of chapters) {
      if (chapter.videos) {
        videoIds = [...videoIds, ...chapter.videos];
      }
    }
  }

  // fetch all video nodes we found (node types can be Video or Challenge)
  const allVideos = await context.nodeModel.getNodesByIds({ ids: videoIds });

  // extract and dedupe tags
  const tags = new Set();

  for (let video of allVideos) {
    if (video[type]) {
      video[type].forEach((v) => tags.add(v));
    }
  }

  return [...tags];
};

const filterByTagsResolver = async (
  args,
  context,
  type // Challenge or Track
) => {
  const { language, topic, skip, limit } = args;

  const query = {};

  if (language) set(query, `filter.languages.eq`, language);
  if (topic) set(query, `filter.topics.eq`, topic);
  if (skip) set(query, 'skip', skip);
  if (limit) set(query, 'limit', limit);

  if (type === 'Challenge') {
    // handle the sorting in GraphQL
    set(query, 'sort.fields', ['date']);
    set(query, 'sort.order', ['DESC']);
  }

  let { entries } = await context.nodeModel.findAll({
    type,
    query
  });

  if (type === 'Track') {
    // We have to implement our own sorting for tracks because the order is defined in a different JSON file.
    // When trying to implement an `order` resolver on the `Track` type and sorting with GraphQL, the resolver result gets cached
    // and it makes the sorting order stale, requiring a full cache clearing.

    const { trackOrder } = await context.nodeModel.findOne({
      type: 'TracksOrder'
    });

    entries = [...entries].sort((a, b) => {
      let aIndex = trackOrder.indexOf(`${a.type}-tracks/${a.slug}`);
      aIndex = aIndex > -1 ? aIndex : 9999;

      let bIndex = trackOrder.indexOf(`${b.type}-tracks/${b.slug}`);
      bIndex = bIndex > -1 ? bIndex : 9999;

      return aIndex - bIndex;
    });
  }

  return entries;
};

const filterByAuthorNameSlugResolver = async (args, context) => {
  const { authorSlug, skip, limit } = args;

  const query = {};

  set(query, 'sort.fields', ['submittedOn', 'title']);
  set(query, 'sort.order', ['DESC', 'ASC']);

  if (authorSlug) set(query, `filter.author.nameSlug.eq`, authorSlug);
  if (skip) set(query, 'skip', skip);
  if (limit) set(query, 'limit', limit);

  const { entries } = await context.nodeModel.findAll({
    type: 'Contribution',
    query
  });

  return entries;
};

const showcaseResolver = async (source, args, context, info) => {
  const query = {};

  set(query, 'filter.video.id.eq', source.id);
  set(query, 'sort.order', ['ASC']);
  set(query, 'sort.fields', ['name']);

  const { entries } = await context.nodeModel.findAll({
    type: 'Contribution',
    query
  });

  return entries;
};

const videoCanonicalTrackResolver = async (source, args, context, info) => {
  // we need a pointer from a video to its canonical track for the showcase page

  // challenge videos can't have a canonical track (their challenge page is canon)
  if (source.source === 'Challenges') return;

  // a canonical track might've been explicitly set in the Gatsby node creation phase
  if (source.canonicalTrack) {
    return await context.nodeModel.getNodeById({ id: source.canonicalTrack });
  }

  // find tracks referencing this video
  const queries = [
    set({}, 'filter.videos.elemMatch.id.eq', source.id),
    set({}, 'filter.chapters.elemMatch.videos.elemMatch.id.eq', source.id)
  ];

  for (const query of queries) {
    const track = await context.nodeModel.findOne({ type: 'Track', query });
    if (track) return track;
  }

  // it shouldn't be possible to get here - non-challenge videos should have at least one track referencing them
  return;
};

// ---

export const createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Track: {
      topics: {
        type: ['String'],
        resolve: async (source, args, context, info) =>
          await tagResolver(source, context, 'topics')
      },
      languages: {
        type: ['String'],
        resolve: async (source, args, context, info) =>
          await tagResolver(source, context, 'languages')
      }
    },
    Challenge: {
      showcase: {
        type: ['Contribution'],
        resolve: showcaseResolver
      }
    },
    Video: {
      showcase: {
        type: ['Contribution'],
        resolve: showcaseResolver
      },
      canonicalTrack: {
        type: 'Track',
        resolve: videoCanonicalTrackResolver
      }
    },
    Query: {
      tracksPaginatedFilteredByTags: {
        type: ['Track'],
        resolve: async (source, args, context, info) =>
          await filterByTagsResolver(args, context, 'Track')
      },
      challengesPaginatedFilteredByTags: {
        type: ['Challenge'],
        resolve: async (source, args, context, info) =>
          await filterByTagsResolver(args, context, 'Challenge')
      },
      contributionsPaginatedFilteredByTags: {
        type: ['Contribution'],
        resolve: async (source, args, context, info) =>
          await filterByAuthorNameSlugResolver(args, context)
      }
    }
  };
  createResolvers(resolvers);
};
