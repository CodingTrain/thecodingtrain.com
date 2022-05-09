import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import CharacterSpacer from '../components/CharacterSpacer';
import { Heading1 } from '../components/Heading';
import Spacer from '../components/Spacer';
import Question from '../components/Question';

import { useLinkParsedText } from '../hooks';

import BracketsCharacter1 from '../images/characters/CurlyBrackets_3.mini.svg';
import BracketsCharacter2 from '../images/characters/CurlyBrackets_2.mini.svg';
import BracketsCharacter3 from '../images/characters/CurlyBrackets_1.mini.svg';
import BracketsCharacter4 from '../images/characters/CurlyBrackets_4.mini.svg';

import * as css from '../styles/pages/faq.module.css';

const FAQPage = ({ data, location }) => {
  const { title, description, sections } = data.page.nodes[0];
  const currentHash = location.hash;
  const parsedDescription = useLinkParsedText(description);
  return (
    <Layout>
      <Spacer />
      <header className={css.header}>
        <Heading1 className={css.heading} variant="pink">
          {title}
        </Heading1>
        <div className={css.character}>
          <BracketsCharacter1 />
        </div>
      </header>
      <div className={css.description}>{parsedDescription}</div>
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
              <h2 className={css.title}>{section.title}</h2>
              {section.questions.map(
                (question, index) =>
                  console.log({ question }) || (
                    <Question
                      key={index}
                      variant="pink"
                      pathPrefix="faq"
                      currentHash={currentHash}
                      {...question}
                    />
                  )
              )}
            </div>
            <Spacer className={css.spacer} pattern />
            <CharacterSpacer
              className={css.sep}
              variant={sectionIndex !== sections.length - 1 ? 'pink' : null}
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
    page: allFaqPage {
      nodes {
        title
        description
        sections {
          title
          questions {
            slug
            question
            answer {
              text
              list
              video {
                id
                list
              }
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
