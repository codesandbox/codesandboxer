import cases from 'jest-in-case';
import getAllImports from './getAllImports';
import resolvePath from './resolvePath';

const codeImportTests = [
  { name: 'simple import', code: `import a from 'b'` },
  { name: 'spread import', code: `import { a } from 'b'` },
  { name: 'two imports', code: `import a from 'b' import c from 'd'` },
  {
    name: 'multiline imports',
    code: `import a from 'b'
import c from 'd'`,
  },
  { name: 'two spread imports', code: `import { a, b } from 'c'` },
  {
    name: 'two spread imports multiline',
    code: `import {
  a,
  b
} from 'c'`,
  },
  { name: 'no spaces', code: `import {a} from 'b'` },
  {
    name: 'dev and peer deps',
    code: `import {a} from 't' import s from 'z' import y from 'x'`,
  },
  {
    name: 'relativeImport',
    code: `import {a} from './c'`,
  },
  {
    name: 'using regex pattern',
    code: `import a from './c/somewhere' import b from './c/anywhere'`,
    old: './c/*',
    new: 'c/',
  },
];

cases(
  'getAllImports()',
  ({ code }) => {
    let mpts = getAllImports(code);
    expect(mpts).toMatchSnapshot();
  },
  codeImportTests,
);

cases(
  'resolvePath',
  ({ basePath, relativePath, returnedPath }) => {
    let res = resolvePath(basePath, relativePath);
    expect(res).toBe(returnedPath);
  },
  [
    { basePath: 'a/b/c', relativePath: '../z', returnedPath: 'a/z' },
    {
      basePath: 'a/b/c',
      relativePath: '../../z/x',
      returnedPath: 'z/x',
    },
    { basePath: 'a/b/c', relativePath: './z', returnedPath: 'a/b/z' },
    {
      basePath: 'a/b/c',
      relativePath: '../../../z/x',
      returnedPath: 'a/b/c',
    },
    {
      basePath: 'a/b/c',
      relativePath: 'zxy',
      returnedPath: 'a/b/c/zxy',
    },
    {
      basePath: 'a/b/c/',
      relativePath: './zxy',
      returnedPath: 'a/b/zxy',
    },
  ],
);
