import React, { memo } from 'react';
import ButtonPanel from './ButtonPanel';
import cn from 'classnames';

import * as css from './PagePanel.module.css';

import Triangle from '../images/triangle_walking.svg';

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
        <Triangle className={css.ctaIcon} />

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
