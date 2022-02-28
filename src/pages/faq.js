import * as React from 'react';
import Layout from '../components/Layout';

import { Heading1 } from '../components/Heading';
import Spacer from '../components/Spacer';
import Question from '../components/Question';

import Train from '../images/train.svg';

import * as css from '../styles/pages/faq.module.css';

const FAQPage = () => {
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
        <Question
          variant="pink"
          question="I have never coded before, where can I start?"
          content="Some content here"
        />
        <Question
          variant="pink"
          question="I have never coded before, where can I start?"
          content="Some content here"
        />
      </div>
      <Spacer />
      <div>
        <h3 className={css.title}>Tools</h3>
        <Question
          variant="pink"
          question="I have never coded before, where can I start?"
          content="Some content here"
        />
        <Question
          variant="pink"
          question="I have never coded before, where can I start?"
          content="Some content here"
        />
      </div>
      <Spacer />
    </Layout>
  );
};

export default FAQPage;
