import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import * as css from './Tags.module.css';

const Tags = memo(
  ({ className, heading, items, singleLine = true, linkTo }) => {
    // const visibleItems = items.slice(0, 2);
    // const hiddenItems = items.slice(2);
    return (
      <div
        className={cn(css.root, className, { [css.singleLine]: singleLine })}>
        <h4 className={css.tagHeading}>{heading}</h4>
        {items.map((tag) =>
          linkTo ? (
            <Link
              key={tag}
              className={css.tag}
              to={linkTo(tag)}
              state={{ expanded: true }}>
              {tag}
            </Link>
          ) : (
            <span className={css.tag} key={tag}>
              {tag}
            </span>
          )
        )}
      </div>
    );
  }
);

export default Tags;
