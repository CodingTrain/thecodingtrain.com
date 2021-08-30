import React, { memo } from "react";
import cn from "classnames";

import * as css from "./Filter.module.css";
import { box } from "../styles/box.module.css";

const Filter = ({ title, className, seeMore = "See more" }) => {
  return (
    <div className={cn(css.root, className)}>
      <div className={cn(box, css.left)}>
        <div className={cn(box, css.icon)}>Ⴤ</div>
      </div>
      <div className={cn(box, css.right)}>
        <div className={cn(box, css.title)}>
          <h3>{title}</h3>
        </div>
      </div>
    </div>
  );
};

//
// <div className={cn(box, css.left)} />
// <div className={cn(box, css.right)}>
//   This is something!
//   <button onClick={() => {}}>{seeMore}</button>
// </div>

export default memo(Filter);
