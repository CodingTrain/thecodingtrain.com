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
    coverImage,
    videoPlaceHolderImage,
    challengePlaceholderImage
  } = data;

  const placeholderMainTrackImage =
    data.placeholderMainTrackImage.childImageSharp.gatsbyImageData;
  const placeholderSideTrackImage =
    data.placeholderSideTrackImage.childImageSharp.gatsbyImageData;
  const trackPlaceholder =
    track.type === 'main'
      ? placeholderMainTrackImage
      : placeholderSideTrackImage;

  // cover image for the video, falls back to final placeholder image
  const videoCover = coverImage
    ? coverImage.childImageSharp.gatsbyImageData
    : videoPlaceHolderImage
    ? videoPlaceHolderImage.childImageSharp.gatsbyImageData
    : null;

  // generic placeholder for challenge videos, collage of screenshots of challenge thumbnails
  const challengesPlaceholder =
    challengePlaceholderImage.childImageSharp.gatsbyImageData;

  // cover image for the track, falls back to track placeholder image
  const trackImage = track.cover
    ? track.cover.file.childImageSharp.gatsbyImageData
    : trackPlaceholder;

  // cover image for the video, falls back to track cover image
  const videoImage = coverImage
    ? coverImage.childImageSharp.gatsbyImageData
    : trackImage;

  const { trackPosition, isTrackPage } = pageContext;

  return (
    <Layout
      title={isTrackPage ? track.title : video.title}
      description={isTrackPage ? track.description : video.description}
      image={isTrackPage ? trackImage : videoImage}>
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
            placeholderImage={videoCover}
            headerType={isTrackPage ? 'h3' : 'h2'}
            submitButtonState={{
              track: video.canonicalTrack?.slug ?? 'challenges',
              video: video.slug
            }}
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
        parts {
          title
          videoId
          timestamps {
            time
            title
            seconds
          }
        }
      }
      chapters {
        title
        videos {
          title
          slug
          languages
          topics
          parts {
            title
            videoId
            timestamps {
              time
              title
              seconds
            }
          }
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
    video: videoInterface(id: { eq: $videoId }) {
      title
      slug
      canonicalTrack {
        slug
      }
      videoId
      nebulaSlug
      description
      languages
      topics
      timestamps {
        title
        time
        seconds
      }
      parts {
        title
        videoId
        nebulaSlug
        timestamps {
          time
          title
          seconds
        }
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
      credits {
        title
        name
        url
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
    coverImage: file(
      sourceInstanceName: { eq: $source }
      extension: { in: ["jpg", "png"] }
      relativeDirectory: { eq: $videoSlug }
      name: { eq: "index" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
    videoPlaceHolderImage: file(
      sourceInstanceName: { eq: $source }
      extension: { in: ["jpg", "png"] }
      relativeDirectory: { eq: "" }
      name: { eq: "placeholder" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
    challengePlaceholderImage: file(
      sourceInstanceName: { eq: "challenges" }
      extension: { in: ["jpg", "png"] }
      relativeDirectory: { eq: "" }
      name: { eq: "placeholder" }
    ) {
      childImageSharp {
        gatsbyImageData
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

export default Track;
