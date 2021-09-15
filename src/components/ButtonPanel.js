import React, { memo } from 'react';
import cn from 'classnames';

import Button from './Button';

import * as css from './ButtonPanel.module.css';

const ButtonPanel = ({ text, buttonText, buttonLink, variant, className }) => {
  return (
    <div className={cn(css.root, className, { [css[variant]]: variant })}>
      <p>{text}</p>
      <Button variant={variant} to={buttonLink}>
        {buttonText}
      </Button>
    </div>
  );
};

export default memo(ButtonPanel);
