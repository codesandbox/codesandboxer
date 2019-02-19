import * as path from 'path-browserify';

function apiBase(gitInfo) {
  const { account, repository, branch } = gitInfo;
  return `https://api.bitbucket.org/2.0/repositories/${account}/${repository}/src/${branch}`;
}

async function paginateRequest(url) {
  const MAX_PAGES = 20; // This seems like a good idea? I dunno
  let respJson = await fetch(url).then(res => res.json());
  let values = respJson.values;
  const pageLen = respJson.pagelen; // The number of elements we'll get per page
  const size = respJson.size; // The number of values once if we were to paginate all of them
  if (size / pageLen > MAX_PAGES) {
    throw new Error(
      'Paginating would require more than ' +
        MAX_PAGES +
        ' pages of requests, aborting',
    );
  }
  while (respJson.next) {
    respJson = await fetch(respJson.next).then(res => res.json());
    values = values.concat(respJson.values);
  }
  return values;
}

function getBitbucketDir(gitInfo, dirPath) {
  if (dirPath === '/') dirPath = '';
  const apiUrl = `${apiBase(gitInfo)}/${dirPath}`;

  return paginateRequest(apiUrl).then(values => {
    // We can clean up the data and only return what we need here
    return values.map(({ path: filePath, size, type }) => ({
      path: filePath,
      size,
      type: type === 'commit_file' ? 'file' : 'directory',
    }));
  });
}

async function gitPkgUp(gitInfo, filePath) {
  // Return true if a list of file paths contains a package.json file
  const filesContainPkgJson = files =>
    files.some(file => path.basename(file.path) === 'package.json');
  let curPath = path.dirname(filePath);
  let filesInDir = await getBitbucketDir(gitInfo, curPath);
  while (!filesContainPkgJson(filesInDir) && curPath !== '.') {
    curPath = path.dirname(curPath);
    filesInDir = await getBitbucketDir(gitInfo, curPath);
  }
  if (!filesContainPkgJson(filesInDir)) {
    throw new Error('Unable to find a package.json');
  }
  return path.join(curPath, 'package.json').replace('./', '');
}

async function getFile(gitInfo, filePath) {
  const apiUrl = `${apiBase(gitInfo)}/${filePath}`;
  const resp = await fetch(apiUrl);
  if (path.extname(filePath) === '.json') {
    return resp.json();
  }
  return resp.text();
}

module.exports = {
  getBitbucketDir,
  gitPkgUp,
  getFile,
};
