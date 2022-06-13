import React, { memo, useState, useEffect } from 'react';
import cn from 'classnames';

import Image from './Image';
import YouTubeVideo from './YouTubeVideo';

import * as css from './Question.module.css';

import Open from '../images/open.svg';

import { useLinkParsedText } from '../hooks';

const ListItem = ({ item }) => {
  const text = useLinkParsedText(item);
  return <li>{text}</li>;
};

const Question = ({ variant, slug, question, answer, currentHash }) => {
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
      <div
        className={css.summary}
        onClick={() => setOpen(!open)}
        onKeyPress={(e) => e.key === 'Enter' && setOpen(!open)}
        role="button"
        tabIndex="0">
        <Open className={cn(css.icon, { [css.rotateIcon]: open })} />
        <h3>{question}</h3>
        {open && (
          <a
            className={css.permalink}
            href={`#${slug}`}
            onClick={(e) => e.stopPropagation()}>
            #
          </a>
        )}
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
              alt={question}
            />
          )}
          {answer.video && (
            <YouTubeVideo
              containerClassName={css.videoContainer}
              className={css.video}
              videoId={answer.video.id}
              listId={answer.video.list}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Question);
