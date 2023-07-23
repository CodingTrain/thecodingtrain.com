import React, { memo, useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import * as css from './Tags.module.css';

const Tags = ({
  className,
  heading,
  items,
  singleLine = true,
  linkTo,
  headerType = 'h2'
}) => {
  const [truncate, setTruncate] = useState(true);
  const truncateSize = 2;
  const overflowSize = items.length - truncateSize;
  const showToggle = overflowSize > 1;
  const visibleItems =
    showToggle && truncate ? items.slice(0, truncateSize) : items;

  const Header = headerType;

  return (
    <div className={cn(css.root, className, { [css.singleLine]: singleLine })}>
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

      {showToggle && (
        <button
          className={css.showButton}
          onClick={() => setTruncate((v) => !v)}>
          {truncate ? `and ${overflowSize} more` : 'show less'}
        </button>
      )}
    </div>
  );
};

export default memo(Tags);
