import React, { useEffect, useState } from 'react';
import { Link, graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import { Heading2 } from '../components/Heading';
import ButtonPanel from '../components/ButtonPanel';
import HomepageScene from '../components/HomepageScene';
import Spacer from '../components/Spacer';
import Image from '../components/Image';

import TriangleCharacter from '../images/characters/Triangle_6.mini.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_2.mini.svg';
import SquareCharacter from '../images/characters/Square_4.mini.svg';
import SemiColonCharacter from '../images/characters/SemiColon_1.mini.svg';

import * as css from '../styles/pages/index.module.css';
import Button from '../components/Button';
import PlayButton from '../images/playbutton.svg';
import { getReadableDate, useIsFirstRender } from '../hooks';
import { shuffleCopy } from '../utils';

const TrackCard = ({ track, placeholderImage }) => {
  const { title, cover, date, numVideos, slug } = track;
  return (
    <article className={cn(css.card, css.trackCard)}>
      <div className={css.details}>
        <div className={css.icon}>👁</div>

        <h3 className={css.smallTitle}>
          <Link to={`tracks/${slug}`}>{title}</Link>
        </h3>

        <div className={css.numVideos}>
          {numVideos} video{numVideos > 1 ? 's' : ''}
        </div>
      </div>
      <Link to={`tracks/${slug}`}>
        <Image
          image={
            cover
              ? cover.file.childImageSharp.gatsbyImageData
              : placeholderImage
          }
          pictureClassName={css.picture}
          imgClassName={css.image}
          alt={`"${title}" track`}
        />
      </Link>

      <p className={css.date}>
        {date ? <time dateTime={date}> {getReadableDate(date)}</time> : ''}
      </p>
    </article>
  );
};

const ChallengeCard = ({ challenge, placeholderImage }) => {
  const { title, cover, date, slug, videoNumber } = challenge;
  const image = cover
    ? cover.file.childImageSharp.gatsbyImageData
    : placeholderImage;
  return (
    <article className={cn(css.card, css.challengeCard)}>
      <div className={css.details}>
        <div className={css.icon}>👁</div>

        <h3 className={css.smallTitle}>
          <Link to={`challenges/${slug}`}>
            {videoNumber ? `#${videoNumber} — ` : ''} {title}
          </Link>
        </h3>
      </div>
      <Link to={`challenges/${slug}`}>
        {image ? (
          <Image
            image={image}
            pictureClassName={css.picture}
            imgClassName={css.image}
            alt={`"${title}" coding challenge`}
          />
        ) : (
          <div className={css.noImage} />
        )}
      </Link>

      <p className={css.date}>
        {date ? <time dateTime={date}> {getReadableDate(date)}</time> : ''}
      </p>
    </article>
  );
};

const PassengerShowcaseCard = ({ showcase, placeholderImage, cta }) => {
  const { author, title, video, url } = showcase;
  const image = showcase?.cover
    ? showcase.cover.file.childImageSharp.gatsbyImageData
    : placeholderImage;
  const buttonLink = url ?? '';
  const description = `Passenger showcase "${title}" from ${author?.name}`;

  return (
    <article className={css.showcase}>
      <div className={css.left}>
        <div className={css.details}>
          <p className={css.videoTitle}>
            {video?.title} {video?.source && `(${video.source})`}
          </p>
          <p className={css.showcaseTitle}>{title}</p>
        </div>
        <address className={css.author}>
          {author && <span>by </span>}
          {author && (
            <span className={css.authorName}>
              {author.url ? (
                <a href={author.url}>{author.name}</a>
              ) : (
                author.name
              )}
            </span>
          )}
        </address>
      </div>
      <a
        className={css.right}
        href={buttonLink}
        target="_blank"
        rel="noreferrer"
        aria-label={description}>
        {image ? (
          <Image
            image={image}
            pictureClassName={css.picture}
            imgClassName={css.image}
            alt={description}
          />
        ) : (
          <div className={css.noImage}></div>
        )}
        <PlayButton width={30} className={css.playButton} />
      </a>
    </article>
  );
};

const PassengerShowcaseSection = ({ passengerShowcase, placeholderImage }) => {
  const { title: sectionTitle, showcaseCta, featured } = passengerShowcase;
  // First render : empty placeholder
  const [featuredShowcases, setFeaturedShowcases] = useState([{}, {}, {}]);
  useEffect(() => {
    // Next renders : a random passenger showcase
    setFeaturedShowcases(shuffleCopy(featured).slice(0, 3));
  }, [featured]);

  return (
    <section id="passenger-showcase">
      <div className={css.subheader}>
        <Heading2 className={css.subheading} variant="purple">
          {sectionTitle}
        </Heading2>
      </div>
      <ButtonPanel
        className={css.showcaseBanner}
        variant="purple"
        text={showcaseCta.text}
        buttonText={showcaseCta.buttonText}
        buttonLink={showcaseCta.href}
        smallWrap
        rainbow
      />
      <Spacer className={css.verticalSpacer} pattern />
      {featuredShowcases.map((showcase, index) => (
        <React.Fragment key={index}>
          <PassengerShowcaseCard
            showcase={showcase}
            placeholderImage={placeholderImage}
            cta={showcaseCta}
          />
          {index < 2 && <Spacer className={css.verticalSpacer} pattern />}
        </React.Fragment>
      ))}
    </section>
  );
};

const EventRow = ({ event }) => {
  const { title, description, date, time, host, type, url } = event;
  return (
    <article className={css.event}>
      <div className={css.left}>
        <h3>{title}</h3>
      </div>
      <div className={css.center}>
        <p>
          <span className={css.icon}>🗒</span>
          <time dateTime={`${date} ${time}`}>
            {date}, {time}
          </time>
        </p>
        <p>
          <span className={css.icon}>🙋</span>
          <span>{host}</span>
        </p>
        <p>
          <span className={css.icon}>💻</span>
          <span>{type}</span>
        </p>
      </div>
      <div className={css.right}>
        <div className={css.eventDescription}>
          <p>{description}</p>
        </div>
        <div className={css.eventButton}>
          <Button href={url} variant="pink" rainbow>
            GO TO EVENT
          </Button>
        </div>
      </div>
    </article>
  );
};

const IndexPage = ({ data }) => {
  const { content } = data;
  const placeholderMainTrackImage =
    data.placeholderMainTrackImage.nodes[0].childImageSharp.gatsbyImageData;
  const placeholderSideTrackImage =
    data.placeholderSideTrackImage.nodes[0].childImageSharp.gatsbyImageData;
  const challengesPlaceholder =
    data.challengePlaceholderImage.nodes.length > 0
      ? data.challengePlaceholderImage.nodes[0].childImageSharp.gatsbyImageData
      : null;
  // First render : empty placeholders
  const [featuredChallenges, setFeaturedChallenges] = useState([{}, {}, {}]);
  // Next renders : 3 random challenges on client side hydration
  useEffect(() => {
    setFeaturedChallenges(shuffleCopy(content.challenges.featured).slice(0, 3));
  }, [content.challenges.featured]);

  const isFirstRender = useIsFirstRender();
  return (
    <Layout>
      <div className={css.root}>
        <Spacer background="var(--background-color)" />

        <HomepageScene
          title={content.header.title}
          description={content.header.description}
        />

        <Spacer pattern size="x2" />

        <section>
          <div className={css.subheader}>
            <Heading2 className={css.subheading} variant="orange" as="h1">
              {content.newToCoding.title}
            </Heading2>
            <div className={css.character}>
              <TriangleCharacter />
            </div>
          </div>

          <div className={css.newToCoding}>
            <div className={css.left}>
              <p>{content.newToCoding.description}</p>
            </div>
            <div className={css.right}>
              <ButtonPanel
                className={css.baselineButtonPanel}
                variant="orange"
                text={content.newToCoding.guideCta.text}
                buttonText={content.newToCoding.guideCta.buttonText}
                buttonLink={content.newToCoding.guideCta.href}
                smallWrap
                rainbow
              />
              <ButtonPanel
                className={css.baselineButtonPanel}
                variant="orange"
                text={content.newToCoding.discordCta.text}
                buttonText={content.newToCoding.discordCta.buttonText}
                buttonLink={content.newToCoding.discordCta.href}
                smallWrap
                rainbow
              />
            </div>
          </div>
        </section>

        <Spacer pattern size="x2" />

        <section>
          <div className={css.subheader}>
            <Heading2 className={css.subheading} variant="red" as="h1">
              {content.tracks.title}
            </Heading2>
            <div className={css.character}>
              <SquareCharacter />
            </div>
          </div>
          <div className={css.descriptionBlock}>
            <p>{content.tracks.description}</p>
          </div>
          <ButtonPanel
            className={css.baselineButtonPanel}
            variant="red"
            text={content.tracks.tracksCta.text}
            buttonText={content.tracks.tracksCta.buttonText}
            buttonLink={content.tracks.tracksCta.href}
            smallWrap
            rainbow
          />

          <Spacer pattern />
          <div className={css.tracks}>
            {content.tracks.featured.map((track, index) => (
              <React.Fragment key={index}>
                <TrackCard
                  track={track}
                  placeholderImage={
                    track.type === 'main'
                      ? placeholderMainTrackImage
                      : placeholderSideTrackImage
                  }
                />
                {index % 2 === 0 && (
                  <div
                    className={cn(css.horizontalSpacer, {
                      [css.lastSpacer]:
                        index === content.tracks.featured.length - 1
                    })}
                  />
                )}
                {index % 2 === 0 &&
                  index !== content.tracks.featured.length - 1 && (
                    <Spacer
                      className={cn(css.verticalSpacer, css.mobileSpacer)}
                      pattern
                    />
                  )}
                {index % 2 === 1 &&
                  index !== content.tracks.featured.length - 1 && (
                    <Spacer className={css.verticalSpacer} pattern />
                  )}
              </React.Fragment>
            ))}
          </div>
        </section>

        <Spacer pattern size="x2" />

        <section>
          <div className={css.subheader}>
            <Heading2 className={css.subheading} variant="cyan" as="h1">
              {content.challenges.title}
            </Heading2>
            <div className={css.character}>
              <BracketsCharacter />
            </div>
          </div>
          <div className={css.descriptionBlock}>
            <p>{content.challenges.description}</p>
          </div>
          <ButtonPanel
            className={css.baselineButtonPanel}
            variant="cyan"
            text={content.challenges.challengesCta.text}
            buttonText={content.challenges.challengesCta.buttonText}
            buttonLink={content.challenges.challengesCta.href}
            smallWrap
            rainbow
          />
          <Spacer pattern />
          <div className={css.challenges}>
            {featuredChallenges.map((challenge, index) => (
              <React.Fragment key={index}>
                <ChallengeCard
                  challenge={challenge}
                  placeholderImage={
                    isFirstRender ? null : challengesPlaceholder
                  }
                />
                {index % 3 !== 2 && (
                  <div
                    className={cn(css.horizontalSpacer, {
                      [css.lastSpacer]: index === featuredChallenges.length - 1
                    })}
                  />
                )}
                {index % 3 !== 2 && index !== featuredChallenges.length - 1 && (
                  <Spacer
                    className={cn(css.verticalSpacer, css.mobileSpacer)}
                    pattern
                  />
                )}
                {index % 3 === 2 && index !== featuredChallenges.length - 1 && (
                  <Spacer className={css.verticalSpacer} pattern />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        <Spacer pattern size="x2" />

        <PassengerShowcaseSection
          passengerShowcase={content.passengerShowcase}
          placeholderImage={isFirstRender ? null : challengesPlaceholder}
        />

        <Spacer pattern size="x2" />

        <section>
          <div className={css.subheader}>
            <Heading2 className={css.subheading} variant="pink" as="h1">
              {content.events.title}
            </Heading2>
            <div className={css.character}>
              <SemiColonCharacter />
            </div>
          </div>
          <p className={css.eventsBanner}>
            <span>
              {content.events.upcoming.length > 0
                ? content.events.comingEventsDescription
                : content.events.noEventsDescription}
            </span>
          </p>
          {content.events.upcoming.length > 0 && (
            <>
              {content.events.upcoming.map((event, index) => (
                <React.Fragment key={index}>
                  <EventRow event={event} />
                  {index !== content.events.upcoming.length - 1 && (
                    <Spacer pattern />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </section>

        <Spacer pattern size="x2" />
        <section>
          <div className={css.support}>
            <div className={css.left}>
              <div className={css.subheader}>
                <Heading2 className={css.subheading} variant="orange">
                  {content.support.title}
                </Heading2>
              </div>

              <div className={css.descriptionBlock}>
                <p>{content.support.description}</p>
              </div>
            </div>
            <div className={css.right}>
              {content.support.options.map((o, index) => (
                <ButtonPanel
                  key={index}
                  className={css.baselineButtonPanel}
                  text={o.text}
                  buttonText={o.buttonText}
                  buttonLink={o.href}
                  variant="orange"
                  smallWrap
                  rainbow
                />
              ))}
            </div>
          </div>
        </section>

        <Spacer pattern size="x2" />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    content: homepageInfo {
      id
      header {
        title
        description
      }
      newToCoding {
        title
        description
        guideCta {
          buttonText
          text
          href
        }
        discordCta {
          buttonText
          text
          href
        }
      }
      tracks {
        title
        description
        tracksCta {
          text
          buttonText
          href
        }
        featured {
          title
          type
          date
          numVideos
          type
          slug
          cover {
            file {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
      challenges {
        title
        description
        challengesCta {
          text
          buttonText
          href
        }
        featured {
          title
          date
          slug
          videoNumber
          cover {
            file {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
      passengerShowcase {
        title
        showcaseCta {
          text
          buttonText
          href
        }
        featured {
          title
          url
          author {
            name
            url
          }
          cover {
            file {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
          video {
            title
            slug
            source
          }
        }
      }
      events {
        title
        comingEventsDescription
        noEventsDescription
        upcoming {
          title
          description
          date
          time
          host
          type
          url
        }
      }
      support {
        title
        description
        options {
          text
          buttonText
          href
        }
      }
    }
    placeholderMainTrackImage: allFile(
      filter: {
        name: { eq: "placeholder" }
        sourceInstanceName: { eq: "main-tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    placeholderSideTrackImage: allFile(
      filter: {
        name: { eq: "placeholder" }
        sourceInstanceName: { eq: "side-tracks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
    challengePlaceholderImage: allFile(
      filter: {
        sourceInstanceName: { eq: "challenges" }
        extension: { in: ["jpg", "png"] }
        relativeDirectory: { eq: "" }
        name: { eq: "placeholder" }
      }
    ) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  }
`;

export default IndexPage;
