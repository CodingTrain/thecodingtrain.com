import React, { memo } from 'react';
import cn from 'classnames';

import Tabs from './Tabs';
import CodeExampleList from './CodeExampleList';
import LinkList from './LinkList';
import CollapsableDescription from './CollapsableDescription';
import * as css from './VideoInfo.module.css';

const VideoInfo = ({ video, variant }) => {
  const hasCodeExamples = video.codeExamples && video.codeExamples.length > 0;

  let labels = [];
  if (hasCodeExamples) {
    labels.push('CODE EXAMPLES');
  }

  labels.push('DESCRIPTION');

  labels = [...labels, ...video.groupLinks.map((g) => g.title.toUpperCase())];
  return labels;
};

const VideoInfo = ({ video, variant }) => {
  const labels = useLabels(video);
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
