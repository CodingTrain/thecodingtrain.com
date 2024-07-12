import React, { useMemo, useState } from 'react';
import ReactSelect from 'react-select';
import cn from 'classnames';

import * as css from './Select.module.css';

export const Select = ({
  title,
  options,
  selected,
  placeholder,
  onChange,
  icon,
  className,
  variant,
  instanceId
}) => {
  const [input, setInput] = useState('');
  const opts = useMemo(() => options.map(toOption), [options]);
  const filteredOpts = useMemo(
    () => (input === '' ? opts : filterAndSortRank(opts, input)),
    [opts, input]
  );

  return (
    <section className={cn(css.root, className, { [css[variant]]: variant })}>
      <div className={css.left}>
        <div className={css.icon}>{icon}</div>
        <div className={css.spacer} />
      </div>
      <div className={css.right}>
        <div className={css.title}>
          <h2>{title}</h2>
        </div>
        <div className={css.selectContainer}>
          <ReactSelect
            isClearable
            placeholder={placeholder}
            className={css.select}
            classNamePrefix="rs"
            options={filteredOpts}
            defaultValue={selected ? toOption(selected) : ''}
            onChange={(o) => onChange(o ? o.value : null)}
            instanceId={instanceId}
            onInputChange={setInput}
            filterOption={() => true}
          />

          <div className={css.itemSpacer}></div>
        </div>
      </div>
    </section>
  );
};

export default Select;

const toOption = (value) => ({ value, label: value });

// trim, lowercase and strip accents
const normalize = (value) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const rank = (value, input) => {
  // exact match: highest priority
  if (value === input) return 0;

  // complete word match: higher priority based on word position
  const words = value.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i] === input) return i + 1;
  }

  // partial match: lower priority based on character position
  const index = value.indexOf(input);
  return index === -1 ? Number.MAX_SAFE_INTEGER : 1000 + index;
};

const filterAndSortRank = (options, input) => {
  // It doesn't seem possible to only sort the filtered options in react-select, but we can re-implement the filtering to do so.
  // https://github.com/JedWatson/react-select/discussions/4426

  const normalizedInput = normalize(input);

  return options
    .filter((o) => normalize(o.value).includes(normalizedInput))
    .sort((optA, optB) => {
      const rankDelta =
        rank(normalize(optA.value), normalizedInput) -
        rank(normalize(optB.value), normalizedInput);

      if (rankDelta !== 0) return rankDelta;

      return optA.value.localeCompare(optB.value);
    });
};
