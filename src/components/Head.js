import React, { memo } from "react";
import { Helmet } from "react-helmet";

const Head = ({ title }) => {
  return (
    <Helmet
      defaultTitle="The Coding Train"
      titleTemplate="%s / The Coding Train"
    >
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{title}</title>
    </Helmet>
  );
};

export default memo(Head);
