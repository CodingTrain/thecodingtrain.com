import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './Filter.module.css';

const Filter = ({
  title,
  items = [],
  icon = '☆',
  selected,
  multiple = false,
  seeMore = 'See more',
  seeLess = 'See less',
  expanded,
  onExpand,
  onChange,
  className,
  variant
}) => {
  const onClick = (item) => {
    let newSelected;

    if (multiple) {
      newSelected = selected.slice();
      const idx = selected.indexOf(item);
      if (idx > -1) {
        newSelected.splice(idx, 1);
      } else {
        newSelected.push(item);
      }
    } else {
      if (selected === item) {
        newSelected = null;
      } else {
        newSelected = item;
      }
    }

    onChange(newSelected);
  };

  return (
    <section className={cn(css.root, className, { [css[variant]]: variant })}>
      <div className={css.left}>
        <div className={css.icon}>{icon}</div>
        <div className={css.spacer} />
      </div>
      <div className={css.right}>
        <div className={css.title}>
          <h2>{title}</h2>
        </div>
        <div className={css.itemContainer}>
          <div className={cn(css.items, { [css.expanded]: expanded })}>
            {items.map((item) => (
              <div
                key={item}
                className={cn(css.item, {
                  [css.selected]:
                    selected &&
                    (multiple ? selected.includes(item) : item === selected)
                })}>
                <button onClick={() => onClick(item)}>{item}</button>
              </div>
            ))}
          </div>
          <div className={css.itemSpacer}></div>
          <button className={css.seeMore} onClick={onExpand}>
            {expanded ? seeLess : seeMore}
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(Filter);
