import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';

import Menu from './Menu';
import NewLogo from '../images/new-logo.mini.svg';

import * as css from './TopBar.module.css';

const suffix = (day) => {
  if (day === '11' || day === '12' || day === '13') return 'th';
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
  const [date, setDate] = useState({ long: '', short: '' });

  useEffect(() => {
    // Runs client-side only, the date should not be captured at build time during SSG

    const today = new Date();
    setDate({
      long: longDate(today),
      short: shortDate(today)
    });
  }, []);

  return (
    <div className={css.outer}>
      <header className={css.root}>
        <div className={css.logo}>
          <Link to="/" aria-label="Go to homepage">
            <NewLogo className={css.logoSvg} />
          </Link>
        </div>
        <div className={css.clock}>🕛</div>
        <div className={css.date}>
          <span className={css.longDate}>{date.long}</span>
          <span className={css.shortDate}>{date.short}</span>
        </div>
        <Menu />
      </header>
    </div>
  );
};

export default TopBar;
