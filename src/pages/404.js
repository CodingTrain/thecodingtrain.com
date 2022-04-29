import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import { Heading1 } from '../components/Heading';
import ButtonPanel from '../components/ButtonPanel';
import Spacer from '../components/Spacer';

import SemiColonCharacter from '../images/characters/SemiColon_4.mini.svg';
import SceneCharacter1 from '../images/characters/Equals_4.mini.svg';
import SceneCharacter2 from '../images/characters/Square_6.mini.svg';
import SceneCharacter3 from '../images/characters/ThisDot_8.mini.svg';

import * as css from '../styles/pages/404.module.css';

const NotFoundPage = ({ data }) => {
  const { title, description, links } = data.pageData.nodes[0];
  return (
    <Layout title="Page not found!">
      <Spacer />
      <div className={css.header}>
        <Heading1 className={css.heading} variant="pink">
          {title}
        </Heading1>
        <div className={css.scene}>
          <SceneCharacter1 />
          <SceneCharacter2 />
          <SceneCharacter3 />
          <SemiColonCharacter />
        </div>
      </div>
      <div className={css.content}>
        <div className={css.description}>
          <p>{description}</p>
        </div>
        <div className={css.ctas}>
          {links.map((link) => (
            <div className={css.cta}>
              <ButtonPanel
                className={css.buttonPanel}
                variant={link.color}
                buttonText={link.page}
                buttonLink={link.url}
              />
            </div>
          ))}
        </div>
      </div>
      <Spacer pattern />
    </Layout>
  );
};

export const query = graphql`
  query {
    pageData: allNotFoundInfo {
      nodes {
        title
        description
        links {
          page
          url
          color
        }
      }
    }
  }
`;

export default NotFoundPage;
