// https://github.com/tjallingt/react-youtube
// https://developers.google.com/youtube/iframe_api_reference
import React, { memo, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import cn from 'classnames';

import * as css from './YouTubeVideo.module.css';

const YouTubeVideo = ({
  containerClassName,
  className,
  videoId,
  timestamp
}) => {
  const youTubeVideo = useRef();

  useEffect(() => {
    const jumpToTimestamp = async () => {
      if (timestamp === undefined || timestamp.seconds === undefined) return;
      const { seconds } = timestamp;
      const player = youTubeVideo.current.getInternalPlayer();
      player.seekTo(seconds);
      player.playVideo();
    };
    jumpToTimestamp();
  }, [timestamp]);

  return (
    <div key={videoId}>
      <YouTube
        containerClassName={cn(css.container, containerClassName)}
        className={cn(css.video, className)}
        ref={youTubeVideo}
        videoId={videoId}
        opts={{ playerVars: { autoplay: 0, rel: 0 } }}
      />
    </div>
  );
};

export default memo(YouTubeVideo);
