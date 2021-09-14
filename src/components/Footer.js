import React from 'react';
import cn from 'classnames';

import * as css from './Footer.module.css';

import Logo from '../images/logo.svg';
import Train from '../images/train.svg';
import Github from '../images/github.svg';
import Discord from '../images/discord.svg';
import Youtube from '../images/youtube.svg';
import Instagram from '../images/instagram.svg';
import NYU from '../images/nyu.svg';
import ITP from '../images/itp.svg';
import Google from '../images/google.svg';

import { cols, col } from '../styles/grid.module.css';

const Footer = () => {
  return (
    <div className={css.root}>
      <div className={cn(cols, css.actions)}>
        <div className={cn(css.box)}>
          <div className={css.logo}>
            <Logo width={250} />
          </div>
          <div className={css.train}>
            <Train width={250} />
          </div>
        </div>
        <div className={cn(css.box)}>
          <h3>Become a member</h3>
          <div>
            <p>
              Support the Coding Train and get access to a number of perks like
              stickers and member-only livestreams.
            </p>
            <a>Support now</a>
          </div>
        </div>
        <div className={cn(css.box)}>
          <h3>Join the community</h3>
          <div>
            <p>
              Join our channel on Discord to find answers to your questions and
              take part in our inclusive community.
            </p>
            <a>Join now</a>
          </div>
        </div>
        <div className={cn(css.box)}>
          <h3>Shop</h3>
          <div>
            <p>
              Visit the Coding Train store with a small selection of high
              quality items.
            </p>
            <a>Go now</a>
          </div>
        </div>
      </div>
      <div className={css.links}>
        <div className={css.socials}>
          <ul>
            <li>
              <Github width={30} />
              Github
            </li>
            <li>
              <Discord width={30} />
              Discord
            </li>
            <li>
              <Youtube width={30} />
              Youtube
            </li>
            <li>
              <Instagram width={30} />
              Instagram
            </li>
          </ul>
        </div>
        <div>
          <span>Get started</span>
          <ul>
            <li>Getting started guide</li>
          </ul>
        </div>
        <div>
          <span>Videos</span>
          <ul>
            <li>Tracks</li>
            <li>Challenges</li>
            <li>FAQ</li>
            <li>Archive</li>
          </ul>
        </div>
        <div>
          <span>Community</span>
          <ul>
            <li>Discord</li>
            <li>Gallery</li>
            <li>Contribute</li>
            <li>Github</li>
          </ul>
        </div>
        <div>
          <span>About</span>
          <ul>
            <li>Talks</li>
            <li>Shop</li>
          </ul>
        </div>
      </div>
      <div className={css.logos}>
        <NYU />
        <ITP />
        <Google />
      </div>
      <div className={css.copyright}>
        2021 The Coding Train. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
