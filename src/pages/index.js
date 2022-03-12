import * as React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

import Layout from '../components/Layout';

import * as css from '../styles/pages/index.module.css';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <p>Homepage in progress.</p>
      <p>
        <Link to="/routes">Go to routes page</Link>
      </p>
    </Layout>
  );
};

export const query = graphql`
  query {
    tracks: allTrack {
      nodes {
        title
        slug
      }
    }
    challenges: allJourney {
      nodes {
        title
        slug
      }
    }
    mdxs: allMdx {
      nodes {
        frontmatter {
          title
        }
        slug
      }
    }
  }
`;

export default IndexPage;
