import React, { memo } from 'react';

import CollapsableDescription from '../CollapsableDescription';
import Tags from '../Tags';

import { useTopicsAndLanguages } from '../../hooks';

import * as css from './Header.module.css';

const Header = ({ track }) => {
  const { title, description, type, numVideos, videos, chapters } = track;
  const { topics, languages } = useTopicsAndLanguages({
    type,
    videos,
    chapters
  });

  return (
    <div className={css.root}>
      <div className={css.sep} />
      <h1 className={css.title}>{title}</h1>
      <div className={css.info}>
        <CollapsableDescription
          className={css.description}
          expandedClassName={css.showMore}
          variant="red"
          content={description}
        />
        <div className={css.tagsContainer}>
          <Tags heading="Languages" items={languages} singleLine={false} />
          <Tags heading="Topics" items={topics} singleLine={false} />
          <Tags
            heading={
              type === 'main'
                ? `${track.chapters.length} chapters`
                : 'Side track'
            }
            items={[`${numVideos} videos`]}
            singleLine={false}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
