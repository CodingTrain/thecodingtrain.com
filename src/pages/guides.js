import * as React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import CharacterSpacer from '../components/CharacterSpacer';
import { Heading1 } from '../components/Heading';
import PagePanel from '../components/PagePanel';
import Spacer from '../components/Spacer';
import GuideCard from '../components/GuideCard';

import DotCharacter from '../images/characters/ThisDot_5.mini.svg';
import DotCharacter2 from '../images/characters/ThisDot_6.mini.svg';
import MouseCharacter from '../images/characters/WheelstheMouse_3.mini.svg';
import TriangleCharacter from '../images/characters/Triangle_6.mini.svg';

import * as css from '../styles/pages/guides.module.css';

const GuidesPage = ({ data }) => {
  const pageData = data.pageData.nodes[0];
  const guides = data.guides.nodes.filter((n) => n.mdx.frontmatter.title);
  const guidesPlaceholderImage =
    data.guidesPlaceholderImage.nodes.length > 0
      ? data.guidesPlaceholderImage.nodes[0].childImageSharp.gatsbyImageData
      : null;

  const variant = 'purple';

  return (
    <Layout
      title={pageData.title}
      description={pageData.description}
      image={guidesPlaceholderImage}>
      <Spacer />
      <header className={css.header}>
        <Heading1 className={css.heading} variant={variant}>
          {pageData.title}
        </Heading1>
        <div className={css.character}>{<DotCharacter />}</div>
      </header>
      <PagePanel
        className={css.panel}
        description={pageData.description}
        text="New to coding?"
        buttonText="Start here"
        buttonLink="/guides/getting-started"
        variant="orange"
        Character={TriangleCharacter}
        bbColor="orange"
      />

      <CharacterSpacer
        className={css.sep}
        variant={variant}
        size="x2"
        side="right"
        offset={0.75}
        characterSize={1.1}
        Character={DotCharacter2}
      />

      <Spacer className={css.spacer} />

      <div className={css.guideList}>
        {guides.map((guide, i) => (
          <React.Fragment key={i}>
            <GuideCard
              title={guide.mdx.frontmatter.title}
              description={guide.mdx.frontmatter.description}
              slug={`/guides/${guide.mdx.fields.slug}`}
              meta={guide.mdx.frontmatter.date}
              icon={'📒'}
              image={
                guide.cover?.file?.childImageSharp?.gatsbyImageData ??
                guidesPlaceholderImage
              }
              variant={variant}
            />
            {i % 2 === 0 && (
              <div
                className={cn(css.horizontalGap, {
                  [css.lastHG]: i === guides.length - 1
                })}
              />
            )}
            {i !== guides.length - 1 && (
              <div
                className={cn(css.verticalGap, {
                  [css.rowVG]: i % 2 !== 0
                })}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <Spacer className={css.spacer} />
      <CharacterSpacer
        className={css.sep}
        size="x4"
        side="right"
        offset={0.42}
        characterSize={0.9}
        Character={MouseCharacter}
      />
    </Layout>
  );
};

export const query = graphql`
  query {
    pageData: allGuidesPageInfo {
      nodes {
        title
        description
      }
    }
    guides: allGuide {
      nodes {
        mdx {
          frontmatter {
            title
            description
            date
          }
          fields {
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
    }
    guidesPlaceholderImage: allFile(
      filter: {
        sourceInstanceName: { eq: "guides" }
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

export default GuidesPage;
