import React from 'react';
import cn from 'classnames';

import * as css from './NebulaVideoRow.module.css';

const NebulaVideoRow = ({ nebulaSlug, variant }) => {
  return (
    <div className={cn(css.root, css[variant], { [css.hideRow]: !nebulaSlug })}>
      {nebulaSlug && (
        <a
          href={`https://nebula.tv/videos/${nebulaSlug}`}
          target="_blank"
          rel="noopener noreferrer">
          <img
            className={css.svg}
            src="/images/nebula-button.mini.svg"
            alt="Nebula logo"
          />
        </a>
      )}
    </div>
  );
};

export default NebulaVideoRow;
