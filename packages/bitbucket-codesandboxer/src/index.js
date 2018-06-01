import loadingSpinnerStyles from './styles/loading.css'; // eslint-disable-line
import queryString from 'query-string';
import * as codesandboxer from 'codesandboxer';
import * as bitbucket from './utils/bitbucket';
import * as github from './utils/github';

const qs = queryString.parse(location.search);

if (!qs.file || !qs.repoOwner || !qs.repoSlug || !qs.host || !qs.commit) {
  console.error('Error: expected queryString parameters for file, repoOwner, repoSlug, host and commit');
  console.error('queryString: ', qs);
  throw new Error('Invalid queryString');
}

const options = {
  examplePath: qs.file,
  gitInfo: {
    account: qs.repoOwner,
    repository: qs.repoSlug,
    host: qs.host,
    branch: qs.commit
  }
};
const provider = qs.host === 'bitbucket' ? bitbucket : github;

provider.gitPkgUp(options.gitInfo, qs.file)
  .then(packageJsonPath => provider.getFile(options.gitInfo, packageJsonPath))
  .then(pkgJSON => codesandboxer.fetchFiles({ ...options, pkgJSON }))
  .then(files => codesandboxer.finaliseCSB(files))
  .then(({ parameters }) => codesandboxer.sendFilesToCSB(parameters))
  .then(({ sandboxUrl }) => {
    window.open(sandboxUrl, '_blank', '');
  });
