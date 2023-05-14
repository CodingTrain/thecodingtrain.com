import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import ItemsPage from '../components/ItemsPage';
import ItemsPageFilters from '../components/ItemsPageFilters';
import Card from '../components/showcase/Card';
import Spacer from '../components/Spacer';

import DotCharacter from '../images/characters/ThisDot_7.mini.svg';
import DotCharacter2 from '../images/characters/ThisDot_3.mini.svg';
import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';
import DotCharacter3 from '../images/characters/ThisDot_6.mini.svg';

import * as css from './showcases.module.css';

const ShowcasePage = ({ data, pageContext, location }) => {
  const { author } = pageContext;
  const pageData = data.pageData.nodes[0];
  const contributions = data.contributions;

  const contributionsPlaceholder = data.challengePlaceholderImage
    ? data.challengePlaceholderImage.childImageSharp.gatsbyImageData
    : null;

  const variant = 'purple';
  const itemsPath = 'showcase';

  return (
    <ItemsPage
      title={pageData.title}
      description={pageData.description}
      image={contributionsPlaceholder}
      itemsPath={itemsPath}
      variant={variant}
      panelText="Add yours!"
      panelButtonText="Submit"
      panelButtonLink="/guides/passenger-showcase-guide"
      panelVariant="purple"
      panelCharacter={DotCharacter3}
      Character={DotCharacter}
      SeparatorCharacter={DotCharacter2}
      EndPageCharacter={RainbowCharacter}
      characterOrientation="center"
      //
      showPagination={contributions.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}>
      <>
        <ItemsPageFilters
          filters={[
            {
              title: 'Filter by Author',
              placeholder: 'Pick an author to filter',
              icon: '☆',
              jsonKey: 'authors',
              filterKey: 'author',
              selectedOption: author
            }
          ]}
          filtersFilePath="/filters-contributions.json"
          location={location}
          itemsPath={itemsPath}
          variant={variant}
        />
        <Spacer />

        {contributions.length > 0 && (
          <div className={css.contributions}>
            {contributions.map((contribution, i) => (
              <Fragment key={i}>
                <Card
                  contribution={contribution}
                  placeholderImage={contributionsPlaceholder}
                />
                {i % 3 !== 2 && <div className={css.horizontalSpacer}></div>}
                {i % 3 === 2 && <div className={css.verticalSpacer}></div>}
                {i % 3 === 1 && i === contributions.length - 1 ? (
                  <div className={css.horizontalSpacerLast}></div>
                ) : null}
              </Fragment>
            ))}
          </div>
        )}
      </>
    </ItemsPage>
  );
};

export const query = graphql`
  query ($skip: Int, $limit: Int, $authorSlug: String!) {
    pageData: allShowcasePageInfo {
      nodes {
        title
        description
      }
    }
    contributions: contributionsPaginatedFilteredByTags(
      authorSlug: $authorSlug
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
