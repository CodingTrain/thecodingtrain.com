import React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../../components/Layout';
import Breadcrumbs from '../../components/Breadcrumbs';
import TrackContributionsPanel from '../../components/ContributionsPanel';
import TrackVideoSection from '../../components/tracks/VideoSection';
import TrackHeader from '../../components/tracks/Header';
import TrackChallengesPanel from '../../components/ChallengesPanel';
import CharacterSpacer from '../../components/CharacterSpacer';

import * as css from '../../styles/pages/tracks/track.module.css';
import { pattern } from '../../styles/styles.module.css';

const Track = (props) => {
  const { pageContext, data } = props;
  const track = pageContext.track ?? data.track;
  const video = pageContext.video ?? data.track.chapters[0].videos[0];
  const trackPosition = pageContext.trackPosition ?? {
    chapterIndex: 0,
    videoIndex: 0
  };
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
      <TrackVideoSection
        track={track}
        video={video}
        trackPosition={trackPosition}
      />
      <CharacterSpacer
        variant="purple"
        size="x2"
        side="left"
        offset={0.5}
        characterSize={0.7}
      />
      <TrackContributionsPanel video={video} />
      <CharacterSpacer variant="cyan" size="x3" side="right" offset={0.7} />
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
          link
          description
          languages
          topics
          timestamps {
            title
            time
            seconds
          }
          codeExamples {
            title
            type
            codeURL
            githubURL
            editorURL
          }
          groupLinks {
            title
            links {
              title
              url
              author
            }
          }
        }
      }
    }
  }
`;

export default Track;
