import React, { memo, useState, useEffect } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from './Image';

import * as css from './Question.module.css';

import Open from '../images/open.svg';

import { useLinkParsedText } from '../hooks';

const ListItem = ({ item }) => {
  const text = useLinkParsedText(item);
  return <li>{text}</li>;
};

const Question = ({
  variant,
  pathPrefix,
  slug,
  question,
  answer,
  currentHash
}) => {
  const [open, setOpen] = useState(false);
  const answerMainText = useLinkParsedText(answer.text);

  useEffect(() => {
    if (currentHash === `#${slug}`) setOpen(true);
  }, []);

  return (
    <div
      id={slug}
      className={cn(css.root, {
        [css[variant]]: css[variant],
        [css.open]: open
      })}>
      <Link
        className={css.summary}
        onClick={() => setOpen(!open)}
        onKeyPress={(e) => e.key === 'Enter' && setOpen(!open)}
        to={`/${pathPrefix}#${slug}`}>
        <Open className={cn(css.icon, { [css.rotateIcon]: open })} />{' '}
        <p>{question}</p>
      </Link>
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
