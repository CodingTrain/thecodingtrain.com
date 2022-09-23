import { useEffect, useState } from 'react';
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
  if (typeof str === 'string' && str !== '') {
    return str;
  }
  return 'all';
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
export const filteredPath = (resource, language, topic) => {
  return `/${resource}/lang/${toSlug(
    stringValueOrAll(language)
  )}/topic/${toSlug(stringValueOrAll(topic))}`;
};

/**
 * Returns a shuffled copy of the array using the Fisher-Yates algorithm.
 *
 * @param {any[]} array Array to be copied and shuffled
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
 * This hook will return true for the first render on the server and for the
 * first render on the client. Otherwhise, it will return false.
 *
 * This function encapsulates a hook so "rules of hooks" apply to it.
 * @see {@link https://reactjs.org/docs/hooks-rules.html}
 *
 * @return {boolean} true on the first server side and client side render
 */
export const useIsFirstRender = () => {
  const [isFirst, setIsFirst] = useState(true);
  useEffect(() => setIsFirst(false), []);
  return isFirst;
};
