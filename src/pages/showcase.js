import React, { Fragment } from 'react';
import { graphql, Link } from 'gatsby';

import Image from '../components/Image';
import PassengerShowcaseList from '../components/PassengerShowcaseList';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';
import ButtonPanel from '../components/ButtonPanel';
import HomepageScene from '../components/HomepageScene';
import Spacer from '../components/Spacer';
import PagePanel from '../components/PagePanel';
import CharacterSpacer from '../components/CharacterSpacer';

import TriangleCharacter from '../images/characters/Triangle_6.mini.svg';
import DotCharacter from '../images/characters/ThisDot_5.mini.svg';
import DotCharacter2 from '../images/characters/ThisDot_6.mini.svg';
import MouseCharacter from '../images/characters/WheelstheMouse_3.mini.svg';
import SquareCharacter from '../images/characters/Square_4.mini.svg';
import SemiColonCharacter from '../images/characters/SemiColon_1.mini.svg';

import PlayButton from '../images/playbutton.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_4.mini.svg';
import BracketsCharacter2 from '../images/characters/SquareBrackets_2.mini.svg';
import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';

import { getReadableDate } from '../hooks';

import * as css from '../styles/pages/showcase.module.css';

const ShowcasePage = ({ data, pageContext, location }) => {
  const contributions = data.contributions.nodes;
  const content = data.content;
  const pageData = null;

  const contributionsPlaceholder = data.contributions.nodes.cover
    ? data.challengePlaceholderImage.childImageSharp.gatsbyImageData
    : null;

  return (

    <Layout 
      title="Passenger Showcase"
      description="All of the contributions our community has submitted!"
      image={contributionsPlaceholder}>
      <Spacer />
      <header className={css.header}>
        <Heading1 className={css.heading} variant="purple">
          Showcase
        </Heading1>
        <div className={css.character}>{<DotCharacter />}</div>
      </header>
      <PagePanel
        text="Share your work!"
        buttonText="Submit a contribution"
        buttonLink="/guides/passenger-showcase-guide"
		description="All the contributions the Coding Train community has submitted!"
        variant="orange"
        rainbow
        className={css.showcasePanel}
        smallWrap={true}
      />

      <CharacterSpacer
        className={css.sep}
        variant="purple"
        size="x2"
        side="right"
        offset={0.75}
        characterSize={1.1}
        Character={DotCharacter2}
      />

      <Spacer className={css.spacer} />
			<PassengerShowcaseList
				contributions={contributions}
				placeholderImage={contributionsPlaceholder}
			/>
	  </Layout>
  );
};

export const query = graphql`
query MyQuery {
 	  contributions: allContribution(sort: {order: DESC, fields: video___date}) {
     	nodes {
 		  title
		  author {
			name
			url
		  }
		  source
		  submittedOn
		  url
		  video {
			title
			slug
            source
		  }
		  cover {
			file {
				childImageSharp {
					gatsbyImageData
					
				}
			}
      }
    }
  }
}
`;

export default ShowcasePage;
