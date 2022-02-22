import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import Tags from '../Tags';
import ShareButton from '../ShareButton';
import YouTubeVideo from '../YouTubeVideo';
import TimestampTimeline from '../TimestampTimeline';
import * as css from './VideoSection.module.css';

const VideoSection = ({ challenge }) => {
  const { topics, languages, timestamps } = challenge;

  const youTubeVideoRef = useRef();
  const [showTimeline, setShowTimeline] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const updateTimestamp = useCallback((value) => {
    setTimestamp(value);
    setShowTimeline(false);
  }, []);

  useEffect(() => {
    if (showTimeline) {
      document.body.style.overflow = 'hidden';
      youTubeVideoRef.current.scrollIntoView();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTimeline]);

  return (
    <div className={css.root}>
      <div className={css.header}>
        <div className={css.title}>
          <h2>{challenge.title}</h2>
        </div>
        <div
          className={cn(css.details, {
            [css.unCollapsed]: showTimeline
          })}>
          <Tags
            className={css.tags}
            heading="Languages"
            items={languages}
            linkTo={(value) => `/challenges/lang:${value}+topic:all`}
          />
          <Tags
            className={css.tags}
            heading="Topics"
            items={topics}
            linkTo={(value) => `/challenges/lang:all+topic:${value}`}
          />

          <ShareButton
            className={cn(css.share, {
              [css.onlyShare]: timestamps.length === 0
            })}
            variant="cyan"
            text=""
          />
          {timestamps.length > 0 && (
            <div
              className={css.timelinesToggle}
              onClick={() => setShowTimeline((v) => !v)}
              onKeyPress={(e) =>
                e.key === 'Enter' && setShowTimeline((v) => !v)
              }
              role="button"
              tabIndex="0"
              aria-label="Toggle timeline">
              <span className={css.back}>Back</span>
              <span className={css.arrow}> </span>
            </div>
          )}
        </div>
      </div>
      <div className={css.videoPlayer}>
        {timestamps.length === 0 && <div className={css.spacer} />}
        <div className={css.videoContainer}>
          <div className={css.video} ref={youTubeVideoRef}>
            <YouTubeVideo
              containerClassName={css.videoWrapper}
              videoId={challenge.videoId}
              timestamp={timestamp}
            />
          </div>
        </div>
        {timestamps.length === 0 && <div className={css.spacer} />}
        {timestamps.length > 0 && (
          <div
            className={cn(css.timelineContainer, {
              [css.unCollapsed]: showTimeline
            })}>
            <div className={css.timelinesContent}>
              <div className={css.tabs}>
                <div className={css.tab}>Timestamps</div>
              </div>
              <div className={css.timeline}>
                <TimestampTimeline
                  variant="cyan"
                  timestamps={timestamps}
                  updateTimestamp={updateTimestamp}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(VideoSection);
