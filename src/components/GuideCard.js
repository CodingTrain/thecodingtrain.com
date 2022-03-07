import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import ButtonPanel from './ButtonPanel';
import Image from './Image';

import * as css from './GuideCard.module.css';

const GuideCard = ({
  title,
  slug,
  link,
  meta,
  icon = '📒',
  description,
  image,
  variant
}) => {
  return (
    <div className={cn(css.root, css[variant])}>
      <div className={css.block}>
        <div className={css.top}>
          <div className={css.icon}>{icon}</div>
          <h2>
            {link ? <a href={link}>{title}</a> : <Link to={slug}>{title}</Link>}
          </h2>
        </div>
        <div className={css.bottom}>
          <div className={css.left}>
            <p className={css.description}>{description}</p>
            <ButtonPanel
              className={css.meta}
              text={meta}
              buttonLink={link ?? slug}
              buttonText="Read"
              variant={variant}
            />
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

export default memo(GuideCard);
