import React, { memo } from 'react';
import cn from 'classnames';

import { Heading1 } from '../components/Heading';
import Spacer from './Spacer';

import Train from '../images/characters/homepage.mini.svg';
import TrainTrack from '../images/tracks.mini.svg';
import Sun from '../images/sun.mini.svg';
import Cloud from '../images/cloud.mini.svg';

import SemiColonCharacter from '../images/characters/SemiColon_hello.mini.svg';

import * as css from './HomepageScene.module.css';

const HomepageScene = ({ title, description }) => {
  return (
    <>
      <header className={css.header}>
        <Cloud className={cn(css.cloud, css.cloud1)} />
        <Cloud className={cn(css.cloud, css.cloud2)} />
        <Cloud className={cn(css.cloud, css.cloud3)} />
        <Cloud className={cn(css.cloud, css.cloud4)} />
        <Cloud className={cn(css.cloud, css.cloud5)} />
        <Cloud className={cn(css.cloud, css.cloud6)} />

        <Sun className={css.sun} style={{ zIndex: 1 }} />

        <Heading1 className={css.heading} variant="pink">
          {title}
        </Heading1>

        <Train className={css.train} />
        <TrainTrack className={css.trainTrack} />
        <p className={css.paragraph}>{description}</p>
      </header>
      <Spacer className={css.spacer} />

      <div className={css.extraHeader}>
        <div className={css.character}>
          <SemiColonCharacter />
        </div>

        <p className={css.paragraph}>{description}</p>
      </div>
    </>
  );
};

export default memo(HomepageScene);
