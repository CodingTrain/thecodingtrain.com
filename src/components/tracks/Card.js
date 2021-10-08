import React, { memo } from 'react';
import cn from 'classnames';

import Image from '../Image';
import ButtonPanel from '../ButtonPanel';
import Tags from '../Tags';

import * as css from './Card.module.css';
import { pattern } from '../../styles/styles.module.css';

const Card = ({
  title,
  description,
  image,
  path,
  numVideos,
  type,
  topics,
  languages,
  variant,
  className
}) => {
  const trackType = type === 'main' ? 'Main Track' : 'Side Track';

  return (
    <div className={cn(css.root, className, { [css[variant]]: variant })}>
      <div className={css.left}>
        <div className={css.text}>
          <h3 className={css.title}>{title}</h3>
          <Tags className={css.tags} heading="Topics" items={topics} />
          <Tags className={css.tags} heading="Languages" items={languages} />
          <p className={css.description}>{description}</p>
        </div>
        <div className={css.fadeText} />
        <ButtonPanel
          text="Ready to start?"
          buttonText="Go to track"
          buttonLink={path}
          variant={variant}
        />
      </div>
      <div className={css.right}>
        <div className={cn(pattern, css.details)}>
          <h3 className={css.smallTitle}>{title}</h3>
          <div className={css.icon}>👁</div>
          <div className={css.trackType}>{trackType}</div>
          <div className={css.numVideos}>{numVideos} videos</div>
        </div>
        <Image
          image={image}
          pictureClassName={css.picture}
          imgClassName={css.image}
        />
      </div>
    </div>
  );
};

export default memo(Card);
