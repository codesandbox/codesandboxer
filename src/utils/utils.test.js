// @flow
import cases from 'jest-in-case';
import getAllImports from './getAllImports';
import resolvePath from './resolvePath';
import absolutesToRelative from './absolutesToRelative';
import path from 'path';

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
  {
    name: 'import then immediately export',
    code: `export { default } from './abc'`,
    old: './abc',
    new: './cde',
  },
  {
    name: 'import then immediately export as value',
    code: `export { default as something } from './abc'`,
    old: './abc',
    new: './cde',
  },
  {
    name: 'import then immediately export not default',
    code: `export { urd as something } from './abc' } from 'esk'`,
    old: './abc',
    new: './cde',
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
  'resolvePath()',
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

cases(
  'absolutesToRelative different dirs',
  ({ currentLocation, targetLocation }) => {
    let actualPath = path.relative(
      path.dirname(currentLocation),
      targetLocation,
    );
    expect(absolutesToRelative(currentLocation, targetLocation)).toBe(
      actualPath,
    );
  },
  [
    {
      name: 'basic case',
      currentLocation: 'examples/somewhere.js',
      targetLocation: 'src',
    },
    {
      name: 'more deeply nested',
      currentLocation: 'examples/deeper/somewhere.js',
      targetLocation: 'src',
    },
    {
      name: 'in same subdirectory',
      currentLocation: 'examples/deeper/somewhere.js',
      targetLocation: 'examples/fork/elsewhere',
    },
  ],
);

cases(
  'absolutesToRelative same dir',
  ({ currentLocation, targetLocation }) => {
    let actualPath = path.relative(
      path.dirname(currentLocation),
      targetLocation,
    );
    expect(absolutesToRelative(currentLocation, targetLocation)).toBe(
      `./${actualPath}`,
    );
  },
  [
    {
      name: 'in same directory',
      currentLocation: 'examples/deeper/somewhere.js',
      targetLocation: 'examples/deeper/elsewhere',
    },
    {
      name: 'in subdirectory',
      currentLocation: 'examples/somewhere.js',
      targetLocation: 'examples/deeper/elsewhere',
    },
  ],
);
