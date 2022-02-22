import { useMemo } from 'react';

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

export const useTopicsAndLanguages = ({ type, videos, chapters }) => {
  return useMemo(() => {
    const topicSet = new Set();
    const languageSet = new Set();
    if (type === 'main') {
      chapters.forEach((chapter) => {
        chapter.videos.forEach((video) => {
          if (video.languages)
            video.languages.forEach((language) => languageSet.add(language));
          if (video.topics)
            video.topics.forEach((topic) => topicSet.add(topic));
        });
      });
    } else if (type === 'side') {
      videos.forEach((video) => {
        if (video.languages)
          video.languages.forEach((language) => languageSet.add(language));
        if (video.topics) video.topics.forEach((topic) => topicSet.add(topic));
      });
    }
    const topics = [...topicSet];
    const languages = [...languageSet];
    return { topics, languages };
  }, [type, videos, chapters]);
};
