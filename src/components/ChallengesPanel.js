import React, { Fragment, memo } from 'react';
import { Link } from 'gatsby';

import Image from './Image';

import * as css from './ChallengesPanel.module.css';

import PlayButton from '../images/playbutton.svg';

const ChallengesPanel = ({ challenges, images }) => {
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
                <div className={css.left}>
                  {images && images[challenge.slug] ? (
                    <Image
                      image={images[challenge.slug]}
                      pictureClassName={css.picture}
                      imgClassName={css.image}
                    />
                  ) : images && images['_placeholder'] ? (
                    <Image
                      image={images['_placeholder']}
                      pictureClassName={css.picture}
                      imgClassName={css.image}
                    />
                  ) : null}
                </div>
                <div className={css.right}>
                  <div className={css.description}>
                    <p>{challenge.description}</p>
                  </div>
                  <p className={css.year}>
                    <span>
                      {challenge.date ? challenge.date.split('-').pop() : null}
                    </span>
                    <Link to={`/challenges/${challenge.slug}`}>
                      <PlayButton width={30} />
                    </Link>
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
