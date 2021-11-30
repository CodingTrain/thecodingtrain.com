import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

import * as css from './guide.module.css';

const Guide = ({ data }) => {
  const { mdx } = data;

  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Guides', link: `/guides` },
          { name: mdx.frontmatter.title, link: `/guides/${mdx.slug}` }
        ]}
        variant="red"
      />
      <ul>
        {mdx.tableOfContents.items.map((item, index) => (
          <li key={index}>{item.title} </li>
        ))}
      </ul>
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </Layout>
  );
};

export const query = graphql`
  query ($slug: String!) {
    mdx(slug: { eq: $slug }) {
      slug
      body
      tableOfContents
      frontmatter {
        title
      }
    }
  }
`;

export default Guide;
