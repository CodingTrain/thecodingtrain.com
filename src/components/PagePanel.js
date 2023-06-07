import React, { memo } from 'react';
import ButtonPanel from './ButtonPanel';
import cn from 'classnames';

import * as css from './PagePanel.module.css';

const PagePanel = (props) => {
  const {
    description,
    bbColor,
    variant,
    className,
    Character,
    ...buttonPanelProps
  } = props;
  return (
    <aside
      className={cn(css.root, className, {
        [css[variant]]: variant,
        [css['bb' + bbColor]]: bbColor
      })}>
      <div className={css.description}>
        <p>{description}</p>
      </div>
      <div className={css.cta}>
        <Character className={css.ctaIcon} />

        <ButtonPanel
          className={css.buttonPanel}
          variant={variant}
          rainbow
          {...buttonPanelProps}
        />
      </div>
    </aside>
  );
};

export default memo(PagePanel);
