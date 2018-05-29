import 'isomorphic-unfetch';
import * as path from 'path-browserify';

/**
 * Returns a merged list of all values for an api endpoint by looking for res.next
 * Will throw if it would need to paginate more than 20 pages
 */
async function paginateRequest(url) {
  const MAX_PAGES = 20; // This seems like a good idea? I dunno
  let respJson = await fetch(url).then(res => res.json());
  let values = respJson.values;
  const pageLen = respJson.pagelen; // The number of elements we'll get per page
  const size = respJson.size; // The number of values once if we were to paginate all of them
  if (size / pageLen > MAX_PAGES) {
    throw new Error('Paginating would require more than ' + MAX_PAGES + ' pages of requests, aborting');
  }
  while (respJson.next) {
    respJson = await fetch(respJson.next).then(res => res.json());
    values = values.concat(respJson.values);
  }
  return values;
}

/**
 * Returns an array of all the files in a directory on a remote for a given branch (ref).
 */
function getAllFilesInDir(gitInfo, filePath) {
  const { account, repository, branch } = gitInfo;
  const apiUrl = `https://api.bitbucket.org/2.0/repositories/${account}/${repository}/src/${branch}/${filePath}`;

  return paginateRequest(apiUrl).then(values => {
    // We can clean up the data and only return what we need here
    return values.map(({ path, size, type, mimetype }) => ({
      path,
      size,
      type,
      mimetype
    }));
  });
}

/**
 * Essentially pkgUp against a repository, given a filePath, will return the path to the closest package.json
 * i.e.
 * packages/
 *   core/
 *     avatar/
 *       index.js
 *       package.json
 * package.json
 * gitPkgUp({..}, 'packages/core/avatar/index.js') => 'packages/core/avatar/package.json'
 * gitPkgUp({..}, 'packages/core/') => './package.json'
 */
// Get the closest package.json relative to a `filePath`
// For repo's where the package.json is in the root, will return './package.json'
async function gitPkgUp(gitInfo, filePath) {
  // Return true if a list of file paths contains a package.json file
  const filesContainPkgJson = (files) => files.some(file => path.basename(file.path) === 'package.json');
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
  const apiUrl = `https://api.bitbucket.org/2.0/repositories/${account}/${repository}/src/${branch}/${filePath}`;
  const resp = await fetch(apiUrl);
  if(path.extname(filePath) === '.json') {
    return resp.json();
  }
  return resp.text();
}

module.exports = {
  gitPkgUp,
  getAllFilesInDir,
  getFile
};
