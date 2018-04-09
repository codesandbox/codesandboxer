import fetchFiles from './index';
import isomorphic from 'isomorphic-fetch';

const BBInfo = {
  account: 'atlassian',
  repository: 'atlaskit-mk-2',
  branch: '6546190ec6d8e1e47566882177fa941bcb8bf576',
  host: 'bitbucket',
};

const getMainObj = (userOpts = {}) => ({
  examplePath: 'packages/elements/avatar/examples/01-basicAvatar.js',
  pkgJSON: 'packages/elements/avatar/package.json',
  gitInfo: BBInfo,
  importReplacements: [['packages/elements/avatar/src', '@atlaskit/avatar']],
  dependencies: { '@atlaskit/avatar': 'latest' },
  providedFiles: {},
  ...userOpts,
});

it('should fetch an example from atlaskit', () => {
  const config = {
    examplePath: 'packages/elements/avatar/examples/01-basicAvatar.js',
    pkgJSON: 'packages/elements/avatar/package.json',
    gitInfo: BBInfo,
    importReplacements: [['packages/elements/avatar/src', '@atlaskit/avatar']],
    dependencies: { '@atlaskit/avatar': 'latest' },
  };
  return fetchFiles(getMainObj()).then(res => {
    expect(res.files).toMatchSnapshot();
  });
});
it('should fetch an example from react-select', () => {
  const GHInfo = {
    name: 'JedWatson',
    repository: 'react-select',
    branch: 'f95a710b9e8a7b6134dd38afcf83f05c0f09f71e',
    host: 'github',
  };

  const config = {
    examplePath: 'docs/home/examples/BasicSingle.js',
    gitInfo: GHInfo,
    dependencies: { 'react-select': 'latest' },
  };
  return fetchFiles(getMainObj()).then(res => {
    expect(res).toMatchSnapshot();
  });
});
