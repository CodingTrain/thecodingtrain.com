import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { getSrc } from 'gatsby-plugin-image';

const Seo = ({ title, description, image }) => {
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
      siteMetadata: {
        title: defaultTitle,
        siteUrl,
        description: defaultDescription
      }
    }
  } = data;

  const metaTitle = title ?? defaultTitle;
  const metaDescription = description ?? defaultDescription;
  const metaImage =
    getSrc(image) ?? getSrc(data.coverImage.nodes[0].childImageSharp);

  return (
    <>
      <html lang="en" />
      <title>{title ? `${title} / ${defaultTitle}` : defaultTitle}</title>
      <meta name="description" content={metaDescription} />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#00aba9" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon.ico" sizes="any" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={`${siteUrl}${metaImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={`${siteUrl}${metaImage}`} />

      {/* Theme toggle bootstrap */}
      <script>{`
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      `}</script>
    </>
  );
};

export default Seo;
