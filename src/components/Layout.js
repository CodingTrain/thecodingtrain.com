import React from "react";

import "../styles/base.css";
import "../styles/variables.css";
import "../styles/fonts.css";

const Layout = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export default Layout;
