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

import { useImages } from '../hooks';

import * as css from './track-video.module.css';
import { pattern } from '../styles/styles.module.css';

const Track = ({ pageContext, data }) => {
  const { track, video, challenges } = data;
  const { trackPosition, isTrackPage } = pageContext;
  const contributionsImages = {
    ...useImages(data.contributionsImages.nodes)
  };
  if (data.contributionPlaceholderImage.nodes.length > 0) {
    contributionsImages._placeholder =
      data.contributionPlaceholderImage.nodes[0].childImageSharp.gatsbyImageData;
  }
  const challengesImages = {
    ...useImages(data.challengesImages.nodes, 'relativeDirectory')
  };
  if (data.challengePlaceholderImage.nodes.length > 0) {
    challengesImages._placeholder =
      data.challengePlaceholderImage.nodes[0].childImageSharp.gatsbyImageData;
  }
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
            images={contributionsImages}
          />
        </>
      )}
      <div className={css.blankSep} />
      <CharacterSpacer
        className={css.sep}
        variant="cyan"
        size="x3"
        side="right"
        offset={0.7}
      />
      <TrackChallengesPanel
        challenges={challenges.nodes}
        images={challengesImages}
      />
      <div className={cn(pattern, css.pattern)} />
    </Layout>
  );
};

export const query = graphql`
  query (
    $trackId: String
    $videoId: String
    $videoSlug: String
    $contributionsPath: String
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
      }
      chapters {
        title
        lessons {
          title
          slug
        }
      }
    }
    video(id: { eq: $videoId }) {
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
        language
        codeURL
        githubURL
        editorURL
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
      }
    }
    challenges: allChallenge(sort: { order: DESC, fields: slug }, limit: 2) {
      nodes {
        title
        slug
        videoId
        contributionsPath
        description
        date
      }
    }
    challengesImages: allFile(
      filter: {
        extension: { in: ["jpg", "png"] }
        sourceInstanceName: { eq: "challenges" }
        relativeDirectory: { regex: "/^(?!.*(/contributions)).*$/", ne: "" }
      }
      sort: { order: DESC, fields: relativeDirectory }
      limit: 2
    ) {
      nodes {
        relativeDirectory
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    contributionsImages: allFile(
      filter: {
        sourceInstanceName: { in: ["challenges", "lessons", "guest-tutorials"] }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: $contributionsPath }
      }
    ) {
      nodes {
        name
        relativeDirectory
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    contributionPlaceholderImage: allFile(
      filter: {
        sourceInstanceName: { in: ["challenges", "lessons", "guest-tutorials"] }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: $videoSlug }
      }
    ) {
      nodes {
        base
        relativeDirectory
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    challengePlaceholderImage: allFile(
      filter: {
        sourceInstanceName: { eq: "challenges" }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: "" }
      }
    ) {
      nodes {
        base
        relativeDirectory
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  }
`;

export default Track;
