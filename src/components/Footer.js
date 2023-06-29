import React from 'react';
import { Link } from 'gatsby';

import cn from 'classnames';

import * as css from './Footer.module.css';

import Logo from '../images/logo.svg';
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
    <footer className={cn(cols, css.root)}>
      <div className={css.logoMobile}>
        <Logo width={250} />
      </div>

      <div className={cn(css.box, css.trainBox)}>
        <div className={css.logo}>
          <Logo width={250} />
        </div>
        <div className={css.train}>
          <img
            src="/images/train.svg"
            width={371}
            height={150}
            alt="The Coding Train illustration"
          />
        </div>
      </div>

      <nav className={cn(css.box)} aria-labelledby="cafe-car-navigation">
        <h3 id="cafe-car-navigation">
          <a href="https://thecodingtrain.com/discord">The Cafe Car!</a>
        </h3>
        <div className={css.action}>
          <p>
            Join the Coding Train Discord to chat with the community and get
            help with your code from the Station Managers.
          </p>
          <a className={css.cta} href="https://thecodingtrain.com/discord">
            Join Discord now
          </a>
        </div>
      </nav>

      <nav
        className={cn(css.box)}
        aria-labelledby="passenger-showcase-navigation">
        <h3 id="passenger-showcase-navigation">
          <Link to="/showcase">Passenger Showcase!</Link>
        </h3>
        <div className={css.action}>
          <p>
            What have you been inspired to make watching The Coding Train? Share
            your work and have it featured on this site!
          </p>
          <Link className={css.cta} to="/guides/passenger-showcase-guide/">
            Learn how to submit your work
          </Link>
        </div>
      </nav>

      <nav className={css.socialLinks} aria-labelledby="socials-navigation">
        <h3 className={css.title} id="socials-navigation">
          Follow us!
        </h3>
        <ul>
          <li>
            <a
              href="https://www.youtube.com/c/TheCodingTrain/"
              aria-label="Youtube">
              <Youtube width={30} />
              <span>Youtube</span>
            </a>
          </li>
          <li>
            <a
              href="https://www.twitch.tv/codingtrainchoochoo"
              aria-label="Twitch">
              <Twitch width={30} />
              <span>Twitch</span>
            </a>
          </li>

          <li>
            <a href="https://nebula.tv/codingtrain" aria-label="Nebula">
              <Nebula width={30} />
              <span>Nebula</span>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/thecodingtrain" aria-label="Twitter">
              <Twitter width={30} />
              <span>Twitter</span>
            </a>
          </li>

          <li>
            <a
              href="https://www.instagram.com/the.coding.train/"
              aria-label="Instagram">
              <Instagram width={30} />
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a href="https://thecodingtrain.com/discord" aria-label="Discord">
              <Discord width={30} />
              <span>Discord</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/CodingTrain" aria-label="GitHub">
              <Github width={30} />
              <span>GitHub</span>
            </a>
          </li>
        </ul>
      </nav>

      <nav className={css.navBox}>
        <ul>
          <li className={css.title}>
            <Link to="/guides/getting-started">Getting started</Link>
          </li>
          <li>
            <Link to="/guides/getting-started"> Guide</Link>
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
              href="https://store.nebula.tv/collections/the-coding-train"
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
            <a href="https://thecodingtrain.com/discord">Discord</a>
          </li>
          <li>
            <a href="https://github.com/CodingTrain">GitHub</a>
          </li>
        </ul>
      </nav>

      <nav
        className={cn(css.box, css.bottomBox)}
        aria-labelledby="support-navigation">
        <h3 id="support-navigation">
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
            <a href="https://www.patreon.com/codingtrain" {...externalLink}>
              Patreon Supporter
            </a>
            , or{' '}
            <a href="https://github.com/sponsors/codingtrain" {...externalLink}>
              GitHub Sponsor
            </a>
            ! For questions about rewards and perks, write us an{' '}
            <a href="mailto:help@thecodingtrain.com" {...externalLink}>
              email
            </a>
            .
          </p>
        </div>
      </nav>

      <div className={css.copyright}>
        <span>
          2016-{new Date().getFullYear()} The Coding Train. All rights reserved.
          Built in collaboration with{' '}
          <a href="https://designsystems.international/" {...externalLink}>
            Design System International
          </a>
          .
        </span>
      </div>
    </footer>
  );
};

export default Footer;
