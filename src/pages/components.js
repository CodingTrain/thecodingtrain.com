import * as React from "react";
import Layout from "../components/Layout";
import Heading from "../components/Heading";
import Breadcrumb from "../components/Breadcrumbs";

const ComponentsPage = () => {
  return (
    <Layout>
      <Heading>This is a heading</Heading>
      <Breadcrumb
        breadcrumbs={[
          { name: "Videos Overview", link: "" },
          { name: "Tracks", link: "" },
          { name: "The Nature of Code", link: "" },
        ]}
      />
    </Layout>
  );
};

export default ComponentsPage;
