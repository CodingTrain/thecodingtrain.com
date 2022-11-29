import React, { useEffect, useRef, useState } from 'react';
import { Link, navigate } from 'gatsby';
import cn from 'classnames';

import Layout from './Layout';
import CharacterSpacer from './CharacterSpacer';
import { Heading1 } from './Heading';
import PagePanel from './PagePanel';
import Select from './Select';
import Spacer from './Spacer';
import Button from './Button';

import { filteredPath } from '../utils';

import * as css from './ItemsPage.module.css';

import SemiColon from '../images/characters/SemiColon_3.mini.svg';
import ZeroCharacter from '../images/characters/Zero_4.mini.svg';
import ZeroCharacter2 from '../images/characters/Zero_3.mini.svg';

const ItemsPage = ({
  selectedLanguage,
  selectedTopic,
  location,
  title,
  description,
  image,
  itemsPath,
  variant,
  Character,
  SeparatorCharacter,
  EndPageCharacter,
  characterOrientation,
  midSection,
  children,
  showPagination,
  previousPagePath,
  humanPageNumber,
  numberOfPages,
  nextPagePath,
  filtersFilePath
}) => {
  const [expanded, setExpanded] = useState(false);
  const [languages, setLanguages] = useState([selectedLanguage]);
  const [topics, setTopics] = useState([selectedTopic]);
  const filtersRef = useRef();
  const shouldScroll = location.pathname.split('/').length > 2;

  useEffect(() => {
    (async () => {
      const resp = await fetch(filtersFilePath);
      const doc = await resp.json();
      setLanguages(doc.languages);
      setTopics(doc.topics);
    })();
  }, [filtersFilePath]);

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
    navigate(`/${itemsPath}/`, {
      state: { expanded }
    });
  };

  const setSelectedLanguage = (value) => {
    navigate(filteredPath(itemsPath, value, selectedTopic), {
      state: { expanded }
    });
  };

  const setSelectedTopic = (value) => {
    navigate(filteredPath(itemsPath, selectedLanguage, value), {
      state: { expanded }
    });
  };

  return (
    <Layout title={title} description={description} image={image}>
      <Spacer />
      <header className={css.header}>
        <Heading1 className={css.heading} variant={variant}>
          {title}
        </Heading1>
        <div
          className={cn(css.character, {
            [css[characterOrientation]]: characterOrientation
          })}>
          <Character />
        </div>
      </header>

      <PagePanel
        className={css.panel}
        description={description}
        text="New to coding?"
        buttonText="Start here"
        buttonLink="/guides/getting-started"
        variant="orange"
        bbColor={variant}
      />
      <CharacterSpacer
        className={css.sep}
        variant={variant}
        size="x2"
        side="right"
        offset={0.7}
        characterSize={0.9}
        Character={SeparatorCharacter}
      />
      {midSection}
      {midSection && <Spacer />}
      <div className={css.filters} ref={filtersRef}>
        <Select
          title="Filter by Language"
          placeholder="Pick a language to filter"
          icon="⌥"
          className={css.filter}
          options={languages}
          selected={selectedLanguage}
          onChange={setSelectedLanguage}
          variant={variant}
          instanceId="languages-filter"
        />

        <Select
          title="Filter by Topic"
          placeholder="Pick a topic to filter"
          icon="☆"
          className={css.filter}
          options={topics}
          selected={selectedTopic}
          onChange={setSelectedTopic}
          variant={variant}
          instanceId="topics-filter"
        />
      </div>

      <Spacer />

      {children({
        isFiltered:
          (selectedLanguage !== 'all' && selectedLanguage !== '') ||
          (selectedTopic !== 'all' && selectedTopic !== ''),
        language: selectedLanguage,
        topic: selectedTopic
      })}

      {showPagination ? (
        <nav className={cn(css.paginationNav, { [css[variant]]: variant })}>
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
        </nav>
      ) : (
        <div className={cn(css.noItemsMessage, { [css[variant]]: variant })}>
          <p>No {title} found! </p>
          <Button variant={variant} onClick={() => resetFilters()} rainbow>
            Reset filters
          </Button>
          <SemiColon className={css.semiColon} />
          <ZeroCharacter className={css.squareBrackets} />
        </div>
      )}
      <Spacer pattern className={css.spacer} />
      <CharacterSpacer
        className={css.sep}
        size="x4"
        side="right"
        offset={0.42}
        characterSize={0.9}
        Character={EndPageCharacter ?? ZeroCharacter2}
      />
    </Layout>
  );
};

export default ItemsPage;
