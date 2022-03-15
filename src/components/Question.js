import React, { memo, useState } from 'react';
import cn from 'classnames';

import Image from './Image';

import * as css from './Question.module.css';

import Open from '../images/open.svg';

import { useLinkParsedText } from '../hooks';

const ListItem = ({ item }) => {
  const text = useLinkParsedText(item);
  return <li>{text}</li>;
};

const Question = ({ variant, question, answer }) => {
  const [open, setOpen] = useState(false);
  const answerMainText = useLinkParsedText(answer.text);

  return (
    <div
      className={cn(
        css.root,
        { [css[variant]]: css[variant] },
        { [css.opened]: open }
      )}>
      <div
        className={css.summary}
        onClick={() => setOpen(!open)}
        onKeyPress={(e) => e.key === 'Enter' && setOpen(!open)}
        role="button"
        tabIndex="0">
        <Open className={cn(css.icon, { [css.rotateIcon]: open })} />{' '}
        <p>{question}</p>
      </div>
      {open && (
        <div className={css.answer}>
          {answerMainText}
          {answer.list && (
            <ul className={css.list}>
              {answer.list.map((item, index) => (
                <ListItem key={index} item={item} />
              ))}
            </ul>
          )}
          {answer.image && (
            <Image
              image={answer.image.file.childImageSharp.gatsbyImageData}
              pictureClassName={css.picture}
              imgClassName={css.image}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Question);
