import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import ContributionsPanel from '../components/ContributionsPanel';
import ChallengeVideoSection from '../components/challenges/VideoSection';
import VideoInfo from '../components/tracks/VideoInfo';
import ChallengesPanel from '../components/ChallengesPanel';
import CharacterSpacer from '../components/CharacterSpacer';

import { useImages } from '../hooks';

import * as css from './challenge.module.css';
import { pattern } from '../styles/styles.module.css';

const Challenge = (props) => {
  const challenge = props.data.challenge;
  const images = {
    ...useImages(props.data.contributionImages.nodes, 'base'),
    _placeholder:
      props.data.challengeImage.nodes[0].childImageSharp.gatsbyImageData
  };
  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Challenges', link: '/challenges' },
          { name: challenge.title, link: `/challenges/${challenge.slug}` }
        ]}
        variant="cyan"
      />
      <ChallengeVideoSection challenge={challenge} />
      <div className={css.blankSep} />
      <VideoInfo video={challenge} variant="cyan" />
      <div className={css.blankSep} />
      <CharacterSpacer
        className={css.sep}
        variant="purple"
        size="x2"
        side="left"
        offset={0.5}
        characterSize={0.7}
      />
      <ContributionsPanel
        contributions={challenge.contributions}
        images={images}
      />

      <div className={css.blankSep} />
      <ChallengesPanel />
      <div className={cn(pattern, css.pattern)} />
    </Layout>
  );
};

export const query = graphql`
  query ($id: String, $contributionsPath: String, $slug: String) {
    challenge(id: { eq: $id }) {
      title
      slug
      videoId
      contributionsPath
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
      contributions {
        title
        url
        image
        author {
          name
          url
        }
      }
    }
    contributionImages: allFile(
      filter: {
        sourceInstanceName: { eq: "challenges" }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: $contributionsPath }
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
    challengeImage: allFile(
      filter: {
        sourceInstanceName: { eq: "challenges" }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: $slug }
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

export default Challenge;
