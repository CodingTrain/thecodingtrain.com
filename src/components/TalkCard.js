import React, { memo } from 'react';

import * as css from './TalkCard.module.css';

const TalkCard = ({ title, meta, description }) => {
  return (
    <div className={css.root}>
      <h5>{title}</h5>
      {meta && <p className={css.meta}>{meta}</p>}
      <p>{description}</p>
    </div>
  );
};

export default memo(TalkCard);
