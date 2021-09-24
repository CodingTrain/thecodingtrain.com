import React, { memo } from 'react';

import * as css from './TrackChallengesPanel.module.css';

import PlayButton from '../../images/playbutton.svg';

//dummy content
const challenges = [
  {
    title: "Estimating π from Random Numbers with Euclid's Algo...",
    description:
      'Happy Pi Day 2021! This year I estimate the digits of π with random numbers and the probability of two integers being co-prime. I estimate ...',
    year: '2017'
  },
  {
    title: "Estimating π from Random Numbers with Euclid's Algo...",
    description:
      'Happy Pi Day 2021! This year I estimate the digits of π with random numbers and the probability of two integers being co-prime. I estimate ...',
    year: '2017'
  }
];

const TrackChallengesPanel = ({ video }) => {
  return (
    <div className={css.root}>
      <div className={css.titleBox}>
        <h4>Try a challenge!</h4>
        <p>Suggested by the video you're watching</p>
      </div>
      <div className={css.challenges}>
        {challenges.map((challenge, key) => (
          <div className={css.challenge} key={key}>
            <span>{challenge.title}</span>
            <div className={css.thumb}>
              <div className={css.imagePlaceholder}></div>
              <div>
                <p className={css.description}>{challenge.description}</p>
                <p className={css.year}>
                  <span>{challenge.year}</span>
                  <PlayButton width={30} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TrackChallengesPanel);
