import React, { memo } from 'react';
import ButtonPanel from './ButtonPanel';
import cn from 'classnames';

import * as css from './PagePanel.module.css';

import TriangleCharacter from '../images/characters/Triangle_6.mini.svg';

const PagePanel = (props) => {
  const { description, bbColor, variant, className, ...buttonPanelProps } =
    props;
  return (
    <div
      className={cn(css.root, className, {
        [css[variant]]: variant,
        [css['bb' + bbColor]]: bbColor
      })}>
      <div className={css.description}>
        <p>{description}</p>
      </div>
      <div className={css.cta}>
        <TriangleCharacter className={css.ctaIcon} />

        <ButtonPanel
          className={css.buttonPanel}
          variant={variant}
          rainbow
          {...buttonPanelProps}
        />
      </div>
    </div>
  );
};

export default memo(PagePanel);
