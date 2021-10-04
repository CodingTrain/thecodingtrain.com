import React, { Fragment, memo } from 'react';

import * as css from './ChallengesPanel.module.css';

import PlayButton from '../../images/playbutton.svg';

//dummy content
const challenges = [
  {
    title:
      "Estimating π from Random Numbers with Euclid's Algorithms and somethings",
    description: 'Happy Pi Day 2021! ',
    year: '2017'
  },
  {
    title: "Estimating π from Random Numbers with Euclid's Algo...",
    description:
      'Happy Pi Day 2021! This year I estimate the digits of π with random numbers and the probability of two integers being co-prime. Happy Pi Day 2021! This year I estimate the digits of π with random numbers and the probability of two integers being co-prime. I estimate',
    year: '2017'
  }
];

const ChallengesPanel = ({ video }) => {
  return (
    <div className={css.root}>
      <div className={css.titleBox}>
        <h4>Try a challenge!</h4>
        <p>Suggested by the video you're watching</p>
      </div>
      <div className={css.challenges}>
        {challenges.map((challenge, key) => (
          <Fragment key={key}>
            <div className={css.challenge}>
              <div className={css.titleContainer}>
                <div className={css.icon}>👁</div>
                <span className={css.title}>{challenge.title}</span>
                {/* <h5 className={css.title}>{challenge.title}</h5> */}
              </div>
              <div className={css.thumb}>
                <div className={css.left}></div>
                <div className={css.right}>
                  <div className={css.description}>
                    <p>{challenge.description}</p>
                  </div>
                  <p className={css.year}>
                    <span>{challenge.year}</span>
                    <PlayButton width={30} />
                  </p>
                </div>
              </div>
            </div>
            {key !== challenges.length - 1 && (
              <div className={css.spacer}></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(ChallengesPanel);
