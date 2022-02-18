import React, { Fragment, useEffect, useRef, useState } from 'react';
import { graphql, Link, navigate } from 'gatsby';
import Layout from '../components/Layout';

import Breadcrumbs from '../components/Breadcrumbs';
import { Heading1 } from '../components/Heading';
import PagePanel from '../components/PagePanel';
import Filter from '../components/Filter';
import Spacer from '../components/Spacer';
import Card from '../components/challenges/Card';

import * as css from './challenges.module.css';

const useSelectedTags = (pathname) => {
  const splittedString = pathname.replace('%20', ' ').split('/');
  const filterString =
    splittedString[2] && splittedString[2].includes('-')
      ? splittedString[2]
      : 'lang--top-';
  const splittedFilter = filterString.split('-');
  return [splittedFilter[1], splittedFilter[3]];
};

const ChallengesPage = ({ data, pageContext, location }) => {
  const [selectedLanguage, selectedTopic] = useSelectedTags(location.pathname);

  const challenges = data.challenges.nodes;
  const languages = data.languages.nodes.map(({ value }) => value);
  const topics = data.topics.nodes.map(({ value }) => value);
  const [expanded, setExpanded] = useState(false);

  const filtersRef = useRef();
  const shouldScroll = location.pathname.split('/').length > 2;

  useEffect(() => {
    if (location?.state?.expanded !== undefined)
      setExpanded(location?.state?.expanded);
  }, [location?.state?.expanded]);

  useEffect(() => {
    if (shouldScroll) {
      filtersRef.current.scrollIntoView();
    }
  }, [shouldScroll]);

  const onExpand = () => {
    setExpanded((expanded) => !expanded);
  };

  const setSelectedLanguage = (value) => {
    navigate(`/challenges/lang-${value ?? ''}-top-${selectedTopic}/`, {
      state: { expanded }
    });
  };

  const setSelectedTopic = (value) => {
    navigate(`/challenges/lang-${selectedLanguage}-top-${value ?? ''}/`, {
      state: { expanded }
    });
  };

  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[{ name: 'Challenges', link: '#' }]}
        variant="cyan"
      />
      <Heading1 variant="cyan">Challenges</Heading1>
      <PagePanel
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
        text="New to coding?"
        buttonText="Start here"
        buttonLink="#"
        variant="purple"
        bbColor="cyan"
      />
      <div className={css.filters} ref={filtersRef}>
        <Filter
          title="Filter by Language"
          icon="⌥"
          items={languages}
          seeMore="See more languages >"
          seeLess="< See less languages"
          selected={selectedLanguage}
          onChange={setSelectedLanguage}
          expanded={expanded}
          onExpand={onExpand}
          className={css.filter}
          variant="cyan"
        />
        <Filter
          title="Filter by Topic"
          icon="☆"
          items={topics}
          seeMore="See more topics >"
          seeLess="< See less topics"
          selected={selectedTopic}
          onChange={setSelectedTopic}
          expanded={expanded}
          onExpand={onExpand}
          className={css.filter}
          variant="cyan"
        />
      </div>
      <Spacer />
      {challenges.length > 0 ? (
        <div className={css.challenges}>
          {challenges.map((challenge, i) => (
            <Fragment key={i}>
              <Card challenge={challenge} />
              {i % 2 !== 1 && <div className={css.horizontalSpacer}></div>}
              {i % 2 !== 0 && <div className={css.verticalSpacer}></div>}
            </Fragment>
          ))}
        </div>
      ) : (
        <p className={css.noItemsMessage}>No challenges found!</p>
      )}

      {challenges.length > 0 && (
        <div className={css.paginationNav}>
          <span>
            {pageContext.previousPagePath && (
              <Link to={pageContext.previousPagePath} state={{ expanded }}>
                {'<'} Previous
              </Link>
            )}
          </span>
          <span>
            {pageContext.humanPageNumber} of {pageContext.numberOfPages}
          </span>
          <span>
            {pageContext.nextPagePath && (
              <Link to={pageContext.nextPagePath} state={{ expanded }}>
                Next {'>'}{' '}
              </Link>
            )}
          </span>
        </div>
      )}
    </Layout>
  );
};

export const query = graphql`
  query ($skip: Int!, $limit: Int!, $topic: String!, $language: String!) {
    challenges: allJourney(
      filter: {
        languagesFlat: { regex: $language }
        topicsFlat: { regex: $topic }
      }
      sort: { order: DESC, fields: date }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        title
        slug
        description
        date
        cover {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
    images: allFile(
      filter: {
        sourceInstanceName: { eq: "challenges" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        base
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    languages: allTag(filter: { type: { eq: "language" } }) {
      nodes {
        value
      }
    }
    topics: allTag(filter: { type: { eq: "topic" } }) {
      nodes {
        value
      }
    }
  }
`;

export default ChallengesPage;
