import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import CharacterSpacer from '../components/CharacterSpacer';
import Breadcrumbs from '../components/Breadcrumbs';
import ContributionsPanel from '../components/ContributionsPanel';
import ChallengeVideoSection from '../components/challenges/VideoSection';
import VideoInfo from '../components/VideoInfo';
import ChallengesPanel from '../components/ChallengesPanel';

import * as css from './challenge.module.css';
import { pattern } from '../styles/styles.module.css';

import DotCharacter from '../images/characters/ThisDot_2.mini.svg';
import PiCharacter from '../images/characters/PiGuy_2.mini.svg';
import Asterisk from '../images/characters/Asterik_2.mini.svg';

const Challenge = ({ data }) => {
  const { challenge, contributionPlaceholderImage, challengePlaceholderImage } =
    data;
  const challengesPlaceholder =
    challengePlaceholderImage.nodes.length > 0
      ? challengePlaceholderImage.nodes[0].childImageSharp.gatsbyImageData
      : null;
  const contributionsPlaceholder =
    contributionPlaceholderImage.nodes.length > 0
      ? contributionPlaceholderImage.nodes[0].childImageSharp.gatsbyImageData
      : challengesPlaceholder;
  return (
    <Layout title={challenge.title}>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Challenges', link: '/challenges' },
          { name: challenge.title, link: `/challenge/${challenge.slug}` }
        ]}
        variant="cyan"
      />
      <div className={css.simpleSep} />
      <ChallengeVideoSection challenge={challenge} />
      <div className={css.blankSep} />
      <VideoInfo
        video={challenge}
        variant="cyan"
        url={`/challenges/${challenge.slug}`}
      />
      <div className={css.blankSep} />
      <CharacterSpacer
        className={css.sep}
        variant="purple"
        size="x3"
        side="left"
        offset={0.7}
        characterSize={0.8}
        Character={DotCharacter}
      />
      <ContributionsPanel
        contributions={challenge.contributions}
        placeholderImage={contributionsPlaceholder}
      />
      {challenge.relatedJourneys.length > 0 && (
        <>
          <div className={css.blankSep} />
          <CharacterSpacer
            className={css.sep}
            variant="cyan"
            size="x3"
            side="right"
            offset={0.7}
            Character={PiCharacter}
          />
          <ChallengesPanel
            challenges={challenge.relatedJourneys}
            placeholderImage={challengesPlaceholder}
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
  query ($id: String, $slug: String) {
    challenge: journey(id: { eq: $id }) {
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
        sourceInstanceName: { eq: "journeys" }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: $slug }
        name: { eq: "index" }
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

export default Challenge;
