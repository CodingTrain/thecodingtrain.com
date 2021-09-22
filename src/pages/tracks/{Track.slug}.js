import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../../components/Layout';
import Breadcrumbs from '../../components/Breadcrumbs';
import TrackChallengesPanel from '../../components/tracks/TrackChallengesPanel';
import TrackContributionsPanel from '../../components/tracks/TrackContributionsPanel';
import TrackHeader from '../../components/tracks/TrackHeader';
import TrackVideoPlayer from '../../components/tracks/TrackVideoPlayer';

import * as css from '../../styles/pages/tracks/track.module.css';
import { pattern } from '../../styles/styles.module.css';

const Track = (props) => {
  const { pageContext, data } = props;
  const track = pageContext.track ?? data.track;
  const video = pageContext.video ?? data.track.chapters[0].videos[0];
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
      {!pageContext.video && <TrackHeader track={track} />}
      <TrackVideoPlayer track={track} video={video} />
      <div className={cn(pattern, css.pattern)} />
      <TrackContributionsPanel video={video} />
      <div className={cn(pattern, css.pattern)} />
      <TrackChallengesPanel video={video} />
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
