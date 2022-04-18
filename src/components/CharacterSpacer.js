import React, { memo } from 'react';
import cn from 'classnames';

import DefaultCharacter from '../images/characters/Triangle_4.mini.svg';

import * as css from './CharacterSpacer.module.css';

const CharacterSpacer = ({
  className,
  variant,
  size = 'x1',
  side = 'right',
  offset = 0,
  characterSize = 1,
  Character
}) => {
  const CharacterComponent = Character ?? DefaultCharacter;
  return (
    <div
      className={cn(css.root, className, {
        [css[size]]: size,
        [css[variant]]: variant
      })}>
      <CharacterComponent
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
