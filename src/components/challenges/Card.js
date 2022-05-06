import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from '../Image';

import { getReadableDate } from '../../hooks';

import * as css from './Card.module.css';

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
          <div className={css.description}>
            <p>{description}</p>
          </div>
          <p className={css.date}>
            <span>{date ? getReadableDate(date) : null}</span>
          </p>
        </div>
        <div className={css.right}>
          <Link to={`/challenge/${slug}`}>
            {cover ? (
              <Image
                image={cover.file.childImageSharp.gatsbyImageData}
                pictureClassName={css.picture}
                imgClassName={css.image}
                alt={title}
              />
            ) : placeholderImage ? (
              <Image
                image={placeholderImage}
                pictureClassName={css.picture}
                imgClassName={css.image}
                alt={title}
              />
            ) : (
              <div
                aria-label={title}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </Link>
          <p className={css.date}>
            <span>{date ? getReadableDate(date) : null}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(Card);
