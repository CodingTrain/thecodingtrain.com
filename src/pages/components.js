import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';
import Layout from '../components/Layout';
import Spacer from '../components/Spacer';
import Heading from '../components/Heading';
import Breadcrumbs from '../components/Breadcrumbs';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import ButtonPanel from '../components/ButtonPanel';
import Footer from '../components/Footer';
import TrackCard from '../components/TrackCard';
import cn from 'classnames';

import * as css from '../styles/pages/components.module.css';
import { cols, col, pattern } from '../styles/styles.module.css';

const ComponentsPage = ({ data }) => {
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
        variant="red"
      />
      <Breadcrumbs
        breadcrumbs={[
          { name: 'Videos Overview', link: '' },
          { name: 'Tracks', link: '' },
          { name: 'The Nature of Code', link: '' }
        ]}
        variant="purple"
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
      <Spacer label="Track Card (slim)" />
      <TrackCard
        variant="slim"
        title="Code! Programming with p5.js"
        description="This online course focuses on the fundamentals of computer programming (variables, conditionals, iteration, functions & objects) using JavaScript. In particular it leverages the p5.js creative computing environment which is oriented towards visual displays on desktops, laptops, tablets or smartphones. The course is designed for computer programming novices. This online course focuses on the fundamentals of computer programming (variables, conditionals, iteration, functions & objects) using JavaScript. In particular it leverages the p5.js creative computing environment which is oriented towards visual displays on desktops, laptops, tablets or smartphones. The course is designed for computer programming novices."
        numVideos={36}
        image={getImage(data.placeholder)}
        path="/tracks/code-programming-with-p5-js"
        topics={[
          'Beginner-Friendly',
          'Machine Learning',
          'Algorithms',
          'Fun Times',
          'Funky Times by the Computer'
        ]}
        languages={['p5.js', 'JavaScript']}
      />
      <Spacer label="Track Card (full)" />
      <TrackCard
        title="Code! Programming with p5.js"
        description="This online course focuses on the fundamentals of computer programming (variables, conditionals, iteration, functions & objects) using JavaScript. In particular it leverages the p5.js creative computing environment which is oriented towards visual displays on desktops, laptops, tablets or smartphones. The course is designed for computer programming novices. This online course focuses on the fundamentals of computer programming (variables, conditionals, iteration, functions & objects) using JavaScript. In particular it leverages the p5.js creative computing environment which is oriented towards visual displays on desktops, laptops, tablets or smartphones. The course is designed for computer programming novices."
        numVideos={36}
        image={getImage(data.placeholder)}
        path="/tracks/code-programming-with-p5-js"
        topics={[
          'Beginner-Friendly',
          'Machine Learning',
          'Algorithms',
          'Fun Times',
          'Funky Times by the Computer'
        ]}
        languages={['p5.js', 'JavaScript']}
      />
      <Spacer label="Button panel" />
      <div className={cols}>
        <ButtonPanel
          text={
            "We've created We've created We've created We've created We've created"
          }
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
      <Footer />
      <Spacer label="Pattern" />
      <div className={cn(pattern, css.pattern)} />
    </Layout>
  );
};

export const query = graphql`
  query {
    placeholder: file(
      sourceInstanceName: { eq: "images" }
      name: { eq: "track-placeholder" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`;

export default ComponentsPage;
