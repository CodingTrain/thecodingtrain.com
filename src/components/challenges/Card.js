import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from '../Image';

import * as css from './Card.module.css';

const getReadableDate = (dateString) => {
  const [year, month] = dateString.split('-');
  const months = {
    '01': 'jan',
    '02': 'feb',
    '03': 'mar',
    '04': 'apr',
    '05': 'may',
    '06': 'jun',
    '07': 'jul',
    '08': 'aug',
    '09': 'sep',
    10: 'oct',
    11: 'nov',
    12: 'dic'
  };
  return `${months[month]}, ${year}`;
};

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
        <div className={css.right}>
          <div className={css.description}>
            <p>{description}</p>
          </div>
          <p className={css.date}>
            <span>{date ? getReadableDate(date) : null}</span>
          </p>
        </div>
        <div className={css.left}>
          <Link to={`/challenge/${slug}`}>
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
            ) : (
              <div style={{ width: '100%', height: '100%' }} />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(Card);
