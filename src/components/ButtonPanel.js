import React, { memo } from "react";
import cn from "classnames";

import Button from "./Button";

import * as css from "./ButtonPanel.module.css";
import { box } from "../styles/box.module.css";

const ButtonPanel = ({ text, buttonText, buttonLink, variant }) => {
  return (
    <div className={cn(box, css.root)}>
      <p>{text}</p>
      <Button variant={variant} to={buttonLink}>
        {buttonText}
      </Button>
    </div>
  );
};

export default memo(ButtonPanel);
