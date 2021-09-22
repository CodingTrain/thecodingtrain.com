import React, { memo } from 'react';

import Tags from './Tags';

import * as css from './TrackHeader.module.css';

const TrackHeader = ({ track }) => {
  // TODO: Obtain languages and topics related to track
  const languages = ['JavaScript', 'Processing'];
  const topics = ['Machine Learning', 'Physics'];

  return (
    <div className={css.root}>
      <h1 className={css.title}>{track.title}</h1>
      <div className={css.info}>
        <div className={css.description}>
          <p>{track.description}</p>
        </div>
        <div className={css.tags}>
          <Tags heading="Languages" items={languages} singleLine={false} />
          <Tags heading="Topics" items={topics} singleLine={false} />
          <Tags
            heading={`${track.chapters.length} chapters`}
            items={[
              `${track.chapters.reduce(
                (curr, acc) => curr + acc.videos.length,
                0
              )}' '
            video lessons ()`
            ]}
            singleLine={false}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(TrackHeader);
