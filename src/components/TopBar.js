import React from "react";
import cn from "classnames";
import Menu from "./Menu";

import * as css from "./TopBar.module.css";
import { box } from "../styles/box.module.css";

import Logo from "../images/logo.svg";
import Clock from "../images/clock.svg";

const TopBar = () => {
  return (
    <div className={cn(box, css.root)}>
      <div className={cn(box, css.logo)}>
        <Logo />
      </div>
      <div className={cn(box, css.clock)}>
        <Clock />
      </div>
      <div className={cn(box, css.date)}>Sunday / Feb 7th, 2021</div>
      <Menu />
    </div>
  );
};

export default TopBar;
