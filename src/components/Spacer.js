import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './Spacer.module.css';
import { pattern as patternClass } from '../styles/styles.module.css';

const Spacer = ({ pattern, children }) => {
  return (
    <div
      className={cn(css.root, {
        [patternClass]: pattern
      })}>
      {children}
    </div>
  );
};

export default memo(Spacer);
