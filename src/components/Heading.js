import React, { memo } from "react";
import cn from "classnames";

import * as css from "./Heading.module.css";
import { box } from "../styles/grid.module.css";

const Heading = ({ children }) => {
  return (
    <div className={cn(box, css.root)}>
      <h1>{children}</h1>
    </div>
  );
};

export default memo(Heading);
