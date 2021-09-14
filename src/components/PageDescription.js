import React, { memo } from 'react';

import * as css from './PageDescription.module.css';

const PageDescription = ({ text, children }) => {
  return (
    <div className={css.root}>
      <div className={css.text}>
        <p>{text}</p>
      </div>
      <div className={css.cta}>{children}</div>
    </div>
  );
};

export default memo(PageDescription);
