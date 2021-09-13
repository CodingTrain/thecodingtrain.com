import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';
import cn from 'classnames';

import Layout from '../components/Layout';
import Spacer from '../components/Spacer';
import Heading from '../components/Heading';
import Breadcrumbs from '../components/Breadcrumbs';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import TrackCard from '../components/TrackCard';

import { useImages } from '../hooks';

import * as css from '../styles/pages/tracks.module.css';
import { cols, col, pattern } from '../styles/styles.module.css';

const ComponentsPage = ({ data }) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedTopic, setSelectedTopic] = useState();

  const tracks = data.tracks.nodes;
  const images = useImages(data.images.nodes);

  console.log(tracks);

  return (
    <Layout>
      <TopBar />
      <Breadcrumbs
        breadcrumbs={[
          { name: 'Videos Overview', link: '#' },
          { name: 'Tracks', link: '#' }
        ]}
        variant="red"
      />
      <Heading>Tracks</Heading>
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
          selected={selectedLanguage}
          onChange={setSelectedLanguage}
          className={col}
        />
        <Filter
          title="Filter by Topic"
          items={[
            'Machine learning',
            'Beginner-friendly',
            'Physics',
            'Text',
            'Data',
            'Interaction',
            'Computer Vision',
            'Simulation'
          ]}
          selected={selectedTopic}
          onChange={setSelectedTopic}
          className={col}
        />
      </div>
      <Spacer />
      {tracks.map((track) => {
        return (
          <TrackCard
            key={track.slug}
            {...track}
            numVideos={36}
            image={images[track.slug]}
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
        );
      })}
    </Layout>
  );
};

export const query = graphql`
  query {
    tracks: allTrack {
      nodes {
        title
        slug
        description
        chapters {
          title
          videos {
            title
          }
        }
      }
    }
    images: allFile(
      filter: {
        sourceInstanceName: { eq: "tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  }
`;

export default ComponentsPage;
