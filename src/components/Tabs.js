import React, { Children, useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import Button from './Button';
import ShareButton from './ShareButton';

import * as css from './Tabs.module.css';

export const Tabs = ({ className, variant, labels, children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wrapShareButton, setWrapShareButton] = useState(false);
  const isFirstRender = useRef(true);
  const tabsRefs = labels.map(useRef);
  const navRef = useRef();

  useEffect(() => {
    if (!navRef.current) return;

    const onResize = () => {
      const hasShareButtonWrapped = navRef.current.clientHeight > 50;
      setWrapShareButton(hasShareButtonWrapped);
    };

    // wait for css layout wrap before reading height (takes a few frames on page load)
    let timeoutId = setTimeout(() => {
      onResize();
      timeoutId = undefined;
    }, 200);

    window.addEventListener('resize', onResize);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', onResize);
    };
  }, [navRef]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (window.innerWidth < 600) {
      const tab = tabsRefs[activeIndex].current;
      tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeIndex, tabsRefs]);

  return (
    <div className={cn(css.root, className, { [css[variant]]: variant })}>
      <nav className={css.tabs} ref={navRef}>
        <ul>
          {labels.map((label, index) => (
            <li
              ref={tabsRefs[index]}
              className={cn({
                [css.next]: index > activeIndex
              })}
              key={index}>
              <Button
                className={cn(css.tab, {
                  [css.active]: index === activeIndex
                })}
                onClick={() => setActiveIndex(index)}>
                {label}
              </Button>
            </li>
          ))}

          {/* inlined tab content (mobile/vertical accordion) */}
          {Children.toArray(children).map((child, index) => (
            <li
              className={cn(css.componentTab, {
                [css.activeComponentTab]: index === activeIndex
              })}
              key={index}>
              {child}
            </li>
          ))}
        </ul>

        <ShareButton
          wrapped={wrapShareButton}
          className={css.share}
          variant={variant}
          text="Copy link"
        />
      </nav>

      {/* tab content (desktop view) */}
      {Children.toArray(children).map((child, index) => (
        <div
          className={cn(css.component, {
            [css.activeComponent]: index === activeIndex
          })}
          key={index}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
