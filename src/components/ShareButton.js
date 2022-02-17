import React from 'react';
import classnames from 'classnames';

import Button from './Button';

import * as css from './ShareButton.module.css';

import ShareIcon from '../images/share.svg';

export const ShareButton = ({
  className,
  variant,
  onClick,
  text = 'Share'
}) => {
  const classes = classnames(css.root, className, {
    [css[variant]]: css[variant]
  });

  return (
    <Button className={classes}>
      <ShareIcon />
      {text && <span>{text}</span>}
    </Button>
  );
};

export default ShareButton;
