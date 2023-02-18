import React, { useEffect, useState, useRef } from 'react';
import { filteredPath } from '../utils';
import { navigate } from 'gatsby';

import Select from './Select';

import * as css from './ItemsPageFilters.module.css';

const ItemsPageFilters = ({
  location,
  itemsPath,
  selectedLanguage,
  selectedTopic,
  filtersFilePath,
  variant
}) => {
  const [languages, setLanguages] = useState([selectedLanguage]);
  const [topics, setTopics] = useState([selectedTopic]);
  const filtersRef = useRef();

  const shouldScroll = location.pathname.split('/').length > 2;

  useEffect(() => {
    (async () => {
      const doc = await (await fetch(filtersFilePath)).json();
      setLanguages(doc.languages);
      setTopics(doc.topics);
    })();
  }, [filtersFilePath]);

  useEffect(() => {
    if (shouldScroll) {
      filtersRef.current.scrollIntoView();
    }
  }, [shouldScroll]);

  const setSelectedLanguage = (value) => {
    navigate(filteredPath(itemsPath, value, selectedTopic));
  };

  const setSelectedTopic = (value) => {
    navigate(filteredPath(itemsPath, selectedLanguage, value));
  };

  return (
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
  );
};

export default ItemsPageFilters;
