import React, { memo, useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Tabs from '../Tabs';
import Tags from './Tags';
import VideoCodeExamples from './VideoCodeExamples';
import YouTubeVideo from '../YouTubeVideo';

import * as css from './VideoSection.module.css';

const VideoSection = ({ track, video, trackPosition }) => {
  const { chapters } = track;
  const { topics, languages } = video;
  const timestamps = [
    { time: 10, label: 'Hey!' },
    { time: 20, label: 'Hey 2!' },
    { time: 30, label: 'Hey 3!' },
    { time: 40, label: 'Hey 4!' }
  ];

  const [showTimestamps, setShowTimestamps] = useState(false);
  const [timestamp, setTimestamp] = useState();

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
          <div className={css.video}>
            <YouTubeVideo
              containerClassName={css.videoWrapper}
              link={video.link}
              timestamp={timestamp}
            />
          </div>
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
            <VideoTimestampsTimeline
              className={cn({ [css.hide]: !showTimestamps })}
              timestamps={timestamps}
              updateTimestamp={setTimestamp}
            />
            <TrackOverViewTimeline
              className={cn({ [css.hide]: showTimestamps })}
              chapters={chapters}
              track={track}
              trackPosition={trackPosition}
            />
          </div>
        </div>
      </div>
      <div className={css.sep}></div>
      <div className={css.about}>
        <Tabs
          variant="red"
          labels={['OVERVIEW', 'CODE EXAMPLES', 'LINKS DISCUSSED']}>
          <div className={css.description}>
            <p>{video.description}</p>
          </div>
          <div>
            <VideoCodeExamples />
          </div>
          <div></div>
        </Tabs>
      </div>
    </div>
  );
};

const TrackOverViewTimeline = memo(
  ({ className, chapters, track, trackPosition }) => {
    const nextVideoPath = (() => {
      if (
        trackPosition.chapterIndex === chapters.length - 1 &&
        trackPosition.videoIndex ===
          chapters[chapters.length - 1].videos.length - 1
      )
        return null;
      if (
        trackPosition.videoIndex ===
        chapters[trackPosition.chapterIndex].videos.length - 1
      ) {
        const video = chapters[trackPosition.chapterIndex + 1].videos[0];
        return `/tracks/${track.slug}/${video.slug}`;
      }
      const video =
        chapters[trackPosition.chapterIndex].videos[
          trackPosition.videoIndex + 1
        ];
      return `/tracks/${track.slug}/${video.slug}`;
    })();
    const previousVideoPath = (() => {
      if (trackPosition.chapterIndex === 0 && trackPosition.videoIndex === 0)
        return null;
      if (trackPosition.videoIndex === 0) {
        const video =
          chapters[trackPosition.chapterIndex - 1].videos[
            chapters[trackPosition.chapterIndex - 1].videos.length - 1
          ];
        return `/tracks/${track.slug}/${video.slug}`;
      }
      const video =
        chapters[trackPosition.chapterIndex].videos[
          trackPosition.videoIndex - 1
        ];
      return `/tracks/${track.slug}/${video.slug}`;
    })();

    return (
      <div className={cn(css.trackTimelineContainer, className)}>
        <div className={css.trackTimeline}>
          {chapters.map((chapter, index) => (
            <ChapterSection
              key={chapter.title}
              chapter={chapter}
              chapterIndex={index}
              track={track}
              trackPosition={trackPosition}
              startsCollapsed={false}
            />
          ))}
        </div>
        <div className={css.trackNavigation}>
          {previousVideoPath !== null && (
            <Link
              className={cn(css.navButton, {
                [css.disabled]: previousVideoPath === null
              })}
              to={previousVideoPath}>
              Previous
            </Link>
          )}
          {nextVideoPath !== null && (
            <Link
              className={cn(css.navButton, {
                [css.disabled]: nextVideoPath === null
              })}
              to={nextVideoPath}>
              Next
            </Link>
          )}
        </div>
      </div>
    );
  }
);

const ChapterSection = memo(
  ({ startsCollapsed = true, chapter, chapterIndex, track, trackPosition }) => {
    const [collapsed, setCollapsed] = useState(startsCollapsed);
    return (
      <ul className={css.chapterList} key={chapter.title}>
        <button
          className={cn(
            css.chapterTitle,
            { [css.notCollapsed]: !collapsed },
            { [css.hasSeen]: chapterIndex <= trackPosition.chapterIndex }
          )}
          onClick={() => setCollapsed((c) => !c)}>
          <h5>{chapter.title}</h5>
        </button>
        {!collapsed &&
          chapter.videos.map((video, index) => (
            <li
              key={video.slug}
              className={cn(css.videoItem, {
                [css.seen]:
                  chapterIndex < trackPosition.chapterIndex ||
                  (chapterIndex === trackPosition.chapterIndex &&
                    index <= trackPosition.videoIndex),
                [css.last]:
                  (chapterIndex < trackPosition.chapterIndex &&
                    index === track.chapters[chapterIndex].videos.length - 1) ||
                  (chapterIndex === trackPosition.chapterIndex &&
                    index === trackPosition.videoIndex)
              })}>
              <Link to={`/tracks/${track.slug}/${video.slug}`}>
                {video.title}
              </Link>
            </li>
          ))}
      </ul>
    );
  }
);

const VideoTimestampsTimeline = memo(
  ({ className, timestamps, updateTimestamp }) => (
    <div className={cn(css.timestampsTimeline, className)}>
      {timestamps.map(({ time, label }, key) => (
        <button onClick={() => updateTimestamp({ time, label })} key={key}>
          {time} - {label}
        </button>
      ))}
    </div>
  )
);

export default memo(VideoSection);
