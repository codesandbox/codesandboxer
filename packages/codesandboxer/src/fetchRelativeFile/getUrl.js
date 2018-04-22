// @flow
import type { GitInfo } from '../types';

const raw = {
  github: (path, { account, repository, branch = 'master' }) =>
    `https://raw.githubusercontent.com/${account}/${repository}/${branch}/${path}`,
  bitbucket: (path, { account, repository, branch = 'master' }) =>
    `https://api.bitbucket.org/1.0/repositories/${account}/${repository}/raw/${branch}/${path}`,
};

export default function getUrl(
  path: string,
  { host, ...urlConfig }: GitInfo,
) {
  let getRaw = raw[host];
  if (typeof getRaw !== 'function')
    throw new Error(`Could not parse files from ${host}`);

  let url = getRaw(path, urlConfig);
  let fileType = '';
  let fileMatch = path.match(/.+(\..+)$/);
  if (!fileMatch) {
    return { fileType: '.js', url: `${url}.js` };
  } else {
    return { fileType: fileMatch[1], url };
  }
}
