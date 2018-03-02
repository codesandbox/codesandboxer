import cases from 'jest-in-case';
import fetchRelativeFile from './';
import getUrl from './getUrl';

const BBConfig = {
  account: 'a',
  repository: 'b',
  branch: 'c',
  host: 'bitbucket',
};

test.skip('relative file fetching to be tested', () => {});

cases(
  'getUrl()',
  ({ path, expectedType }) => {
    const { fileType, url } = getUrl(path, BBConfig);
    expect(fileType).toBe(expectedType);
  },
  [
    { name: 'js file', path: 'something.js', expectedType: '.js' },
    { name: 'png file', path: 'something.png', expectedType: '.png' },
    {
      name: 'png file extended',
      path: 'abc/something.png',
      expectedType: '.png',
    },
    {
      name: 'png file extended',
      path: 'abc/something.json',
      expectedType: '.json',
    },
    {
      name: 'root package.json fetch',
      path: 'package.json',
      expectedType: '.json',
    },
  ],
);
