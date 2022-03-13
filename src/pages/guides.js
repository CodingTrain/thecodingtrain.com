import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import CharacterSpacer from '../components/CharacterSpacer';
import { Heading1 } from '../components/Heading';
import PagePanel from '../components/PagePanel';
import Spacer from '../components/Spacer';
import GuideCard from '../components/GuideCard';

import DotCharacter from '../images/characters/ThisDot_4.mini.svg';
import MouseCharacter from '../images/characters/WheelstheMouse_3.mini.svg';

import * as css from '../styles/pages/guides.module.css';

const GuidesPage = ({ data }) => {
  const guides = data.guides.nodes.filter((n) => n.mdx.frontmatter.title);
  const guidesPlaceholderImage =
    data.guidesPlaceholderImage.nodes.length > 0
      ? data.guidesPlaceholderImage.nodes[0].childImageSharp.gatsbyImageData
      : null;
  return (
    <Layout title="Guides">
      <Spacer />
      <div className={css.header}>
        <Heading1 className={css.heading} variant="purple">
          Guides
        </Heading1>
        <div className={css.character}>{<DotCharacter />}</div>
      </div>
      <PagePanel
        className={css.panel}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
        text="New to coding?"
        buttonText="Start here"
        buttonLink="/get-started"
        variant="orange"
        bbColor="orange"
      />
      <CharacterSpacer
        className={css.sep}
        variant="purple"
        size="x2"
        side="right"
        offset={0.75}
        characterSize={1.1}
        Character={DotCharacter}
      />
      <div className={css.guideList}>
        {guides.map((guide, i) => (
          <GuideCard
            key={i}
            title={guide.mdx.frontmatter.title}
            description={guide.mdx.frontmatter.description}
            slug={`/guides/${guide.mdx.slug}`}
            meta={guide.mdx.frontmatter.date}
            icon={'📒'}
            image={
              guide.cover?.file?.childImageSharp?.gatsbyImageData ??
              guidesPlaceholderImage
            }
            variant="purple"
            className={css.guideItem}
          />
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
    guides: allGuide {
      nodes {
        mdx {
          frontmatter {
            title
            description
            date
          }
          slug
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
