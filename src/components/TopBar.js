import React from 'react';
import { Link } from 'gatsby';

import Menu from './Menu';

import * as css from './TopBar.module.css';

import Logo from '../images/logo.svg';

const suffix = (day) => {
  switch (day[day.length - 1]) {
    case '1':
      return 'st';
    case '2':
      return 'nd';
    case '3':
      return 'rd';
    default:
      return 'th';
  }
};
const shortDate = (date) => date.toLocaleDateString('en-US');
const longDate = (date) => {
  const month = date.toLocaleDateString('en-US', {
    month: 'short'
  });
  const year = date.toLocaleDateString('en-US', {
    year: 'numeric'
  });
  const weekday = date.toLocaleDateString('en-US', {
    weekday: 'long'
  });
  const day = date.toLocaleDateString('en-US', {
    day: 'numeric'
  });
  const daySuffix = suffix(day);
  return `${weekday} / ${month} ${day}${daySuffix}, ${year}`;
};

const TopBar = () => {
  const today = new Date();
  console.log(longDate(today));
  return (
    <div className={css.outer}>
      <div className={css.root}>
        <div className={css.logo}>
          <Link to="/" aria-label="Go to homepage">
            <Logo width={250} />
          </Link>
        </div>
        <div className={css.clock}>🕛</div>
        <div className={css.date}>
          <span className={css.longDate}>{longDate(today)}</span>
          <span className={css.shortDate}>{shortDate(today)}</span>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default TopBar;
