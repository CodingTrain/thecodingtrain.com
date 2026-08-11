import React from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';
import * as css from './Button.module.css';

/**
 * @typedef {Object} ButtonProps
 * @property {string} [className] Additional CSS classes.
 * @property {string} [to] Internal Gatsby destination.
 * @property {string} [href] External link destination.
 * @property {'red' | 'orange' | 'purple' | 'cyan' | 'pink'} [variant] Color variant.
 * @property {React.MouseEventHandler<HTMLButtonElement>} [onClick] Button click handler.
 * @property {React.ReactNode} [children] Button contents.
 * @property {boolean} [disabled] Whether the button is disabled.
 * @property {boolean} [rainbow] Whether to show the rainbow treatment.
 * @property {Object} [state] State passed to an internal Gatsby link.
 */

/**
 * @param {ButtonProps & React.HTMLAttributes<HTMLElement>} props
 * @returns {React.ReactElement}
 */
const Button = ({
  className,
  to,
  href,
  variant,
  onClick,
  children,
  disabled,
  rainbow,
  state,
  ...otherProps
}) => {
  const classes = cn(css.root, className, variant && css[variant], {
    [css.rainbow]: rainbow
  });

  return to ? (
    <Link to={to} className={classes} state={state}>
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

export default Button;
