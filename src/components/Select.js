import React, { useMemo } from 'react';
import ReactSelect from 'react-select';
import cn from 'classnames';

import * as css from './Select.module.css';

const toOption = (value) => ({ value, label: value });

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
  const opts = useMemo(() => options.map(toOption), [options]);
  const handleOnChange = (o, action) => onChange(o ? o.value : o);

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
            options={opts}
            defaultValue={selected ? toOption(selected) : selected}
            onChange={handleOnChange}
            instanceId={instanceId}
          />

          <div className={css.itemSpacer}></div>
        </div>
      </div>
    </section>
  );
};
export default Select;
