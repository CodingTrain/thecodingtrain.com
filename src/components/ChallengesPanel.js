import React, { Fragment, memo, useEffect, useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from './Image';

import * as css from './ChallengesPanel.module.css';
import { getReadableDate } from '../hooks';
import { shuffledCopy, useIsClient } from '../utils';

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
            ) : null}
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
  headerType = 'h2',
  shuffle = false
}) => {
  const Header = headerType;
  const { key } = useIsClient();
  const [suggestions, setSuggestions] = useState(
    // This initial value is used on server side rendering
    shuffledCopy(challenges, shuffle).slice(0, 2)
  );
  useEffect(() => {
    // This value is used on client side hydration, to shuffle the challenges
    setSuggestions(shuffledCopy(challenges, shuffle).slice(0, 2));
  }, [challenges, shuffle]);
  return (
    <section className={css.root}>
      <div className={css.titleBox}>
        <Header>Try a challenge!</Header>
        <p>Suggested by the video you're watching</p>
      </div>
      {/* This "key" attribute forces a fresh rerender on client side hydration,
          which prevents a weird mix of static and dynamic content */}
      <div className={css.challenges} key={key}>
        {suggestions.map((challenge, index) => (
          <Fragment key={challenge.videoId}>
            <Card
              className={css.challenge}
              challenge={challenge}
              placeholderImage={placeholderImage}
              headerType={`h${parseFloat(headerType[1]) + 1}`}
            />
            {index !== suggestions.length - 1 && (
              <div className={css.spacer}></div>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default memo(ChallengesPanel);
