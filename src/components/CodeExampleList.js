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
          example.type in icons ? icons[example.type] : () => <svg></svg>;
        return (
          <li className={css.example} key={key}>
            <div className={css.description}>
              <span className={css.icon}>
                <Icon />
              </span>
              <span className={css.name}>{example.title}</span>
            </div>
            <div className={css.links}>
              <a href={example.editorURL} target="_blank" rel="noreferrer">
                Web Editor
              </a>
              <a href={example.githubURL} target="_blank" rel="noreferrer">
                View Code
              </a>
              <a href={example.codeURL} target="_blank" rel="noreferrer">
                Download Code
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
});

export default CodeExampleList;
