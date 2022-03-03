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
