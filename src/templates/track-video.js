import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import TrackContributionsPanel from '../components/ContributionsPanel';
import TrackVideoSection from '../components/tracks/VideoSection';
import VideoInfo from '../components/tracks/VideoInfo';
import TrackHeader from '../components/tracks/Header';
import TrackChallengesPanel from '../components/ChallengesPanel';
import CharacterSpacer from '../components/CharacterSpacer';

import { useImages } from '../hooks';

import * as css from './track-video.module.css';
import { pattern } from '../styles/styles.module.css';

const Track = (props) => {
  const { pageContext, data } = props;
  const { track, video, contributionImages, videoImage } = data;
  const images = {
    ...useImages(contributionImages.nodes)
  };
  if (videoImage.nodes.length > 0)
    images._placeholder = videoImage.nodes[0].childImageSharp.gatsbyImageData;
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
            images={images}
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
      <TrackChallengesPanel video={video} />
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
    contributionImages: allFile(
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
    videoImage: allFile(
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
  }
`;

export default Track;
