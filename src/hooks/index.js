import { useMemo, useRef, useEffect } from 'react';
import { passiveEventArg } from '../utils';
/**
 * Takes an array of images nodes and makes a hashed object based on their names
 */
export const useImages = (nodes, property = 'name') => {
  return useMemo(() => {
    const images = {};
    for (let i = 0; i < nodes.length; i++) {
      images[nodes[i][property]] = nodes[i].childImageSharp.gatsbyImageData;
    }
    return images;
  }, [nodes, property]);
};

export const filterVideos = (videos, filters) => {
  const { isFiltered, language, topic } = filters;
  if (!isFiltered) return videos;
  return videos.filter(
    (v) =>
      (language === 'all' || v.languages.includes(language)) &&
      (topic === 'all' || v.topics.includes(topic))
  );
};

export const useSelectedTags = (pathname) => {
  const splittedString = pathname.replace('%20', ' ').split('/');
  const filterString =
    splittedString[2] && splittedString[2].includes('+')
      ? splittedString[2]
      : 'lang:all+topic:all';
  const [languageFilter, topicFilter] = filterString.split('+');
  return [languageFilter.split(':')[1], topicFilter.split(':')[1]];
};

const scrollPositions = {};

// persists scroll position of an element across page refreshes
export const usePersistScrollPosition = (key) => {
  const ref = useRef(); // the ref
  const frame = useRef(); // internal timer

  // save the current scroll position, debounced with requestAnimationFrame
  const onScroll = (e) => {
    cancelAnimationFrame(frame.current);
    requestAnimationFrame(() => {
      // console.log('setting scroll to', scrollPositions[key]);
      scrollPositions[key] = e.target.scrollTop;
    });
  };

  // if set, override scrollTop of element on initial load
  useEffect(() => {
    if (scrollPositions[key]) {
      // console.log('restoring scroll to', scrollPositions[key]);
      ref.current.scrollTop = scrollPositions[key];
    }

    ref.current.addEventListener('scroll', onScroll, passiveEventArg);

    return () => {
      ref.current &&
        ref.current.removeEventListener('scroll', onScroll, passiveEventArg);
    };
  }, []);

  return ref;
};
