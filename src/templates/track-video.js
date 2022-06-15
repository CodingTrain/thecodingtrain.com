import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import CharacterSpacer from '../components/CharacterSpacer';
import Breadcrumbs from '../components/Breadcrumbs';
import PassengerShowcasePanel from '../components/PassengerShowcasePanel';
import TrackVideoSection from '../components/tracks/VideoSection';
import VideoInfo from '../components/VideoInfo';
import TrackHeader from '../components/tracks/Header';
import TrackChallengesPanel from '../components/ChallengesPanel';

import * as css from './track-video.module.css';
import { pattern } from '../styles/styles.module.css';

import SquareCharacter from '../images/characters/Square_1.mini.svg';
import DotCharacter from '../images/characters/ThisDot_2.mini.svg';
import PiCharacter from '../images/characters/PiGuy_2.mini.svg';
import Asterisk from '../images/characters/Asterik_2.mini.svg';

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
    <Layout
      title={isTrackPage ? track.title : video.title}
      description={isTrackPage ? track.description : video.description}>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Tracks', link: '/tracks' },
          { name: track.title, link: `/tracks/${track.slug}` }
        ]}
        variant="red"
      />

      <div className={css.simpleSep} />

      {isTrackPage && <TrackHeader track={track} />}

      {isTrackPage && (
        <CharacterSpacer
          className={css.sep}
          variant="red"
          size="x2"
          side="right"
          offset={0.1}
          Character={SquareCharacter}
        />
      )}
      <main>
        <TrackVideoSection
          track={track}
          video={video}
          trackPosition={trackPosition}
          mainTitle={!isTrackPage}
        />

        <div className={css.blankSep} />

        <VideoInfo
          video={video}
          variant="red"
          url={`/tracks/${track.slug}/${video.slug}`}
        />
      </main>

      {video.canContribute && (
        <>
          <div className={css.blankSep} />
          <CharacterSpacer
            className={css.sep}
            variant="purple"
            size="x3"
            side="right"
            offset={0.7}
            characterSize={0.8}
            Character={DotCharacter}
          />

          <PassengerShowcasePanel
            contributions={video.showcase}
            placeholderImage={contributionsPlaceholder}
            headerType={isTrackPage ? 'h3' : 'h2'}
          />
        </>
      )}

      {video.relatedChallenges.length > 0 && (
        <>
          <div className={css.blankSep} />
          <CharacterSpacer
            className={css.sep}
            variant="cyan"
            size="x3"
            side="right"
            offset={0.4}
            Character={PiCharacter}
          />

          <TrackChallengesPanel
            challenges={video.relatedChallenges}
            placeholderImage={challengesPlaceholder}
            headerType={isTrackPage ? 'h3' : 'h2'}
          />
        </>
      )}

      <div className={cn(pattern, css.pattern)} />
      <CharacterSpacer
        className={css.sep}
        size="x4"
        side="right"
        offset={0.42}
        characterSize={0.9}
        Character={Asterisk}
      />
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
      languages
      topics
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
        image {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        urls {
          p5
          processing
          node
          other
        }
      }
      groupLinks {
        title
        links {
          icon
          title
          url
          description
        }
      }
      canContribute
      showcase {
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
      relatedChallenges {
        title
        slug
        videoId
        description
        date
        videoNumber
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
        sourceInstanceName: { eq: "challenges" }
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
