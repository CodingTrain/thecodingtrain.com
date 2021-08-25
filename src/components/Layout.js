import React from "react";
import Head from "./Head";

import "../styles/base.css";
import "../styles/variables.css";
import "../styles/fonts.css";

import * as css from "./Layout.module.css";

const Layout = ({ children, title }) => {
  return (
    <div className={css.outer}>
      <Head title={title} />
      <div className={css.inner}>
        <header>MENU HERE</header>
        {children}
      </div>
    </div>
  );
};

export default Layout;
