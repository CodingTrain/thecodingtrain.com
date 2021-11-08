import * as React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/Layout';

const IndexPage = () => {
  return (
    <Layout>
      <ul>
        <li>
          <Link to="/components">Go to components overview</Link>
        </li>
        <li>
          <Link to="/tracks">Go to tracks page</Link>
        </li>
        <li>
          <Link to="/about">Go to about page</Link>
        </li>
      </ul>
    </Layout>
  );
};

export default IndexPage;
