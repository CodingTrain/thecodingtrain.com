import React, { Fragment, memo } from 'react';

import ButtonPanel from './ButtonPanel';

import * as css from './ContributionsPanel.module.css';

import PlayButton from '../images/playbutton.svg';

//dummy content
const contributions = [
  {
    title: 'Grab any spring particle',
    author: 'Galiton'
  },
  {
    title: 'Grab any spring particle',
    author: 'Galiton'
  },
  {
    title: 'Grab any spring particle',
    author: 'Galiton'
  },
  {
    title: 'Grab any spring particle',
    author: 'Galiton'
  }
];

const ContributionsPanel = ({ video }) => {
  return (
    <div className={css.root}>
      <div className={css.titleBox}>
        <h4>Community contributions</h4>
        <p>What our community has done based on this video</p>
      </div>
      <div className={css.contributions}>
        {contributions.map((contrib, key) => (
          <Fragment key={key}>
            <div className={css.contrib}>
              <span className={css.title}>{contrib.title}</span>
              <div className={css.imagePlaceholder}></div>
              <p className={css.author}>
                <span className={css.authorName}>{contrib.author}</span>
                <PlayButton width={30} />
              </p>
            </div>
            {key !== contributions.length - 1 && (
              <div className={css.spacer}></div>
            )}
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
