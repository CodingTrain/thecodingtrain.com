import React, { memo } from 'react';
import cn from 'classnames';

import Tabs from './Tabs';
import CodeExampleList from './CodeExampleList';
import LinkList from './LinkList';
import CollapsableDescription from './CollapsableDescription';
import * as css from './VideoInfo.module.css';

const VideoInfo = ({ video, variant }) => {
  let labels = ['OVERVIEW'];
  if (video.codeExamples && video.codeExamples.length > 0) {
    labels.push('CODE EXAMPLES');
  }
  labels = [...labels, ...video.groupLinks.map((g) => g.title.toUpperCase())];

  return (
    <div className={cn(css.root, { [css[variant]]: variant })}>
      <Tabs className={css.aboutTabs} variant={variant} labels={labels}>
        <CollapsableDescription
          className={css.description}
          expandedClassName={css.descriptionExpanded}
          variant={variant}
          content={video.description}
          charLimit={150}
        />
        {video.codeExamples && video.codeExamples.length > 0 && (
          <div>
            <CodeExampleList examples={video.codeExamples} variant={variant} />
          </div>
        )}
        {video.groupLinks.map((g, index) => (
          <LinkList links={g.links} variant={variant} key={index} />
        ))}
      </Tabs>
    </div>
  );
};

export default memo(VideoInfo);
