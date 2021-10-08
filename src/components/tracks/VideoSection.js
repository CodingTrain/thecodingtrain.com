import React, { memo, useCallback, useState } from 'react';
import cn from 'classnames';

import Tabs from '../Tabs';
import Tags from '../Tags';
import CodeExampleList from '../CodeExampleList';
import YouTubeVideo from '../YouTubeVideo';
import CollapsableDescription from '../CollapsableDescription';
import TimestampTimeline from '../TimestampTimeline';
import OverviewTimeline from './OverviewTimeline';

import * as css from './VideoSection.module.css';

const codeExamples = [
  {
    icon: 'p5js',
    name: 'Walker',
    webEditorLink: 'https://editor.p5js.org/codingtrain/sketches/FiOG6uajS',
    viewCodeLink:
      'https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random',
    downloadCodeLink:
      'https://codingtrain.github.io/DownGit/#/home?url=https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random'
  },
  {
    icon: 'node',
    name: 'Gravitational Attraction Attraction Attraction Attraction',
    webEditorLink: 'https://editor.p5js.org/codingtrain/sketches/FiOG6uajS',
    viewCodeLink:
      'https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random',
    downloadCodeLink:
      'https://codingtrain.github.io/DownGit/#/home?url=https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random'
  },
  {
    icon: 'p5js',
    name: 'Rectangle Acceleration',
    webEditorLink: 'https://editor.p5js.org/codingtrain/sketches/FiOG6uajS',
    viewCodeLink:
      'https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random',
    downloadCodeLink:
      'https://codingtrain.github.io/DownGit/#/home?url=https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random'
  },
  {
    icon: 'node',
    name: 'Rectangle Grab Exercise',
    webEditorLink: 'https://editor.p5js.org/codingtrain/sketches/FiOG6uajS',
    viewCodeLink:
      'https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random',
    downloadCodeLink:
      'https://codingtrain.github.io/DownGit/#/home?url=https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random'
  },
  {
    icon: 'processing',
    name: 'Rectangle Grab Exercise',
    webEditorLink: 'https://editor.p5js.org/codingtrain/sketches/FiOG6uajS',
    viewCodeLink:
      'https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random',
    downloadCodeLink:
      'https://codingtrain.github.io/DownGit/#/home?url=https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random'
  },
  {
    icon: '',
    name: 'Rectangle Grab Exercise',
    webEditorLink: 'https://editor.p5js.org/codingtrain/sketches/FiOG6uajS',
    viewCodeLink:
      'https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random',
    downloadCodeLink:
      'https://codingtrain.github.io/DownGit/#/home?url=https://github.com/CodingTrain/website/tree/main/CodingChallenges/CC_161_pi_from_random/from-random'
  }
];

const timestamps = [
  { time: 10, label: 'Hey!' },
  { time: 20, label: 'Hey 2!' },
  {
    time: 30,
    label: "Code! gcd() function with Euclid's Algorithm. "
  },
  { time: 40, label: 'Hey 4!' }
];

const VideoSection = ({ track, video, trackPosition }) => {
  const { chapters } = track;
  const { topics, languages } = video;

  const [showTimeline, setShowTimeline] = useState(false);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [timestamp, setTimestamp] = useState();

  const updateTimestamp = useCallback((value) => {
    setTimestamp(value);
    setShowTimeline(false);
  }, []);

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
        <div className={cn(css.right, { [css.unCollapsed]: showTimeline })}>
          <div
            className={css.timelinesToggle}
            onClick={() => setShowTimeline((v) => !v)}
            onKeyPress={(e) => e.key === 'Enter' && setShowTimeline((v) => !v)}
            role="button"
            tabIndex="0"
            aria-label="Toggle timeline"
          />
          <div className={css.timelinesContent}>
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
              <TimestampTimeline
                className={cn(css.timestampsTimeline, {
                  [css.hide]: !showTimestamps
                })}
                variant="red"
                timestamps={timestamps}
                updateTimestamp={updateTimestamp}
              />
              <OverviewTimeline
                className={cn(css.overviewTimeline, {
                  [css.hide]: showTimestamps
                })}
                chapters={chapters}
                track={track}
                trackPosition={trackPosition}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={css.sep}></div>
      <div>
        <Tabs
          className={css.aboutTabs}
          variant="red"
          labels={['OVERVIEW', 'CODE EXAMPLES', 'LINKS DISCUSSED']}>
          <CollapsableDescription
            className={css.description}
            expandedClassName={css.descriptionExpanded}
            variant="red"
            content={video.description}
          />
          <div>
            <CodeExampleList examples={codeExamples} variant="red" />
          </div>
          <div></div>
        </Tabs>
      </div>
    </div>
  );
};

export default memo(VideoSection);
