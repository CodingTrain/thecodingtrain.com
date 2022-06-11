import React, { memo, useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import * as css from './Tags.module.css';

const Tags = memo(
  ({
    className,
    heading,
    items,
    singleLine = true,
    linkTo,
    headerType = 'h2'
  }) => {
    const [showAll, setShowAll] = useState(false);
    const visibleItems = showAll ? items : items.slice(0, 2);
    const Header = headerType;
    return (
      <div
        className={cn(css.root, className, { [css.singleLine]: singleLine })}>
        <Header className={css.tagHeading}>{heading}</Header>
        {visibleItems.map((tag, index) =>
          linkTo ? (
            <Link
              key={tag}
              className={css.tag}
              to={linkTo(tag)}
              state={{ expanded: true }}>
              {tag}
              {index !== items.length - 1 && ','}
            </Link>
          ) : (
            <span className={css.tag} key={tag}>
              {tag}
              {index !== items.length - 1 && ','}
            </span>
          )
        )}

        {items.length > 2 && !showAll && (
          <button
            className={css.showButton}
            onClick={() => setShowAll((v) => !v)}>
            Show {showAll ? 'less' : 'more'}
          </button>
        )}
      </div>
    );
  }
);

export default Tags;
