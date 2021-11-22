import React, { useState } from 'react';
import { Link } from 'gatsby';
import cn from 'classnames';

import * as css from './Menu.module.css';

import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const items = [
  {
    name: 'Get Started',
    href: '/'
  },
  {
    name: 'Videos',
    children: [
      { name: 'Tracks', href: '/tracks' },
      { name: 'Challenges', href: '/challenges' }
    ]
  },
  {
    name: 'Community',
    href: '/'
  },
  {
    name: 'About',
    href: '/about'
  }
];

const Menu = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={css.root}>
      <button className={css.menuToggle} onClick={() => setExpanded(!expanded)}>
        {expanded ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>
      <ul className={cn(css.menu, { [css.expanded]: expanded })}>
        {items.map((item, i) => (
          <li
            key={i}
            className={cn(css.item, { [css.hasSubmenu]: item.children })}>
            {item.href ? (
              <Link to={item.href}>{item.name}</Link>
            ) : (
              <>
                <span>{item.name}</span>
                <ul className={css.submenu}>
                  {item.children.map((subitem, j) => (
                    <li className={css.subitem} key={j}>
                      <Link to={subitem.href}>{subitem.name}</Link>
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
