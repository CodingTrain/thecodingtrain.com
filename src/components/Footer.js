import React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import cn from 'classnames';

import * as css from './Footer.module.css';

import Logo from '../images/logo.svg';
import Train from '../images/train.svg';
import Github from '../images/github.svg';
import Discord from '../images/discord.svg';
import Youtube from '../images/youtube.svg';
import Instagram from '../images/instagram.svg';

import { cols } from '../styles/styles.module.css';

const Footer = () => {
  return (
    <div className={css.root}>
      <div className={css.logoMobile}>
        <Logo width={250} />
      </div>
      <div className={cn(cols, css.actions)}>
        <div className={cn(css.box, css.topbox)}>
          <div className={css.logo}>
            <Logo width={250} />
          </div>
          <div className={css.train}>
            <Train />
          </div>
        </div>
        <div className={cn(css.box)}>
          <h3>
            <Link to="#">Become a member</Link>
          </h3>
          <div className={css.action}>
            <p>
              Support the Coding Train and get access to a number of perks like
              stickers and member-only livestreams.
            </p>
            <a href="#">Support now</a>
          </div>
        </div>
        <div className={cn(css.box)}>
          <h3>
            <Link to="#">Join the community</Link>
          </h3>
          <div className={css.action}>
            <p>
              Join our channel on Discord to find answers to your questions and
              take part in our inclusive community.
            </p>
            <a href="#">Join now</a>
          </div>
        </div>
        <div className={cn(css.box)}>
          <h3>
            <Link to="#">Shop</Link>
          </h3>
          <div className={css.action}>
            <p>
              Visit the Coding Train store with a small selection of high
              quality items.
            </p>
            <a href="#">Go now</a>
          </div>
        </div>
      </div>
      <div className={css.links}>
        <div className={css.socials}>
          <ul>
            <li>
              <a href="https://github.com/CodingTrain">
                <Github width={30} />
                <span>Github</span>
              </a>
            </li>
            <li>
              <a href="https://discord.com/invite/hPuGy2g">
                <Discord width={30} />
                <span>Discord</span>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/c/TheCodingTrain/">
                <Youtube width={30} />
                <span>Youtube</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/the.coding.train">
                <Instagram width={30} />
                <span>Instagram</span>
              </a>
            </li>
          </ul>
        </div>
        <div>
          <span>Get started</span>
          <ul>
            <li>
              <Link to="#">Getting started guide</Link>
            </li>
          </ul>
        </div>
        <div>
          <span>Videos</span>
          <ul>
            <li>
              <Link to="#">Tracks</Link>
            </li>
            <li>
              <Link to="#">Challenges</Link>
            </li>
            <li>
              <Link to="#">FAQ</Link>
            </li>
            <li>
              <Link to="#">Archive</Link>
            </li>
          </ul>
        </div>
        <div>
          <span>Community</span>
          <ul>
            <li>
              <a href="https://discord.com/invite/hPuGy2g">Discord</a>
            </li>
            <li>
              <Link to="#">Gallery</Link>
            </li>
            <li>
              <Link to="#">Contribute</Link>
            </li>
            <li>
              <a href="https://github.com/CodingTrain">Github</a>
            </li>
          </ul>
        </div>
        <div>
          <span>About</span>
          <ul>
            <li>
              <Link to="#">Talks</Link>
            </li>
            <li>
              <Link to="#">Shop</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={css.logos}>
        <div>The coding train contributors:</div>
        <div>
          <StaticImage
            src="../images/nyu.png"
            alt=""
            width={150}
            objectFit="contain"
            className={css.image}
          />
          <p>NYU creative grant 2018-present</p>
        </div>
        <div>
          <StaticImage
            src="../images/itp.png"
            alt=""
            objectFit="contain"
            width={150}
            className={css.image}
          />
          <p>ITP research fellowship mentorship</p>
        </div>
        <div>
          <StaticImage
            src="../images/google.png"
            alt=""
            width={150}
            objectFit="contain"
            className={css.image}
          />
        </div>
      </div>
      <div className={css.socialsMobile}>
        <Github width={50} />
        <Discord width={50} />
        <Youtube width={50} />
        <Instagram width={50} />
      </div>
      <div className={css.copyright}>
        2021 The Coding Train. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
