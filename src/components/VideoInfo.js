import React, { memo } from 'react';
import cn from 'classnames';

import Tabs from './Tabs';
import CodeExampleList from './CodeExampleList';
import LinkList from './LinkList';
import CollapsableDescription from './CollapsableDescription';
import * as css from './VideoInfo.module.css';

const useLabels = (video) => {
  let labels = [];

  if (video.codeExamples && video.codeExamples.length > 0) {
    labels.push('CODE EXAMPLES');
  }
  labels.push('DESCRIPTION');

  labels = [...labels, ...video.groupLinks.map((g) => g.title.toUpperCase())];
  return labels;
};

const useCredits = (video) => {
  const credits = video.credits || [];
  return credits.map((credit) => {
    return credit.url ? (
      <>
        {credit.title} by <a href={credit.url}>{credit.name}</a>
        <br />
      </>
    ) : (
      <>
        {credit.title} by {credit.name}
        <br />
      </>
    );
  });
};

const VideoInfo = ({ video, variant, url, placeholderImage }) => {
  const labels = useLabels(video);
  const credits = useCredits(video);
  const descriptionContent = (
    <>
      {video.description}
      {video.credits && (
        <>
          <br />
          <br />
          Credits:
          <br />
          {credits}
        </>
      )}
    </>
  );
  return (
    <div className={cn(css.root, { [css[variant]]: variant })}>
      <Tabs className={css.aboutTabs} variant={variant} labels={labels}>
        {video.codeExamples && video.codeExamples.length > 0 && (
          <CodeExampleList
            examples={video.codeExamples}
            variant={variant}
            placeholderImage={placeholderImage}
          />
        )}
        <CollapsableDescription
          className={css.description}
          expandedClassName={css.descriptionExpanded}
          variant={variant}
          content={descriptionContent}
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
