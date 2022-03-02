import React, { memo, useState } from 'react';
import ButtonPanel from './ButtonPanel';
import cn from 'classnames';

import * as css from './PagePanel.module.css';

import Triangle from '../images/triangle_walking.svg';

const PagePanel = (props) => {
  const { description, bbColor, variant, ...buttonPanelProps } = props;
  const [expand, setExpand] = useState(false);
  return (
    <div
      className={cn(css.root, {
        [css[variant]]: variant,
        [css['bb' + bbColor]]: bbColor
      })}>
      <div className={css.description}>
        <p>{description}</p>
      </div>
      <div className={cn(css.cta, { [css.expand]: expand })}>
        <Triangle
          className={css.ctaIcon}
          onClick={() => setExpand((e) => !e)}
        />

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
