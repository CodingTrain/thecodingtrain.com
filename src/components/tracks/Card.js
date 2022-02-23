import React, { memo } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from '../Image';
import ButtonPanel from '../ButtonPanel';
import Tags from '../Tags';

import { filterVideos } from '../../hooks';

import * as css from './Card.module.css';
import { pattern } from '../../styles/styles.module.css';
import Spacer from '../Spacer';

import PlayButton from '../../images/playbutton.svg';

const Card = ({
  title,
  slug,
  description,
  topics,
  languages,
  image,
  path,
  numVideos,
  type,
  videos,
  chapters,
  variant,
  className,
  filters
}) => {
  const trackType = type === 'main' ? 'Main Track' : 'Side Track';

  const filteredVideos = filterVideos(
    type === 'side'
      ? videos
      : chapters.map((c) => c.videos).reduce((a, c) => [...a, ...c], []),
    filters
  );

  return (
    <>
      <div className={cn(css.root, className, { [css[variant]]: variant })}>
        <div className={css.left}>
          <div className={css.text}>
            <h3 className={css.title}>{title}</h3>
            <Tags className={css.tags} heading="Topics" items={topics} />
            <Tags className={css.tags} heading="Languages" items={languages} />
            <p className={css.description}>{description}</p>
          </div>
          <div className={css.fadeText} />
          <ButtonPanel
            text="Ready to start?"
            buttonText="Go to track"
            buttonLink={path}
            variant={variant}
          />
        </div>
        <div className={css.right}>
          <div className={cn(pattern, css.details)}>
            <h3 className={css.smallTitle}>{title}</h3>
            <div className={css.icon}>👁</div>
            <div className={css.trackType}>{trackType}</div>
            <div className={css.numVideos}>{numVideos} videos</div>
          </div>
          <Image
            image={image}
            pictureClassName={css.picture}
            imgClassName={css.image}
          />
        </div>
      </div>
      {filters.isFiltered && (
        <>
          <Spacer />
          <div className={css.filterHeading}>
            {filteredVideos.length} videos within this track match the tag:
          </div>
          <div className={css.filteredResults}>
            {filteredVideos.map((v) => (
              <div className={css.filteredVideo}>
                <Link to={`/tracks/${slug}/${v.slug}`}>
                  <PlayButton className={css.playIcon} />
                </Link>
                <Link to={`/tracks/${slug}/${v.slug}`}>{v.title}</Link>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default memo(Card);
