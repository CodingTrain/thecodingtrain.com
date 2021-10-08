import React, { memo } from 'react';
import cn from 'classnames';

import * as css from './CodeExampleList.module.css';

import NodeIcon from '../images/node-icon.svg';
import P5Icon from '../images/p5js-icon.svg';
import ProcessingLogo from '../images/processing-icon.svg';

const icons = {
  p5js: () => <P5Icon className={css.p5} />,
  node: () => <NodeIcon className={css.node} />,
  processing: () => <ProcessingLogo className={css.processing} />
};

const CodeExampleList = memo(({ className, variant, examples }) => {
  return (
    <ul className={cn(css.root, className, { [css[variant]]: variant })}>
      {examples.map((example, key) => {
        const Icon =
          example.icon in icons ? icons[example.icon] : () => <svg></svg>;
        return (
          <li className={css.example} key={key}>
            <span className={css.icon}>
              <Icon />
            </span>
            <span className={css.name}>{example.name}</span>
            <a href={example.webEditorLink}>Web Editor</a>
            <a href={example.viewCodeLink}>View Code</a>
            <a href={example.downloadCodeLink}>Download Code</a>
          </li>
        );
      })}
    </ul>
  );
});

export default CodeExampleList;
