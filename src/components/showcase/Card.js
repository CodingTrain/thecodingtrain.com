import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from '../Image';

import { getReadableDate } from '../../hooks';

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
  const { title, url, submittedOn, cover, author, video } = contribution;

  const slug = video.track
    ? `/tracks/${video.track.slug}/${video.slug}`
    : `/challenges/${video.slug}`;

  return (
    <article className={cn(css.challenge, className)}>
      <div className={css.titleContainer}>
        <div className={css.icon}>👁</div>
        <h3 className={css.title}>
          <ExternalLink href={url} className={css.titleLink}>
            {title}
          </ExternalLink>
        </h3>
      </div>
      <div className={css.thumb}>
        <div className={css.left}>
          <div className={css.description}>
            Submitted to{' '}
            <Link to={slug} className={css.videoLink}>
              {video.title}
            </Link>{' '}
            by{' '}
            {author.url ? (
              <ExternalLink href={author.url} className={css.authorLink}>
                {author.name}
              </ExternalLink>
            ) : (
              author.name
            )}
          </div>
          <p className={css.date}>
            <span>
              {submittedOn ? (
                <time dateTime={submittedOn}>
                  {getReadableDate(submittedOn)}
                </time>
              ) : null}
            </span>
          </p>
        </div>
        <div className={css.right}>
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
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </ExternalLink>
          <p className={css.date}>
            <span>
              {submittedOn ? (
                <time dateTime={submittedOn}>
                  {getReadableDate(submittedOn)}
                </time>
              ) : null}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
};

export default memo(Card);
