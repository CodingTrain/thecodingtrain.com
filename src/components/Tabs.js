import React, { useState } from 'react';
import classnames from 'classnames';

import Button from './Button';
import * as css from './Tabs.module.css';

import ShareIcon from '../images/share.svg';

export const Tabs = ({ labels, children }) => {
  const [active, setActive] = useState(0);

  const onClick = (value) => {
    setActive(value);
  };

  return (
    <div className={css.root}>
      <div className={css.tabs}>
        <ul>
          {labels.map((label, key) => (
            <li key={key}>
              <Button
                className={classnames(css.tab, {
                  [css.active]: key === active
                })}
                onClick={() => onClick(key)}
                onKeyDown={() => onClick(key)}>
                {label}
              </Button>
            </li>
          ))}
        </ul>
        <div className={css.share}>
          <ShareIcon />
          <span>Share</span>
        </div>
      </div>
      {children.map((child, key) => (
        <div
          className={classnames(css.component, {
            [css.activeComponent]: key === active
          })}
          key={key}>
            {child}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
