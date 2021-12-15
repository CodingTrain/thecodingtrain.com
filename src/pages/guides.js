import * as React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';

const GuidesPage = ({ data }) => {
  return (
    <Layout>
      <Breadcrumbs
        // className={css.breadcrumbs}
        breadcrumbs={[{ name: 'Guides', link: `/guides` }]}
        variant="red"
      />
      <ul>
        {data.guides.nodes.map((mdx, i) => (
          <li key={i}>
            <Link to={`/guides/${mdx.slug}`}>{mdx.frontmatter.title}</Link>
          </li>
        ))}
      </ul>
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
