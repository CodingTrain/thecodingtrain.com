import React, { Fragment, useState } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';

import Breadcrumbs from '../components/Breadcrumbs';
import Filter from '../components/Filter';
import { Heading1 } from '../components/Heading';
import PagePanel from '../components/PagePanel';
import Spacer from '../components/Spacer';
import TrackCard from '../components/TrackCard';

import { useImages } from '../hooks';

import * as css from '../styles/pages/tracks.module.css';

const TracksPage = ({ data }) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedTopic, setSelectedTopic] = useState();
  const [expanded, setExpanded] = useState(false);

  const tracks = data.tracks.nodes;
  const images = useImages(data.images.nodes);

  const onExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Videos Overview', link: '#' },
          { name: 'Tracks', link: '#' }
        ]}
        variant="red"
      />
      <Heading1 variant="red">Tracks</Heading1>
      <PagePanel
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
        text="New to coding?"
        buttonText="Start here"
        buttonLink="#"
        variant="purple"
        bbColor="red"
      />
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
          seeMore="See more languages >"
          seeLess="< See less languages"
          selected={selectedLanguage}
          onChange={setSelectedLanguage}
          expanded={expanded}
          onExpand={onExpand}
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
          seeMore="See more topics >"
          seeLess="< See less topics"
          selected={selectedTopic}
          onChange={setSelectedTopic}
          expanded={expanded}
          onExpand={onExpand}
          className={css.filter}
        />
      </div>
      <Spacer />
      {tracks.map((track) => {
        return (
          <Fragment key={track.slug}>
            <TrackCard
              {...track}
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
              variant="red"
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
        numVideos
        type
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
