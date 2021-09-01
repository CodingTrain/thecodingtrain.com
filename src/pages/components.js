import React, { useState } from "react";
import Layout from "../components/Layout";
import Heading from "../components/Heading";
import Breadcrumb from "../components/Breadcrumbs";
import Filter from "../components/Filter";
import ButtonPanel from "../components/ButtonPanel";
import cn from "classnames";

import * as css from "../styles/pages/components.module.css";
import { box, cols, col } from "../styles/box.module.css";

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
      <Heading>Box Test</Heading>
      <div className={cn(box, css.box)}>Box 1</div>
      <div className={cn(box, css.box)}>Box 2</div>
      <div className={cols}>
        <div className={cn(box, col, css.box)}>Box 3</div>
        <div className={cn(box, col, css.box)}>Box 4</div>
      </div>
      <div className={cols}>
        <div className={cn(box, col, css.box)}>Box 5</div>
        <div className={cn(box, col, css.box)}>Box 6</div>
        <div className={cn(box, col, css.box)}>Box 7</div>
      </div>
      <div className={cn(box, css.box)}>
        <div className={cols}>
          <div className={cn(box, col, css.box)}><ButtonPanel text={"We've created a sample guide to help you get started"} buttonText={"Go to our guide"} buttonLink={""} variant={"red"}/></div>
          <div className={cn(box, col, css.box)}>Nested 2</div>
        </div>
        <div className={cols}>
          <div className={cn(box, col, css.box)}><ButtonPanel text={"Sounds interesting"} buttonText={"Go to track"} buttonLink={""} variant={"orange"}/></div>
          <div className={cn(box, col, css.box)}>Nested 5</div>
          <div className={cn(box, col, css.box)}>Nested 6</div>
        </div>
      </div>
      <div className={cn(box, css.box)}>Box 8</div>
      <ButtonPanel text={"Sounds interesting"} buttonText={"Go to track"} buttonLink={""} variant={"purple"}/>
    </Layout>
  );
};

export default ComponentsPage;
