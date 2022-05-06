import React, { Fragment, memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from './Image';

import * as css from './ChallengesPanel.module.css';

const Card = ({ className, challenge, placeholderImage }) => {
  const { title, cover, description, date, slug } = challenge;
  return (
    <div className={cn(css.challenge, className)}>
      <div className={css.titleContainer}>
        <div className={css.icon}>👁</div>
        <span className={css.title}>
          {<Link to={`/challenge/${slug}`}>{title}</Link>}
        </span>
      </div>
      <div className={css.thumb}>
        <div className={css.left}>
          <Link to={`/challenge/${slug}`} aria-label={title}>
            {cover ? (
              <Image
                image={cover.file.childImageSharp.gatsbyImageData}
                pictureClassName={css.picture}
                imgClassName={css.image}
              />
            ) : placeholderImage ? (
              <Image
                image={placeholderImage}
                pictureClassName={css.picture}
                imgClassName={css.image}
              />
            ) : null}
          </Link>
          <p className={css.year}>
            <span>{date ? date.split('-')[0] : null}</span>
          </p>
        </div>
        <div className={css.right}>
          <div className={css.description}>
            <p>{description}</p>
          </div>
          <p className={css.year}>
            <span>{date ? date.split('-')[0] : null}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ChallengesPanel = ({ challenges, placeholderImage }) => {
  return (
    <div className={css.root}>
      <div className={css.titleBox}>
        <h4>Try a challenge!</h4>
        <p>Suggested by the video you're watching</p>
      </div>
      <div className={css.challenges}>
        {challenges.slice(0, 2).map((challenge, key) => (
          <Fragment key={key}>
            <Card
              className={css.challenge}
              challenge={challenge}
              placeholderImage={placeholderImage}
            />
            {key !== challenges.length - 1 && (
              <div className={css.spacer}></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(ChallengesPanel);
