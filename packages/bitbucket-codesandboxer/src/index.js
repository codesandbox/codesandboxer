import 'babel-polyfill';
import loadingSpinnerStyles from './styles/loading.css'; // eslint-disable-line
import queryString from 'query-string';
import * as path from 'path-browserify';
import * as codesandboxer from 'codesandboxer';
import * as bitbucket from './bitbucket';

const qs = queryString.parse(location.search);

if (!qs.file || !qs.repoOwner || !qs.repoSlug) {
  console.error('Error: expected queryString parameters for file, repoOwner and repoSlug');
  console.error('queryString: ', qs);
}

const options = {
  examplePath: qs.file,
  gitInfo: {
    account: qs.repoOwner,
    repository: qs.repoSlug,
    host: 'bitbucket',
    branch: 'master'
  }
};

bitbucket.gitPkgUp(options.gitInfo, qs.file)
  .then(packageJsonPath => bitbucket.getFile(options.gitInfo, packageJsonPath))
  .then(pkgJSON => codesandboxer.fetchFiles({ ...options, pkgJSON }))
  .then(files => codesandboxer.finaliseCSB(files))
  .then(({ parameters }) => codesandboxer.sendFilesToCSB(parameters))
  .then(({ sandboxUrl }) => {
    window.location = sandboxUrl;
  });
