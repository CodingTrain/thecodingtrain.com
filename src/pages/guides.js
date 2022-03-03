import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';
import PagePanel from '../components/PagePanel';
import ButtonPanel from '../components/ButtonPanel';
import Spacer from '../components/Spacer';

import * as css from '../styles/pages/guides.module.css';

const GuidesPage = ({ data }) => {
  const guides = data.guides.nodes.filter((n) => n.frontmatter.title);
  return (
    <Layout>
      <Heading1 variant="purple">Guides</Heading1>
      <PagePanel
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
        text="New to coding?"
        buttonText="Start here"
        buttonLink="/get-started"
        variant="orange"
        bbColor="orange"
      />
      <Spacer />
      <div className={css.guideList}>
        {guides.map((mdx, i) => (
          <ButtonPanel
            key={i}
            text={mdx.frontmatter.title}
            buttonText={'Go'}
            buttonLink={`/guides/${mdx.slug}`}
            variant="purple"
            className={css.guideItem}
          />
        ))}
      </div>
      <Spacer />
    </Layout>
  );
};

export const query = graphql`
  query {
    guides: allMdx {
      nodes {
        frontmatter {
          title
        }
        slug
      }
    }
  }
`;

export default GuidesPage;
