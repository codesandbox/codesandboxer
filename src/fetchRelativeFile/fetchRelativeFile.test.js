import cases from 'jest-in-case';
import fetchRelativeFile from './';
import getUrl from './getUrl';
import isomorphic from 'isomorphic-fetch';
const BBConfig = {
  account: 'noviny',
  repository: 'react-codesandboxer',
  branch: 'ca41dfb340eed67c7f755e0b03939652d1f42cc7',
  host: 'github',
};

describe('fetchRelativeFile()', () => {
  it('should fetch a .js file in a subdirectory', async () => {
    return fetchRelativeFile(
      'src/CodeSandboxer/index.js',
      {},
      [],
      BBConfig,
    ).then(({ file, deps, internalImports }) => {
      expect(deps).toMatchObject({ react: 'latest' });
      expect(internalImports).toEqual(
        expect.arrayContaining(['../types', '../fetchFiles']),
      );
      expect(file).toMatchSnapshot();
    });
  });
  it('should fetch a .js file at the root');
  it('should fetch a .png file in a subdirectory');
  it('should fetch a .png file at the root');
  it('should fetch a .json file in a subdirectory');
  it('should fetch a .json file at the root', async () => {
    return fetchRelativeFile('package.json', {}, [], BBConfig).then(
      ({ file, deps, internalImports }) => {
        expect(deps).toMatchObject({});
        expect(internalImports).toEqual(expect.arrayContaining([]));
        expect(file).toMatchSnapshot();
      },
    );
  });
});

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
