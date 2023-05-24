import slugify from 'slugify';
import omit from 'lodash/omit.js';
import get from 'lodash/get.js';
import { createContentDigest } from 'gatsby-core-utils/create-content-digest';

export const toSlug = (path) => {
  return slugify(path, { lower: true, trim: true }).replace('.', '-');
};

export const createDefaults = (type, node) => {
  // remove Gatsby node internals
  const strippedNode = omit(node, ['id', 'children', 'parent', 'internal']);

  return {
    ...strippedNode,

    parent: node.id,
    internal: { type, contentDigest: createContentDigest(strippedNode) }
  };
};

/**
 * Converts a timestamp into total seconds.
 * @param {string} timestamp - A string representing a time in the format hh:mm:ss or mm:ss.
 * @return {number} total seconds
 */
const timestampToSeconds = (timestamp) => {
  return timestamp
    .split(':')
    .reverse()
    .map(Number)
    .reduce((totalSeconds, component, index) => {
      return totalSeconds + component * 60 ** index;
    }, 0);
};

/**
 * Add computed seconds to an array of Timestamp objets (creates a new array).
 * @param {{ time: string }[]} timestamps
 * @returns {{ time: string, seconds: number }[]} the timestamps with computed seconds
 */
export const timestampsWithSeconds = (timestamps) => {
  return timestamps.map((t) => ({ ...t, seconds: timestampToSeconds(t.time) }));
};

/**
 * Re-implementation of "awesome pagination" for ESM compat
 */
export const paginate = ({
  createPage,
  itemsTotal,
  itemsPerPage,
  pathPrefix,
  component,
  context
}) => {
  // always at least one page (so we can display the filters reset page state when no results instead of 404)
  const numberOfPages = Math.max(1, Math.ceil(itemsTotal / itemsPerPage));

  const paginatePath = (i) => {
    if (i < 0 || i >= numberOfPages) return;
    return i === 0 ? pathPrefix : `${pathPrefix}/${i + 1}`;
  };

  for (let i = 0; i < numberOfPages; i++) {
    const [previousPagePath, path, nextPagePath] = [i - 1, i, i + 1].map(
      paginatePath
    );

    createPage({
      path,
      component,
      context: {
        ...context,

        humanPageNumber: i + 1,
        numberOfPages,
        previousPagePath,
        nextPagePath,

        skip: itemsPerPage * i,
        limit: itemsPerPage
      }
    });
  }
};

/**
 * Extract, dedupe and sort values from an object. Used for tags (languages, topics).
 */
export const extractTags = (nodes, pluckPath) => {
  const set = new Set();
  nodes.forEach((node) => {
    const val = get(node, pluckPath);
    if (typeof val === 'string') {
      set.add(val);
    } else {
      val.forEach((v) => set.add(v));
    }
  });

  return [...set].sort((a, b) => {
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  });
};
