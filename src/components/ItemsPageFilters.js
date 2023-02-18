import React, { useEffect, useState, useRef } from 'react';
import { filteredPath } from '../utils';
import { navigate } from 'gatsby';

import Select from './Select';

import * as css from './ItemsPageFilters.module.css';

const ItemsPageFilters = ({
  filters,
  filtersFilePath,
  location,
  itemsPath,
  variant
}) => {
  const filtersRef = useRef();
  const shouldScroll = location.pathname.split('/').length > 2;

  const optionsInitialState = {};
  filters.forEach((f) => (optionsInitialState[f.jsonKey] = [f.selectedOption]));
  const [options, setOptions] = useState(optionsInitialState);

  const filterState = {};
  filters.forEach((f) => (filterState[f.filterKey] = f.selectedOption));

  useEffect(() => {
    (async () => {
      const doc = await (await fetch(filtersFilePath)).json();
      setOptions(doc);
    })();
  }, [filtersFilePath]);

  useEffect(() => {
    if (shouldScroll && filtersRef.current) filtersRef.current.scrollIntoView();
  }, [filtersRef, shouldScroll]);

  return (
    <div className={css.filters} ref={filtersRef}>
      {filters.map(({ name, icon, jsonKey, filterKey, selectedOption }) => (
        <Select
          key={name}
          title={`Filter by ${name}`}
          placeholder={`Pick a ${name.toLowerCase()} to filter`}
          icon={icon}
          className={css.filter}
          options={options[jsonKey]}
          selected={selectedOption}
          onChange={(value) => {
            filterState[filterKey] = value;
            navigate(filteredPath(itemsPath, filterState));
          }}
          variant={variant}
          instanceId={`${name}-filter`}
        />
      ))}
    </div>
  );
};

export default ItemsPageFilters;
