import React, { memo } from 'react';

import * as css from './Heading.module.css';

const Heading = ({ children }) => {
  return (
    <div className={css.root}>
      <h1>{children}</h1>
    </div>
  );
};

export default memo(Heading);
