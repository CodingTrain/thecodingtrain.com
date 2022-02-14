import React, { memo } from 'react';
import cn from 'classnames';

import Tabs from './Tabs';
import CodeExampleList from './CodeExampleList';
import LinkList from './LinkList';
import CollapsableDescription from './CollapsableDescription';
import * as css from './VideoInfo.module.css';

const VideoInfo = ({ video, variant }) => {
  let labels = ['DESCRIPTION'];
  const hasCodeExamples = video.codeExamples && video.codeExamples.length > 0;
  if (hasCodeExamples) {
    labels.unshift('CODE EXAMPLES');
  }

  labels = [...labels, ...video.groupLinks.map((g) => g.title.toUpperCase())];

  return (
    <div className={cn(css.root, { [css[variant]]: variant })}>
      <Tabs className={css.aboutTabs} variant={variant} labels={labels}>
        {hasCodeExamples && (
          <CodeExampleList examples={video.codeExamples} variant={variant} />
        )}
        <CollapsableDescription
          className={css.description}
          expandedClassName={css.descriptionExpanded}
          variant={variant}
          content={video.description}
          charLimit={150}
        />
        {video.groupLinks.map((g, index) => (
          <LinkList links={g.links} variant={variant} key={index} />
        ))}
      </Tabs>
    </div>
  );
};

export default memo(VideoInfo);
