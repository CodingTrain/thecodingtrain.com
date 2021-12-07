import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import ContributionsPanel from '../components/ContributionsPanel';
import ChallengeVideoSection from '../components/challenges/VideoSection';
import VideoInfo from '../components/VideoInfo';
import ChallengesPanel from '../components/ChallengesPanel';
import CharacterSpacer from '../components/CharacterSpacer';

import { useImages } from '../hooks';

import * as css from './challenge.module.css';
import { pattern } from '../styles/styles.module.css';

const Challenge = ({ data }) => {
  const { challenge, challenges } = data;
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
        images={contributionsImages}
      />
      <div className={css.blankSep} />
      <CharacterSpacer
        className={css.sep}
        variant="cyan"
        size="x3"
        side="right"
        offset={0.7}
      />
      <ChallengesPanel
        challenges={challenges.nodes}
        images={challengesImages}
      />
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
        sourceInstanceName: { eq: "challenges" }
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

export default Challenge;
