import React, { memo } from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import cn from 'classnames';

import * as css from './TrackCard.module.css';
import { pattern } from '../styles/styles.module.css';

const TrackCard = ({
  image,
  numVideos,
  trackType = 'Main track',
  topics,
  languages
}) => {
  return (
    <div className={css.root}>
      <div className={css.left}>Left</div>
      <div className={css.right}>
        <div className={cn(pattern, css.details)}>
          <div className={css.icon}>O</div>
          <div className={css.trackType}>{trackType}</div>
          <div className={css.numVideos}>{numVideos} videos</div>
        </div>
        <GatsbyImage image={image} alt="" className={css.image} />
        <Tags heading="Topics" items={topics} />
        <Tags heading="Languages" items={languages} />
      </div>
    </div>
  );
};

const Tags = memo(({ heading, items }) => {
  const visibleItems = items.slice(0, 2);
  // const hiddenItems = items.slice(2);

  return (
    <div className={css.tags}>
      <h3 className={css.tagHeading}>{heading}</h3>
      {visibleItems.map((tag) => (
        <span className={css.tag}>{tag}</span>
      ))}
    </div>
  );
});

export default TrackCard;
