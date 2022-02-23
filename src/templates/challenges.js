import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import Card from '../components/challenges/Card';

import ItemsPage from '../components/ItemsPage';

import * as css from './challenges.module.css';

const ChallengesPage = ({ data, pageContext, location }) => {
  const challenges = data.challenges.nodes;
  const languages = data.languages.nodes.map(({ value }) => value);
  const topics = data.topics.nodes.map(({ value }) => value);

  return (
    <ItemsPage
      title="Challenges"
      location={location}
      itemsPath="challenges"
      variant="cyan"
      languages={languages}
      topics={topics}
      showPagination={challenges.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}>
      {challenges.length > 0 && (
        <div className={css.challenges}>
          {challenges.map((challenge, i) => (
            <Fragment key={i}>
              <Card challenge={challenge} />
              {i % 2 !== 1 && <div className={css.horizontalSpacer}></div>}
              {i % 2 !== 0 && <div className={css.verticalSpacer}></div>}
            </Fragment>
          ))}
        </div>
      )}
    </ItemsPage>
  );
};

export const query = graphql`
  query ($skip: Int!, $limit: Int!, $topic: String!, $language: String!) {
    challenges: allJourney(
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
  }
`;

export default ChallengesPage;
