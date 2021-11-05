import React, { Children, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import Button from './Button';
import ShareButton from './ShareButton';
import * as css from './Tabs.module.css';

export const Tabs = ({ className, variant, labels, children, shareLink }) => {
  const [active, setActive] = useState(0);
  const isFirstRender = useRef(true);

  const onClick = (value) => {
    setActive(value);
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      const tab = document.getElementById(`#component-tab-${active}`);
      tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (isFirstRender) {
      isFirstRender.current = false;
    }
  }, [active]);

  return (
    <div className={cn(css.root, className, { [css[variant]]: variant })}>
      <div className={css.tabs}>
        <ul>
          {labels.map((label, key) => (
            <li
              id={`#component-tab-${key}`}
              className={cn({
                [css.next]: key > active
              })}
              key={key}>
              <Button
                className={cn(css.tab, {
                  [css.active]: key === active
                })}
                onClick={() => onClick(key)}
                onKeyDown={() => onClick(key)}>
                {label}
              </Button>
            </li>
          ))}
          {Children.toArray(children).map((child, key) => (
            <li
              className={cn(css.componentTab, {
                [css.activeComponentTab]: key === active
              })}
              key={key}>
              {child}
            </li>
          ))}
        </ul>
        <ShareButton className={css.share} variant="red" />
      </div>
      {Children.toArray(children).map((child, key) => (
        <div
          className={cn(css.component, {
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
