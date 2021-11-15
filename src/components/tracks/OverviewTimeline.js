import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Link } from 'gatsby';

import * as css from './OverviewTimeline.module.css';

const usePaths = (chapters, track, trackPosition) => {
  console.log({ chapters, track, trackPosition });
  let nextVideoPath;
  let prevVideoPath = null;
  if (
    trackPosition.chapterIndex === chapters.length - 1 &&
    trackPosition.videoIndex ===
      chapters[chapters.length - 1].lessons.length - 1
  )
    nextVideoPath = null;
  else if (
    trackPosition.videoIndex ===
    chapters[trackPosition.chapterIndex].lessons.length - 1
  ) {
    const video = chapters[trackPosition.chapterIndex + 1].lessons[0];
    nextVideoPath = `/tracks/${track.slug}/${video.slug}`;
  } else {
    const video =
      chapters[trackPosition.chapterIndex].lessons[
        trackPosition.videoIndex + 1
      ];
    nextVideoPath = `/tracks/${track.slug}/${video.slug}`;
  }

  if (trackPosition.chapterIndex === 0 && trackPosition.videoIndex === 0)
    prevVideoPath = null;
  else if (trackPosition.videoIndex === 0) {
    const video =
      chapters[trackPosition.chapterIndex - 1].lessons[
        chapters[trackPosition.chapterIndex - 1].lessons.length - 1
      ];
    prevVideoPath = `/tracks/${track.slug}/${video.slug}`;
  } else {
    const video =
      chapters[trackPosition.chapterIndex].lessons[
        trackPosition.videoIndex - 1
      ];
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

    return (
      <div className={cn(css.root, className)}>
        <div className={css.overviewTimeline}>
          {chapters.map((chapter, index) => (
            <ChapterSection
              key={chapter.title}
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
      <ul className={css.chapterList} key={chapterIndex}>
        {chapter.title && (
          <button
            className={cn(
              css.chapterTitle,
              { [css.expanded]: !collapsed },
              { [css.hasSeen]: hasSeenChapter || isThisChapter }
            )}
            onClick={() => setCollapsed((c) => !c)}>
            <h5>{chapter.title}</h5>
          </button>
        )}
        {!collapsed &&
          chapter.lessons.map((video, index) => {
            const { videoIndex } = trackPosition;
            const hasSeenVideo =
              hasSeenChapter || (isThisChapter && index <= videoIndex);
            const isLastVideo =
              (hasSeenChapter &&
                index === chapters[chapterIndex].lessons.length - 1) ||
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
