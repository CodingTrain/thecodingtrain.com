import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/Layout';
import Spacer from '../../components/Spacer';
import TrackHeader from '../../components/TrackHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

import * as css from '../../styles/pages/tracks/track.module.css';

const Track = (props) => {
  console.log({ props });
  const { track } = props.data;
  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Videos Overview' },
          { name: 'Tracks', link: '/tracks' },
          { name: track.title, link: `/tracks/${track.slug}` }
        ]}
        variant="red"
      />
      <TrackHeader track={track} />
      {track.title + props.params.slug}
    </Layout>
  );
};

export const query = graphql`
  query ($id: String) {
    track(id: { eq: $id }) {
      title
      slug
      description
      numVideos
      type
      chapters {
        title
        videos {
          title
          languages
          topics
        }
      }
    }
  }
`;

export default Track;
