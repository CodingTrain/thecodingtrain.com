import React from 'react';
import { Slice } from 'gatsby';

// fixes chunks order warnings
import '../styles/styles.module.css';

import '../styles/base.css';
import '../styles/variables.css';
import '../styles/fonts.css';

import * as css from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={css.container}>
      <div className={css.content}>
        <Slice alias="TopBar" />
        {children}
        <Slice alias="Footer" />
      </div>
    </div>
  );
};

export default Layout;
