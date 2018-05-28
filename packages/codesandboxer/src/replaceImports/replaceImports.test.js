import cases from 'jest-in-case';
import replaceImports from './';

cases(
  'replaceImports()',
  ({ files, replaces }) => {
    let code = replaceImports(files, replaces);
    expect(code).toMatchSnapshot();
  },
  [
    {
      name: 'replace imports',
      files: 'import a from \'b\' import c from \'d\'',
      replaces: [['b', 'z'], ['d', 'arg']],
    },
    {
      name: 'replace imports based on pattern',
      files: 'import b from \'b\'; import c from \'./d/somewhere\'',
      replaces: [['b', 'z'], ['./d/*', 'anywhere/']],
    },
  ],
);
