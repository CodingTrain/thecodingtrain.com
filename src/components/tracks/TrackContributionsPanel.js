import React, { memo } from 'react';
import ButtonPanel from '../ButtonPanel';

import * as css from './TrackContributionsPanel.module.css';

import PlayButton from '../../images/playbutton.svg';

//dummy content
const contributions = [
  {
    title: "Grab any spring particle",
    author: "galiton"
  },
  {
    title: "Grab any spring particle",
    author: "galiton"
  },
  {
    title: "Grab any spring particle",
    author: "galiton"
  },
  {
    title: "Grab any spring particle",
    author: "galiton"
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
          <div className={css.contrib}>
            <span>{contrib.title}</span>
            <p>
            <span>{contrib.author}</span>
            <PlayButton />
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
