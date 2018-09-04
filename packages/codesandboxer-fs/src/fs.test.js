// @flow
const assembleFiles = require('./assembleFiles');
const cases = require('jest-in-case');

const baseFiles = ['package.json', 'index.html', 'example.js', 'index.js'];

cases(
  'load fixtures with fs',
  async (
    {
      name,
      extraDeps = {},
      expectedFiles = baseFiles,
    } /*: { name: string , extraDeps?: { [string]: string }, expectedFiles?: Array<mixed> }*/,
  ) => {
    try {
      const { files, dependencies } = await assembleFiles(name);
      const expectedDeps = {
        react: '^16.2.0',
        'react-dom': '^16.2.0',
        ...extraDeps,
      };

      expect(expectedDeps).toMatchObject(dependencies);
      expect(dependencies).toMatchObject(expectedDeps);
      expect(Object.keys(files)).toEqual(expect.arrayContaining(expectedFiles));
    } catch (e) {
      if (e.key) {
        console.log('failed with known error', e);
        throw e;
      } else {
        throw e;
      }
    }
  },
  // Fun note, since jest is being run from our package root, the paths here are
  // relative to that
  [
    { name: 'fixtures/simple' },
    {
      name: 'fixtures/withAbsoluteImport',
      extraDeps: { 'react-node-resolver': '^1.0.1', resolve: '^1.7.1' },
    },
    {
      name: 'fixtures/withRelativeImport',
      expectedFiles: ['fixtures/simple.js'],
    },
    {
      name: 'fixtures/withPNG',
      expectedFiles: ['fixtures/testImage.png'],
    },
    {
      name: 'fixtures/scoped/index.js',
      extraDeps: { foo: '0.3.1', react: 'latest', 'react-dom': 'latest' },
    },
    {
      name: 'fixtures/importResolution/jsx/A.jsx',
      expectedFiles: ['example.jsx'],
    },
    {
      name: 'fixtures/importResolution/jsx/B.jsx',
      expectedFiles: ['example.jsx', 'fixtures/importResolution/jsx/A.jsx'],
    },
    {
      name: 'fixtures/withJSONImport',
    },
    {
      expectedFiles: ['fixtures/importResolution/css/A.css'],
      name: 'fixtures/withCssImport',
    },
    {
      // This test tests for the resolution of https://github.com/Noviny/codesandboxer/issues/21
      skip: true,
      expectedFiles: ['fixtures/importResolution/css/A.css'],
      name: 'fixtures/withCssImportNoDeclaration',
    },
  ],
);
