import React, { memo } from 'react';
import cn from 'classnames';

import PlayButton from '../images/playbutton-filled.mini.svg';

import * as css from './TimestampTimeline.module.css';

const TimestampTimeline = ({
  className,
  variant,
  timestamps,
  updateTimestamp
}) => (
  <div className={cn(css.root, className, { [css[variant]]: variant })}>
    {timestamps.map((timestamp, key) => {
      const { time, title } = timestamp;
      return (
        <button
          className={css.timestamp}
          onClick={() => updateTimestamp({ ...timestamp })}
          key={key}>
          <span className={css.icon}>
            <PlayButton />
          </span>
          <span className={css.time}>{time}</span>
          <span className={css.title}>{title}</span>
        </button>
      );
    })}
    {timestamps.length === 0 && (
      <div className={css.timestamp}>
        <span className={css.message}>No timestamps for this video</span>
      </div>
    )}
  </div>
);

export default memo(TimestampTimeline);
