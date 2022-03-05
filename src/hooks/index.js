import React, { useMemo } from 'react';

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

const linkRegEx = /\[[^[\]]*\]\([^()]*\)/g;

export const useLinkParsedText = (text) =>
  useMemo(() => {
    const result = [];
    let keyIndex = 0;
    let currentIndex = 0;
    let match;
    while ((match = linkRegEx.exec(text)) !== null) {
      result.push(
        <span key={keyIndex}>{text.substring(currentIndex, match.index)}</span>
      );
      keyIndex += 1;
      const linkText = match[0].substring(1, match[0].indexOf(']'));
      const linkUrl = match[0].substring(
        match[0].indexOf('(') + 1,
        match[0].indexOf(')')
      );
      result.push(
        <a key={keyIndex} href={linkUrl}>
          {linkText}
        </a>
      );
      keyIndex += 1;
      currentIndex = linkRegEx.lastIndex;
    }
    result.push(text.substring(currentIndex, text.length));
    return result;
  }, [text]);
