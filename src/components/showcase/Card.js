import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from '../Image';

import { getReadableDate } from '../../hooks';

import * as css from './Card.module.css';

const Card = ({ className, contribution, placeholderImage }) => {
  const { title, url, cover, author, video } = contribution;
  return (
    <article className={cn(css.challenge, className)}>
      <div className={css.titleContainer}>
        <div className={css.icon}>👁</div>
        <h3 className={css.title}>
          {
            <Link to={url}>
              {title}
            </Link>
          }
        </h3>
      </div>
      <div className={css.thumb}>
        <div className={css.left}>
          <div className={css.description}>
            <p>{author.name}</p>
          </div>
          <p className={css.date}>
            <span>
              {video.date ? (
                <time dateTime={video.date}>{getReadableDate(video.date)}</time>
              ) : null}
            </span>
          </p>
        </div>
        <div className={css.right}>
          <Link to={url}>
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
            <span>
              {video.date ? (
                <time dateTime={video.date}>{getReadableDate(video.date)}</time>
              ) : null}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
};

export default memo(Card);
