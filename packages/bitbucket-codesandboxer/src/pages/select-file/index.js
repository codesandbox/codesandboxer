import React from 'react';
import ReactDOM from 'react-dom';
import GitFileSelector from '../../components/GitFileExplorer';
import queryString from 'query-string';

import * as codesandboxer from 'codesandboxer';
import * as bitbucket from '../../utils/bitbucket';

// TODO: Add support for github here

const qs = queryString.parse(location.search);
let repoOwner = 'atlassian';
let repoName = 'atlaskit-mk-2';
let commit = 'master';

if (!qs.commit || !qs.repoOwner || !qs.repoSlug) {
  console.error(
    'Error: expected queryString parameters for commit, repoOwner and repoSlug'
  );
  console.error('queryString: ', qs);
  console.error('Using defaults');
} else {
  repoOwner = qs.repoOwner;
  repoName = qs.repoSlug;
  commit = qs.commit;
}

function deployExample(filePath) {
  const options = {
    examplePath: filePath,
    gitInfo: {
      account: repoOwner,
      repository: repoName,
      host: 'bitbucket',
      branch: commit,
    },
  };
  bitbucket
    .gitPkgUp(options.gitInfo, options.examplePath)
    .then(packageJsonPath =>
      bitbucket.getFile(options.gitInfo, packageJsonPath)
    )
    .then(pkgJSON => codesandboxer.fetchFiles({ ...options, pkgJSON }))
    .then(files => codesandboxer.finaliseCSB(files))
    .then(({ parameters }) => codesandboxer.sendFilesToCSB(parameters))
    .then(({ sandboxUrl }) => {
      window.open(sandboxUrl, '_blank', '');
    });
}

const outerFlexWrapper = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

const App = () => (
  <div style={outerFlexWrapper}>
    <div style={{ minWidth: '600px', minHeight: '450px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>
        Select an example file to upload
      </h1>
      <GitFileSelector
        repoOwner={repoOwner}
        repoName={repoName}
        branch={commit}
        onFileSelect={deployExample}
      />
    </div>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
