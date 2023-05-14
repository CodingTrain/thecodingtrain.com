import { graphql } from 'gatsby';
import React, { Fragment } from 'react';

import ItemsPage from '../components/ItemsPage';
import ItemsPageFilters from '../components/ItemsPageFilters';
import Spacer from '../components/Spacer';
import TrackCard from '../components/tracks/Card';

import AsteriskCharacter from '../images/characters/Asterik_5.mini.svg';
import SquareCharacter2 from '../images/characters/Square_3.mini.svg';
import SquareCharacter from '../images/characters/Square_4.mini.svg';

// import * as css from './tracks.module.css';

const TracksPage = ({ data, pageContext, location }) => {
  const { language, topic } = pageContext;
  const pageData = data.pageData.nodes[0];
  const tracks = data.tracks;

  const placeholderMainTrackImage =
    data.placeholderMainTrackImage.childImageSharp.gatsbyImageData;
  const placeholderSideTrackImage =
    data.placeholderSideTrackImage.childImageSharp.gatsbyImageData;

  const variant = 'red';
  const itemsPath = 'tracks';

  const unfilteredValues = ['all', ''];
  const cardFilters = {
    isFiltered:
      !unfilteredValues.includes(language) || !unfilteredValues.includes(topic),
    language,
    topic
  };

  return (
    <ItemsPage
      title={pageData.title}
      description={pageData.description}
      image={placeholderMainTrackImage}
      itemsPath={itemsPath}
      variant={variant}
      Character={SquareCharacter}
      SeparatorCharacter={SquareCharacter2}
      EndPageCharacter={AsteriskCharacter}
      characterOrientation="center"
      //
      showPagination={tracks.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}>
      <>
        <ItemsPageFilters
          filters={[
            {
              title: 'Filter by Language',
              placeholder: 'Pick a language to filter',
              icon: '⌥',
              jsonKey: 'languages',
              filterKey: 'lang',
              selectedOption: language
            },
            {
              title: 'Filter by Topic',
              placeholder: 'Pick a topic to filter',
              icon: '☆',
              jsonKey: 'topics',
              filterKey: 'topic',
              selectedOption: topic
            }
          ]}
          filtersFilePath="/filters-tracks.json"
          location={location}
          itemsPath={itemsPath}
          variant={variant}
        />
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
              variant={variant}
              filters={cardFilters}
            />
            <Spacer />
          </Fragment>
        ))}
      </>
    </ItemsPage>
  );
};

export const query = graphql`
  query ($skip: Int, $limit: Int, $topic: String!, $language: String!) {
    pageData: allTracksPageInfo {
      nodes {
        title
        description
      }
    }
    tracks: tracksPaginatedFilteredByTags(
      language: $language
      topic: $topic
      skip: $skip
      limit: $limit
    ) {
      title
      slug
      description
      numVideos
      type
      languages
      topics
      videos {
        slug
        languages
        topics
        title
      }
      chapters {
        title
        videos {
          slug
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
    placeholderMainTrackImage: file(
      sourceInstanceName: { eq: "main-tracks" }
      extension: { in: ["jpg", "png"] }
      name: { eq: "placeholder" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
    placeholderSideTrackImage: file(
      sourceInstanceName: { eq: "side-tracks" }
      extension: { in: ["jpg", "png"] }
      name: { eq: "placeholder" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`;

export default TracksPage;
