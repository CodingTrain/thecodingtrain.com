import React, { Fragment, useEffect, useRef, useState } from 'react';
import { graphql, Link, navigate } from 'gatsby';

import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { Heading1 } from '../components/Heading';
import PagePanel from '../components/PagePanel';
import Filter from '../components/Filter';
import Spacer from '../components/Spacer';
import TrackCard from '../components/tracks/Card';
import Button from '../components/Button';

import { useSelectedTags } from '../hooks';

import * as css from './tracks.module.css';

import SemiColon from '../images/SemiColon_3.svg';
import SquareBrackets from '../images/SquareBrackets_4.svg';

const TracksPage = ({ data, pageContext, location }) => {
  const [selectedLanguage, selectedTopic] = useSelectedTags(location.pathname);

  const tracks = data.tracks.nodes;
  const languages = data.languages.nodes.map(({ value }) => value);
  const topics = data.topics.nodes.map(({ value }) => value);

  const placeholderMainTrackImage =
    data.placeholderMainTrackImage.nodes[0].childImageSharp.gatsbyImageData;
  const placeholderSideTrackImage =
    data.placeholderSideTrackImage.nodes[0].childImageSharp.gatsbyImageData;

  const [expanded, setExpanded] = useState(false);

  const filtersRef = useRef();
  const shouldScroll = location.pathname.split('/').length > 2;

  useEffect(() => {
    if (location?.state?.expanded !== undefined)
      setExpanded(location?.state?.expanded);
  }, [location?.state?.expanded]);

  useEffect(() => {
    if (shouldScroll) {
      filtersRef.current.scrollIntoView();
    }
  }, [shouldScroll]);

  const onExpand = () => {
    setExpanded(!expanded);
  };

  const resetFilters = () => {
    navigate(`/tracks/lang:all+topic:all/`, {
      state: { expanded }
    });
  };

  const setSelectedLanguage = (value) => {
    navigate(`/tracks/lang:${value ?? 'all'}+topic:${selectedTopic}/`, {
      state: { expanded }
    });
  };

  const setSelectedTopic = (value) => {
    navigate(`/tracks/lang:${selectedLanguage}+topic:${value ?? 'all'}/`, {
      state: { expanded }
    });
  };

  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[{ name: 'Tracks', link: '/tracks' }]}
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
      <div className={css.filters} ref={filtersRef}>
        <Filter
          title="Filter by Language"
          icon="⌥"
          items={languages}
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
          items={topics}
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
              track.cover?.file.childImageSharp.gatsbyImageData ??
              (track.type === 'main'
                ? placeholderMainTrackImage
                : placeholderSideTrackImage)
            }
            path={`/tracks/${track.slug}`}
            variant="red"
          />
          <Spacer />
        </Fragment>
      ))}
      {tracks.length > 0 ? (
        <div className={css.paginationNav}>
          <span>
            {pageContext.previousPagePath && (
              <Link to={pageContext.previousPagePath} state={{ expanded }}>
                {'<'} Previous
              </Link>
            )}
          </span>
          <span>
            {pageContext.humanPageNumber} of {pageContext.numberOfPages}
          </span>
          <span>
            {pageContext.nextPagePath && (
              <Link to={pageContext.nextPagePath} state={{ expanded }}>
                Next {'>'}{' '}
              </Link>
            )}
          </span>
        </div>
      ) : (
        <div className={css.noItemsMessage}>
          <p>No tracks found! </p>
          <Button variant="red" onClick={() => resetFilters()}>
            Reset filters
          </Button>
          <SemiColon className={css.semiColon} />
          <SquareBrackets className={css.squareBrackets} />
        </div>
      )}
    </Layout>
  );
};

export const query = graphql`
  query ($skip: Int!, $limit: Int!, $topic: String!, $language: String!) {
    tracks: allTrack(
      filter: {
        languagesFlat: { regex: $language }
        topicsFlat: { regex: $topic }
      }
      skip: $skip
      limit: $limit
    ) {
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
          videos {
            languages
            topics
            title
          }
        }
        cover {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
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
    languages: allTag(filter: { type: { eq: "language" } }) {
      nodes {
        value
      }
    }
    topics: allTag(filter: { type: { eq: "topic" } }) {
      nodes {
        value
      }
    }
  }
`;

export default TracksPage;
