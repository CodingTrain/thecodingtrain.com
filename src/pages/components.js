import React, { useState } from 'react';
import Layout from '../components/Layout';
import Spacer from '../components/Spacer';
import Heading from '../components/Heading';
import Breadcrumbs from '../components/Breadcrumbs';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import ButtonPanel from '../components/ButtonPanel';
import TrackCard from '../components/TrackCard';
import cn from 'classnames';

import * as css from '../styles/pages/components.module.css';
import { cols, col, pattern } from '../styles/styles.module.css';

const ComponentsPage = () => {
  const [filters1, setFilters1] = useState();
  const [filters2, setFilters2] = useState();

  return (
    <Layout>
      <TopBar />
      <Spacer label="Heading" />
      <Heading>New to coding</Heading>
      <Heading>Challenges</Heading>
      <Heading>The Nature of Code 2.0</Heading>
      <Spacer label="Breadcrumbs" />
      <Breadcrumbs
        breadcrumbs={[
          { name: 'Videos Overview', link: '' },
          { name: 'Tracks', link: '' },
          { name: 'The Nature of Code', link: '' }
        ]}
        variant={'red'}
      />
      <Breadcrumbs
        breadcrumbs={[
          { name: 'Videos Overview', link: '' },
          { name: 'Tracks', link: '' },
          { name: 'The Nature of Code', link: '' }
        ]}
        variant={'purple'}
      />
      <Spacer label="Filter" />
      <div className={cols}>
        <Filter
          title="Filter by Language"
          items={[
            'P5.js',
            'Processing',
            'JavaScript',
            'Java',
            'React',
            'Mechanic',
            'Lisp'
          ]}
          selected={filters1}
          onChange={setFilters1}
          className={col}
        />
        <Filter
          title="Filter by Language"
          items={[
            'P5.js',
            'Processing',
            'JavaScript',
            'Java',
            'React',
            'Mechanic',
            'Lisp'
          ]}
          selected={filters2}
          onChange={setFilters2}
          className={col}
        />
      </div>
      <Spacer label="Track Card" />
      <TrackCard numVideos={36} />
      <Spacer label="Button panel" />
      <div className={cols}>
        <ButtonPanel
          text={"We've created"}
          buttonText={'Go to our guide'}
          buttonLink={''}
          variant={'red'}
          className={cn(col, css.box)}
        />
        <ButtonPanel
          text={'Sounds interesting'}
          buttonText={'Go to track'}
          buttonLink={''}
          variant={'orange'}
          className={cn(col, css.box)}
        />
      </div>
      <ButtonPanel
        text={'Sounds interesting'}
        buttonText={'Go to track'}
        buttonLink={''}
        variant={'purple'}
      />
      <Spacer label="Pattern" />
      <div className={cn(pattern, css.pattern)} />
    </Layout>
  );
};

export default ComponentsPage;
