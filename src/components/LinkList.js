import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './LinkList.module.css';
import { useLinkParsedText } from '../hooks';

const Link = ({ link }) => {
  const { description, title, icon, url } = link;
  const parsedDescription = useLinkParsedText(description ?? '');

  return (
    <li className={css.link}>
      <span className={css.icon}>{icon}</span>
      <div className={css.url}>
        <a
          title={title.length > 30 ? title : ''}
          href={url}
          target="_blank"
          rel="noreferrer">
          {title}
        </a>
      </div>
      {description && (
        <div className={css.description}>{parsedDescription}</div>
      )}
    </li>
  );
};

const LinkList = ({ className, variant, links }) => {
  return (
    <ul className={cn(css.root, className, { [css[variant]]: variant })}>
      {links.map((link, key) => (
        <Link key={key} link={link} />
      ))}
    </ul>
  );
};

export default memo(LinkList);
