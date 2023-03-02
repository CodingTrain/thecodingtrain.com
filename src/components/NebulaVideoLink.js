import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

import * as css from './NebulaVideoLink.module.css';

const NebulaVideoLink = ({ nebulaSlug }) => {
  return (
    <div className={css.root}>
      <a
        href={`https://nebula.tv/videos/${nebulaSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={css.link}>
        <span className={css.text}>watch this video ad-free on</span>
        <StaticImage
          src="../images/nebula-logo.png"
          height={22}
          alt="Nebula logo"
          placeholder="none"
          style={{ marginLeft: '13px' }}
          imgStyle={{ transition: 'none' }}
        />
      </a>
    </div>
  );
};

export default NebulaVideoLink;
