import * as React from "react";
import Layout from "../components/Layout";
import Heading from "../components/Heading";
import Breadcrumb from "../components/Breadcrumbs";

const breadcrumbs = [
  { name: "Videos Overview", link: "" },
  { name: "Tracks", link: "" },
  { name: "The Nature of Code", link: "" },
];

const ComponentsPage = () => {
  return (
    <Layout>
      <Heading>This is a heading</Heading>
      <Heading>This is a heading</Heading>
      <Heading>This is a heading</Heading>
      <Breadcrumb breadcrumbs={breadcrumbs}>This is a Breadcrumb</Breadcrumb>
      <h2>This is a subheading</h2>
      <p>Hello</p>
    </Layout>
  );
};

export default ComponentsPage;
