import React, { memo, useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Tabs from '../Tabs';
import Tags from './Tags';

import * as css from './TrackVideoPlayer.module.css';

const TrackVideoPlayer = ({ track, video, trackPosition }) => {
  const { chapters } = track;
  const [showTimestamps, setShowTimestamps] = useState(false);
  const { topics, languages } = video;
  console.log({ chapters, video, trackPosition });
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
            {showTimestamps ? (
              <VideoTimestampsTimeline />
            ) : (
              <TrackOverViewTimeline
                chapters={chapters}
                track={track}
                trackPosition={trackPosition}
              />
            )}
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
          <div></div>
          <div></div>
        </Tabs>
      </div>
    </div>
  );
};

const TrackOverViewTimeline = ({ chapters, track, trackPosition }) => {
  return (
    <>
      {chapters.map((chapter, index) => (
        <ChapterSection
          key={chapter.title}
          chapter={chapter}
          chapterIndex={index}
          track={track}
          trackPosition={trackPosition}
        />
      ))}
    </>
  );
};

const ChapterSection = ({
  startsCollapsed = false,
  chapter,
  chapterIndex,
  track,
  trackPosition
}) => {
  const [collapsed, setCollapsed] = useState(startsCollapsed);
  return (
    <ul className={css.chapterList} key={chapter.title}>
      <h5
        className={cn(css.chapterTitle, { [css.notCollapsed]: !collapsed })}
        onClick={() => setCollapsed((c) => !c)}>
        {chapter.title}
      </h5>
      {!collapsed &&
        chapter.videos.map((video, index) => (
          <li
            key={video.slug}
            className={cn(css.videoItem, {
              [css.previous]:
                chapterIndex < trackPosition.chapterIndex ||
                (chapterIndex === trackPosition.chapterIndex &&
                  index <= trackPosition.videoIndex)
            })}>
            <Link to={`/tracks/${track.slug}/${video.slug}`}>
              {video.title}
            </Link>
          </li>
        ))}
    </ul>
  );
};

const VideoTimestampsTimeline = () => null;

export default memo(TrackVideoPlayer);
