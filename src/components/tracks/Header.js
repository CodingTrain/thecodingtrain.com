import React, { memo, useState } from 'react';
import cn from 'classnames';

import Tags from './Tags';

import * as css from './Header.module.css';

const Description = ({ content }) => {
  const [showMore, setShowMore] = useState(false);
  const text = showMore
    ? content
    : content.split(' ').splice(0, 45).join(' ') + ' ...';
  return (
    <div className={cn(css.description, { [css.showMore]: showMore })}>
      <p>
        {text}{' '}
        <button
          className={css.showButton}
          onClick={() => setShowMore((v) => !v)}>
          show {showMore ? 'less' : 'more'}
        </button>
      </p>
    </div>
  );
};

const Header = ({ track }) => {
  // TODO: Obtain languages and topics related to track
  const languages = ['JavaScript', 'Processing'];
  const topics = ['Machine Learning', 'Physics'];

  return (
    <div className={css.root}>
      <h1 className={css.title}>{track.title}</h1>
      <div className={css.info}>
        <Description content={track.description} />
        <div className={css.tagsContainer}>
          <Tags heading="Languages" items={languages} singleLine={false} />
          <Tags heading="Topics" items={topics} singleLine={false} />
          <Tags
            heading={`${track.chapters.length} chapters`}
            items={[
              `${track.chapters.reduce(
                (curr, acc) => curr + acc.videos.length,
                0
              )} 
            video lessons`,
              `()`
            ]}
            singleLine={false}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
