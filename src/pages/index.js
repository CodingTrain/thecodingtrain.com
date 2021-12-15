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
        <li>
          <Link to="/challenges">Go to challenges page</Link>
          <ul>
            {data.challenges.nodes.map((challenge, i) => (
              <li key={i}>
                <Link to={`/challenges/${challenge.slug}`}>
                  {challenge.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          Guides:
          <ul>
            {data.mdxs.nodes.map((mdx, i) => (
              <li key={i}>
                <Link to={`/guides/${mdx.slug}`}>{mdx.frontmatter.title}</Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <Link to="/faq">Go to FAQ page</Link>
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
    challenges: allChallenge {
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
