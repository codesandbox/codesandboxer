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
      files: `import a from 'b' import c from 'd'`,
      replaces: [['b', 'z'], ['d', 'arg']],
    },
  ],
);
