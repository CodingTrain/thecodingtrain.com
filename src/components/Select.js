import React from 'react';
import ReactSelect from 'react-select';

const toOption = (value) => ({ value, label: value });

export const Select = ({ options, selected, onChange }) => {
  const opts = options.map(toOption);

  const handleOnChange = (o) => {
    onChange(o.value);
  };

  return (
    <ReactSelect
      options={opts}
      defaultValue={toOption(selected)}
      onChange={handleOnChange}
    />
  );
};
export default Select;
