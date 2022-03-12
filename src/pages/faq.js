import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';
import Spacer from '../components/Spacer';
import Question from '../components/Question';

import BracketsCharacter1 from '../images/characters/CurlyBrackets_3.mini.svg';
import BracketsCharacter2 from '../images/characters/CurlyBrackets_2.mini.svg';
import BracketsCharacter3 from '../images/characters/CurlyBrackets_1.mini.svg';
import BracketsCharacter4 from '../images/characters/CurlyBrackets_4.mini.svg';

import * as css from '../styles/pages/faq.module.css';
import CharacterSpacer from '../components/CharacterSpacer';

const FAQPage = ({ data }) => {
  const { sections } = data.order.nodes[0];
  return (
    <Layout>
      <Spacer />
      <div className={css.header}>
        <Heading1 className={css.heading} variant="pink">
          FAQ
        </Heading1>
        <div className={css.character}>
          <BracketsCharacter1 />
        </div>
      </div>
      <div className={css.description}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>
      <CharacterSpacer
        className={css.sep}
        variant="pink"
        size="x2"
        side="left"
        offset={0.7}
        characterSize={1.2}
        Character={BracketsCharacter2}
      />
      <div className={css.sections}>
        {sections.map((section, sectionIndex) => (
          <Fragment key={sectionIndex}>
            <div>
              <h3 className={css.title}>{section.title}</h3>
              {section.questions.map((question, index) => (
                <Question key={index} variant="pink" {...question} />
              ))}
            </div>
            <CharacterSpacer
              className={css.sep}
              variant="pink"
              size={sectionIndex !== sections.length - 1 ? 'x3' : 'x4'}
              side="right"
              offset={0.4}
              characterSize={sectionIndex !== sections.length - 1 ? 1 : 1.2}
              Character={
                sectionIndex !== sections.length - 1
                  ? BracketsCharacter3
                  : BracketsCharacter4
              }
            />
          </Fragment>
        ))}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    order: allFaqOrder {
      nodes {
        sections {
          title
          questions {
            question
            answer {
              text
              list
              image {
                file {
                  childImageSharp {
                    gatsbyImageData
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default FAQPage;
