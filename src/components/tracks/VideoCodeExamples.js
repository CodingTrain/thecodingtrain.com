import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './VideoCodeExamples.module.css';

import NodeIcon from '../../images/node-icon.svg';
import P5Icon from '../../images/p5js-icon.svg';
import ProcessingLogo from '../../images/processing-icon.svg';

const icons = {
  p5js: P5Icon,
  node: NodeIcon,
  processing: ProcessingLogo
};

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

const VideoCodeExamples = memo(({ className }) => {
  return (
    <ul className={cn(css.root, className)}>
      {codeExamples.map((example, key) => {
        const Icon =
          example.icon in icons ? icons[example.icon] : () => <svg></svg>;
        return (
          <li className={css.example} key={key}>
            <span className={css.icon}>
              <Icon />
            </span>
            <span className={css.name}>{example.name}</span>
            <a className={css.webEditor} href={example.webEditorLink}>
              Web Editor
            </a>
            <a className={css.viewCode} href={example.viewCodeLink}>
              View Code
            </a>
            <a className={css.downloadCode} href={example.downloadCodeLink}>
              Download Code
            </a>
          </li>
        );
      })}
    </ul>
  );
});

export default VideoCodeExamples;
