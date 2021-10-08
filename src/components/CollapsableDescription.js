import React, { memo, useState } from 'react';
import cn from 'classnames';

import * as css from './CollapsableDescription.module.css';

const CollapsableDescription = ({
  className,
  expandedClassName,
  variant,
  content,
  wordLimit = 45
}) => {
  const [showMore, setShowMore] = useState(false);
  const splittedContent = content.split(' ');
  const isCollapsable = splittedContent.length > wordLimit;
  const text =
    showMore || !isCollapsable
      ? content
      : splittedContent.slice(0, wordLimit - 1).join(' ') + ' ...';
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
            show {showMore ? 'less' : 'more'}
          </button>
        )}
      </p>
    </div>
  );
};

export default memo(CollapsableDescription);
