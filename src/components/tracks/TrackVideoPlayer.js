import React, { memo, useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Tags from './Tags';

import * as css from './TrackVideoPlayer.module.css';

const TrackVideoPlayer = ({ track, video }) => {
  const { chapters } = track;
  const [showTimestamps, setShowTimestamps] = useState(false);
  const { topics, languages } = video;
  console.log({ chapters, video });
  return (
    <div className={css.root}>
      <div className={css.subheading}>
        <h2>{video.title}</h2>
      </div>
      <div className={css.videoPlayer}>
        <div className={css.left}>
          <div className={css.details}>
            <Tags className={css.tags} heading="Languages" items={languages} />
            <Tags className={css.tags} heading="Topics" items={topics} />
          </div>
          <div className={css.video}></div>
        </div>
        <div className={css.right}>
          <div className={css.tabs}>
            <div className={cn(css.tab, { [css.selected]: !showTimestamps })}>
              <button onClick={() => setShowTimestamps(false)}>
                Track overview
              </button>
            </div>
            <div className={cn(css.tab, { [css.selected]: showTimestamps })}>
              <button onClick={() => setShowTimestamps(true)}>
                Video timestamps
              </button>
            </div>
          </div>
          <div className={css.timeline}>
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
        </div>
      </div>
      <div className={css.sep}></div>
      <div className={css.about}></div>
    </div>
  );
};

export default memo(TrackVideoPlayer);
