import React, { memo } from 'react';
import ButtonPanel from './ButtonPanel';
import cn from 'classnames';

import * as css from './PagePanel.module.css';

const PagePanel = (props) => {
  const { description, bbColor, variant, ...buttonPanelProps } = props;
  return (
    <div
      className={cn(css.root, {
        [css[variant]]: variant,
        [css['bb' + bbColor]]: bbColor
      })}>
      <div className={css.description}>
        <p>{description}</p>
      </div>
      <div className={css.cta}>
        <ButtonPanel
          className={css.buttonPanel}
          variant={variant}
          {...buttonPanelProps}
        />
      </div>
    </div>
  );
};

export default memo(PagePanel);
