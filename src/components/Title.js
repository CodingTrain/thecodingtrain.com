import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './Spacer.module.css';

const Title = ({ variant, className, children }) => {
  return (
    <div className={cn(css.root, className, css[variant])}>{children}</div>
  );
};

export default memo(Title);
