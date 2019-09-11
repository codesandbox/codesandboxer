import cases from 'jest-in-case';
import fetchRelativeFile from './';
import getUrl from './getUrl';
/* eslint-disable-next-line no-unused-vars */
import isomorphic from 'isomorphic-unfetch';
import pkgJSON from '../../../../package.json';
const GHConfig = {
  account: 'noviny',
  repository: 'react-codesandboxer',
  branch: '8935bc99739eff1df5961a22782e7cacbb145c5a',
  host: 'github',
};

cases(
  'fetchRelativeFile()',
  ({
    name,
    pkg = pkgJSON,
    expectedDeps = {},
    expectedInternal = [],
    config,
    json,
  }) => {
    expectedDeps = { react: '^16.2.0', ...expectedDeps };
    return fetchRelativeFile(name, pkg, [], GHConfig, config).then(
      // We are not currently testing the file's contents. Maybe we should do this
      ({ file, deps, internalImports }) => {
        if (!json) {
          expect(expectedDeps).toEqual(deps);
          expect(expectedInternal).toEqual(internalImports);
        } else {
          expect({}).toEqual(deps);
          expect([]).toEqual(internalImports);
          let contents = JSON.parse(file);
          expect(contents).toEqual(json);
        }
      }
    );
  },
  [
    {
      name: 'fixtures/simple',
    },
    {
      name: 'fixtures/withAbsoluteImport',
      expectedDeps: { 'react-node-resolver': '^1.0.1', resolve: '^1.7.1' },
    },
    {
      name: 'fixtures/withRelativeImport',
      expectedInternal: ['./simple'],
    },
    {
      name: 'fixtures/importResolution/js/A',
    },
    {
      name: 'fixtures/importResolution/json/A',
      json: { a: 'A.json file' },
    },
    {
      name: 'fixtures/importResolution/jsx/A',
      config: { extensions: ['.jsx'] },
    },
    {
      name: 'fixtures/importResolution/ts/A',
      config: { extensions: ['.ts'] },
    },
    {
      name: 'fixtures/importResolution/tsx/A',
      config: { extensions: ['.tsx'] },
    },
    {
      name: 'fixtures/importResolution/fromIndex/js',
    },
    {
      name: 'fixtures/importResolution/fromIndex/js/',
    },
    {
      name: 'fixtures/importResolution/fromIndex/json',
      json: { a: 'index.json file' },
    },
    {
      name: 'fixtures/importResolution/fromIndex/jsx',
      config: { extensions: ['.jsx'] },
    },
  ]
);

cases(
  'getUrl()',
  ({ path, expectedType }) => {
    const { fileType } = getUrl(path, GHConfig);
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
  ]
);
