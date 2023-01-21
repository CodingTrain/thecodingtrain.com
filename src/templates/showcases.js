import React, { Fragment } from 'react';
import { graphql, Link } from 'gatsby';

import ItemsPage from '../components/ItemsPage';
import Image from '../components/Image';
import Card from '../components/showcase/Card';

import PlayButton from '../images/playbutton.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_4.mini.svg';
import BracketsCharacter2 from '../images/characters/SquareBrackets_2.mini.svg';
import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';

import { getReadableDate } from '../hooks';

import * as css from './showcases.module.css';

const ShowcasePage = ({ data, pageContext, location }) => {
  const { language, topic } = pageContext;
  const pageData = data.pageData.nodes[0];
  const contributions = data.contributions.nodes;
  const languages = data.languages.nodes.map(({ value }) => value);
  const topics = data.topics.nodes.map(({ value }) => value);

  const contributionsPlaceholder = data.challengePlaceholderImage
    ? data.challengePlaceholderImage.childImageSharp.gatsbyImageData
    : null;

  return (
    <ItemsPage
      title={pageData.title}
      selectedLanguage={language}
      selectedTopic={topic}
      description={pageData.description}
      image={contributionsPlaceholder}
      location={location}
      itemsPath="showcase"
      variant="purple"
      Character={BracketsCharacter}
      SeparatorCharacter={BracketsCharacter2}
      EndPageCharacter={RainbowCharacter}
      characterOrientation="left"
      languages={languages}
      topics={topics}
      midSection={null}
      showPagination={contributions.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}>
      {() =>
        contributions.length > 0 && (
          <div className={css.challenges}>
            {contributions.map((contribution, i) => (
              <Fragment key={i}>
                <Card
                  contribution={contribution}
                  placeholderImage={contributionsPlaceholder}
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

export const query = graphql`
  query(
    $skip: Int!
    $limit: Int!
    $topicRegex: String!
    $languageRegex: String!
  ) {
    pageData: allShowcasePageInfo {
      nodes {
        title
        description
        }
      }
    contributions: allContribution(
      filter: { video: {
        languagesFlat: { regex: $languageRegex }
        topicsFlat: { regex: $topicRegex }
        }
      }
      sort: { order: DESC, fields: video___date }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        title
        url
        author {
            name
            url
        }
        video {
            title
            date
        }
        cover {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
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

export default ShowcasePage;
