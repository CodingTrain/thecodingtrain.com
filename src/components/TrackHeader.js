import React, { memo } from 'react';

import * as css from './TrackHeader.module.css';

const TrackHeader = ({ track }) => {
  // TODO: Obtain languages and topics related to track
  const languages = ['JavaScript', 'Processing'];
  const topics = ['Machine Learning', 'Physics'];

  return (
    <div className={css.root}>
      <h1 className={css.title}>{track.title}</h1>
      <div className={css.tags}>
        {languages.length > 0 && (
          <>
            <span className={css.label}>Languages</span>
            {languages.map((language, index) => (
              <span key={`language-${index}`}>{language}</span>
            ))}
          </>
        )}
        {topics.length > 0 && (
          <>
            <span className={css.label}>Topics</span>
            {topics.map((topic, index) => (
              <span key={`topic-${index}`}>{topic}</span>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default memo(TrackHeader);
