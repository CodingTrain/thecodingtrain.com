import * as React from 'react';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';
import ButtonPanel from '../components/ButtonPanel';
import Spacer from '../components/Spacer';

import SemiColonCharacter from '../images/characters/SemiColon_4.mini.svg';
import SceneCharacter1 from '../images/characters/Equals_4.mini.svg';
import SceneCharacter2 from '../images/characters/Square_6.mini.svg';
import SceneCharacter3 from '../images/characters/ThisDot_8.mini.svg';

import * as css from '../styles/pages/404.module.css';

const NotFoundPage = () => {
  return (
    <Layout title="Page not found!">
      <Spacer />
      <div className={css.header}>
        <Heading1 className={css.heading} variant="pink" as="h2">
          Page not found!
        </Heading1>
      </div>
      <ButtonPanel
        className={css.buttonPanel}
        text="Oops! Sorry we couldn’t find what you were looking for."
        buttonText="Go home"
        buttonLink="/"
        variant="pink"
        smallWrap
      />
      <div className={css.scene}>
        <SceneCharacter1 />
        <SceneCharacter2 />
        <SceneCharacter3 />
        <SemiColonCharacter />
      </div>
      <Spacer pattern />
    </Layout>
  );
};

export default NotFoundPage;
