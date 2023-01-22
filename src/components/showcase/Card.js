import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from '../Image';

import { getReadableDate } from '../../hooks';

import * as css from './Card.module.css';

const Card = ({ className, contribution, placeholderImage }) => {
  const { title, url, cover, author, video, parent } = contribution;
  var relativeDir = parent.parent.relativeDirectory;
  relativeDir = relativeDir.substring(0, relativeDir.lastIndexOf("/"));
  const trackSlugs = {
    "noc": "/tracks/the-nature-of-code-2/",
    "ml5": "/tracks/ml5js-beginners-guide/",
    "data": "/tracks/data-and-apis-in-javascript/",
    "git": "/tracks/git-github-for-poets/",
    "code": "/tracks/code-programming-with-p5-js/",
    "js": "/tracks/topics-in-native-javascript/",
    "more-p5": "/tracks/p5-tips-and-tricks/",
    "workflow": "/tracks/2018-workflow/"
    };
  const slug = ((relativeDir.split("/").length-1) !== 0 ? `${trackSlugs[relativeDir.split("/").slice(0,1)]}${relativeDir}` : `/challenges/${relativeDir}`);

  return (
    <article className={cn(css.challenge, className)}>
      <div className={css.titleContainer}>
        <div className={css.icon}>👁</div>
        <h3 className={css.title}>
            <a href={url} className={css.titleLink}>{title}</a> by {(author.url ? <a href={author.url} className={css.authorLink}>{author.name}</a> : author.name)}
        </h3>
      </div>
      <div className={css.thumb}>
        <div className={css.left}>
          <div className={css.description}>
            From <Link to={`${slug}`} className={css.videoLink}>{video.title}</Link>
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
