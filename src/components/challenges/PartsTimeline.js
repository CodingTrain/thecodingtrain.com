import React, { memo, useState } from 'react';
import cn from 'classnames';

import * as css from './PartsTimeline.module.css';
import { Link } from 'gatsby';

const PartsTimeline = ({ className, parts, onPartChange }) => {
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  const updatePartIndex = (index) => {
    onPartChange(parts[index]);
    setCurrentPartIndex(index);
  };

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
              <Link
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  updatePartIndex(index);
                }}>
                {part.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={css.navigation}>
        {currentPartIndex > 0 && (
          <Link
            to="#"
            className={css.navButton}
            onClick={(event) => {
              event.preventDefault();
              updatePartIndex(currentPartIndex - 1);
            }}>
            Previous
          </Link>
        )}
        {currentPartIndex < parts.length - 1 && (
          <Link
            to="#"
            className={css.navButton}
            onClick={(event) => {
              event.preventDefault();
              updatePartIndex(currentPartIndex + 1);
            }}>
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(PartsTimeline);
