import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './Spacer.module.css';

import { pattern as patternClass } from '../styles/styles.module.css';

const Spacer = ({
  className,
  pattern,
  variant,
  background,
  children,
  size
}) => {
  return (
    <div
      className={cn(css.root, className, {
        [patternClass]: pattern,
        [css[variant]]: variant,
        [css[size]]: size
      })}
      style={{ background }}>
      {children}
    </div>
  );
};

export default memo(Spacer);
