import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import TrackContributionsPanel from '../components/ContributionsPanel';
import TrackVideoSection from '../components/tracks/VideoSection';
import VideoInfo from '../components/VideoInfo';
import TrackHeader from '../components/tracks/Header';
import TrackChallengesPanel from '../components/ChallengesPanel';
import CharacterSpacer from '../components/CharacterSpacer';

import * as css from './track-video.module.css';
import { pattern } from '../styles/styles.module.css';

const Track = ({ pageContext, data }) => {
  const {
    track,
    video,
    contributionPlaceholderImage,
    videoPlaceHolderImage,
    challengePlaceholderImage
  } = data;
  const contributionsPlaceholder =
    contributionPlaceholderImage.nodes.length > 0
      ? contributionPlaceholderImage.nodes[0].childImageSharp.gatsbyImageData
      : videoPlaceHolderImage.nodes.length > 0
      ? videoPlaceHolderImage.nodes[0].childImageSharp.gatsbyImageData
      : null;
  const challengesPlaceholder =
    challengePlaceholderImage.nodes[0].childImageSharp.gatsbyImageData;

  const { trackPosition, isTrackPage } = pageContext;

  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Tracks', link: '/tracks' },
          { name: track.title, link: `/tracks/${track.slug}` }
        ]}
        variant="red"
      />
      {isTrackPage && <TrackHeader track={track} />}
      {isTrackPage && (
        <CharacterSpacer
          className={css.sep}
          variant="red"
          size="x2"
          side="right"
          offset={0.1}
        />
      )}
      <TrackVideoSection
        track={track}
        video={video}
        trackPosition={trackPosition}
      />
      <div className={css.blankSep} />
      <VideoInfo video={video} variant="red" />
      {video.canContribute && (
        <>
          <div className={css.blankSep} />
          <CharacterSpacer
            className={css.sep}
            variant="purple"
            size="x2"
            side="left"
            offset={0.5}
            characterSize={0.7}
          />
          <TrackContributionsPanel
            contributions={video.contributions}
            placeholderImage={contributionsPlaceholder}
          />
        </>
      )}
      {video.relatedJourneys.length > 0 && (
        <>
          <div className={css.blankSep} />
          <CharacterSpacer
            className={css.sep}
            variant="cyan"
            size="x3"
            side="right"
            offset={0.7}
          />
          <TrackChallengesPanel
            challenges={video.relatedJourneys}
            placeholderImage={challengesPlaceholder}
          />
        </>
      )}

      <div className={cn(pattern, css.pattern)} />
    </Layout>
  );
};

export const query = graphql`
  query (
    $trackId: String
    $videoId: String
    $videoSlug: String
    $source: String
  ) {
    track(id: { eq: $trackId }) {
      title
      slug
      description
      numVideos
      type
      videos {
        title
        slug
        languages
        topics
      }
      chapters {
        title
        videos {
          title
          slug
          languages
          topics
        }
      }
    }
    video: videoInterface(id: { eq: $videoId }) {
      title
      slug
      videoId
      description
      languages
      topics
      timestamps {
        title
        time
        seconds
      }
      codeExamples {
        title
        description
        image
        language
        codeUrl
        githubUrl
        editorUrl
      }
      groupLinks {
        title
        links {
          title
          url
          author
        }
      }
      canContribute
      contributions {
        title
        name
        url
        author {
          name
          url
        }
        cover {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
      relatedJourneys {
        title
        slug
        videoId
        description
        date
        cover {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
    contributionPlaceholderImage: allFile(
      filter: {
        sourceInstanceName: { eq: $source }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: $videoSlug }
        name: { eq: "index" }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    videoPlaceHolderImage: allFile(
      filter: {
        sourceInstanceName: { eq: $source }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: "" }
        name: { eq: "placeholder" }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    challengePlaceholderImage: allFile(
      filter: {
        sourceInstanceName: { eq: "journeys" }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: "" }
        name: { eq: "placeholder" }
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

export default Track;
