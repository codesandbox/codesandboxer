import cases from 'jest-in-case';
import { parseScssFile, parseSassFile } from './parseScssfile';

const scssImportTests = [
  {
    name: 'simple scss',
    code: `@import 'B';`,
    internal: ['./B.scss'],
  },
  {
    name: 'simple path',
    code: `@import './B';`,
    internal: ['./B.scss'],
  },
  {
    name: 'double quote',
    code: `@import "./B";`,
    internal: ['./B.scss'],
  },
  {
    name: 'no spaces',
    code: `@import'./B';`,
    internal: ['./B.scss'],
  },
  {
    name: 'many spaces',
    code: `@import      './B'        ;`,
    internal: ['./B.scss'],
  },
  {
    name: 'line breaks',
    code: `@import      './B'        ;`,
    internal: ['./B.scss'],
  },
  {
    name: 'with multiple imports',
    code: `@import './B'; @import './C';`,
    internal: ['./B.scss', './C.scss'],
  },
  {
    name: 'with text after',
    code: `@import './B'; Totes invalid eh?`,
    internal: ['./B.scss'],
  },
  {
    // This is not being resolved correctly atm and will cause errors
    skip: true,
    name: 'Currently failing',
    code: `@import '/B';`,
    internal: ['/B.scss'],
  },
];

const sassImportTests = [
  {
    name: 'sass import',
    code: `@import B;`,
    internal: ['./B.sass'],
  },
  {
    name: 'sass two import',
    code: `@import B; @import C;`,
    internal: ['./B.sass', './C.sass'],
  },
];

cases(
  'parseScssFile()',
  async ({ code, internal = [] }) => {
    let parsedImports = await parseScssFile(code);
    expect(Array.from(parsedImports.internalImports)).toMatchObject(internal);
  },
  scssImportTests,
);
cases(
  'parseSassFile()',
  async ({ code, internal = [] }) => {
    let parsedImports = await parseSassFile(code);
    expect(Array.from(parsedImports.internalImports)).toMatchObject(internal);
  },
  sassImportTests,
);
