import queryString from 'query-string';
import * as codesandboxer from 'codesandboxer';
import loadingSpinnerStyles from './loading.css'; // eslint-disable-line
import * as bitbucket from '../../utils/bitbucket';
import * as github from '../../utils/github';

const qs = queryString.parse(location.search);
const spinnerEle = document.getElementById('spinner');
const statusEle = document.getElementById('status');
const subStatusEle = document.getElementById('subStatus');

function updateStatus(status = '', subStatus = '') {
  // We use innerHtml because we want to be able to inject an anchor
  statusEle.innerHTML = status;
  subStatusEle.innerHTML = subStatus;
}

function getFileUrl(csbOptions) {
  const { account, repository, branch } = csbOptions.gitInfo;
  if (csbOptions.gitInfo.host === 'bitbucket') {
    return `https://bitbucket.org/${account}/${repository}/src/${branch}/${csbOptions.examplePath}`;
  } else {
    return `https://github.com/${account}/${repository}/tree/${branch}/${csbOptions.examplePath}`;
  }
}

function onSuccess(sandboxUrl) {
  const subStatus = `You will be automatically redirected (or you can click <a href="${sandboxUrl}">here</a>)`;
  updateStatus('Success!', subStatus);
  spinnerEle.innerHTML = '&#10003;';
  spinnerEle.classList.remove('spinner');
  spinnerEle.classList.add('success');
}

if (!qs.file || !qs.repoOwner || !qs.repoSlug || !qs.host || !qs.commit) {
  console.error('Error: expected queryString parameters for file, repoOwner, repoSlug, host and commit');
  console.error('queryString: ', qs);
  updateStatus('Error: Invalid queryString (see console)');
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

updateStatus('Uploading example', getFileUrl(options));
const provider = qs.host === 'bitbucket' ? bitbucket : github;

provider.gitPkgUp(options.gitInfo, qs.file)
  .then(packageJsonPath => provider.getFile(options.gitInfo, packageJsonPath))
  .then(pkgJSON => {
    updateStatus('Uploading example', 'Fetching files...');
    return pkgJSON;
  })
  .then(pkgJSON => codesandboxer.fetchFiles({ ...options, pkgJSON }))
  .then(files => {
    updateStatus('Uploading example', 'Crafting payload...');
    return files;
  })
  .then(files => codesandboxer.finaliseCSB(files))
  .then(({ parameters }) => codesandboxer.sendFilesToCSB(parameters))
  .then(({ sandboxUrl }) => {
    onSuccess(sandboxUrl);
    window.open(sandboxUrl, '_blank', '');
  });
