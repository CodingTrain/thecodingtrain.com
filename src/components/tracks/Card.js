import React, { Fragment, memo, useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Image from '../Image';
import ButtonPanel from '../ButtonPanel';
import Tags from '../Tags';

import { filterVideos } from '../../hooks';
import { filteredPath } from '../../utils';

import * as css from './Card.module.css';
import { pattern } from '../../styles/styles.module.css';

import PlayButton from '../../images/playbutton.svg';

const FilteredVideosSection = ({ videos: allVideos, trackSlug }) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = allVideos.length > 6;
  const videos = expanded || !canExpand ? allVideos : allVideos.slice(0, 6);

  return (
    <section>
      <div className={css.filterHeading}>
        {allVideos.length} video{allVideos.length > 1 ? 's' : ''} within this
        track match the filter.
      </div>
      <div className={css.filteredResults}>
        {videos.map((v, i) => (
          <Fragment key={i}>
            <div className={css.filteredVideo}>
              <Link to={`/tracks/${trackSlug}/${v.slug}`}>
                <PlayButton className={css.playIcon} />
              </Link>
              <Link to={`/tracks/${trackSlug}/${v.slug}`}>{v.title}</Link>
            </div>
            {i % 2 === 0 && <div className={css.spacer} />}
            {i % 2 === 0 && i === videos.length - 1 && (
              <div className={cn(css.spacer, css.growSpacer)} />
            )}
          </Fragment>
        ))}
      </div>
      {canExpand && (
        <button className={css.expand} onClick={() => setExpanded((e) => !e)}>
          {!expanded ? 'See all results >' : 'See fewer results <'}
        </button>
      )}
    </section>
  );
};

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
    chapters
      ? chapters.map((c) => c.videos).reduce((a, c) => [...a, ...c], [])
      : videos,
    filters
  );

  return (
    <>
      <article className={cn(css.root, className, { [css[variant]]: variant })}>
        <div className={css.left}>
          <div className={css.text}>
            <h3 className={css.title}>{title}</h3>
            <Tags
              className={css.tags}
              heading="Languages"
              items={languages}
              linkTo={(value) =>
                filteredPath('tracks', { lang: value, topic: 'all' })
              }
              headerType="h4"
            />
            <Tags
              className={css.tags}
              heading="Topics"
              items={topics}
              linkTo={(value) =>
                filteredPath('tracks', { lang: 'all', topic: value })
              }
              headerType="h4"
            />
            <p className={css.description}>{description}</p>
          </div>
          <div className={css.fadeText} />
          <ButtonPanel
            text="Ready to start?"
            buttonText="Go to track"
            buttonLink={path}
            variant={variant}
            rainbow
          />
        </div>
        <div className={css.right}>
          <div className={cn(pattern, css.details)}>
            <h3 className={css.smallTitle}>{title}</h3>
            <div className={css.icon}>👁</div>
            <div className={css.trackType}>{trackType}</div>
            <div className={css.numVideos}>
              {numVideos} video{numVideos > 1 ? 's' : ''}
            </div>
          </div>
          <Image
            image={image}
            pictureClassName={css.picture}
            imgClassName={css.image}
            alt={`"${title}" track`}
          />
        </div>
      </article>
      {filters.isFiltered && (
        <FilteredVideosSection trackSlug={slug} videos={filteredVideos} />
      )}
    </>
  );
};

export default memo(Card);
