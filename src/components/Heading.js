import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './Heading.module.css';

/**
 * @typedef {Object} HeadingProps
 * @property {React.ReactNode} [children] Heading contents.
 * @property {'purple' | 'red' | 'orange' | 'cyan' | 'pink'} [variant] Color variant.
 * @property {boolean} [borderBottom] Whether to show the bottom border.
 * @property {boolean} [fill] Whether to use the filled style.
 * @property {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} [tag] Heading element to render.
 * @property {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} [as] Heading level to use for styling.
 * @property {string} [className] Additional CSS classes.
 * @property {string} [id] Heading ID.
 */

/**
 * @param {HeadingProps} props
 * @returns {React.ReactElement}
 */
const Heading = (props) => {
  const {
    children,
    variant = 'red',
    borderBottom = true,
    fill,
    tag = 'h1',
    as,
    className,
    id
  } = props;

  const Tag = tag;

  return (
    <div
      className={cn(css.root, className, css[variant], [css[`${as || tag}`]], {
        [css.borderBottom]: borderBottom,
        [css.fill]: fill
      })}>
      <Tag id={id}>{children}</Tag>
    </div>
  );
};

export const Heading1 = memo((props) => <Heading tag="h1" {...props} />);
export const Heading2 = memo((props) => <Heading tag="h2" {...props} />);
export const Heading3 = memo((props) => <Heading tag="h3" {...props} />);
export const Heading4 = memo((props) => <Heading tag="h4" {...props} />);
export const Heading5 = memo((props) => <Heading tag="h5" {...props} />);
export const Heading6 = memo((props) => <Heading tag="h6" {...props} />);
