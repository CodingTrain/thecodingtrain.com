import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import * as css from './Heading.module.css';

const Heading = ({
  children,
  variant = 'red',
  borderBottom = true,
  fill,
  tag = 'h1',
  as,
  className
}) => {
  const Tag = `${tag}`;
  return (
    <div
      className={cn(css.root, className, css[variant], [css[`${as || tag}`]], {
        [css.borderBottom]: borderBottom,
        [css.fill]: fill
      })}>
      <Tag>{children}</Tag>
    </div>
  );
};

export const Heading1 = memo((props) => <Heading tag="h1" {...props} />);
export const Heading2 = memo((props) => <Heading tag="h2" {...props} />);
export const Heading3 = memo((props) => <Heading tag="h3" {...props} />);
export const Heading4 = memo((props) => <Heading tag="h4" {...props} />);
export const Heading5 = memo((props) => <Heading tag="h5" {...props} />);
export const Heading6 = memo((props) => <Heading tag="h6" {...props} />);

const TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const COLORS = ['purple', 'red', 'orange', 'cyan', 'pink'];
const propTypes = {
  tag: PropTypes.oneOf(TAGS),
  as: PropTypes.oneOf(TAGS),
  fill: PropTypes.bool,
  variant: PropTypes.oneOf(COLORS)
};
Heading.propTypes = { ...propTypes, tag: PropTypes.oneOf(TAGS).isRequired };

Heading1.propTypes = propTypes;
Heading2.propTypes = propTypes;
Heading3.propTypes = propTypes;
Heading4.propTypes = propTypes;
Heading5.propTypes = propTypes;
Heading6.propTypes = propTypes;
