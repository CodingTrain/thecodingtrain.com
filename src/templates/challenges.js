import { graphql, Link } from 'gatsby';
import React, { Fragment } from 'react';

import Card from '../components/challenges/Card';
import Image from '../components/Image';
import ItemsPage from '../components/ItemsPage';
import ItemsPageFilters from '../components/ItemsPageFilters';
import Spacer from '../components/Spacer';

import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';
import BracketsCharacter2 from '../images/characters/SquareBrackets_2.mini.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_4.mini.svg';
import PlayButton from '../images/playbutton.svg';

import { getReadableDate } from '../hooks';

import * as css from './challenges.module.css';

const ChallengesPage = ({ data, pageContext, location }) => {
  const { language, topic } = pageContext;
  const pageData = data.pageData.nodes[0];
  const challenges = data.challenges;
  const recentChallenge = data.recentChallenge.nodes[0];

  const challengesPlaceholder = data.challengePlaceholderImage
    ? data.challengePlaceholderImage.childImageSharp.gatsbyImageData
    : null;

  const variant = 'cyan';
  const itemsPath = 'challenges';

  return (
    <ItemsPage
      title={pageData.title}
      description={pageData.description}
      image={challengesPlaceholder}
      itemsPath={itemsPath}
      variant={variant}
      Character={BracketsCharacter}
      SeparatorCharacter={BracketsCharacter2}
      EndPageCharacter={RainbowCharacter}
      characterOrientation="left"
      //
      showPagination={challenges.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}>
      <>
        <RecentChallenge
          featuredChallengeTitle={pageData.featuredText}
          challenge={pageData.featuredChallenge ?? recentChallenge}
          placeholderImage={challengesPlaceholder}
        />
        <Spacer />

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
          filtersFilePath="/filters-challenges.json"
          location={location}
          itemsPath={itemsPath}
          variant={variant}
        />
        <Spacer />

        {challenges.length > 0 && (
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
        )}
      </>
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
  query ($skip: Int, $limit: Int, $topic: String!, $language: String!) {
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
    challenges: challengesPaginatedFilteredByTags(
      language: $language
      topic: $topic
      skip: $skip
      limit: $limit
    ) {
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
    recentChallenge: allChallenge(sort: { date: DESC }, limit: 1) {
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
  }
`;

export default ChallengesPage;
