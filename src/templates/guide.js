import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from '../components/Heading';
import Spacer from '../components/Spacer';

import * as css from './guide.module.css';

const kebabCase = (string) =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[?'!,:.]/g, '')
    .toLowerCase();

const components = {
  h1: (props) => (
    <Heading1
      variant="orange"
      as="h2"
      id={kebabCase(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  h2: (props) => (
    <Heading2
      variant="orange"
      as="h3"
      id={kebabCase(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  h3: (props) => (
    <Heading3
      variant="orange"
      as="h4"
      id={kebabCase(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  h4: (props) => (
    <Heading4
      variant="orange"
      as="h5"
      id={kebabCase(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  h5: (props) => (
    <Heading5
      variant="orange"
      as="h6"
      id={kebabCase(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  h6: (props) => (
    <Heading6
      variant="orange"
      as="h6"
      id={kebabCase(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  p: (props) => <p className={css.paragraph} {...props} />,
  a: (props) => <a className={css.a} {...props} />,
  ul: (props) => <ul className={css.list} {...props} />,
  ol: (props) => <ol className={css.list} {...props} />,
  li: (props) => <li className={css.listItem} {...props} />,
  thematicBreak: (props) => (
    <Spacer className={css.breakSpacer} pattern {...props} />
  ),
  pre: (props) => <pre className={css.pre} {...props} />,
  table: (props) => (
    <div className={css.table}>
      <table {...props} />
    </div>
  ),
  tr: (props) => <tr className={css.tr} {...props} />,
  td: (props) => <td className={css.td} {...props} />,
  th: (props) => <th className={css.th} {...props} />,
  blockquote: (props) => <blockquote className={css.blockquote} {...props} />,
  hr: (props) => <Spacer className={css.breakSpacer} pattern {...props} />
};

const Guide = ({ data }) => {
  const { mdx } = data;

  return (
    <Layout>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Guides', link: `/guides` },
          { name: mdx.frontmatter.title, link: `/guides/${mdx.slug}` }
        ]}
        variant="orange"
      />
      <Heading1
        variant="orange"
        as="h2"
        className={css.title}
        borderBottom={false}>
        {mdx.frontmatter.title}
      </Heading1>
      <ul className={css.index}>
        {mdx.tableOfContents.items.map((item, index) => (
          <a href={item.url} className={css.indexItem}>
            <li key={index}>
              {'>'} {item.title}
            </li>
          </a>
        ))}
        {mdx.tableOfContents.items.length % 2 === 1 && (
          <div className={css.itemSpacer} />
        )}
      </ul>
      <Spacer />
      <MDXProvider components={components}>
        <div className={css.root}>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </div>
      </MDXProvider>
    </Layout>
  );
};

export const query = graphql`
  query ($slug: String!) {
    mdx(slug: { eq: $slug }) {
      slug
      body
      tableOfContents
      frontmatter {
        title
      }
    }
  }
`;

export default Guide;
