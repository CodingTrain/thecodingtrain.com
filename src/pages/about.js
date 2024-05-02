import * as React from 'react';
import { graphql } from 'gatsby';
import cn from 'classnames';

import Layout from '../components/Layout';
import CharacterSpacer from '../components/CharacterSpacer';
import { Heading1, Heading2 } from '../components/Heading';
import Spacer from '../components/Spacer';
import VideoCard, { VideoCardList } from '../components/VideoCard';
import Image from '../components/Image';

import { useLinkParsedText } from '../hooks';

import PiRainbow from '../images/characters/PiRainbow.mini.svg';
import TrainIcon from '../images/characters/TrainRainbow.mini.svg';
import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';
import ChooChooCharacter from '../images/characters/ChooChooBot_1.mini.svg';
import TriangleCharacter from '../images/characters/Triangle_3.mini.svg';

import {
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaYoutube,
  FaInstagram
} from 'react-icons/fa6';

import * as css from '../styles/pages/about.module.css';

const socialIcons = {
  twitter: () => <FaTwitter className={css.socialIcon} size={30} />,
  discord: () => <FaDiscord className={css.socialIcon} size={30} />,
  instagram: () => <FaInstagram className={css.socialIcon} size={30} />,
  youtube: () => <FaYoutube className={css.socialIcon} size={30} />,
  github: () => <FaGithub className={css.socialIcon} size={30} />
};

const SocialIcon = ({ site }) => {
  const Icon = Object.keys(socialIcons).includes(site)
    ? socialIcons[site]
    : socialIcons['twitter'];
  return (
    <>
      <Icon />
      <span> {site.toUpperCase()}</span>
    </>
  );
};

const SocialsSection = ({ socials }) => {
  return (
    <div className={css.links}>
      {socials.map((group, index) => (
        <nav
          className={css.socialRow}
          key={index}
          aria-labelledby={`${group.title}`}>
          <span id={group.title} className={css.socialTitleGroup}>
            {group.title}:
          </span>
          {group.links.map((link, linkIndex) => (
            <a
              href={link.url}
              className={css.socialLink}
              target="_blank"
              rel="noreferrer"
              key={linkIndex}>
              <SocialIcon site={link.site} />
            </a>
          ))}
        </nav>
      ))}
    </div>
  );
};

const AboutPage = ({ data }) => {
  const content = data.content.nodes[0];
  const {
    title,
    description,
    coversDescription,
    personalSocials,
    secondaryTitle,
    secondaryDescription,
    siteSocials,
    featuredTitle,
    featured,
    acknowledgementsText,
    acknowledgements
  } = content;

  const parsedMainDescription = useLinkParsedText(description);
  const parsedCoverDescription = useLinkParsedText(coversDescription);
  const parsedSecondaryDescription = useLinkParsedText(secondaryDescription);

  const mainCover = content.covers[0].file.childImageSharp.gatsbyImageData;
  const secondaryCover = content.covers[1].file.childImageSharp.gatsbyImageData;

  return (
    <Layout title="About" description={secondaryDescription} image={mainCover}>
      <Spacer />

      <header className={css.row}>
        <Heading1 className={css.mainHeading} variant="purple">
          {title}
        </Heading1>
        <div className={css.train}>
          <PiRainbow className={css.trainIcon} />
        </div>
      </header>

      <main>
        <div className={css.aboutRow}>
          <div className={cn(css.aboutBlock, css.primaryAboutBlock)}>
            <div className={cn(css.aboutParagraph, css.danIntro)}>
              {parsedMainDescription}
            </div>
          </div>
          <div className={cn(css.photoBlock, css.primaryPhoto)}>
            <Image image={mainCover} />
          </div>
        </div>

        <div className={css.aboutRow}>
          <div className={cn(css.photoBlock, css.secondaryPhoto)}>
            <Image image={secondaryCover} />
          </div>
          <div className={cn(css.aboutBlock, css.coverAboutBlock)}>
            <div className={cn(css.aboutParagraph, css.coverDescription)}>
              {parsedCoverDescription}
            </div>
          </div>
        </div>
        <SocialsSection socials={personalSocials} />

        <Spacer pattern className={css.spacer} />
        <CharacterSpacer
          className={css.sep}
          size="x2"
          variant="purple"
          side="right"
          offset={0.42}
          characterSize={0.7}
          Character={TrainIcon}
        />
        <section>
          <Heading2 variant="purple">{secondaryTitle}</Heading2>
          <div className={cn(css.aboutBlock, css.coverAboutBlock)}>
            <div className={cn(css.aboutParagraph, css.secondaryParagraph)}>
              {parsedSecondaryDescription}
            </div>
          </div>
          <SocialsSection socials={siteSocials} />
        </section>

        <Spacer pattern className={css.spacer} />
        <CharacterSpacer
          className={css.sep}
          size="x2"
          variant="purple"
          side="right"
          offset={0.42}
          characterSize={0.7}
          Character={RainbowCharacter}
        />

        <section>
          <Heading2
            className={css.h4LikeTitle}
            variant="purple"
            borderBottom={false}
            as="h4">
            {featuredTitle}
          </Heading2>
          <VideoCardList variant="purple">
            {featured.map((featuredItem, index) => (
              <VideoCard
                key={index}
                variant="purple"
                title={featuredItem.title}
                description={featuredItem.description}
                {...{
                  [featuredItem.url.startsWith('/') ? 'slug' : 'link']:
                    featuredItem.url
                }}
                image={
                  featuredItem.thumbnail.file.childImageSharp.gatsbyImageData
                }
              />
            ))}
          </VideoCardList>
        </section>

        <Spacer pattern className={css.spacer} />
        <CharacterSpacer
          className={css.sep}
          size="x3"
          variant="purple"
          side="right"
          offset={0.12}
          characterSize={0.9}
          Character={ChooChooCharacter}
        />

        <section id="acknowledgements">
          <Heading2 className={css.h4LikeTitle} variant="purple" as="h4">
            Acknowledgements
          </Heading2>
          <div className={css.acknowledgementsText}>
            <p>{acknowledgementsText}</p>
          </div>
          <div className={css.acknowledgementsList}>
            {acknowledgements.map((group, index) => (
              <div className={css.acknowledgementsTeam} key={index}>
                <h3>{group.name}</h3>
                <table>
                  <tbody>
                    {group.people.map((person, personIndex) => (
                      <tr key={personIndex}>
                        <td>
                          {person.url ? (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={person.url}>
                              {person.name}
                            </a>
                          ) : (
                            person.name
                          )}
                        </td>
                        {person.role && <td>{person.role}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>

        <Spacer pattern className={css.spacer} />
        <CharacterSpacer
          className={css.sep}
          size="x4"
          side="right"
          offset={0.42}
          characterSize={0.9}
          Character={TriangleCharacter}
        />
      </main>
    </Layout>
  );
};

export const query = graphql`
  query {
    content: allAboutPageInfo {
      nodes {
        title
        description
        acknowledgementsText
        covers {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        coversDescription
        secondaryTitle
        secondaryDescription
        personalSocials {
          title
          links {
            site
            url
          }
        }
        siteSocials {
          title
          links {
            site
            url
          }
        }
        featuredTitle
        featured {
          title
          description
          url
          thumbnail {
            file {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
        acknowledgementsText
        acknowledgements {
          name
          people {
            name
            url
            role
          }
        }
      }
    }
  }
`;

export default AboutPage;
