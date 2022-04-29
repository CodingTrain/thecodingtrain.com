import React, { useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import * as css from './Menu.module.css';

import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const items = [
  {
    name: 'Get Started',
    to: '/guides/getting-started'
  },
  {
    name: 'Videos',
    children: [
      { name: 'Tracks', to: '/tracks' },
      { name: 'Challenges', to: '/challenges' },
      { name: 'FAQ', to: '/faq' }
    ]
  },
  {
    name: 'Community',
    children: [
      {
        name: 'Discord',
        href: 'https://discord.com/invite/hPuGy2g'
      },
      {
        name: 'Guides',
        to: '/guides'
      },
      { name: 'GitHub', href: 'https://github.com/CodingTrain' }
    ]
  },
  {
    name: 'About',
    to: '/about'
  }
];

const Menu = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={css.root}>
      <button
        className={css.menuToggle}
        aria-label="Menu toggle"
        onClick={() => setExpanded(!expanded)}>
        {expanded ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>
      <ul className={cn(css.menu, { [css.expanded]: expanded })}>
        {items.map((item, i) => (
          <li
            key={i}
            className={cn(css.item, { [css.hasSubmenu]: item.children })}>
            {item.to ? (
              <Link to={item.to}>{item.name}</Link>
            ) : item.href ? (
              <a href={item.href}>{item.name}</a>
            ) : (
              <>
                <span>{item.name}</span>
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
    </div>
  );
};

export default Menu;
