import React from 'react';
import cn from 'classnames';

import * as css from './NebulaVideoRow.module.css';

import nebulaButtonSvgUrl from '../images/nebula-button.svg?url';

const NebulaVideoRow = ({ nebulaSlug, variant }) => {
  return (
    <div className={cn(css.root, css[variant], { [css.hideRow]: !nebulaSlug })}>
      {nebulaSlug && (
        <a
          href={`https://nebula.tv/videos/${nebulaSlug}`}
          target="_blank"
          rel="noopener noreferrer">
          <img className={css.svg} src={nebulaButtonSvgUrl} alt="Nebula logo" />
        </a>
      )}
    </div>
  );
};

export default NebulaVideoRow;
