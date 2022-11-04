import React, { Fragment } from 'react';
import { graphql, Link } from 'gatsby';

import Image from '../components/Image';
import PassengerShowcasePanel from '../components/PassengerShowcasePanel';

import Layout from '../components/Layout';

import PlayButton from '../images/playbutton.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_4.mini.svg';
import BracketsCharacter2 from '../images/characters/SquareBrackets_2.mini.svg';
import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';

import { getReadableDate } from '../hooks';

import * as css from '../styles/pages/showcase.module.css';

const ShowcasePage = ({ data, pageContext, location }) => {
  const contributions = data.contributions.nodes;

  const contributionsPlaceholder = data.contributions.nodes.cover
    ? data.challengePlaceholderImage.childImageSharp.gatsbyImageData
    : null;

  return (

    <Layout
      title="Passenger Showcase"
      description="All of the contributions our community has submitted!"
      image={contributionsPlaceholder}>
			<PassengerShowcasePanel
				contributions={contributions}
				placeholderImage={contributionsPlaceholder}
			/>
	  </Layout>
  );
};

export const query = graphql`
query MyQuery {
contributions: allContribution {
    nodes {
      title
      source
      submittedOn
      url
      video {
        title
        slug
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
