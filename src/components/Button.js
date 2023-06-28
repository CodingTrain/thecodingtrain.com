import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import cn from 'classnames';
import * as css from './Button.module.css';

export const Button = ({
  className,
  to,
  href,
  variant,
  onClick,
  children,
  disabled,
  rainbow,
  ...otherProps
}) => {
  const classes = cn(css.root, className, {
    [css[variant]]: css[variant],
    [css.rainbow]: rainbow
  });

  return to ? (
    <Link to={to} className={classes}>
      {children}
    </Link>
  ) : href ? (
    <a href={href} className={classes} {...otherProps}>
      {children}
    </a>
  ) : (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}>
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['red', 'orange', 'purple', 'cyan', 'pink']),
  className: PropTypes.string,
  to: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  rainbow: PropTypes.bool
};

export default Button;
