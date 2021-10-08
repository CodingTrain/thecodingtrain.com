import React, { memo } from 'react';
import cn from 'classnames';

import PlayButton from '../images/playbutton-filled.svg';

import * as css from './TimestampTimeline.module.css';

const TimestampTimeline = memo(
  ({ className, variant, timestamps, updateTimestamp }) => (
    <div className={cn(css.root, className, { [css[variant]]: variant })}>
      {timestamps.map(({ time, label }, key) => (
        <button
          className={css.timestamp}
          onClick={() => updateTimestamp({ time, label })}
          key={key}>
          <span className={css.icon}>
            <PlayButton />
          </span>
          <span className={css.time}>{time}</span>
          <span className={css.description}>{label}</span>
        </button>
      ))}
    </div>
  )
);

export default memo(TimestampTimeline);
