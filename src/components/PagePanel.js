import React, { memo } from 'react';
import ButtonPanel from './ButtonPanel';

import * as css from './PagePanel.module.css';

const PagePanel = (props) => {
  const { description, ...buttonPanelProps } = props;
  return (
    <div className={css.root}>
      <div className={css.description}>
        <p>{description}</p>
      </div>
      <div className={css.cta}>
        <ButtonPanel className={css.buttonPanel} {...buttonPanelProps} />
      </div>
    </div>
  );
};

export default memo(PagePanel);
