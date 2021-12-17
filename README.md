# Coding Train Website

This repo holds the website for thecodingtrain.com. The website is built with:

- [Gatsby](https://www.gatsbyjs.com/) to perform the static site rendering
- [React](https://reactjs.org/) as the general JavaScript framework

## Table of Contents

- **[Content Structure Guide](/content/content-structure-guide.md)**. This guide walk you through the process of adding content to the website.

## Development info

When updating the website, it is helpful to run the website locally in order to quickly see the changes made. Make sure you have Node.js version `14.x` installed and then perform the following steps:

1. Clone down the repo to your computer and `cd` into the folder
2. Run `npm install`
3. Run `npm run dev`

This will start a local server and the website will now be accessible on [localhost:8000](http://localhost:8000). Changes to most files will be auto-updated in the browser while the website is running.

**Note:** In some cases, specially when updating loaded content, you need to restart the local server with `npm run dev`.
And in some cases that may fail because of Gatsby's cache usage. If you run `npm run clean` before `npm run dev`, that should fix it.
