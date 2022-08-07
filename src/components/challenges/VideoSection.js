import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import Tags from '../Tags';
import ShareButton from '../ShareButton';
import YouTubeVideo from '../YouTubeVideo';
import TimestampTimeline from '../TimestampTimeline';
import Button from '../Button';
import * as css from './VideoSection.module.css';

const VideoSection = ({ challenge }) => {
  const { topics, languages, videoNumber, title } = challenge;

  const youTubeVideoRef = useRef();
  const [showTimeline, setShowTimeline] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const [activePart, setActivePart] = useState(getPartAtIndex(challenge, 0));
  const { videoId, timestamps, partIndex } = activePart;
  const partsCount = 1 + challenge.nextParts.length;

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
        {timestamps.length === 0 && <div className={css.spacer} />}
        <div className={css.videoContainer}>
          <div className={css.video} ref={youTubeVideoRef}>
            <YouTubeVideo
              containerClassName={css.videoWrapper}
              videoId={videoId}
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
            <nav className={css.timelinesContent}>
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
            </nav>
          </div>
        )}
      </div>

      {partsCount > 1 && (
        <div className={css.partsNav}>
          <div className={css.partsNavButtonGroup}>
            {Array.from({ length: partsCount }).map((_, i) => (
              <Button
                className={cn(css.partsNavButton, {
                  [css.active]: partIndex === i
                })}
                variant="cyan"
                onClick={() => setActivePart(getPartAtIndex(challenge, i))}>
                Part {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Get the `videoId` and `timestamps` for a challenge at a given part index. If
 * the challenge isn't multi-part, this function can still be called at index 0
 * to get the `videoId` and `timestamps` of the single video.
 *
 * @param {Challenge} challenge Challenge we want to take the part from
 * @param {number} partIndex Index of the part
 * @returns {{
 *   partIndex: number,
 *   videoId: string,
 *   timestamps: { time: string, title: string, seconds: number }[]
 * }}
 * Information about the challenge part
 */
const getPartAtIndex = (challenge, partIndex) => {
  if (partIndex === 0) {
    return {
      partIndex,
      videoId: challenge.videoId,
      timestamps: challenge.timestamps
    };
  } else if (partIndex >= 1 && partIndex < challenge.nextParts.length + 1) {
    return {
      partIndex,
      ...challenge.nextParts[partIndex - 1]
    };
  } else {
    throw new Error(`Challenge part index out of bounds: ${partIndex}`);
  }
};

export default memo(VideoSection);
