import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const Head = ({ title, description }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          siteUrl
          description
        }
      }
      coverImage: allFile(
        filter: {
          name: { eq: "placeholder" }
          sourceInstanceName: { eq: "main-tracks" }
          extension: { in: ["jpg", "png"] }
        }
      ) {
        nodes {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  `);
  const {
    site: {
      sitMetadata: {
        title: defaultTitle,
        siteURL,
        description: defaultDescription
      }
    }
  } = data;
  const image =
    data.coverImage.nodes[0].childImageSharp.gatsbyImageData.images.fallback
      .src;
  // console.log({ image });
  return (
    <Helmet
      htmlAttributes={{
        lang: 'en'
      }}
      defaultTitle={defaultTitle}
      titleTemplate={`%s / ${defaultTitle}`}>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description ?? defaultDescription} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteURL} />
      <meta property="og:title" content={title ?? defaultTitle} />
      <meta
        property="og:description"
        content={description ?? defaultDescription}
      />
      <meta property="og:image" content={`${siteURL}${image.slice(1)}`} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteURL} />
      <meta property="twitter:title" content={title ?? defaultTitle} />
      <meta
        property="twitter:description"
        content={description ?? defaultDescription}
      />
      <meta property="twitter:image" content={`${siteURL}${image.slice(1)}`} />
    </Helmet>
  );
};

export default memo(Head);
