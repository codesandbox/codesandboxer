import fetchFiles from './index';
/* eslint-disable-next-line no-unused-vars */
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
  return fetchFiles(getMainObj()).then(res => {
    expect(res.files).toMatchSnapshot();
  });
});
it('should fetch an example from react-select', () => {
  return fetchFiles(getMainObj()).then(res => {
    expect(res.files).toMatchSnapshot();
  });
});
