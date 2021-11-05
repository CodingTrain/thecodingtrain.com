import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './LinkList.module.css';

const LinkList = memo(({ className, variant, links }) => {
  return (
    <ul className={cn(css.root, className, { [css[variant]]: variant })}>
      {links.map((link, key) => {
        return (
          <li className={css.link} key={key}>
            <a
              className={css.url}
              href={link.url}
              target="_blank"
              rel="noreferrer">
              {link.title}
            </a>
            {link.author && <span>By {link.author}</span>}
          </li>
        );
      })}
    </ul>
  );
});

export default LinkList;
