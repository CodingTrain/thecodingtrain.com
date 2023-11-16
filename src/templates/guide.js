import React, { useMemo } from 'react';
import { graphql } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { toSlug } from '../utils';

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
import Button from '../components/Button';
import Spacer from '../components/Spacer';
import YouTubeVideo from '../components/YouTubeVideo';
import Image from '../components/Image';
import PassengerShowcaseForm from '../components/PassengerShowcaseForm';

import * as css from './guide.module.css';

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

function makeId(val) {
  if (typeof val === 'string') return toSlug(val);

  // If the markdown source was stylized, we may get a mix of React elements and strings and need to drill down to extract a string
  if (Array.isArray(val)) {
    return val.map(makeId).join('-');
  } else {
    return makeId(val?.props?.children ?? '');
  }
}

const components = (localImages) => ({
  h1: (props) => (
    <Heading1 variant="purple" as="h2" id={makeId(props.children)} {...props} />
  ),
  h2: (props) => (
    <Heading2
      className={css.headingBorderTop}
      variant="purple"
      as="h3"
      id={makeId(props.children)}
      {...props}
    />
  ),
  h3: (props) => (
    <Heading3
      variant="purple"
      as="h4"
      id={makeId(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  h4: (props) => (
    <Heading4
      variant="purple"
      as="h5"
      id={makeId(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  h5: (props) => (
    <Heading5
      variant="purple"
      as="h6"
      id={makeId(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  h6: (props) => (
    <Heading6
      variant="purple"
      as="h6"
      id={makeId(props.children)}
      borderBottom={false}
      {...props}
    />
  ),
  p: (props) => <p className={css.paragraph} {...props} />,
  img: (props) =>
    !isValidHttpUrl(props.src) && localImages.hasOwnProperty(props.src) ? (
      <p className={css.paragraph}>
        <Image
          className={css.image}
          image={localImages[props.src]}
          alt={props.alt}
          {...props}
        />
      </p>
    ) : (
      <p className={css.paragraph}>
        <img className={css.image} alt={props.alt} {...props} />
      </p>
    ),
  a: ({ children, ...props }) => (
    <a className={css.a} {...props}>
      {children}
    </a>
  ),
  ul: (props) => <ul className={css.list} {...props} />,
  ol: (props) => <ol className={css.list} {...props} />,
  li: (props) => <li className={css.listItem} {...props} />,
  thematicBreak: (props) => (
    <Spacer className={css.breakSpacer} pattern {...props} />
  ),
  pre: (props) => (
    <figure className={css.preWrapper}>
      <pre className={css.pre} {...props} />
    </figure>
  ),
  table: (props) => (
    <div className={css.table}>
      <table {...props} />
    </div>
  ),
  tr: (props) => <tr className={css.tr} {...props} />,
  td: (props) => <td className={css.td} {...props} />,
  th: (props) => <th className={css.th} {...props} />,
  blockquote: (props) => <blockquote className={css.blockquote} {...props} />,
  hr: (props) => <Spacer className={css.breakSpacer} pattern {...props} />,
  Button: (props) => (
    <div className={css.button}>
      <Button variant={'purple'} {...props} rainbow />
    </div>
  ),
  Video: (props) => (
    <div className={css.video}>
      <YouTubeVideo className={css.videoContainer} {...props} />
    </div>
  ),
  PassengerShowcaseForm: (props) => <PassengerShowcaseForm {...props} />
});

const useLocalImages = (images) => {
  return useMemo(() => {
    const imagesObj = {};
    for (let image of images) {
      const {
        file: { relativePath }
      } = image;
      imagesObj[`/${relativePath}`] =
        image.file.childImageSharp.gatsbyImageData;
      imagesObj[`./${relativePath}`] =
        image.file.childImageSharp.gatsbyImageData;
      imagesObj[relativePath] = image.file.childImageSharp.gatsbyImageData;
    }
    return imagesObj;
  }, [images]);
};

const Guide = ({ data, children }) => {
  const { mdx, images, coverImage } = data;

  const localImages = useLocalImages(images.nodes);

  // cover image for the guide, falls back to final placeholder image
  const guideCover = coverImage
    ? coverImage.childImageSharp.gatsbyImageData
    : localImages['placeholder.png'];

  return (
    <Layout
      title={mdx.frontmatter.title}
      description={mdx.frontmatter.description}
      image={guideCover}>
      <Breadcrumbs
        className={css.breadcrumbs}
        breadcrumbs={[
          { name: 'Guides', link: `/guides` },
          { name: mdx.frontmatter.title, link: `/guides/${mdx.fields.slug}` }
        ]}
        variant="purple"
      />
      <header>
        <Heading1
          variant="purple"
          as="h2"
          className={css.title}
          borderBottom={false}>
          {mdx.frontmatter.title}
        </Heading1>
        <nav aria-labelledby="table-of-content-navigation">
          <ul className={css.index}>
            <li className={css.indexLabel} id="table-of-content-navigation">
              Table Of Contents
            </li>
            {mdx.tableOfContents.items.map((item, index) => (
              <li key={index} className={css.indexItem}>
                <a href={'#' + toSlug(item.title)}>{item.title}</a>
              </li>
            ))}
            {mdx.tableOfContents.items.length % 2 === 1 && (
              <div className={css.itemSpacer} />
            )}
          </ul>
        </nav>
      </header>
      <Spacer />
      <div className={css.root}>
        <MDXProvider components={components(localImages)}>
          {children}
        </MDXProvider>
        <div className={css.guideBottomSpacer} />
      </div>
      <Spacer pattern className={css.spacer} />
    </Layout>
  );
};

export const query = graphql`
  query ($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      fields {
        slug
      }
      tableOfContents
      frontmatter {
        title
        description
      }
    }
    images: allCoverImage(
      filter: { file: { sourceInstanceName: { eq: "guides" } } }
    ) {
      nodes {
        file {
          relativePath
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
    coverImage: file(
      sourceInstanceName: { eq: "guides" }
      extension: { in: ["jpg", "png"] }
      name: { eq: $slug }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`;

export default Guide;
