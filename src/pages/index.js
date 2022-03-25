import * as React from 'react';
import { Link, graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import { Heading1, Heading2, Heading3 } from '../components/Heading';
import ButtonPanel from '../components/ButtonPanel';
import Spacer from '../components/Spacer';
import Image from '../components/Image';

import Train from '../images/train.svg';
import TriangleCharacter from '../images/characters/Triangle_6.mini.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_2.mini.svg';
import SquareCharacter from '../images/characters/Square_4.mini.svg';
import SemiColonCharacter from '../images/characters/SemiColon_1.mini.svg';

import * as css from '../styles/pages/index.module.css';

const TrackCard = ({ track, placeholderImage }) => {
  const { title, cover, type, numVideos, slug } = track;
  return (
    <div className={css.trackCard}>
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

      <p className={css.trackType}>{type} track</p>
    </div>
  );
};

const IndexPage = ({ data }) => {
  const { content } = data;
  const placeholderMainTrackImage =
    data.placeholderMainTrackImage.nodes[0].childImageSharp.gatsbyImageData;
  const placeholderSideTrackImage =
    data.placeholderSideTrackImage.nodes[0].childImageSharp.gatsbyImageData;
  console.log({ content });
  return (
    <Layout>
      <div className={css.root}>
        <p className={css.routesLink}>
          <Link to="/routes">Go to routes page</Link>
        </p>
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
        {/* {content.challenges.featured.map((t, index) => (
          <p key={index}>{t.title}</p>
        ))} */}
        <Spacer pattern size="x2" />
        <Heading2 className={css.subheading} variant="purple" as="h3">
          {content.passengerShowcase.title}
        </Heading2>
        <ButtonPanel
          variant="purple"
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
        <p>{content.passengerShowcase.featured.title}</p>
        <Spacer pattern size="x2" />
        <div className={css.subheader}>
          <Heading2 className={css.subheading} variant="pink" as="h1">
            Events
          </Heading2>
          <div className={css.character}>
            <SemiColonCharacter />
          </div>
        </div>

        <Spacer pattern size="x2" />
        <Heading2 className={css.subheading} variant="orange" as="h3">
          SUPPORT
        </Heading2>
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
        description
      }
      support {
        title
        description
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
  }
`;

export default IndexPage;
