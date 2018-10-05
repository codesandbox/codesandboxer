// @flow
import type { GitInfo } from '../types';
import path from 'path-browserify';

const raw = {
  github: (filePath, { account, repository, branch = 'master' }) =>
    `https://raw.githubusercontent.com/${account}/${repository}/${branch}/${filePath}`,
  bitbucket: (filePath, { account, repository, branch = 'master' }) =>
    `https://api.bitbucket.org/1.0/repositories/${account}/${repository}/raw/${branch}/${filePath}`,
};

export default function getUrl(
  filePath: string,
  { host, ...urlConfig }: GitInfo,
) {
  let getRaw = raw[host];
  if (typeof getRaw !== 'function') {
    throw new Error(`Could not parse files from ${host}`);
  }

  let url = getRaw(filePath, urlConfig);
  let extName = path.extname(filePath);
  if (!extName) {
    return { fileType: '.js', url: `${url}.js` };
  } else {
    return { fileType: extName, url };
  }
}
