import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './Heading.module.css';

const Heading = ({ variant, children }) => {
  return (
    <div className={cn(css.root, { [css[variant]]: variant })}>
      <h1>{children}</h1>
    </div>
  );
};

export default memo(Heading);
