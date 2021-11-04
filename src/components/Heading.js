import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './Heading.module.css';

const Heading = ({ children, variant = 'red', fill, level = 1, className }) => {
  const Tag = `h${level}`;
  return (
    <div
      className={cn(css.root, className, css[variant], { [css.fill]: fill })}>
      <Tag>{children}</Tag>
    </div>
  );
};

export default memo(Heading);

export const Heading1 = memo((props) => <Heading level={1} {...props} />);
export const Heading2 = memo((props) => <Heading level={2} {...props} />);
export const Heading3 = memo((props) => <Heading level={3} {...props} />);
export const Heading4 = memo((props) => <Heading level={4} {...props} />);
export const Heading5 = memo((props) => <Heading level={5} {...props} />);
export const Heading6 = memo((props) => <Heading level={6} {...props} />);
