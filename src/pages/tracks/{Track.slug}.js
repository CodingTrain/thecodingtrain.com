import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../../components/Layout';
import TrackChallengesPanel from '../../components/tracks/TrackChallengesPanel';
import TrackContributionsPanel from '../../components/tracks/TrackContributionsPanel';
import TrackHeader from '../../components/tracks/TrackHeader';
import TrackVideoPlayer from '../../components/tracks/TrackVideoPlayer';
import Breadcrumbs from '../../components/Breadcrumbs';

import { pattern } from '../../styles/styles.module.css';
import * as css from '../../styles/pages/tracks/track.module.css';

const Track = (props) => {
  console.log({ props });
  const { track } = props.data;
  console.log({ track });
  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Tracks', link: '/tracks' },
          { name: track.title, link: `/tracks/${track.slug}` }
        ]}
        variant="red"
      />
      <TrackHeader track={track} />
      <TrackVideoPlayer chapters={track.chapters} />
      <div className={cn(pattern, css.pattern)} />
      <TrackContributionsPanel track={track} />
      <div className={cn(pattern, css.pattern)} />
      <TrackChallengesPanel track={track} />
      <div className={cn(pattern, css.pattern)} />
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
          slug
          languages
          topics
        }
      }
    }
  }
`;

export default Track;
