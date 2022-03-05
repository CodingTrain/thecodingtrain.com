import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';
import Spacer from '../components/Spacer';
import Question from '../components/Question';

import Train from '../images/train.svg';

import * as css from '../styles/pages/faq.module.css';

const FAQPage = ({ data }) => {
  const {
    general: { nodes: general },
    tools: { nodes: tools }
  } = data;
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
      <div>
        <h3 className={css.title}>General questions</h3>
        {general.map((question, index) => (
          <Question key={index} variant="pink" {...question} />
        ))}
      </div>
      <Spacer />
      <div>
        <h3 className={css.title}>Tools</h3>
        {tools.map((question, index) => (
          <Question key={index} variant="pink" {...question} />
        ))}
      </div>
      <Spacer />
    </Layout>
  );
};

export const query = graphql`
  query {
    general: allFaq(filter: { type: { eq: "general" } }) {
      nodes {
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
    tools: allFaq(filter: { type: { eq: "tools" } }) {
      nodes {
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
`;

export default FAQPage;
