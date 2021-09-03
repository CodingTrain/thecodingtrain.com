import * as React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';

const IndexPage = () => {
  return (
    <Layout>
      <Link to="/components">Go to components overview</Link>
    </Layout>
  );
};

export default IndexPage;
