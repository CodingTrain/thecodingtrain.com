import React, { memo, useState } from 'react';
import cn from 'classnames';

import * as css from './Question.module.css';

import Open from '../images/open.svg';

const Question = ({ variant, question, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        css.root,
        { [css[variant]]: css[variant] },
        { [css.opened]: open }
      )}>
      <div className={css.summary} onClick={() => setOpen(!open)}>
        <Open className={cn(css.icon, { [css.rotateIcon]: open })} />{' '}
        <p>{question}</p>
      </div>
      {open && <div className={css.content}>{content}</div>}
    </div>
  );
};

export default memo(Question);
