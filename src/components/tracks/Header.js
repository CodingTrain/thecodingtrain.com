import React, { memo } from 'react';

import CollapsableDescription from '../CollapsableDescription';
import Tags from '../Tags';

import * as css from './Header.module.css';

const Header = ({ track }) => {
  // TODO: Obtain languages and topics related to track
  const languages = ['JavaScript', 'Processing'];
  const topics = ['Machine Learning', 'Physics'];

  const { title, description, type, numVideos } = track;

  return (
    <div className={css.root}>
      <div className={css.sep} />
      <h1 className={css.title}>{title}</h1>
      <div className={css.info}>
        <CollapsableDescription
          className={css.description}
          expandedClassName={css.showMore}
          variant={'red'}
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
            items={[`${numVideos} video lessons`]}
            singleLine={false}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
