import React, { useEffect, useRef, useState } from 'react';
import { Link, navigate } from 'gatsby';
import cn from 'classnames';

import Layout from './Layout';
import { Heading1 } from './Heading';
import PagePanel from './PagePanel';
import Filter from './Filter';
import Spacer from './Spacer';
import Button from './Button';

import { useSelectedTags } from '../hooks';

import * as css from './ItemsPage.module.css';

import SemiColon from '../images/SemiColon_3.svg';
import SquareBrackets from '../images/SquareBrackets_4.svg';

const ItemsPage = ({
  location,
  title,
  itemsPath,
  variant,
  languages,
  topics,
  midSection,
  children,
  showPagination,
  previousPagePath,
  humanPageNumber,
  numberOfPages,
  nextPagePath
}) => {
  const [selectedLanguage, selectedTopic] = useSelectedTags(location.pathname);

  const [expanded, setExpanded] = useState(false);
  const onExpand = () => {
    setExpanded((expanded) => !expanded);
  };

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

  const resetFilters = () => {
    navigate(`/${itemsPath}/lang:all+topic:all/`, {
      state: { expanded }
    });
  };
  const setSelectedLanguage = (value) => {
    navigate(`/${itemsPath}/lang:${value ?? 'all'}+topic:${selectedTopic}/`, {
      state: { expanded }
    });
  };
  const setSelectedTopic = (value) => {
    navigate(
      `/${itemsPath}/lang:${selectedLanguage}+topic:${value ?? 'all'}/`,
      {
        state: { expanded }
      }
    );
  };

  return (
    <Layout title={title}>
      <Spacer />
      <Heading1 variant={variant}>{title}</Heading1>
      <PagePanel
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
        text="New to coding?"
        buttonText="Start here"
        buttonLink="/get-started"
        variant="orange"
        bbColor={variant}
      />
      {midSection}
      {midSection && <Spacer />}
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
          variant={variant}
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
          variant={variant}
        />
      </div>
      <Spacer />
      {children({
        isFiltered: selectedLanguage !== 'all' || selectedTopic !== 'all',
        language: selectedLanguage,
        topic: selectedTopic
      })}

      {showPagination ? (
        <div className={cn(css.paginationNav, { [css[variant]]: variant })}>
          <span>
            {previousPagePath && (
              <Link to={previousPagePath} state={{ expanded }}>
                {'<'} Previous
              </Link>
            )}
          </span>
          <span>
            {humanPageNumber} of {numberOfPages}
          </span>
          <span>
            {nextPagePath && (
              <Link to={nextPagePath} state={{ expanded }}>
                Next {'>'}{' '}
              </Link>
            )}
          </span>
        </div>
      ) : (
        <div className={cn(css.noItemsMessage, { [css[variant]]: variant })}>
          <p>No {title} found! </p>
          <Button variant={variant} onClick={() => resetFilters()}>
            Reset filters
          </Button>
          <SemiColon className={css.semiColon} />
          <SquareBrackets className={css.squareBrackets} />
        </div>
      )}
    </Layout>
  );
};

export default ItemsPage;
