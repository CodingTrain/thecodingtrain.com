import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Link } from 'gatsby';

import { usePersistScrollPosition } from '../../hooks';

import * as css from './OverviewTimeline.module.css';

const usePaths = (chapters, track, trackPosition) => {
  let nextVideoPath;
  let prevVideoPath = null;
  if (
    trackPosition.chapterIndex === chapters.length - 1 &&
    trackPosition.videoIndex === chapters[chapters.length - 1].videos.length - 1
  )
    nextVideoPath = null;
  else if (
    trackPosition.videoIndex ===
    chapters[trackPosition.chapterIndex].videos.length - 1
  ) {
    const video = chapters[trackPosition.chapterIndex + 1].videos[0];
    nextVideoPath = `/tracks/${track.slug}/${video.slug}`;
  } else {
    const video =
      chapters[trackPosition.chapterIndex].videos[trackPosition.videoIndex + 1];
    nextVideoPath = `/tracks/${track.slug}/${video.slug}`;
  }

  if (trackPosition.chapterIndex === 0 && trackPosition.videoIndex === 0)
    prevVideoPath = null;
  else if (trackPosition.videoIndex === 0) {
    const video =
      chapters[trackPosition.chapterIndex - 1].videos[
        chapters[trackPosition.chapterIndex - 1].videos.length - 1
      ];
    prevVideoPath = `/tracks/${track.slug}/${video.slug}`;
  } else {
    const video =
      chapters[trackPosition.chapterIndex].videos[trackPosition.videoIndex - 1];
    prevVideoPath = `/tracks/${track.slug}/${video.slug}`;
  }
  return [prevVideoPath, nextVideoPath];
};

const OverviewTimeline = memo(
  ({ className, chapters, track, trackPosition }) => {
    const [previousVideoPath, nextVideoPath] = usePaths(
      chapters,
      track,
      trackPosition
    );

    const timelineRef = usePersistScrollPosition(track.slug, 'tracks');
    return (
      <div className={cn(css.root, className)}>
        <div className={css.overviewTimeline} ref={timelineRef}>
          {chapters.map((chapter, index) => (
            <ChapterSection
              key={index}
              chapter={chapter}
              chapterIndex={index}
              chapters={chapters}
              track={track}
              trackPosition={trackPosition}
            />
          ))}
        </div>
        <div className={css.navigation}>
          {previousVideoPath !== null && (
            <Link className={css.navButton} to={previousVideoPath}>
              Previous
            </Link>
          )}
          {nextVideoPath !== null && (
            <Link className={css.navButton} to={nextVideoPath}>
              Next
            </Link>
          )}
        </div>
      </div>
    );
  }
);

const ChapterSection = memo(
  ({ chapter, chapterIndex, chapters, track, trackPosition }) => {
    const hasSeenChapter = chapterIndex < trackPosition.chapterIndex;
    const isThisChapter = chapterIndex === trackPosition.chapterIndex;
    const trackPath = `/tracks/${track.slug}`;
    const [collapsed, setCollapsed] = useState(false);
    return (
      <ul className={css.chapterList}>
        {chapter.title && (
          <li>
            <button
              className={cn(
                css.chapterTitle,
                { [css.expanded]: !collapsed },
                { [css.hasSeen]: hasSeenChapter || isThisChapter }
              )}
              onClick={() => setCollapsed((c) => !c)}>
              {chapter.title}
            </button>
          </li>
        )}
        {!collapsed &&
          chapter.videos.map((video, index) => {
            const { videoIndex } = trackPosition;
            const hasSeenVideo =
              hasSeenChapter || (isThisChapter && index <= videoIndex);
            const isLastVideo =
              (hasSeenChapter &&
                index === chapters[chapterIndex].videos.length - 1) ||
              (isThisChapter && index === videoIndex);
            return (
              <li
                key={video.slug}
                className={cn(css.videoItem, {
                  [css.seen]: hasSeenVideo,
                  [css.last]: isLastVideo
                })}>
                <Link to={`${trackPath}/${video.slug}`}>{video.title}</Link>
              </li>
            );
          })}
      </ul>
    );
  }
);

export default memo(OverviewTimeline);
