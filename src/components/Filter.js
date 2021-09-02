import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './Filter.module.css';
import { box } from '../styles/box.module.css';

const Filter = ({
  title,
  items = [],
  selected = [],
  seeMore = 'See more',
  onChange,
  className
}) => {
  const onClick = (item) => {
    let newSelected = selected.slice();
    const idx = selected.indexOf(item);

    if (idx > -1) {
      newSelected.splice(idx, 1);
    } else {
      newSelected.push(item);
    }

    onChange(newSelected);
  };

  return (
    <div className={cn(css.root, className)}>
      <div className={css.left}>
        <div className={cn(box, css.icon)}>Ⴤ</div>
        <div className={cn(box, css.spacer)} />
      </div>
      <div className={css.right}>
        <div className={cn(box, css.title)}>
          <h3>{title}</h3>
        </div>
        <div className={css.items}>
          {items.map((item) => (
            <div
              key={item}
              className={cn(box, css.item, {
                [css.selected]: selected.includes(item)
              })}>
              <button onClick={() => onClick(item)}>{item}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

//
// <div className={cn(box, css.left)} />
// <div className={cn(box, css.right)}>
//   This is something!
//   <button onClick={() => {}}>{seeMore}</button>
// </div>

export default memo(Filter);
