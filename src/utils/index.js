import slugify from 'slugify';

/**
  This function has to match the one in node-scripts/utils
  SSR broke when trying to share the same code.
**/
export const toSlug = (path) =>
  slugify(path, { lower: true, trim: true }).replace('.', '-');

const stringValueOrAll = (str) => {
  return typeof str === 'string' && str !== '' ? str : 'all';
};

/**
  Makes a filtered path
**/
export const filteredPath = (resource, filters) => {
  let path = `/${resource}`;

  if (
    Object.values(filters).every((value) => stringValueOrAll(value) === 'all')
  ) {
    return path;
  }

  const sortedKeys = Object.keys(filters).sort((a, b) => a.localeCompare(b));
  for (const key of sortedKeys) {
    const value = toSlug(stringValueOrAll(filters[key]));
    path += `/${key}/${value}`;
  }

  return path;
};

/**
 * Returns a shuffled copy of the array using the Fisher-Yates algorithm.
 *
 * @param {any[]} array Array to be copied and shuffled
 * @return Shuffled copy of the array
 */
export const shuffleCopy = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
};

/**
 * Creates a URL hash value (fragment) referring to a specific part of a
 * multi-part coding challenge. Part 1 of a challenge has no hash value.
 *
 * @param partIndex {number} Zero-based part index
 *
 * @example
 * buildPartHash(0) === ""
 * buildPartHash(1) === "#part-2"
 */
export const buildPartHash = (partIndex) => {
  return partIndex > 0 ? `#part-${partIndex + 1}` : '';
};
