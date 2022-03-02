import React, { useState, Children, cloneElement } from 'react';
import classnames from 'classnames';

import Button from './Button';

import * as css from './ShareButton.module.css';

import ShareIcon from '../images/share.svg';

import copy from 'copy-to-clipboard';

const CopyUrlToClipboard = ({ children, text, onCopy, options }) => {
  const onClick = (event) => {
    const elem = Children.only(children);
    const res = copy(window.location.href, options);

    onCopy && onCopy(text, res);

    if (elem && elem.props && typeof elem.props.onClick === 'function') {
      elem.props.onClick(event);
    }
  };

  const elem = Children.only(children);

  return cloneElement(elem, { onClick });
};

export const ShareButton = ({ className, variant, text = 'Share' }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = (text, res) => {
    if (res) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  };

  const classes = classnames(css.root, className, {
    [css[variant]]: css[variant]
  });

  return (
    <CopyUrlToClipboard onCopy={onCopy}>
      <Button className={classes} aria-label="Share page URL">
        <ShareIcon />
        {text && <span>{text}</span>}
        {isCopied && (
          <p className={css.copiedNotification}>Copied to clipboard!</p>
        )}
      </Button>
    </CopyUrlToClipboard>
  );
};

export default ShareButton;
