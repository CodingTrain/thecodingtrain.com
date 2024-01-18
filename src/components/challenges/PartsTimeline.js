import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './PartsTimeline.module.css';
import { Link } from 'gatsby';

const PartsTimeline = ({ className, parts, currentPartIndex }) => {
  return (
    <div className={cn(css.root, className)}>
      <div className={css.partsTimeline}>
        <ul className={css.partList}>
          {parts.map((part, index) => (
            <li
              key={index}
              className={cn(css.videoItem, {
                [css.seen]: index <= currentPartIndex,
                [css.last]: index === currentPartIndex
              })}>
              <Link to={`#part-${index + 1}`}>{part.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={css.navigation}>
        {currentPartIndex > 0 && (
          <Link to={`#part-${currentPartIndex}`} className={css.navButton}>
            Previous
          </Link>
        )}
        {currentPartIndex < parts.length - 1 && (
          <Link to={`#part-${currentPartIndex + 2}`} className={css.navButton}>
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(PartsTimeline);
