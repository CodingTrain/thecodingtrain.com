import * as React from 'react';
import { Link, graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import { Heading1, Heading2 } from '../components/Heading';
import ButtonPanel from '../components/ButtonPanel';
import Spacer from '../components/Spacer';
import Image from '../components/Image';

import Train from '../images/train.svg';
import TriangleCharacter from '../images/characters/Triangle_6.mini.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_2.mini.svg';
import SquareCharacter from '../images/characters/Square_4.mini.svg';
import SemiColonCharacter from '../images/characters/SemiColon_1.mini.svg';

import * as css from '../styles/pages/index.module.css';
import Button from '../components/Button';

const TrackCard = ({ track, placeholderImage }) => {
  const { title, cover, date, numVideos, slug } = track;
  return (
    <div className={cn(css.card, css.trackCard)}>
      <div className={css.details}>
        <div className={css.icon}>👁</div>

        <h3 className={css.smallTitle}>
          <Link to={`tracks/${slug}`}>{title}</Link>
        </h3>

        <div className={css.numVideos}>{numVideos} videos</div>
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
        />
      </Link>

      <p className={css.date}>{date ? date.substring(0, 4) : ''}</p>
    </div>
  );
};

const ChallengeCard = ({ challenge, placeholderImage }) => {
  const { title, cover, date, slug } = challenge;
  return (
    <div className={cn(css.card, css.challengeCard)}>
      <div className={css.details}>
        <div className={css.icon}>👁</div>

        <h3 className={css.smallTitle}>
          <Link to={`tracks/${slug}`}>{title}</Link>
        </h3>
      </div>
      <Link to={`challenge/${slug}`}>
        <Image
          image={
            cover
              ? cover.file.childImageSharp.gatsbyImageData
              : placeholderImage
          }
          pictureClassName={css.picture}
          imgClassName={css.image}
        />
      </Link>

      <p className={css.date}>{date ? date.substring(0, 4) : ''}</p>
    </div>
  );
};

const EventRow = ({ event }) => {
  const { title, description, date, time, host, type, url } = event;
  return (
    <div className={css.event}>
      <div className={css.left}>
        <h2>{title}</h2>
      </div>
      <div className={css.center}>
        <p>
          <span className={css.icon}>🗒</span>
          <span>
            {date}, {time}
          </span>
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
          <Button href={url} variant="pink">
            GO
          </Button>
        </div>
      </div>
    </div>
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
  return (
    <Layout>
      <div className={css.root}>
        <Spacer background="white" />
        <div className={css.header}>
          <Heading1 className={css.heading} variant="pink">
            {content.header.title}
          </Heading1>
          <p>{content.header.description}</p>
          <Train className={css.train} />
        </div>
        <Spacer pattern size="x2" />
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
            />
            <ButtonPanel
              className={css.baselineButtonPanel}
              variant="orange"
              text={content.newToCoding.discordCta.text}
              buttonText={content.newToCoding.discordCta.buttonText}
              buttonLink={content.newToCoding.discordCta.href}
              smallWrap
            />
          </div>
        </div>
        <Spacer pattern size="x2" />
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
        <Spacer pattern size="x2" />
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
        />
        <Spacer pattern />
        <div className={css.challenges}>
          {content.challenges.featured.map((challenge, index) => (
            <React.Fragment key={index}>
              <ChallengeCard
                challenge={challenge}
                placeholderImage={challengesPlaceholder}
              />
              {index % 3 !== 2 && (
                <div
                  className={cn(css.horizontalSpacer, {
                    [css.lastSpacer]:
                      index === content.challenges.featured.length - 1
                  })}
                />
              )}
              {index % 3 !== 2 &&
                index !== content.challenges.featured.length - 1 && (
                  <Spacer
                    className={cn(css.verticalSpacer, css.mobileSpacer)}
                    pattern
                  />
                )}
              {index % 3 === 2 &&
                index !== content.challenges.featured.length - 1 && (
                  <Spacer className={css.verticalSpacer} pattern />
                )}
            </React.Fragment>
          ))}
        </div>

        <Spacer pattern size="x2" />

        <div className={css.showcase}>
          <div className={css.left}>
            <Heading2
              id="passenger-showcase"
              className={css.subheading}
              variant="purple"
              as="h3">
              {content.passengerShowcase.title}
            </Heading2>
            <div className={css.details}>
              <p>
                {content.passengerShowcase.featured.author.url ? (
                  <a href={content.passengerShowcase.featured.author.url}>
                    {content.passengerShowcase.featured.author.name}
                  </a>
                ) : (
                  content.passengerShowcase.featured.author.name
                )}
              </p>
              <p>{content.passengerShowcase.featured.title}</p>
              <p>
                {content.passengerShowcase.featured.video.title} (
                {content.passengerShowcase.featured.video.source})
              </p>
            </div>
            <ButtonPanel
              variant="purple"
              className={css.baselineButtonPanel}
              text={content.passengerShowcase.cta.text}
              buttonText={content.passengerShowcase.cta.buttonText}
              buttonLink={
                content.passengerShowcase.featured.url ??
                (content.passengerShowcase.featured.videoId
                  ? `https://youtu.be/${content.passengerShowcase.featured.videoId}`
                  : content.passengerShowcase.featured.source)
              }
              smallWrap
            />
          </div>
          <div className={css.right}>
            <Image
              image={
                content.passengerShowcase.featured.cover
                  ? content.passengerShowcase.featured.cover.file
                      .childImageSharp.gatsbyImageData
                  : challengesPlaceholder
              }
              pictureClassName={css.picture}
              imgClassName={css.image}
            />
          </div>
        </div>

        <Spacer pattern size="x2" />
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
          <span></span>
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

        <Spacer pattern size="x2" />

        <Heading2 className={css.subheading} variant="orange" as="h3">
          {content.support.title}
        </Heading2>
        <div className={css.support}>
          <div className={css.left}>
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
              />
            ))}
          </div>
        </div>

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
        cta {
          text
          buttonText
        }
        featured {
          title
          url
          videoId
          source
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
