import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import Tags from '../Tags';
import ShareButton from '../ShareButton';
import YouTubeVideo from '../YouTubeVideo';
import TimestampTimeline from '../TimestampTimeline';
import PartsTimeline from './PartsTimeline';
import * as css from './VideoSection.module.css';

const VideoSection = ({ challenge }) => {
  const { topics, languages, videoNumber, title } = challenge;

  const youTubeVideoRef = useRef();
  const [showTimeline, setShowTimeline] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const hasMultiParts = challenge.parts?.length > 0;
  const [showTimestamps, setShowTimestamps] = useState(!hasMultiParts);

  const [activePart, setActivePart] = useState(
    challenge.parts?.[0] ?? challenge
  );
  const { videoId, timestamps } = activePart;
  const hasTimestamps = timestamps?.length > 0;
  const hasSidebar = hasMultiParts || hasTimestamps;

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
      <header className={css.header}>
        <div className={css.title}>
          <h1>
            {videoNumber ? `#${videoNumber} — ` : ''} {title}
          </h1>
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
            headerType="h3"
          />
          <Tags
            className={css.tags}
            heading="Topics"
            items={topics}
            linkTo={(value) => `/challenges/lang:all+topic:${value}`}
            headerType="h3"
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
      </header>

      <div className={css.videoPlayer}>
        {!hasSidebar && <div className={css.spacer} />}
        <div className={css.videoContainer}>
          <div className={css.video} ref={youTubeVideoRef}>
            <YouTubeVideo
              containerClassName={css.videoWrapper}
              videoId={videoId}
              timestamp={timestamp}
            />
          </div>
        </div>
        {!hasSidebar && <div className={css.spacer} />}
        {hasSidebar && (
          <div
            className={cn(css.timelineContainer, {
              [css.unCollapsed]: showTimeline
            })}>
            <nav className={css.timelinesContent}>
              <div className={css.tabs}>
                {hasMultiParts && (
                  <div
                    className={cn(css.tab, {
                      [css.selected]: !showTimestamps,
                      [css.clickable]: hasMultiParts && hasTimestamps
                    })}>
                    <button onClick={() => setShowTimestamps(false)}>
                      Parts
                    </button>
                  </div>
                )}
                {hasTimestamps && (
                  <div
                    className={cn(css.tab, {
                      [css.selected]: showTimestamps,
                      [css.clickable]: hasMultiParts && hasTimestamps
                    })}>
                    <button onClick={() => setShowTimestamps(true)}>
                      Timestamps
                    </button>
                  </div>
                )}
              </div>
              <div className={css.timeline}>
                {hasMultiParts && (
                  <PartsTimeline
                    className={cn(css.partTimeline, {
                      [css.hide]: showTimestamps
                    })}
                    parts={challenge.parts}
                    onPartChange={(part) => {
                      setActivePart(part);
                      setShowTimeline(false);
                    }}
                  />
                )}
                {hasTimestamps && (
                  <TimestampTimeline
                    className={cn(css.timestampsTimeline, {
                      [css.hide]: !showTimestamps
                    })}
                    variant="cyan"
                    timestamps={timestamps}
                    updateTimestamp={updateTimestamp}
                  />
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(VideoSection);
