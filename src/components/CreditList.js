import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './CreditList.module.css';

const Credit = ({ credit }) => {
  const { name, title, url } = credit;

  return (
    <li className={css.credit}>
      <div className={css.creditTitle}>{title}</div>
      {name && (
        <div className={css.description}>
          <p>by {url ? <a href={url}>{name}</a> : name}</p>
        </div>
      )}
    </li>
  );
};

const CreditList = ({ className, variant, credits }) => {
  return (
    <ul className={cn(css.root, className, { [css[variant]]: variant })}>
      {credits.map((credit, key) => (
        <Credit key={key} credit={credit} />
      ))}
    </ul>
  );
};

export default memo(CreditList);
