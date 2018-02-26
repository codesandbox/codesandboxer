import cases from 'jest-in-case';
import fetchRelativeFile from '../fetchRelativeFile';

const BBConfig = {
  account: 'atlassian',
  repository: 'atlaskit-mk-2',
  branch: 'master',
  host: 'bitbucket',
};

cases(
  'fetchRelativeFile',
  ({ basePath, source, returnedPath }) => {
    let res = fetchRelativeFile(basePath, source, {}, BBConfig);
    expect(res).toBe(returnedPath);
  },
  [
    { basePath: 'a/b/c', source: '../z' },
    {
      basePath: 'a/b/c',
      source: '../../z/x.png',
    },
    { basePath: 'a/b/c', source: './z' },
    {
      basePath: 'a/b/c',
      source: '../../../z/x',
    },
    {
      basePath: 'a/b/c',
      source: 'zxy',
    },
    {
      basePath: 'a/b/c/',
      source: './zxy',
    },
  ],
);
