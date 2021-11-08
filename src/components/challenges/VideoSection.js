import React, { memo, useCallback, useState, useEffect } from 'react';
import cn from 'classnames';

import Tags from '../Tags';
import ShareButton from '../ShareButton';
import YouTubeVideo from '../YouTubeVideo';
import TimestampTimeline from '../TimestampTimeline';
import * as css from './VideoSection.module.css';

const VideoSection = ({ challenge }) => {
  const { topics, languages } = challenge;

  const [showTimeline, setShowTimeline] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [timestamp, setTimestamp] = useState();

  const updateTimestamp = useCallback((value) => {
    setTimestamp(value);
    setShowTimeline(false);
  }, []);

  useEffect(() => {
    if (showTimeline) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTimeline]);

  return (
    <div className={css.root}>
      <h2 className={css.subheading}>{challenge.title}</h2>
      <div className={css.videoPlayer}>
        <div className={css.left}>
          <div className={css.details}>
            <Tags className={css.tags} heading="Languages" items={languages} />
            <Tags className={css.tags} heading="Topics" items={topics} />
            <ShareButton className={css.share} variant="cyan" />
          </div>
          <div className={css.video}>
            <YouTubeVideo
              containerClassName={css.videoWrapper}
              link={challenge.link}
              timestamp={timestamp}
            />
          </div>
        </div>
        <div className={cn(css.right, { [css.unCollapsed]: showTimeline })}>
          <div
            className={css.timelinesToggle}
            onClick={() => setShowTimeline((v) => !v)}
            onKeyPress={(e) => e.key === 'Enter' && setShowTimeline((v) => !v)}
            role="button"
            tabIndex="0"
            aria-label="Toggle timeline">
            <span className={css.back}>Back</span>
            <span className={css.arrow}> </span>
          </div>
          <div className={css.timelinesContent}>
            <div className={css.tabs}>
              <div className={cn(css.tab, { [css.selected]: showTimestamps })}>
                <button onClick={() => setShowTimestamps(true)}>
                  Video timestamps
                </button>
              </div>
            </div>
            <div className={css.timeline}>
              <TimestampTimeline
                className={cn(css.timestampsTimeline, {
                  [css.hide]: !showTimestamps
                })}
                variant="red"
                timestamps={challenge.timestamps}
                updateTimestamp={updateTimestamp}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(VideoSection);
