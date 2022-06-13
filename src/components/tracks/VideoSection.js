import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import Tags from '../Tags';
import ShareButton from '../ShareButton';
import YouTubeVideo from '../YouTubeVideo';
import TimestampTimeline from '../TimestampTimeline';
import OverviewTimeline from './OverviewTimeline';
import * as css from './VideoSection.module.css';

const getOverallPositionInTrack = (trackPosition, chapters) => {
  let videoIndex = 0;
  let trackTotal = 0;
  for (let chapter = 0; chapter < chapters.length; chapter++) {
    trackTotal += chapters[chapter].videos.length;
    if (trackPosition.chapterIndex > chapter) {
      videoIndex += chapters[chapter].videos.length;
    } else if (trackPosition.chapterIndex === chapter) {
      videoIndex += trackPosition.videoIndex;
    }
  }
  return [videoIndex + 1, trackTotal];
};

const VideoSection = ({ track, video, trackPosition, mainTitle }) => {
  const chapters = track.chapters ? track.chapters : [{ videos: track.videos }];
  const { title, videoId, topics, languages, timestamps } = video;
  const [videoIndex, trackTotal] = getOverallPositionInTrack(
    trackPosition,
    chapters,
    track
  );

  const [showTimeline, setShowTimeline] = useState(false);
  const youTubeVideoRef = useRef();
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const Header = mainTitle ? 'h1' : 'h2';

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
          <Header>{title}</Header>
        </div>
        <div
          className={cn(css.details, {
            [css.unCollapsed]: showTimeline
          })}>
          <Tags
            className={css.tags}
            heading="Languages"
            items={languages}
            linkTo={(value) => `/tracks/lang:${value}+topic:all`}
            headerType="h3"
          />
          <Tags
            className={css.tags}
            heading="Topics"
            items={topics}
            linkTo={(value) => `/tracks/lang:all+topic:${value}`}
            headerType="h3"
          />

          <ShareButton className={css.share} variant="red" text="" />
          <div
            className={css.timelinesToggle}
            onClick={() => setShowTimeline((v) => !v)}
            onKeyPress={(e) => e.key === 'Enter' && setShowTimeline((v) => !v)}
            role="button"
            tabIndex="0"
            aria-label="Toggle timeline">
            <span className={css.back}>Back</span>
            <span className={css.arrow}> </span>
            <span className={css.progress}>
              {videoIndex} / {trackTotal}{' '}
            </span>
          </div>
        </div>
      </header>
      <div className={css.videoPlayer}>
        <div className={css.videoContainer}>
          <div className={css.video} ref={youTubeVideoRef}>
            <YouTubeVideo
              containerClassName={css.videoWrapper}
              videoId={videoId}
              timestamp={timestamp}
            />
          </div>
        </div>
        <div
          className={cn(css.timelineContainer, {
            [css.unCollapsed]: showTimeline
          })}>
          <nav className={css.timelinesContent}>
            <div className={css.tabs}>
              <div
                className={cn(css.tab, {
                  [css.selected]: !showTimestamps,
                  [css.clickable]: timestamps.length > 0
                })}>
                <button
                  onClick={() =>
                    timestamps.length > 0 && setShowTimestamps(false)
                  }>
                  track stops
                </button>
              </div>
              {timestamps.length > 0 && (
                <div
                  className={cn(css.tab, {
                    [css.selected]: showTimestamps,
                    [css.clickable]: timestamps.length > 0
                  })}>
                  <button
                    onClick={() =>
                      timestamps.length > 0 && setShowTimestamps(true)
                    }>
                    timestamps
                  </button>
                </div>
              )}
            </div>
            <div className={css.timeline}>
              {timestamps.length > 0 && (
                <TimestampTimeline
                  className={cn(css.timestampsTimeline, {
                    [css.hide]: !showTimestamps
                  })}
                  variant="red"
                  timestamps={timestamps}
                  updateTimestamp={updateTimestamp}
                />
              )}

              <OverviewTimeline
                className={cn(css.overviewTimeline, {
                  [css.hide]: showTimestamps
                })}
                chapters={chapters}
                track={track}
                trackPosition={trackPosition}
              />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default memo(VideoSection);
