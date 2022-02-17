import React, { memo } from 'react';
import cn from 'classnames';
import parse from 'html-react-parser';

import * as css from './LinkList.module.css';

const Link = ({ link }) => {
  const { description, title, icon, url } = link;
  return (
    <li className={css.link}>
      <span className={css.icon}>{icon}</span>
      <div className={css.url}>
        <a href={url} target="_blank" rel="noreferrer">
          {title}
        </a>
      </div>
      {description && (
        <div className={css.description}>
          <p>{parse(description)}</p>
        </div>
      )}
    </li>
  );
};

const LinkList = memo(({ className, variant, links }) => {
  return (
    <ul className={cn(css.root, className, { [css[variant]]: variant })}>
      {links.map((link, key) => (
        <Link key={key} link={link} />
      ))}
    </ul>
  );
});

export default LinkList;
