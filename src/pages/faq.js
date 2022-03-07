import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';
import Spacer from '../components/Spacer';
import Question from '../components/Question';

import Train from '../images/train.svg';

import * as css from '../styles/pages/faq.module.css';

const FAQPage = ({ data }) => {
  const { sections } = data.order.nodes[0];
  return (
    <Layout>
      <Spacer />
      <div className={css.header}>
        <Heading1 className={css.heading} variant="pink">
          FAQ
        </Heading1>
        <div className={css.train}>
          <Train />
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
      <div className={css.sections}>
        {sections.map((section, sectionIndex) => (
          <Fragment key={sectionIndex}>
            <div>
              <h3 className={css.title}>{section.title}</h3>
              {section.questions.map((question, index) => (
                <Question key={index} variant="pink" {...question} />
              ))}
            </div>
            <Spacer />
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
