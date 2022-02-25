import React, { Fragment, memo } from 'react';

import ButtonPanel from './ButtonPanel';
import Image from './Image';

import * as css from './ContributionsPanel.module.css';

import PlayButton from '../images/playbutton.svg';

const ContributionsPanel = ({ contributions, placeholderImage }) => {
  const description =
    contributions.length > 0
      ? 'What the Coding Train community has created based on this video'
      : 'No contributions submitted yet!';
  return (
    <div className={css.root}>
      <div className={css.titleBox}>
        <h4>Passenger Showcase</h4>
        <p>{description}</p>
      </div>
      <div className={css.contributions}>
        {contributions.map((contrib, key) => (
          <Fragment key={key}>
            <Contribution
              contribution={contrib}
              placeholderImage={placeholderImage}
            />
            <div className={css.spacer}></div>
          </Fragment>
        ))}
      </div>
      <ButtonPanel
        text="Have you completed a project? Share your work!"
        buttonText="Submit a contribution"
        buttonLink=""
        variant="purple"
        className={css.contribsPanel}
        smallWrap={true}
      />
    </div>
  );
};

const Contribution = ({ contribution, placeholderImage }) => {
  const { title, cover, author } = contribution;
  const image = cover
    ? contribution.cover.file.childImageSharp.gatsbyImageData
    : placeholderImage;
  const url =
    contribution.url ??
    (contribution.videoId
      ? `https://youtu.be/${contribution.videoId}`
      : contribution.source);
  return (
    <div className={css.contrib}>
      <a className={css.title} href={url} target="_blank" rel="noreferrer">
        {title}
      </a>
      <a
        className={css.pictureContainer}
        href={url}
        target="_blank"
        rel="noreferrer">
        {image ? (
          <Image image={image} imgClassName={css.image} />
        ) : (
          <div className={css.noImage} />
        )}
        <PlayButton width={30} className={css.playButton} />
      </a>
      <p className={css.author}>
        <span>by </span>
        {author.url ? (
          <a
            href={author.url}
            target="_blank"
            rel="noreferrer"
            className={css.authorName}>
            {author.name}
          </a>
        ) : (
          <span className={css.authorName}>{author.name}</span>
        )}
      </p>
    </div>
  );
};

export default memo(ContributionsPanel);
