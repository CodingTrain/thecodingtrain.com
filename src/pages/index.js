import * as React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/Layout';

import * as css from '../styles/pages/index.module.css';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <div className={css.root}>
        <p>Homepage in progress.</p>
        <p>
          <Link to="/routes">Go to routes page</Link>
        </p>
      </div>
    </Layout>
  );
};

export default IndexPage;
