import * as path from 'path';

async function getAllFilesInDir(gitInfo, filePath) {
  const { account, repository, branch } = gitInfo;
  const apiUrl = `https://api.github.com/repos/${account}/${repository}/contents/${filePath}?ref=${branch}&access_token=9f21e76018d76e9ced93f181e9f37953a7f37251`;
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
  const apiUrl = `https://api.github.com/repos/${account}/${repository}/contents/${filePath}?ref=${branch}&access_token=9f21e76018d76e9ced93f181e9f37953a7f37251`;
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
