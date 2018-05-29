import cases from 'jest-in-case';
import parseDeps from './parseDeps';
import parsePkgName from './parsePkgName';
import parseFile from './';
import getAllImports from '../utils/getAllImports';

const fakePKGJSON = {
  name: 'a',
  version: '0.0.1',
  devDependencies: { b: 'v1.0.0', d: '2.0.0', c: '2.1.0', t: '^15.7.1' },
  peerDependencies: { z: 'v1.1.0', x: 'v0.3.0' },
  dependencies: { x: 'v1.2.0' },
};

const codeImportTests = [
  {
    name: 'simple import',
    code: "import a from 'b'",
    deps: { b: 'v1.0.0' },
  },
  {
    name: 'spread import',
    code: "import { a } from 'b'",
    deps: { b: 'v1.0.0' },
  },
  {
    name: 'two imports',
    code: "import a from 'b' import c from 'd'",
    deps: { b: 'v1.0.0', d: '2.0.0' },
  },
  {
    name: 'multiline imports',
    code: `import a from 'b'
import c from 'd'`,
    deps: { b: 'v1.0.0', d: '2.0.0' },
  },
  {
    name: 'two spread imports',
    code: "import { a, b } from 'c'",
    deps: { c: '2.1.0' },
  },
  {
    name: 'two spread imports multiline',
    code: `import {
  a,
  b
} from 'c'`,
    deps: { c: '2.1.0' },
  },
  {
    name: 'no spaces',
    code: "import {a} from 'b'",
    deps: { b: 'v1.0.0' },
  },
  {
    name: 'dev and peer deps',
    code: "import {a} from 't' import s from 'z' import y from 'x'",
    deps: { t: '^15.7.1', z: 'v1.1.0', x: 'v1.2.0' },
  },
  {
    name: 'relativeImport',
    code: "import {a} from './c'",
    internal: ['./c'],
  },
  {
    name: 'when import cannot be found',
    code: "import something from 'unfound-dep'",
    // The pkgJSON main dep is always included
    deps: { d: '2.0.0' },
  },
  {
    name: 'import export syntax',
    code: "export a from 'b'",
    // The pkgJSON main dep is always included
    deps: { b: 'v1.0.0' },
  },
  {
    name: 'simple require',
    code: "const a = require('b')",
    deps: { b: 'v1.0.0' },
  },
  {
    name: 'let require',
    code: "let a = require('b')",
    deps: { b: 'v1.0.0' },
  },
  {
    name: 'var require',
    code: "var a = require('b')",
    deps: { b: 'v1.0.0' },
  },
];

cases(
  'ParseFile()',
  async ({ file, pkgJSON }) => {
    let parsedFile = await parseFile(file, pkgJSON);

    expect(parsedFile).toMatchSnapshot();
  },
  [
    {
      name: 'simple parse',
      file: "import a from 'b'; import c from './c'",
      pkgJSON: fakePKGJSON,
    },
    {
      name: 'simple parse file promise',
      file: Promise.resolve("import a from 'b'; import c from './c'"),
      pkgJSON: fakePKGJSON,
    },
    {
      name: 'simple parse pkgJSON promise',
      file: "import a from 'b'; import c from './c'",
      pkgJSON: Promise.resolve(fakePKGJSON),
    },
    {
      skip: true,
      // This test is a valid use-case which is not currently handled.
      name: 'just getting imports',
      file: `"// @flow

export { default } from './components/Avatar';
export { default as AvatarGroup } from './components/AvatarGroup';
export { default as AvatarItem } from './components/AvatarItem';
export { default as Presence } from './components/Presence';
export { default as Status } from './components/Status';
export { default as Skeleton } from './components/Skeleton';
"`,
      pkgJSON: fakePKGJSON,
    },
  ],
);

cases(
  'parseDeps()',
  ({ code, deps = {}, internal = [] }) => {
    let imports = getAllImports(code);
    let parsedImports = parseDeps(fakePKGJSON, imports);

    expect(Array.from(parsedImports.internalImports)).toMatchObject(internal);
    expect(parsedImports.deps).toMatchObject(deps);
  },
  codeImportTests,
);

cases(
  'parsePkgName()',
  ({ name, result }) => {
    let parsedName = parsePkgName(name);
    expect(parsedName).toBe(result);
  },
  [
    { name: '@space/pkg/something', result: '@space/pkg' },
    { name: '@space/pkg/something/somewhere/whatever', result: '@space/pkg' },
    { name: 'pkg/something', result: 'pkg' },
    { name: 'pkg/something/somewhere/more', result: 'pkg' },
    { name: '@space/pkg', result: '@space/pkg' },
    { name: 'pkg', result: 'pkg' },
  ],
);
