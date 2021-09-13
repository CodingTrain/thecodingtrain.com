import React, { memo } from 'react';

/**
 * This component can be used instead of GatsbyImage in case you don't want the wrapper
 **/
const Image = ({ image, className, imgClassName, style, alt = '' }) => {
  return (
    <picture className={className}>
      {image.images.sources.map((source) => (
        <source key={source.type} {...source} />
      ))}
      <img
        className={imgClassName}
        alt={alt}
        style={style}
        {...image.images.fallback}
      />
    </picture>
  );
};

export default memo(Image);
