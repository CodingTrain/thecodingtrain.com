import React, { Fragment, useState } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import Spacer from '../components/Spacer';
import ButtonPanel from '../components/ButtonPanel';
import Heading from '../components/Heading';
import Breadcrumbs from '../components/Breadcrumbs';
import TopBar from '../components/TopBar';
import Filter from '../components/Filter';
import TrackCard from '../components/TrackCard';
import PageDescription from '../components/PageDescription';

import { useImages } from '../hooks';

import * as css from '../styles/pages/tracks.module.css';

const TracksPage = ({ data }) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedTopic, setSelectedTopic] = useState();

  const tracks = data.tracks.nodes;
  const images = useImages(data.images.nodes);

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
      <PageDescription text="Get started with any of our series below or choose the topic you are most in learning more about.">
        <ButtonPanel
          text="New to coding?"
          buttonText="Start here"
          buttonLink="#"
          variant="red"
        />
      </PageDescription>
      <div className={css.filters}>
        <Filter
          title="Filter by Language"
          icon="⌥"
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
          className={css.filter}
        />
        <Filter
          title="Filter by Topic"
          icon="☆"
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
          className={css.filter}
        />
      </div>
      <Spacer />
      {tracks.map((track) => {
        return (
          <Fragment key={track.slug}>
            <TrackCard
              {...track}
              numVideos={36}
              image={images[track.slug] || images.placeholder}
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
            <Spacer />
          </Fragment>
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

export default TracksPage;
