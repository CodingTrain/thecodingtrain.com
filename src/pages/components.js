import React, { useState } from "react";
import Layout from "../components/Layout";
import Heading from "../components/Heading";
import Breadcrumb from "../components/Breadcrumbs";
import Filter from "../components/Filter";

import { cols, col } from "../styles/grid.module.css";

const ComponentsPage = () => {
  const [filters, setFilters] = useState();

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
      <div className={cols}>
        <Filter title="Filter by Language" items={filters} className={col} />
        <Filter title="Filter by Language" items={filters} className={col} />
      </div>
    </Layout>
  );
};

export default ComponentsPage;
