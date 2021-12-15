import React, { memo, useState } from 'react';
import cn from 'classnames';

import * as css from './CollapsableDescription.module.css';

const CollapsableDescription = ({
  className,
  expandedClassName,
  variant,
  content,
  charLimit = 350
}) => {
  const [showMore, setShowMore] = useState(false);
  const isCollapsable = content.length > charLimit;
  const text =
    showMore || !isCollapsable
      ? content
      : content.substring(0, charLimit - 1) + ' ...';
  return (
    <div
      className={cn(css.root, className, {
        [css.showMore]: showMore,
        [css[variant]]: variant,
        [expandedClassName]: showMore
      })}>
      <p>
        {text}{' '}
        {isCollapsable && (
          <button
            className={css.showButton}
            onClick={() => setShowMore((v) => !v)}>
            Read {showMore ? 'less' : 'more'}
          </button>
        )}
      </p>
    </div>
  );
};

export default memo(CollapsableDescription);
