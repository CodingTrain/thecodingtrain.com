import React, { useState, useContext } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';
import { ThemeContext } from './Theme/Theme';

import * as css from './Menu.module.css';

import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

const items = [
  {
    name: 'Get Started',
    to: '/guides/getting-started'
  },
  {
    name: 'Videos',
    children: [
      { name: 'Tracks', to: '/tracks' },
      { name: 'Challenges', to: '/challenges' }
    ]
  },
  {
    name: 'Community',
    children: [
      {
        name: 'Guides',
        to: '/guides'
      },
      {
        name: 'Showcase',
        to: '/showcase'
      },
      {
        name: 'Discord',
        href: '/discord'
      },

      { name: 'GitHub', href: 'https://github.com/CodingTrain' }
    ]
  },
  {
    name: 'About',
    to: '/about',
    children: [{ name: 'FAQ', to: '/faq' }]
  }
];

const Menu = () => {
  const [expanded, setExpanded] = useState(false);
  const { toggle, dark } = useContext(ThemeContext);
  const ModeIcon = dark ? MdOutlineDarkMode : MdOutlineLightMode;
  const modeLabel = dark ? ' Dark Mode' : ' Light Mode';

  return (
    <nav className={css.root}>
      <button
        className={css.menuToggle}
        aria-label="Menu toggle"
        onClick={() => setExpanded(!expanded)}>
        {expanded ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      <ul className={cn(css.menu, { [css.expanded]: expanded })}>
        {/* Added Dark Mode Toggle */}
        <li className={css.item}>
          <span
            role="button" // Role attribute
            tabIndex="0" // Make it focusable
            onClick={toggle}
            onKeyDown={(event) => {
              // Keyboard event
              if (event.key === 'Enter' || event.key === ' ') {
                toggle();
              }
            }}
            className={css.modeToggle}>
            <ModeIcon
              size={expanded ? 16 : 24}
              color={dark ? 'rgba(255, 255, 255, 0.8)' : undefined}
            />
            {expanded && modeLabel}
          </span>
        </li>
        {items.map((item, i) => (
          <li
            key={i}
            className={cn(css.item, { [css.hasSubmenu]: item.children })}>
            {item.to ? (
              <Link to={item.to}>{item.name}</Link>
            ) : item.href ? (
              <a href={item.href}>{item.name}</a>
            ) : (
              <span>{item.name}</span>
            )}
            {item.children && (
              <>
                <ul className={css.submenu}>
                  {item.children.map((subitem, j) => (
                    <li className={css.subitem} key={j}>
                      {subitem.to ? (
                        <Link to={subitem.to}>{subitem.name}</Link>
                      ) : (
                        <a href={subitem.href}>{subitem.name}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
