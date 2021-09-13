import { useMemo } from 'react';

/**
 * Takes an array of images nodes and makes a hashed object based on their names
 */
export const useImages = (nodes) => {
  return useMemo(() => {
    const images = {};
    for (let i = 0; i < nodes.length; i++) {
      images[nodes[i].name] = nodes[i].childImageSharp.gatsbyImageData;
    }
    return images;
  }, [nodes]);
};
