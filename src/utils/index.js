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
const noop = () => { };
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


export const normalizedLanguages = (language) => {

  const lowercasedLanguage = language.toLowerCase()
  const languages = {
    "javascript": "JavaScript",
    "processing": "Processing"
  }

  return languages[lowercasedLanguage] ? languages[lowercasedLanguage] : lowercasedLanguage
}