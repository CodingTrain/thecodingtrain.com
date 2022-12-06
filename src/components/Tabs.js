import React, { Children, useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import Button from './Button';
import ShareButton from './ShareButton';
import * as css from './Tabs.module.css';

export const Tabs = ({ className, variant, labels, children }) => {
  const [active, setActive] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const isFirstRender = useRef(true);
  const navRef = useRef();

  const onClick = (value) => {
    setActive(value);
  };

  const getNavSize = () => {
    if (navRef.current.clientHeight) {
      const newNavHeight = navRef.current.clientHeight;
      setNavHeight(newNavHeight)
    };
  };

   useEffect(() => {
    getNavSize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', getNavSize);
  }, []);

  useEffect(() => {
    if (!isFirstRender.current && window.innerWidth < 600) {
      const tab = document.getElementById(`#component-tab-${active}`);
      tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (isFirstRender) {
      isFirstRender.current = false;
    }
  }, [active]);

  return (
    
    <div className={cn(css.root, className, { [css[variant]]: variant })}>

      <nav className={css.tabs} ref={navRef}>
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
        <ShareButton
          wrapped={navHeight > 50}
          className={css.share}
          variant={variant}
        />
      </nav>
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
