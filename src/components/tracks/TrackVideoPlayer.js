import React, { memo } from 'react';
import { Link } from 'gatsby';

import * as css from './TrackVideoPlayer.module.css';

const TrackVideoPlayer = ({ track, video }) => {
  const { chapters } = track;
  return (
    <div className={css.root}>
      {video.title}

      {chapters.map((chapter) => (
        <ul key={chapter.title}>
          {chapter.videos.map((video) => (
            <li key={video.slug}>
              <Link to={`/tracks/${track.slug}/${video.slug}`}>
                {video.title}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default memo(TrackVideoPlayer);
