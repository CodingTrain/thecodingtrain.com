import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Button from './Button';
import Image from './Image';
import Spacer from './Spacer';

import Play from '../images/play.svg';

import * as css from './VideoCard.module.css';

export const VideoCardList = memo(({ children, id, className }) => (
  <div id={id} className={cn(css.list, className)}>
    {children}
  </div>
));

const VideoCard = ({
  title,
  slug,
  meta,
  icon = '👁',
  description,
  image,
  variant
}) => {
  return (
    <div className={cn(css.root, css[variant])}>
      <div className={css.block}>
        <div className={css.top}>
          <div className={css.icon}>{icon}</div>
          <h5>
            <Link to={slug}>{title}</Link>
          </h5>
        </div>
        <div className={css.bottom}>
          <div className={css.left}>
            <p className={css.description}>{description}</p>

            <Link to={slug} className={css.meta}>
              <span>{meta}</span>
              <Play />
            </Link>
          </div>
          <div className={css.right}>
            <Image image={image} imgClassName={css.img} />
          </div>
        </div>
      </div>
      <div className={css.gap} />
    </div>
  );
};

export default memo(VideoCard);
