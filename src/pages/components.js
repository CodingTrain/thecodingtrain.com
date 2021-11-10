import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';
import cn from 'classnames';

import Layout from '../components/Layout';

import Breadcrumbs from '../components/Breadcrumbs';
import ButtonPanel from '../components/ButtonPanel';
import ContributionsPanel from '../components/ContributionsPanel';
import Filter from '../components/Filter';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from '../components/Heading';
import Spacer from '../components/Spacer';
import Tabs from '../components/Tabs';
import TrackCard from '../components/tracks/Card';

import * as css from '../styles/pages/components.module.css';
import {
  cols,
  col,
  textLarge,
  textMedium,
  textNormal,
  textSmall,
  textXsmall,
  textTiny
} from '../styles/styles.module.css';

const ComponentsPage = ({ data }) => {
  const [filters1, setFilters1] = useState();
  const [filters2, setFilters2] = useState();

  return (
    <Layout>
      <Spacer>Heading</Spacer>
      <Heading1 variant="red">New to coding</Heading1>
      <Heading2 variant="purple">Challenges</Heading2>
      <Heading3 variant="orange">The Nature of Code 2.0</Heading3>
      <Heading4 variant="purple" fill>
        Check out my talks
      </Heading4>
      <Heading5 variant="cyan">Welcome to the coding rainbow</Heading5>
      <Heading6 variant="pink" fill>
        Choo choo
      </Heading6>

      <Spacer>Text</Spacer>
      <div className={cn(css.box, css.spacing)}>
        <p className={textMedium}>
          <strong>Text Medium</strong> Can the unpredictable evolutionary and
          emergent properties of nature be captured insoftware?
        </p>
        <p className={textNormal}>
          <strong>Text Normal</strong> Can understanding the mathematical
          principles behind the physical world world help to create digital
          worlds?{' '}
        </p>
        <p className={textSmall}>
          <strong>Text Small</strong> This learning playlist focuses on the
          programming strategies and techniques behind computer simulations of
          natural systems.
        </p>

        <p className={textXsmall}>
          <strong>Text X-Small</strong> This online course focuses on the
          fundamentals of computer programming (variables, conditionals,
          iteration, functions & objects) using JavaScript.
        </p>
        <p className={textTiny}>
          <strong>Text Tiny</strong> In particular it leverages the p5.js
          creative computing environment which is oriented towards visual
          displays on desktops, laptops, tablets or smartphones. The course is
          designed for computer programming novices.{' '}
        </p>
      </div>
      <Spacer>Breadcrumbs</Spacer>
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
      <Tabs labels={['First Component', 'Second Component', 'Third Component']}>
        <Heading2>Test</Heading2>
        <Heading2>Best</Heading2>
        <Heading2>Nest</Heading2>
      </Tabs>
      <Spacer>Filter</Spacer>
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
      <Spacer>Track Card (slim)</Spacer>
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
      <Spacer>Track Card (full)</Spacer>
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
      <Spacer>Button panel</Spacer>
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

      <Spacer>Pattern</Spacer>
      <Spacer pattern />
      <ContributionsPanel
        contributions={[
          {
            title: '#1.3 random vectors',
            author: {
              name: 'Sundar Singh',
              url: 'https://eesur.com'
            },
            url: 'https://observablehq.com/@eesur/a-random-vector'
          },
          {
            title: '#1.3 random vectors crazy good like',
            author: {
              name: 'Sundar Singh'
            },
            url: 'https://observablehq.com/@eesur/a-random-vector'
          },
          {
            title: '#1.3 random vectors crazy good like',
            author: {
              name: 'Sundar Singh',
              url: 'https://eesur.com'
            },
            url: 'https://observablehq.com/@eesur/a-random-vector'
          },
          {
            title: '#1.3 random vectors crazy good like',
            author: {
              name: 'Sundar Singh'
            },
            url: 'https://observablehq.com/@eesur/a-random-vector'
          },
          {
            title: '#1.3 random vectors crazy good like',
            author: {
              name: 'Sundar Singh',
              url: 'https://eesur.com'
            },
            url: 'https://observablehq.com/@eesur/a-random-vector'
          }
        ]}
      />
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
