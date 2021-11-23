import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';

import { Heading1, Heading4 } from '../components/Heading';
import Button from '../components/Button';
import Spacer from '../components/Spacer';
import VideoCard, { VideoCardList } from '../components/VideoCard';

// svg
import Train from '../images/train.svg';
import Github from '../images/github.svg';
import Twitter from '../images/twitter.svg';

import { useImages } from '../hooks';

import * as css from '../styles/pages/about.module.css';

// data
import collaborators from '../../content/collaborators.json';

const AboutPage = ({ data }) => {
  const talks = data.talks.nodes;
  const hasMoreTalks = data.talks.hasNextPage;
  const images = useImages(data.images.nodes);

  return (
    <Layout>
      <div className={css.row}>
        <Heading1 className={css.mainHeading} variant="purple">
          Hi I'm Dan!
        </Heading1>
        <div className={css.train}>
          <Train className={css.trainIcon} />
        </div>
      </div>
      <div className={css.aboutRow}>
        <div className={css.aboutBlock}>
          <div className={css.danIntro}>
            <p>
              This is a space where Dan introduces himself - who he is, what
              he’s about
            </p>
            <p>
              Why Dan created the Coding Train. What’s the purpose of it, what
              does he want it to do?
            </p>
            <p>
              And then a section where he talks about the books he’s written and
              anything else he wants people to know ......
            </p>
          </div>
          <div className={css.links}>
            <div className={css.socialRow}>
              <a
                href="https://twitter.com/shiffman"
                className={css.socialLink}
                target="_blank"
                rel="noreferrer">
                <Twitter className={css.socialIcon} />
                Follow on Twitter
              </a>
              <a
                href="https://twitter.com/shiffman"
                className={css.socialLink}
                target="_blank"
                rel="noreferrer">
                <Github className={css.socialIcon} />
                Follow on Github
              </a>
            </div>
            <div className={css.websiteRow}>
              <Button
                className={css.websiteButton}
                target="_blank"
                rel="noreferrer"
                href={'https://shiffmann.net'}
                variant="purple">
                Visit my website
              </Button>
            </div>
          </div>
        </div>
        <div className={css.photoBlock}>
          <img
            src={'https://shiffman.net/images/shiffman_rainbow.png'}
            alt="Daniel Shiffman"
          />
        </div>
      </div>
      <Spacer pattern />
      <div id="talks">
        <Heading4 variant="purple" borderBottom={false}>
          Talks
        </Heading4>
        <VideoCardList>
          {talks.map((talk, index) => (
            <VideoCard
              key={index}
              variant="purple"
              {...talk}
              image={images[talk.slug]}
            />
          ))}
        </VideoCardList>
        {hasMoreTalks && (
          <div className={css.talksCta}>
            <p>want to see more of my talks?</p>
            <Button variant="purple" to="/talks" className={css.talksButton}>
              View Talks
            </Button>
          </div>
        )}
      </div>
      <Spacer pattern />
      <div id="acknowledgements">
        <Heading4 variant="purple">Acknowledgements</Heading4>
        <div className={css.acknowledgementsText}>
          <p>
            The Coding Train is possible thanks to the help and contributions of
            many people.
          </p>
        </div>
        <div className={css.acknowledgementsList}>
          <div className={css.acknowledgementsTeam}>
            <h4>Coding Train Team</h4>
            <ul>
              {collaborators.team.map((person, index) => (
                <li key={index}>
                  <a target="_blank" rel="noreferrer" href={person.url}>
                    {person.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={css.acknowledgementsContributors}>
            <h4>Contributors</h4>
            <ul>
              {collaborators.contributors.map((person, index) => (
                <li key={index}>
                  <a target="_blank" rel="noreferrer" href={person.url}>
                    {person.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    talks: allTalk(limit: 4) {
      pageInfo {
        hasNextPage
      }
      nodes {
        title
        slug
        description
        meta
        link
      }
    }
    images: allFile(
      filter: {
        sourceInstanceName: { eq: "talks" }
        extension: { in: ["jpg", "png"] }
      }
    ) {
      nodes {
        name
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  }
`;

export default AboutPage;
