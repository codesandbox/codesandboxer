import * as path from 'path';
/*
  Note: This file is never checked into the repo, but **must** exist when building
  To create this file locally, go to https://github.com/settings/tokens, click "generate a new token"
  only give it public_repo access. Now copy that token into a file called `github-auth.json` in this directory
  in this format:
  {
    "access_token": "yourTokenHere"
  }
*/
import { access_token } from './github-auth';

async function getAllFilesInDir(gitInfo, filePath) {
  const { account, repository, branch } = gitInfo;
  const apiUrl = `https://api.github.com/repos/${account}/${repository}/contents/${filePath}?ref=${branch}&access_token=${access_token}`;
  const resp = await fetch(apiUrl).then(res => res.json());
  const files = resp.map(({ path: file, type }) => ({
    path: file,
    type
  }));
  return files;
}

async function gitPkgUp(gitInfo, filePath) {
  // Return true if a list of file paths contains a package.json file
  const filesContainPkgJson = files =>
    files.some(file => path.basename(file.path) === 'package.json');
  let curPath = path.dirname(filePath);
  let filesInDir = await getAllFilesInDir(gitInfo, curPath);
  while (!filesContainPkgJson(filesInDir) && curPath !== '.') {
    curPath = path.dirname(curPath);
    filesInDir = await getAllFilesInDir(gitInfo, curPath);
  }
  if (!filesContainPkgJson(filesInDir)) {
    throw new Error('Unable to find a package.json');
  }
  return path.join(curPath, 'package.json').replace('./', '');
}

async function getFile(gitInfo, filePath) {
  const { account, repository, branch } = gitInfo;
  const apiUrl = `https://api.github.com/repos/${account}/${repository}/contents/${filePath}?ref=${branch}&access_token=${access_token}`;
  const resp = await fetch(apiUrl).then(res => res.json());
  const fileStr = atob(resp.content); // content is base64 encoded
  if (path.extname(filePath) === '.json') {
    return JSON.parse(fileStr);
  }
  return fileStr;
}

module.exports = {
  getFile,
  gitPkgUp
};
