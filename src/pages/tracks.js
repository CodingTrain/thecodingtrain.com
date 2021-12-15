import React, { Fragment, useState } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';

import Breadcrumbs from '../components/Breadcrumbs';
import { Heading1 } from '../components/Heading';
import PagePanel from '../components/PagePanel';
import Filter from '../components/Filter';
import Spacer from '../components/Spacer';
import TrackCard from '../components/tracks/Card';

import { useImages } from '../hooks';

import * as css from '../styles/pages/tracks.module.css';

const TracksPage = ({ data }) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedTopic, setSelectedTopic] = useState();
  const [expanded, setExpanded] = useState(false);

  const tracks = data.tracks.nodes;
  const mainTrackImages = useImages(
    data.mainTrackImages.nodes,
    'relativeDirectory'
  );
  const sideTrackImages = useImages(
    data.sideTrackImages.nodes,
    'relativeDirectory'
  );
  const placeholderMainTrackImage =
    data.placeholderMainTrackImage.nodes[0].childImageSharp.gatsbyImageData;
  const placeholderSideTrackImage =
    data.placeholderSideTrackImage.nodes[0].childImageSharp.gatsbyImageData;

  const onExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[{ name: 'Tracks', link: '#' }]}
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
          variant="red"
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
          variant="red"
        />
      </div>
      <Spacer />
      {tracks.map((track) => (
        <Fragment key={track.slug}>
          <TrackCard
            {...track}
            image={
              track.type === 'main'
                ? mainTrackImages[track.slug] || placeholderMainTrackImage
                : sideTrackImages[track.slug] || placeholderSideTrackImage
            }
            path={`/tracks/${track.slug}`}
            variant="red"
          />
          <Spacer />
        </Fragment>
      ))}
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
        videos {
          languages
          topics
          title
        }
        chapters {
          title
          lessons {
            languages
            topics
            title
          }
        }
      }
    }
    mainTrackImages: allFile(
      filter: {
        name: { ne: "placeholder" }
        sourceInstanceName: { eq: "main-tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        relativeDirectory
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    placeholderMainTrackImage: allFile(
      filter: {
        name: { eq: "placeholder" }
        sourceInstanceName: { eq: "main-tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    sideTrackImages: allFile(
      filter: {
        name: { ne: "placeholder" }
        sourceInstanceName: { eq: "side-tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        relativeDirectory
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    placeholderSideTrackImage: allFile(
      filter: {
        name: { eq: "placeholder" }
        sourceInstanceName: { eq: "side-tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  }
`;

export default TracksPage;
