import React, { useState, useLayoutEffect } from 'react';

/**
 * ThemeContext is a Context that holds the state of the theme and the method to toggle it
 * @type {React.Context<{dark: boolean, toggle: () => void}>}
 * @returns {JSX.Element}
 * @constructor
 * @param {boolean} dark - the current state of the theme
 * @param {() => void} toggle - the method to toggle the theme
 * @returns {JSX.Element}
 *
 */
export const ThemeContext = React.createContext({
  dark: false,
  toggle: () => {}
});

/**
 * ThemeProvider component is a Context Provider that passes down the state and the method to toggle the theme
 * @param children - the child components wrapped by the ThemeProvider
 * @returns {JSX.Element}
 *
 */
export default function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useLayoutEffect(() => {
    const storedPreference = localStorage.getItem('darkModePreference');
    if (storedPreference !== null) {
      setDark(JSON.parse(storedPreference));
    } else {
      const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setDark(prefersDarkMode);
    }
  }, []);

  useLayoutEffect(() => {
    applyTheme();
  }, [dark]);

  const applyTheme = () => {
    let theme;
    if (dark) {
      theme = darkTheme;
      localStorage.setItem('darkModePreference', 'true');
    } else {
      theme = lightTheme;
      localStorage.setItem('darkModePreference', 'false');
    }

    const root = document.getElementsByTagName('html')[0];
    root.style.cssText = theme.join(';');
  };

  const toggle = () => {
    const body = document.getElementsByTagName('body')[0];
    body.style.cssText = 'transition: background .5s ease';
    setDark(!dark);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
// styles
const lightTheme = [
  '--text-color: #000000',
  '--gray-dark: #3c3c3c',
  '--gray-mid: #666666',
  '--gray-light: #ededed',
  '--gray-light-hover: #cfcfcf',

  '--cyan: #2dc5f4',
  '--cyan-light: #eefbff',
  '--pink: #f063a4',
  '--pink-light: #ffebf4',
  '--pink-tint: #fff7fa',
  '--orange: #f89e4f',
  '--orange-light: #fff1e5',
  '--purple: #9253a1',
  '--purple-light: #f0e1f3',
  '--red: #f16164',
  '--red-light: #fff3f3',
  '--red-lightest: #fffcfc',

  '--linear-gradient-on-card: linear-gradient(0deg,rgba(255, 255, 255, 1) 30%,rgba(255, 255, 255, 0) 100%)'
];

const darkTheme = [
  '--text-color: #f0f0f0',
  '--background-color: #1e1d20',
  '--gray-dark: #1f1f1f',
  '--gray-mid: #b3b3b3',
  '--gray-light: #2d2d2d',

  '--gray-light-hover: #404040',
  '--cyan: #00b2d6',
  '--cyan-light: #003f4d',

  '--pink: #e6005c',
  '--pink-light: #3a0018',
  '--pink-tint: #2a001a',

  '--orange: #d97f26',
  '--orange-light: #3a2410',

  '--purple: #7c3b82',
  '--purple-light: #2c0e2f',

  '--red: #d1414c',
  '--red-light: #3f1519',
  '--red-lightest: #1e1d20',

  '--linear-gradient-on-card: linear-gradient(0deg,rgba(0, 0, 0, 0.842) 30%,rgba(255, 255, 255, 0) 100%)'
];
