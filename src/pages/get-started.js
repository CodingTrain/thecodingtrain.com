import * as React from 'react';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';
import Spacer from '../components/Spacer';

const GetStarted = () => {
  return (
    <Layout title="Get Started">
      <Spacer />
      <Heading1 variant="orange">New to coding</Heading1>
      <Spacer />
    </Layout>
  );
};

export default GetStarted;
