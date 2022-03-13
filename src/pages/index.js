import * as React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/Layout';
import { Heading1, Heading2 } from '../components/Heading';
import Spacer from '../components/Spacer';

import TriangleCharacter from '../images/characters/Triangle_6.mini.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_2.mini.svg';
import SquareCharacter from '../images/characters/Square_4.mini.svg';
import SemiColonCharacter from '../images/characters/SemiColon_1.mini.svg';

import * as css from '../styles/pages/index.module.css';

const IndexPage = () => {
  return (
    <Layout>
      <div className={css.root}>
        <p className={css.routesLink}>
          <Link to="/routes">Go to routes page</Link>
        </p>
        <Spacer background="white" />
        <div className={css.header}>
          <Heading1 className={css.heading} variant="pink">
            All aboard!
          </Heading1>
        </div>
        <Spacer pattern size="x2" />
        <div className={css.subheader}>
          <Heading2 className={css.subheading} variant="orange" as="h1">
            New to coding?
          </Heading2>
          <div className={css.character}>
            <TriangleCharacter />
          </div>
        </div>
        <Spacer pattern size="x2" />
        <div className={css.subheader}>
          <Heading2 className={css.subheading} variant="red" as="h1">
            Tracks
          </Heading2>
          <div className={css.character}>
            <SquareCharacter />
          </div>
        </div>
        <Spacer pattern size="x2" />
        <div className={css.subheader}>
          <Heading2 className={css.subheading} variant="cyan" as="h1">
            Challenges
          </Heading2>
          <div className={css.character}>
            <BracketsCharacter />
          </div>
        </div>
        <Spacer pattern size="x2" />
        <Heading2 className={css.subheading} variant="purple" as="h3">
          Passenger showcase highlight
        </Heading2>
        <Spacer pattern size="x2" />
        <div className={css.subheader}>
          <Heading2 className={css.subheading} variant="pink" as="h1">
            Events
          </Heading2>
          <div className={css.character}>
            <SemiColonCharacter />
          </div>
        </div>
        <Spacer pattern size="x2" />
        <Heading2 className={css.subheading} variant="orange" as="h1">
          Shop
        </Heading2>

        <Spacer pattern size="x2" />
        <Heading2 className={css.subheading} variant="pink" as="h3">
          Become a member
        </Heading2>
        <Spacer pattern size="x2" />
      </div>
    </Layout>
  );
};

export default IndexPage;
