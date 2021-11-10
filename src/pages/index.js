import * as React from 'react';
import { graphql } from 'gatsby';
import { Link } from 'gatsby';

import Layout from '../components/Layout';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <ul>
        <li>
          <Link to="/components">Go to components overview</Link>
        </li>
        <li>
          <Link to="/tracks">Go to tracks page</Link>
          <ul>
            {data.tracks.nodes.map((track, i) => (
              <li key={i}>
                <Link to={`/tracks/${track.slug}`}>{track.title}</Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Link to="/about">Go to about page</Link>
        </li>
      </ul>
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
  }
`;

export default IndexPage;
