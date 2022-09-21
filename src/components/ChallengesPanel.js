import React, { Fragment, memo, useEffect, useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from './Image';

import * as css from './ChallengesPanel.module.css';
import { getReadableDate } from '../hooks';
import { shuffleCopy, useSSR } from '../utils';

const Card = ({
  className,
  challenge,
  placeholderImage,
  headerType = 'h3'
}) => {
  const { title, cover, description, date, slug, videoNumber } = challenge;
  const Header = headerType;
  return (
    <article className={cn(css.challenge, className)}>
      <div className={css.titleContainer}>
        <div className={css.icon}>👁</div>
        <Header className={css.title}>
          {
            <Link to={`/challenges/${slug}`}>
              {videoNumber ? `#${videoNumber} — ` : ''} {title}
            </Link>
          }
        </Header>
      </div>
      <div className={css.thumb}>
        <div className={css.left}>
          <Link to={`/challenges/${slug}`} aria-label={title}>
            {cover ? (
              <Image
                image={cover.file.childImageSharp.gatsbyImageData}
                pictureClassName={css.picture}
                imgClassName={css.image}
                alt={`"${title}" challenge`}
              />
            ) : placeholderImage ? (
              <Image
                image={placeholderImage}
                pictureClassName={css.picture}
                imgClassName={css.image}
                alt={`"${title}" challenge`}
              />
            ) : (
              <div className={css.image}></div>
            )}
          </Link>
          <p className={css.date}>
            <span>
              {date ? (
                <time dateTime={date}>{getReadableDate(date)}</time>
              ) : null}
            </span>
          </p>
        </div>
        <div className={css.right}>
          <div className={css.description}>
            <p>{description}</p>
          </div>
          <p className={css.date}>
            <span>
              {date ? (
                <time dateTime={date}>{getReadableDate(date)}</time>
              ) : null}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
};

const ChallengesPanel = ({
  challenges,
  placeholderImage,
  headerType = 'h2'
}) => {
  const Header = headerType;
  const { isServer } = useSSR();
  const [suggestions, setSuggestions] = useState(() =>
    // Empty placeholders on server side render
    challenges.map(() => ({})).slice(0, 2)
  );
  useEffect(() => {
    // Shuffled challenges on client side hydration
    setSuggestions(shuffleCopy(challenges).slice(0, 2));
  }, [challenges]);
  return (
    <section className={css.root}>
      <div className={css.titleBox}>
        <Header>Try a challenge!</Header>
        <p>Suggested by the video you're watching</p>
      </div>
      <div className={css.challenges}>
        {suggestions.map((challenge, index) => (
          <Fragment key={challenge.videoNumber}>
            <Card
              className={css.challenge}
              challenge={challenge}
              placeholderImage={isServer ? null : placeholderImage}
              headerType={`h${parseFloat(headerType[1]) + 1}`}
            />
            {(suggestions.length === 1 || index !== suggestions.length - 1) && (
              <div className={css.spacer}></div>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default memo(ChallengesPanel);
