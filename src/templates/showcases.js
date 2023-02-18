import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import ItemsPage from '../components/ItemsPage';
import Card from '../components/showcase/Card';

import DotCharacter from '../images/characters/ThisDot_7.mini.svg';
import DotCharacter2 from '../images/characters/ThisDot_3.mini.svg';
import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';

import * as css from './showcases.module.css';

const ShowcasePage = ({ data, pageContext, location }) => {
  const { language, topic } = pageContext;
  const pageData = data.pageData.nodes[0];
  const contributions = data.contributions;

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
      Character={DotCharacter}
      SeparatorCharacter={DotCharacter2}
      EndPageCharacter={RainbowCharacter}
      characterOrientation="center"
      midSection={null}
      showPagination={contributions.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}
      filtersFilePath="/filters-contributions.json">
      {() =>
        contributions.length > 0 && (
          <div className={css.challenges}>
            {contributions.map((contribution, i) => (
              <Fragment key={i}>
                <Card
                  contribution={contribution}
                  placeholderImage={contributionsPlaceholder}
                />
                {i % 3 !== 2 && <div className={css.horizontalSpacer}></div>}
                {i % 3 === 2 && <div className={css.verticalSpacer}></div>}
              </Fragment>
            ))}
          </div>
        )
      }
    </ItemsPage>
  );
};

export const query = graphql`
  query ($skip: Int, $limit: Int, $topic: String!, $language: String!) {
    pageData: allShowcasePageInfo {
      nodes {
        title
        description
      }
    }
    contributions: contributionsPaginatedFilteredByTags(
      language: $language
      topic: $topic
      skip: $skip
      limit: $limit
    ) {
      title
      url
      submittedOn
      author {
        name
        url
      }
      video {
        title
        date
        slug
        canonicalTrack {
          slug
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
