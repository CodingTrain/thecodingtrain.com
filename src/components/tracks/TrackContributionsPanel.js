import React, { memo } from 'react';

import ButtonPanel from '../ButtonPanel';

import * as css from './TrackContributionsPanel.module.css';

import PlayButton from '../../images/playbutton.svg';

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

const TrackContributionsPanel = ({ video }) => {
  return (
    <div className={css.root}>
      <div className={css.titleBox}>
        <h4>Comunity contributions</h4>
        <p>What our community has done based on this video</p>
      </div>
      <div className={css.contributions}>
        {contributions.map((contrib, key) => (
          <div className={css.contrib} key={key}>
            <span className={css.title}>{contrib.title}</span>
            <div className={css.imagePlaceholder}></div>
            <p>
              <span className={css.author}>{contrib.author}</span>
              <PlayButton width={30} />
            </p>
          </div>
        ))}
      </div>
      <ButtonPanel
        text={'Have you completed a project? Share your work!'}
        buttonText={'Submit a contribution'}
        buttonLink={''}
        variant={'purple'}
        className={css.contribsPanel}
      />
    </div>
  );
};

export default memo(TrackContributionsPanel);
