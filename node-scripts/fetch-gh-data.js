const glob = require('glob');
const fs = require('fs');
const path = require('path');

const { Octokit } = require('@octokit/core');

async function main() {
  const octokit = new Octokit({
    auth: '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'
  });

  const files = glob
    .sync('content/videos/**/contribution*.json')
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      return { _filename: file, data };
    })
    .filter((file) => !file.data.submittedOn);
  console.log(`Found ${files.length} files`);

  // get contents
  const { data } = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: 'CodingTrain',
      repo: 'website-archive',
      path: '_CodingChallenges'
    }
  );
  // data.forEach(async (file) => {
  // const {download_url} = file;
}

main();
