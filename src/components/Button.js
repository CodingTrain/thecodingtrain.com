import React from 'react';
import { Link } from 'gatsby';
import classnames from 'classnames';
import * as css from './Button.module.css';

export const Button = ({
  className,
  to,
  variant,
  onClick,
  children,
  disabled
}) => {
  const classes = classnames(css.root, className, {
    [css[variant]]: css[variant]
  });

  return to ? (
    <Link to={to} className={classes}>
      {children}
    </Link>
  ) : (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
