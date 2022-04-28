import React from 'react';
import { Link } from 'gatsby';

import cn from 'classnames';

import * as css from './Footer.module.css';

import Logo from '../images/logo.svg';
import Train from '../images/train.svg';
import Github from '../images/github.svg';
import Twitch from '../images/twitch.svg';
import Nebula from '../images/nebula.svg';
import Twitter from '../images/twitter.svg';
import Discord from '../images/discord.svg';
import Youtube from '../images/youtube.svg';
import Instagram from '../images/instagram.svg';

import { cols } from '../styles/styles.module.css';

const externalLink = {
  target: '_blank',
  rel: 'noopener noreferrer'
};

const Footer = () => {
  return (
    <div className={cn(cols, css.root)}>
      <div className={css.logoMobile}>
        <Logo width={250} />
      </div>

      <div className={cn(css.box, css.trainBox)}>
        <div className={css.logo}>
          <Logo width={250} />
        </div>
        <div className={css.train}>
          <Train />
        </div>
      </div>

      <div className={cn(css.box)}>
        <h3>
          <a href="https://discord.com/invite/hPuGy2g">The Cafe Car!</a>
        </h3>
        <div className={css.action}>
          <p>
            Join the Coding Train Discord to chat with the community and get
            help with your code from the Station Managers.
          </p>
          <a className={css.cta} href="https://discord.com/invite/hPuGy2g">
            Join now
          </a>
        </div>
      </div>

      <div className={cn(css.box)}>
        <h3>
          <Link to="/showcase">Passenger Showcase!</Link>
        </h3>
        <div className={css.action}>
          <p>
            What have you been inspired to make watching The Coding Train? Share
            your work and have it featured on this site!
          </p>
          <Link className={css.cta} to="/guides/community-contribution-guide/">
            Learn how to submit
          </Link>
        </div>
      </div>

      <div className={css.socialLinks}>
        <h3 className={css.title}>Follow us!</h3>
        <ul>
          <li>
            <a href="https://www.youtube.com/c/TheCodingTrain/">
              <Youtube width={30} />
              <span>Youtube</span>
            </a>
          </li>
          <li>
            <a href="https://www.twitch.tv/codingtrainchoochoo">
              <Twitch width={30} />
              <span>Twitch</span>
            </a>
          </li>

          <li>
            <a href="https://nebula.app/codingtrain">
              <Nebula width={30} />
              <span>Nebula</span>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/thecodingtrain">
              <Twitter width={30} />
              <span>Twitter</span>
            </a>
          </li>

          <li>
            <a href="https://www.instagram.com/the.coding.train">
              <Instagram width={30} />
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a href="https://discord.gg/codingtrain">
              <Discord width={30} />
              <span>Discord</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/CodingTrain">
              <Github width={30} />
              <span>Github</span>
            </a>
          </li>
        </ul>
      </div>
      <div className={css.navBox}>
        <ul>
          <li className={css.title}>
            <Link to="/getting-started">Getting started</Link>
          </li>
          <li>
            <Link to="/getting-started"> Guide</Link>
          </li>
          <li>
            <Link to="/faq">FAQs</Link>
          </li>
          <li className={css.spacer} />
          <li className={css.bold}>
            <Link to="/about">About</Link>
          </li>
          <li className={css.bold}>
            <a
              href="https://store.nebula.app/collections/the-coding-train"
              {...externalLink}>
              Shop
            </a>
          </li>
        </ul>
        <ul>
          <li className={css.title}>Videos</li>
          <li>
            <Link to="/tracks">Tracks</Link>
          </li>
          <li>
            <Link to="/challenges">Challenges</Link>
          </li>
        </ul>

        <ul>
          <li className={css.title}>Passengers</li>
          <li>
            <Link to="/showcase">Showcase</Link>
          </li>
          <li>
            <a href="https://discord.com/invite/hPuGy2g">Discord</a>
          </li>
          <li>
            <a href="https://github.com/CodingTrain">GitHub</a>
          </li>
        </ul>
      </div>

      <div className={cn(css.box, css.bottomBox)}>
        <h3>
          <Link to="#">Support the Coding Train!</Link>
        </h3>
        <div className={css.action}>
          <p>
            You can support the Coding Train by becoming a{' '}
            <a
              href="https://www.youtube.com/thecodingtrain/join"
              {...externalLink}>
              YouTube Member
            </a>
            ,{' '}
            <a
              href="https://subs.twitch.tv/codingtrainchoochoo"
              {...externalLink}>
              Twitch Subscriber
            </a>
            , or{' '}
            <a href="https://github.com/sponsors/shiffman" {...externalLink}>
              GitHub sponsor
            </a>
            ! For questions about rewards and perks, write us an{' '}
            <a href="mailto:membership@thecodingtrain.com" {...externalLink}>
              email
            </a>
            .
          </p>
        </div>
      </div>

      <div className={css.copyright}>
        2021 The Coding Train. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
