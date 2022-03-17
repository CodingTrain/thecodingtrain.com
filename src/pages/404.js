import * as React from 'react';

import Layout from '../components/Layout';
import CharacterSpacer from '../components/CharacterSpacer';
import { Heading1 } from '../components/Heading';
import ButtonPanel from '../components/ButtonPanel';
import Spacer from '../components/Spacer';

import SemiColonCharacter from '../images/characters/SemiColon_4.mini.svg';

import * as css from '../styles/pages/404.module.css';

// markup
const NotFoundPage = () => {
  return (
    <Layout title="Page not found!">
      <Spacer />
      <div className={css.header}>
        <Heading1 className={css.heading} variant="pink" as="h2">
          Page not found!
        </Heading1>
        <div className={css.character}>
          <SemiColonCharacter />
        </div>
      </div>
      {/* <CharacterSpacer
        className="charSpacer"
        variant="pink"
        size="x3"
        Character={SemiColonCharacter}
      /> */}
      <ButtonPanel
        text="Oops! Sorry we couldn’t find what you were looking for."
        buttonText="Go home"
        buttonLink="/"
        variant="pink"
      />
      <Spacer pattern />
    </Layout>
  );
};

export default NotFoundPage;
