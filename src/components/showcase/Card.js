import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from '../Image';

import * as css from './Card.module.css';

const ExternalLink = ({ children, href, className = '' }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}>
      {children}
    </a>
  );
};

const Card = ({ className, contribution, placeholderImage }) => {
  const { title, url, cover, author, video } = contribution;

  const slug = video.canonicalTrack
    ? `/tracks/${video.canonicalTrack.slug}/${video.slug}`
    : `/challenges/${video.slug}`;

  return (
    <article className={cn(css.contribution, className)}>
      <div className={css.titleContainer}>
        <h3 className={css.title}>
          <ExternalLink href={url} className={css.titleLink}>
            {title}
          </ExternalLink>
        </h3>
      </div>
      <div className={css.thumb}>
        <ExternalLink href={url}>
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
              className={css.image}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </ExternalLink>
      </div>
      <div className={css.info}>
        <p>
          by{' '}
          {author.url ? (
            <ExternalLink href={author.url} className={css.authorLink}>
              {author.name}
            </ExternalLink>
          ) : (
            author.name
          )}{' '}
          From{' '}
          <Link to={slug} className={css.videoLink}>
            {video.title}
          </Link>{' '}
        </p>
      </div>
    </article>
  );
};

export default memo(Card);
