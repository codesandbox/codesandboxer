import cases from 'jest-in-case';
import replaceImports from './';

cases(
  'replaceImports()',
  ({ inputFile, outputFile, replaces }) => {
    let code = replaceImports(inputFile, replaces);
    expect(code).toEqual(outputFile);
  },
  [
    {
      name: 'replace imports',
      inputFile: "import a from 'b' import c from 'd'",
      outputFile: "import a from 'z' import c from 'arg'",
      replaces: [['b', 'z'], ['d', 'arg']],
    },
    {
      name: 'replace imports based on pattern',
      inputFile: "import b from 'b'; import c from './d/somewhere'",
      outputFile: "import b from 'z'; import c from 'anywhere/somewhere'",
      replaces: [['b', 'z'], ['./d/*', 'anywhere/']],
    },
    {
      name: 'replace imports that is export-y',
      inputFile: "export b from 'b';",
      outputFile: "export b from 'z';",
      replaces: [['b', 'z']],
    },
    {
      name: 'replace require instead of import',
      inputFile: "const b = require('b');",
      outputFile: "const b = require('z');",
      replaces: [['b', 'z']],
    },
  ]
);
