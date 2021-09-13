import React, { memo } from 'react';

import * as css from './Spacer.module.css';

const Spacer = ({ label }) => {
  return <div className={css.root}>{label}</div>;
};

export default memo(Spacer);
