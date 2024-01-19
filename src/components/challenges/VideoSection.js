import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import Tags from '../Tags';
import ShareButton from '../ShareButton';
import YouTubeVideo from '../YouTubeVideo';
import TimestampTimeline from '../TimestampTimeline';
import PartsTimeline from './PartsTimeline';
import NebulaVideoRow from '../NebulaVideoRow';

import { filteredPath } from '../../utils';
import { useChallengePartIndex } from '../../hooks';

import * as css from './VideoSection.module.css';

const VideoSection = ({ challenge }) => {
  const variant = 'cyan';
  const { topics, languages, videoNumber, title } = challenge;

  const youTubeVideoRef = useRef();
  const [showTimeline, setShowTimeline] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const hasMultiParts = challenge.parts?.length > 0;
  const [showTimestamps, setShowTimestamps] = useState(!hasMultiParts);

  const activePartIndex = useChallengePartIndex(challenge.parts?.length || 1);
  const activePart = challenge.parts?.[activePartIndex] ?? challenge;
  const { videoId, nebulaSlug, timestamps } = activePart;
  const hasTimestamps = timestamps?.length > 0;
  const hasTimeline = hasMultiParts || hasTimestamps;

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
            linkTo={(value) =>
              filteredPath('challenges', { lang: value, topic: 'all' })
            }
            headerType="h3"
          />
          <Tags
            className={css.tags}
            heading="Topics"
            items={topics}
            linkTo={(value) =>
              filteredPath('challenges', { lang: 'all', topic: value })
            }
            headerType="h3"
          />

          <ShareButton
            className={cn(css.share, {
              [css.onlyShare]: timestamps.length === 0
            })}
            variant={variant}
          />

          {timestamps.length > 0 && (
            <button
              className={css.timelinesToggle}
              onClick={() => setShowTimeline((v) => !v)}
              tabIndex="0"
              aria-label="Toggle timeline">
              <span className={css.back}>Back</span>
              <span className={css.arrow}> </span>
            </button>
          )}
        </div>
      </header>

      <div className={css.videoPlayer}>
        {!hasTimeline && <div className={css.spacer} />}
        <div className={css.videoContainer}>
          <div className={css.video} ref={youTubeVideoRef}>
            <YouTubeVideo
              className={css.videoWrapper}
              videoId={videoId}
              timestamp={timestamp}
            />
          </div>
        </div>
        {!hasTimeline && <div className={css.spacer} />}
        {hasTimeline && (
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
                    currentPartIndex={activePartIndex}
                  />
                )}
                {hasTimestamps && (
                  <TimestampTimeline
                    className={cn(css.timestampsTimeline, {
                      [css.hide]: !showTimestamps
                    })}
                    variant={variant}
                    timestamps={timestamps}
                    updateTimestamp={updateTimestamp}
                  />
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      <NebulaVideoRow nebulaSlug={nebulaSlug} variant={variant} />
    </div>
  );
};

export default memo(VideoSection);
