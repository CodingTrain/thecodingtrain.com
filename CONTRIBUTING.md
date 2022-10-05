# All Aboard The Coding Train for Hacktoberfest 2022

One of the major goals of The Coding Train is to provide a beginner-friendly environment for people to make pull requests, which is why we are participating in [Hacktoberfest](https://hacktoberfest.com/participation/) this year.  Hacktoberfest is DigitalOcean's annual event that encourages people to contribute to open source throughout October.

Here are some key values of Hacktoberfest:
- Everyone is welcome
- Quantity is Fun, Quality is Key
- Short-term Act, long term impact

The Coding Train strives to be a respectful, friendly, and welcoming community. Read our [Code of Conduct](https://github.com/CodingTrain/Code-of-Conduct) to learn about what is and is not acceptable.

## Guide For Newer Contributors

Get an overview of the project in [README](https://github.com/CodingTrain/thecodingtrain.com#readme). If you are new to open source contributions, here are some useful guides that can help you get started:
- [Git and GitHub for Poets](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZF9C0YMKuns9sLDzK6zoiV): A Coding Train video series for Git and GitHub beginners.
- [Collaborating With Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests): A GitHub guide on pull requests.

## Contributing to Coding Train

Here are the types of contributions we are looking for this month:

1. Share your creative work inspired by a coding challenge or tutorial in the showcase!
* You can find more information about submitting a showcase in the [Passenger Showcase Guide](http://thecodingtrain.com/guides/passenger-showcase-guide)

2. Create a page for a Coding Challenge video! (https://github.com/CodingTrain/thecodingtrain.com/issues/155)
* Head to the [spreadsheet tracking challenges](https://docs.google.com/spreadsheets/d/1zt8KquMZN_j2-j4ezMsgeq-sRrgoCEAROwFS6LTS8oQ/edit#gid=1236591781) and sign up.
* For instructions, read the [Maintaining the website guide](/guides/maintain-weibsite-guide/) on how to create a challenge page on the new website.  
* Note: If you are unable to complete the page, please add a note and remove your name from the spreadsheet.

3. Add Related Challenges! (https://github.com/CodingTrain/thecodingtrain.com/issues/262)
* The `"relatedChallenges"` property specifies a list of challenges to be featured as suggested on the video page.
*  If it is an empty array and there are any coding challenges in the `"video"` section of the json file, those challenge(s) can be added to the field.
 - You can find the JSON files for challenges in `/content/videos/challenges`.

4. More!
* You can find more things to [work on listed in issues](https://github.com/CodingTrain/thecodingtrain.com/issues).

### Getting Started
Here is a guide to the content structure of the website to help you through the process of contributing.
- [Content Structure Guide](https://github.com/CodingTrain/thecodingtrain.com/blob/main/content/pages/guides/content-structure-guide.md)

### Issues

If you are about to create a new issue, search if an issue already exists regarding the same problem. If a related issue doesn't exist, go ahead and open an issue describing the problem. An issue could be about a bug that you discovered, a suggested change or even a discussion.

To find an issue that you want to fix, scan through the list. You may find that the `labels` are helpful in this situation. You can use them as a filter as well while searching.

### Making Changes

- To make changes to this repository, make sure to fork it and make changes to your fork locally, without harming the original project.
- It is good practice to create a different branch for different changes.
- Commit the changes you are making at every step, and make sure to add good commit messages describing the part you added/changed with that specific commit.
- When you are happy with your changes and are ready to publish them, make a pull request. We will review your suggested changes and hopefully merge them!

### Development Environment

Make sure you have Node.js version `16.x` as well as npm installed. You can find how to test your changes locally [here](https://github.com/CodingTrain/thecodingtrain.com#development-info).

