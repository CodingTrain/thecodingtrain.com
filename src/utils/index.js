import slugify from 'slugify';

// so it doesn't throw if no window
const win =
  typeof window !== 'undefined' ? window : { screen: {}, navigator: {} };

// passive events test
// adapted from https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
let passiveOptionAccessed = false;
const options = {
  get passive() {
    return (passiveOptionAccessed = true);
  }
};

// have to set and remove a no-op listener instead of null
// (which was used previously), because Edge v15 throws an error
// when providing a null callback.
// https://github.com/rafgraph/detect-passive-events/pull/3
const noop = () => {};
win.addEventListener && win.addEventListener('p', noop, options);
win.removeEventListener && win.removeEventListener('p', noop, false);

export const supportsPassiveEvents = passiveOptionAccessed;

export const passiveEventArg = supportsPassiveEvents
  ? { capture: false, passive: true }
  : false;

export const stringValueOrAll = (str) => {
  return typeof str === 'string' && str !== '' ? str : 'all';
};

/**
  This function has to match the one in node-scripts/utils
  SSR broke when trying to share the same code.
**/
export const toSlug = (path) =>
  slugify(path, { lower: true, trim: true }).replace('.', '-');

/**
  Makes a filtered path
**/
export const filteredPath = (resource, filters) => {
  let path = `/${resource}`;

  const sortedKeys = Object.keys(filters).sort((a, b) => a.localeCompare(b));
  for (const k of sortedKeys) {
    const v = toSlug(stringValueOrAll(filters[k]));
    path += `/${k}/${v}`;
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

export const randomElement = (array) => {
  if (array.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

/**
 * Creates a URL hash value (fragment) refering to a specific part of a
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
