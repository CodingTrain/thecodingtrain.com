import React, { useState } from 'react';
import cn from 'classnames';

import Button from './Button';

import * as css from './ShareButton.module.css';

export const ShareButton = ({ className, variant, wrapped, text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const classes = cn(css.root, className, {
    [css[variant]]: css[variant]
  });

  return (
    <Button
      className={classes}
      aria-label="Copy page URL"
      onClick={handleCopy}
      disabled={isCopied}>
      <span className={css.linkIcon}>🔗</span>
      {text && <span>{text}</span>}
      {isCopied && (
        <p
          className={cn(
            css.copiedNotification,
            wrapped ? css.copiedNotificationRight : css.copiedNotificationLeft
          )}>
          Copied to clipboard!
        </p>
      )}
    </Button>
  );
};

export default ShareButton;
