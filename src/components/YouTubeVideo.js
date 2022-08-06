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
  listId,
  timestamp
}) => {
  const youTubeVideo = useRef();

  const opts = { playerVars: { autoplay: 0, rel: 0 } };
  if (listId) {
    opts.playerVars.listType = 'playlist';
    opts.playerVars.list = listId;
  }

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

  const didMount = useRef(false)
  useEffect(() => {
    if (didMount.current) {
      const player = youTubeVideo.current.getInternalPlayer();
      player.loadVideoById({ videoId });
      player.seekTo(0); 
    } else {
      didMount.current = true;
    }
  }, [videoId]);

  return (
    <div key={videoId}>
      <YouTube
        containerClassName={cn(css.container, containerClassName)}
        className={cn(css.video, className)}
        ref={youTubeVideo}
        videoId={videoId}
        opts={opts}
      />
    </div>
  );
};

export default memo(YouTubeVideo);
