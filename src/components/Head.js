import React, { memo } from 'react';
import { Helmet } from 'react-helmet';

const Head = ({ title }) => {
  return (
    <Helmet
      htmlAttributes={{
        lang: 'en'
      }}
      defaultTitle="The Coding Train"
      titleTemplate="%s / The Coding Train">
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{title}</title>
      <meta
        name="description"
        content="All aboard the Coding Train with Daniel Shiffman, a YouTube channel dedicated to beginner-friendly creative coding tutorials and challenges."
      />
    </Helmet>
  );
};

export default memo(Head);
