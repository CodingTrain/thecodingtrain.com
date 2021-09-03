import React from 'react';
import cn from 'classnames';

import * as css from './TrackCard.module.css';
import { pattern } from '../styles/styles.module.css';

const TrackCard = ({ numVideos, trackType = 'Main track' }) => {
  return (
    <div className={css.root}>
      <div className={css.left}>Left</div>
      <div className={css.right}>
        <div className={cn(pattern, css.details)}>
          <div className={css.icon}>O</div>
          <div className={css.trackType}>{trackType}</div>
          <div className={css.numVideos}>{numVideos} videos</div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
