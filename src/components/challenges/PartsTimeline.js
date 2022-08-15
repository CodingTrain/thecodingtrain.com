import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Link } from 'gatsby';

import * as css from './PartsTimeline.module.css';

const PartsTimeline = memo(({ className, parts, setPart }) => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  const updatePartIndex = (index) => {
    setPart(parts[index]);
    setCurrentPartIndex(index);
  };

  return (
    <div className={cn(css.root, className)}>
      <div className={css.overviewTimeline}>
        <ul className={css.partList}>
          {parts.map((part, index) => (
            <li
              key={index}
              className={cn(css.videoItem, {
                [css.seen]: index <= currentPartIndex,
                [css.last]: index === currentPartIndex
              })}>
              <button onClick={() => updatePartIndex(index)}>
                {part.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={css.navigation}>
        {currentPartIndex > 0 && (
          <button
            className={css.navButton}
            onClick={() => {
              updatePartIndex(currentPartIndex - 1);
            }}>
            Previous
          </button>
        )}
        {currentPartIndex < parts.length - 1 && (
          <button
            className={css.navButton}
            onClick={() => {
              updatePartIndex(currentPartIndex + 1);
            }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
});

export default memo(PartsTimeline);
