import React, { memo } from 'react';
import cn from 'classnames';

import Character from '../images/triangle_walking.svg';

import * as css from './CharacterSpacer.module.css';

const CharacterSpacer = ({
  className,
  variant,
  size = 'x1',
  side = 'right',
  offset = 0,
  characterSize = 1
}) => {
  return (
    <div
      className={cn(css.root, className, {
        [css[size]]: size,
        [css[variant]]: variant
      })}>
      <Character
        className={cn(css.character, {
          [css.left]: side === 'left'
        })}
        style={{
          [side]: offset * 100 + '%',
          width: 100 * characterSize + 'px',
          height: 100 * characterSize + 'px'
        }}
      />
      <div className={css.border} />
    </div>
  );
};

export default memo(CharacterSpacer);
