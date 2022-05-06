import React, { memo } from 'react';

import CollapsableDescription from '../CollapsableDescription';
import Tags from '../Tags';

import * as css from './Header.module.css';

const Header = ({ track }) => {
  const { title, description, topics, languages, type, numVideos } = track;

  return (
    <div className={css.root}>
      <h1 className={css.title}>{title}</h1>
      <div className={css.info}>
        <CollapsableDescription
          className={css.description}
          expandedClassName={css.showMore}
          variant="red"
          content={description}
        />
        <div className={css.tagsContainer}>
          <Tags
            heading="Languages"
            items={languages}
            singleLine={false}
            linkTo={(value) => `/tracks/lang:${value}+topic:all`}
          />
          <Tags
            heading="Topics"
            items={topics}
            singleLine={false}
            linkTo={(value) => `/tracks/lang:all+topic:${value}`}
          />
          <Tags
            heading={track.type === 'main' ? 'Main track' : 'Side track'}
            items={[
              ...(track.chapters
                ? [
                    `${track.chapters.length} chapter${
                      track.chapters.length > 1 ? 's' : ''
                    }`
                  ]
                : []),
              `${numVideos} videos`
            ]}
            singleLine={false}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
