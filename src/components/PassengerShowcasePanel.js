import React, { Fragment, memo, useEffect, useState } from 'react';

import ButtonPanel from './ButtonPanel';
import Image from './Image';

import * as css from './PassengerShowcasePanel.module.css';

import PlayButton from '../images/playbutton.svg';
import { shuffleCopy, useIsFirstRender } from '../utils';

const PassengerShowcasePanel = ({
  contributions,
  placeholderImage,
  headerType = 'h2'
}) => {
  // First render : as many empty contributions as there are challenges
  const [shuffledContribs, setShuffledContribs] = useState(() =>
    contributions.map(() => ({}))
  );
  useEffect(() => {
    // Next renders : shuffled contributions on client side hydration
    setShuffledContribs(shuffleCopy(contributions));
  }, [contributions]);
  const isFirstRender = useIsFirstRender();
  const description =
    contributions.length > 0
      ? 'What the Coding Train community has created based on this video'
      : 'No contributions submitted yet!';
  const Header = headerType;
  return (
    <section className={css.root}>
      <div className={css.titleBox}>
        <Header>Passenger Showcase</Header>
        <p>{description}</p>
      </div>
      <div className={css.contributions}>
        {shuffledContribs.map((contrib, key) => (
          <Fragment key={key}>
            <Contribution
              contribution={contrib}
              placeholderImage={isFirstRender ? null : placeholderImage}
            />
            <div className={css.spacer}></div>
          </Fragment>
        ))}
      </div>

      <ButtonPanel
        text="Have you completed a project? Share your work!"
        buttonText="Submit a contribution"
        buttonLink="/guides/passenger-showcase-guide"
        variant="purple"
        rainbow
        className={css.showcasePanel}
        smallWrap={true}
      />
    </section>
  );
};

const Contribution = ({
  contribution,
  placeholderImage,
  headerType = 'h3'
}) => {
  const { title, cover, author } = contribution;
  const image = cover
    ? contribution.cover.file.childImageSharp.gatsbyImageData
    : placeholderImage;
  const url =
    contribution.url ??
    (contribution.videoId
      ? `https://youtu.be/${contribution.videoId}`
      : contribution.source);
  const Header = headerType;
  return (
    <article className={css.contrib}>
      <a className={css.title} href={url} target="_blank" rel="noreferrer">
        <Header title={title?.length > 30 ? title : null}>{title}</Header>
      </a>
      <a
        className={css.pictureContainer}
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label={title}>
        {image ? (
          <Image image={image} imgClassName={css.image} alt={title} />
        ) : (
          <div className={css.noImage} />
        )}
        <PlayButton width={30} className={css.playButton} />
      </a>
      <address className={css.author}>
        {author && <span>by </span>}
        {author?.url ? (
          <a
            href={author.url}
            target="_blank"
            rel="noreferrer"
            className={css.authorName}>
            {author?.name}
          </a>
        ) : author?.name ? (
          <span className={css.authorName}>{author.name}</span>
        ) : null}
      </address>
    </article>
  );
};

export default memo(PassengerShowcasePanel);
