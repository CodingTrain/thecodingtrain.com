import React, { Fragment, memo } from 'react';

import ButtonPanel from './ButtonPanel';
import Image from './Image';

import * as css from './ContributionsPanel.module.css';

import PlayButton from '../images/playbutton.svg';

const ContributionsPanel = ({ contributions, images }) => {
  return (
    <div className={css.root}>
      <div className={css.titleBox}>
        <h4>Community contributions</h4>
        <p>
          {contributions.length > 0
            ? 'What our community has done based on this video'
            : 'No contributions done yet!'}
        </p>
      </div>
      <div className={css.contributions}>
        {contributions.map((contrib, key) => (
          <Fragment key={key}>
            <div className={css.contrib}>
              <span className={css.title}>
                {contrib.image}
                {contrib.title}
              </span>
              {images ? (
                <Image
                  image={images[contrib.image] ?? images['_placeholder']}
                  pictureClassName={css.picture}
                  imgClassName={css.image}
                />
              ) : (
                <div className={css.imagePlaceholder}></div>
              )}
              <p className={css.author}>
                {contrib.author.url ? (
                  <a
                    href={contrib.author.url}
                    target="_blank"
                    rel="noreferrer"
                    className={css.authorName}>
                    {contrib.author.name}
                  </a>
                ) : (
                  <span className={css.authorName}>{contrib.author.name}</span>
                )}
                <a
                  href={contrib.url}
                  target="_blank"
                  rel="noreferrer"
                  className={css.playButton}>
                  <PlayButton width={30} />
                </a>
              </p>
            </div>
            <div className={css.spacer}></div>
          </Fragment>
        ))}
      </div>
      <ButtonPanel
        text={'Have you completed a project? Share your work!'}
        buttonText={'Submit a contribution'}
        buttonLink={''}
        variant={'purple'}
        className={css.contribsPanel}
        smallWrap={true}
      />
    </div>
  );
};

export default memo(ContributionsPanel);
