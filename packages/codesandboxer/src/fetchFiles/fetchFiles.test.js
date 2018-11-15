import fetchFiles from './index';
/* eslint-disable-next-line no-unused-vars */
import isomorphic from 'isomorphic-unfetch';

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

const getSandboxerObj = (userOpts = {}) => ({
  examplePath: 'fixtures/simple.js',
  pkgJSON: 'package.json',
  gitInfo: {
    account: 'Noviny',
    repository: 'codesandboxer',
    branch: 'master',
    host: 'github',
  },
  dependencies: { '@atlaskit/avatar': 'latest' },
  providedFiles: {},
  ...userOpts,
});

it('should fetch an example from atlaskit', () => {
  return fetchFiles(getMainObj()).then(res => {
    expect(res.files).toMatchSnapshot();
  });
});
it('should fetch our basic fixture example', () => {
  return fetchFiles(getSandboxerObj()).then(res => {
    expect(res.files).toMatchSnapshot();
  });
});
it('should fetch a css example from our fixtures', () => {
  return fetchFiles(
    getSandboxerObj({ examplePath: 'fixtures/withCssImport.js' }),
  ).then(res => {
    expect(res.files).toMatchSnapshot();
  });
});
