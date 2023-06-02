import React from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import Layout from './Layout';
import CharacterSpacer from './CharacterSpacer';
import { Heading1 } from './Heading';
import PagePanel from './PagePanel';
import Spacer from './Spacer';
import Button from './Button';

import * as css from './ItemsPage.module.css';

import SemiColon from '../images/characters/SemiColon_3.mini.svg';
import ZeroCharacter from '../images/characters/Zero_4.mini.svg';
import ZeroCharacter2 from '../images/characters/Zero_3.mini.svg';
import TriangleCharacter from '../images/characters/Triangle_6.mini.svg';

const ItemsPage = ({
  title,
  description,
  image,
  itemsPath,
  variant,
  panelText = 'New to coding?',
  panelButtonText = 'Start here',
  panelButtonLink = '/guides/getting-started',
  panelVariant = 'orange',
  panelCharacter = TriangleCharacter,
  Character,
  SeparatorCharacter,
  EndPageCharacter,
  characterOrientation,
  children,
  //
  showPagination,
  previousPagePath,
  humanPageNumber,
  numberOfPages,
  nextPagePath
}) => {
  return (
    <Layout title={title} description={description} image={image}>
      <Spacer />
      <header className={css.header}>
        <Heading1 className={css.heading} variant={variant}>
          {title}
        </Heading1>
        <div
          className={cn(css.character, {
            [css[characterOrientation]]: characterOrientation
          })}>
          <Character />
        </div>
      </header>

      <PagePanel
        className={css.panel}
        description={description}
        text={panelText}
        buttonText={panelButtonText}
        buttonLink={panelButtonLink}
        variant={panelVariant}
        Character={panelCharacter}
        bbColor={variant}
      />
      <CharacterSpacer
        className={css.sep}
        variant={variant}
        size="x2"
        side="right"
        offset={0.7}
        characterSize={0.9}
        Character={SeparatorCharacter}
      />

      {children}

      {showPagination ? (
        <nav className={cn(css.paginationNav, { [css[variant]]: variant })}>
          <span>
            {previousPagePath && (
              <Link to={previousPagePath}>{'<'} Previous</Link>
            )}
          </span>
          <span>
            {humanPageNumber} of {numberOfPages}
          </span>
          <span>
            {nextPagePath && <Link to={nextPagePath}>Next {'>'} </Link>}
          </span>
        </nav>
      ) : (
        <div className={cn(css.noItemsMessage, { [css[variant]]: variant })}>
          <p>No {title} found! </p>

          <Button variant={variant} to={`/${itemsPath}/`} rainbow>
            Reset filters
          </Button>

          <SemiColon className={css.semiColon} />
          <ZeroCharacter className={css.squareBrackets} />
        </div>
      )}

      <Spacer pattern className={css.spacer} />
      <CharacterSpacer
        className={css.sep}
        size="x4"
        side="right"
        offset={0.42}
        characterSize={0.9}
        Character={EndPageCharacter ?? ZeroCharacter2}
      />
    </Layout>
  );
};

export default ItemsPage;
