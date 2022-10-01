import React, { Fragment } from 'react';
import { graphql, Link } from 'gatsby';

import Image from '../components/Image';
import PassengerShowcasePanel from '../components/PassengerShowcasePanel';

import PlayButton from '../images/playbutton.svg';
import BracketsCharacter from '../images/characters/SquareBrackets_4.mini.svg';
import BracketsCharacter2 from '../images/characters/SquareBrackets_2.mini.svg';
import RainbowCharacter from '../images/characters/Rainbow_1.mini.svg';

import { getReadableDate } from '../hooks';

import * as css from '../styles/pages/showcase.module.css';

const ShowcasePage = ({ data, pageContext, location }) => {
  const contributions = data.contributions.nodes;

  const contributionsPlaceholder = data.contributions.cover
    ? data.challengePlaceholderImage.childImageSharp.gatsbyImageData
    : null;

  return (
	<PassengerShowcasePanel
	  contributions={contributions}
	  placeholderImage={contributionsPlaceholder}
      headerType={'h2'}
	/>
  );
};

export const query = graphql`
  query {
contributions: allContribution(limit: 50) {
      nodes {
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
      }
    }
  }
`;

export default ShowcasePage;
