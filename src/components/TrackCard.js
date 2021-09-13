import React, { memo } from 'react';
import cn from 'classnames';

import Image from './Image';
import ButtonPanel from './ButtonPanel';

import * as css from './TrackCard.module.css';
import { pattern } from '../styles/styles.module.css';

const TrackCard = ({
  title,
  description,
  image,
  path,
  numVideos,
  trackType = 'Main track',
  topics,
  languages,
  className
}) => {
  return (
    <div className={cn(css.root, className)}>
      <div className={css.left}>
        <div className={css.text}>
          <h3>{title}</h3>
          <p>{description}</p>
          <div className={css.fadeText} />
        </div>
        <ButtonPanel
          text="Ready to start?"
          buttonText="Go to track"
          buttonLink={path}
          variant="red"
        />
      </div>
      <div className={css.right}>
        <div className={cn(pattern, css.details)}>
          <div className={css.icon}>O</div>
          <div className={css.trackType}>{trackType}</div>
          <div className={css.numVideos}>{numVideos} videos</div>
        </div>
        <Image image={image} className={css.image} />
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
        <span className={css.tag} key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
});

export default TrackCard;
