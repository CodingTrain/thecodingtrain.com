// https://github.com/tjallingt/react-youtube
// https://developers.google.com/youtube/iframe_api_reference
import React, { memo, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import cn from 'classnames';

import * as css from './YouTubeVideo.module.css';

const YouTubeVideo = ({ containerClassName, className, link, timestamp }) => {
  const linkSplit = link.split('/');
  const videoId = linkSplit[linkSplit.length - 1] ?? '';
  const youTubeVideo = useRef();

  useEffect(() => {
    const jumpToTimestamp = async () => {
      if (timestamp === undefined || !timestamp.time) return;
      const { time } = timestamp;
      const player = youTubeVideo.current.getInternalPlayer();
      const state = await player.getPlayerState();
      if (!(time === 0 && (state === -1 || state === 5))) {
        player.seekTo(time);
        player.playVideo();
      }
    };
    jumpToTimestamp();
  }, [timestamp]);

  return (
    <YouTube
      containerClassName={cn(css.container, containerClassName)}
      className={cn(css.video, className)}
      ref={youTubeVideo}
      videoId={videoId}
      opts={{ playerVars: { autoplay: 0, rel: 0 } }}
    />
  );
};

export default memo(YouTubeVideo);
