import React from "react";
import classnames from "classnames";
import * as css from "./Button.module.css";

export const Button = ({
  className,
  href,
  variant,
  onClick,
  children,
  disabled,
}) => {
  const classes = classnames(css.root, {
    [className]: className,
    [css[variant]]: css[variant],
  });

  return href ? (
    <button className={classes}>
      <a href={href}>{children}</a>
    </button>
  ) : (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
