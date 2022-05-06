import * as React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/Layout';
import ButtonPanel from '../components/ButtonPanel';

import * as css from '../styles/pages/index.module.css';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <div className={css.root}>
        <ButtonPanel
          text={'No Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'red'}
        />
        <ButtonPanel
          text={'Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'red'}
          rainbow
        />
        <ButtonPanel
          text={'No Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'orange'}
        />
        <ButtonPanel
          text={'Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'orange'}
          rainbow
        />
        <ButtonPanel
          text={'No Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'pink'}
        />
        <ButtonPanel
          text={'Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'pink'}
          rainbow
        />
        <ButtonPanel
          text={'No Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'purple'}
        />
        <ButtonPanel
          text={'Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'purple'}
          rainbow
        />
        <ButtonPanel
          text={'No Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'cyan'}
        />
        <ButtonPanel
          text={'Rainbow button'}
          buttonText={'Go to'}
          buttonLink={'#'}
          variant={'cyan'}
          rainbow
        />

        <p>
          <Link to="/routes">Go to routes page</Link>
        </p>
      </div>
    </Layout>
  );
};

export default IndexPage;
