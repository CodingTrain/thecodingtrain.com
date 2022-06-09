import React, { Fragment } from 'react';
import { graphql, Link } from 'gatsby';

import ItemsPage from '../components/ItemsPage';
import Image from '../components/Image';
import Card from '../components/challenges/Card';

import PlayButton from '../images/playbutton.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_4.mini.svg';
import BracketsCharacter2 from '../images/characters/SquareBrackets_2.mini.svg';
import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';

import { getReadableDate } from '../hooks';

import * as css from './challenges.module.css';

const ChallengesPage = ({ data, pageContext, location }) => {
  const pageData = data.pageData.nodes[0];
  const challenges = data.challenges.nodes;
  const recentChallenge = data.recentChallenge.nodes[0];
  const languages = data.languages.nodes.map(({ value }) => value);
  const topics = data.topics.nodes.map(({ value }) => value);

  const challengesPlaceholder =
    data.challengePlaceholderImage.nodes.length > 0
      ? data.challengePlaceholderImage.nodes[0].childImageSharp.gatsbyImageData
      : null;

  return (
    <ItemsPage
      title={pageData.title}
      description={pageData.description}
      image={challengesPlaceholder}
      location={location}
      itemsPath="challenges"
      variant="cyan"
      Character={BracketsCharacter}
      SeparatorCharacter={BracketsCharacter2}
      EndPageCharacter={RainbowCharacter}
      characterOrientation="left"
      languages={languages}
      topics={topics}
      midSection={
        <RecentChallenge
          featuredChallengeTitle={pageData.featuredText}
          challenge={pageData.featuredChallenge ?? recentChallenge}
          placeholderImage={challengesPlaceholder}
        />
      }
      showPagination={challenges.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}>
      {() =>
        challenges.length > 0 && (
          <div className={css.challenges}>
            {challenges.map((challenge, i) => (
              <Fragment key={i}>
                <Card
                  challenge={challenge}
                  placeholderImage={challengesPlaceholder}
                />
                {i % 2 !== 1 && <div className={css.horizontalSpacer}></div>}
                {i % 2 !== 0 && <div className={css.verticalSpacer}></div>}
              </Fragment>
            ))}
          </div>
        )
      }
    </ItemsPage>
  );
};

const RecentChallenge = ({
  featuredChallengeTitle,
  challenge,
  placeholderImage
}) => {
  const { title, date, slug, description, cover, videoNumber } = challenge;
  return (
    <section className={css.recentChallenge}>
      <div className={css.left}>
        <div className={css.info}>
          <h2 className={css.heading}>
            {featuredChallengeTitle} <br />
            {videoNumber ? `#${videoNumber} — ` : ''} {title}
          </h2>
          <p>{description}</p>
        </div>
        <div className={css.bottom}>
          <p>{getReadableDate(date)}</p>
          <Link
            className={css.play}
            to={`/challenges/${slug}`}
            aria-label={title}>
            <PlayButton />
          </Link>
        </div>
      </div>
      <div className={css.right}>
        <Link to={`/challenges/${slug}`}>
          {cover ? (
            <Image
              image={cover.file.childImageSharp.gatsbyImageData}
              pictureClassName={css.picture}
              imgClassName={css.image}
              alt={title}
            />
          ) : placeholderImage ? (
            <Image
              image={placeholderImage}
              pictureClassName={css.picture}
              imgClassName={css.image}
              alt={title}
            />
          ) : (
            <div aria-label={title} style={{ width: '100%', height: '100%' }} />
          )}
        </Link>
      </div>
    </section>
  );
};

export const query = graphql`
  query ($skip: Int!, $limit: Int!, $topic: String!, $language: String!) {
    pageData: allChallengesPageInfo {
      nodes {
        title
        description
        featuredText
        featuredChallenge {
          title
          date
          slug
          description
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
    }
    challenges: allChallenge(
      filter: {
        languagesFlat: { regex: $language }
        topicsFlat: { regex: $topic }
      }
      sort: { order: DESC, fields: date }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        title
        slug
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
    recentChallenge: allChallenge(
      sort: { fields: date, order: DESC }
      limit: 1
    ) {
      nodes {
        title
        slug
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
    images: allFile(
      filter: {
        sourceInstanceName: { eq: "challenges" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        base
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

export default ChallengesPage;
