import * as React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';

import * as css from '../styles/pages/guides.module.css';

const GuidesPage = ({ data }) => {
  const guides = data.guides.nodes.filter((n) => n.frontmatter.title);
  return (
    <Layout>
      <Heading1 variant="orange">Guides</Heading1>
      <div className={css.guideList}>
        {guides.map((mdx, i) => (
          <Link className={css.guideItem} to={`/guides/${mdx.slug}`} key={i}>
            <span className={css.icon}>📒</span>
            <span>{mdx.frontmatter.title}</span>
          </Link>
        ))}
      </div>
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
