import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import cn from 'classnames';

import * as css from './NebulaVideoRow.module.css';

const NebulaVideoRow = ({ nebulaSlug, variant }) => {
  return (
    <div className={cn(css.root, css[variant], { [css.hideRow]: !nebulaSlug })}>
      {nebulaSlug && (
        <a
          href={`https://nebula.tv/videos/${nebulaSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={css.link}>
          <span className={css.text}>Watch on</span>
          <StaticImage
            src="../images/nebula-logo.png"
            height={22}
            alt="Nebula logo"
            placeholder="none"
            style={{ marginLeft: '13px' }}
            imgStyle={{ transition: 'none' }}
          />
        </a>
      )}
    </div>
  );
};

export default NebulaVideoRow;
