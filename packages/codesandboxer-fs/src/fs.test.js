// @flow
const assembleFiles = require('./assembleFiles');
const cases = require('jest-in-case');

const baseFiles = ['package.json', 'index.html', 'example.js', 'index.js'];

cases(
  'load fixtures with fs',
  async (
    {
      name,
      deps,
      expectedFiles = baseFiles,
      fileName = 'example.js',
    } /*: { name: string , deps?: { [string]: string }, expectedFiles?: Array<mixed>, fileName?: string }*/,
  ) => {
    try {
      const { files, dependencies } = await assembleFiles(name);
      const expectedDeps = deps || {
        react: '^16.2.0',
        'react-dom': '^16.2.0',
      };

      expect(expectedDeps).toMatchObject(dependencies);
      expect(dependencies).toMatchObject(expectedDeps);
      expect(Object.keys(files)).toContain(fileName);
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
      name: 'fixtures/withSass',
      expectedFiles: [
        'fixtures/importResolution/sass/A.sass',
        'fixtures/importResolution/sass/B.sass',
      ],
    },
    {
      name: 'fixtures/withScss',
      expectedFiles: [
        'fixtures/importResolution/scss/A.scss',
        'fixtures/importResolution/scss/B.scss',
      ],
    },
    {
      name: 'fixtures/withAbsoluteImport',
      deps: {
        'react-node-resolver': '^1.0.1',
        resolve: '^1.7.1',
        'react-dom': '^16.2.0',
        react: '^16.2.0',
      },
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
      deps: { foo: '0.3.1', react: 'latest', 'react-dom': 'latest' },
    },
    {
      name: 'fixtures/importResolution/jsx/A.jsx',
      expectedFiles: ['example.jsx'],
      fileName: 'example.jsx',
    },
    {
      name: 'fixtures/importResolution/jsx/B.jsx',
      fileName: 'example.jsx',
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
      expectedFiles: ['fixtures/importResolution/css/A.css'],
      name: 'fixtures/withCssImportNoDeclaration',
    },
    {
      expectedFiles: ['example.vue'],
      deps: { vue: 'latest' },
      name: 'fixtures/simpleVue.vue',
      fileName: 'example.vue',
    },
    {
      expectedFiles: ['example.tsx'],
      name: 'fixtures/importResolution/tsx/A.tsx',
      fileName: 'example.tsx',
      deps: { react: '^16.2.0', 'react-dom': '^16.2.0' },
    },
  ],
);
