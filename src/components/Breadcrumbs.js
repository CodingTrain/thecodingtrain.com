import React, { memo } from "react";
import cn from "classnames";

import * as css from "./Breadcrumbs.module.css";
import { box } from "../styles/grid.module.css";

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <div className={cn(box, css.root)}>
      {breadcrumbs.map((breadcrumb, i) => {
        return (
          <span key={i} className={css.crumb}>
            {breadcrumb.name}
             {i < breadcrumbs.length - 1 && <span className={css.arrow}>&gt;</span>} 
          </span>
        );
      })}
    </div>
  );
};

export default memo(Breadcrumbs);
