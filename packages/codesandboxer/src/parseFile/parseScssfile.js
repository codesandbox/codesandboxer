// @flow
import type { parsedFileFirst } from '../types';

const matchScssString = `@import\\s*['"\`]([^'"\`]+)['"\`]\\s*;`;
const matchSassString = `@import\\s*['"\`]?([^'"\`;]+)['"\`]?\\s*;`;

const getAllImports = (code, matchString) => {
  let matcher = new RegExp(matchString);
  let matches = [];
  let m = matcher.exec(code);

  while (m) {
    if (m[1]) {
      matches.push(m[1]);
      code = code.slice(m.index + m[0].length);
      matcher = new RegExp(matchString);
      m = matcher.exec(code);
    }
  }
  return matches.map(match => {
    if (match[0] !== '.' && match[0] !== '/') return `./${match}`;
    return match;
  });
};

const parseScssFile = async (
  file: Promise<string> | string,
): Promise<parsedFileFirst> => {
  let fileCode = await Promise.resolve(file);
  let internalImports = getAllImports(fileCode, matchScssString).map(
    a => `${a}.scss`,
  );

  return {
    file: fileCode,
    internalImports,
    deps: {},
  };
};

const parseSassFile = async (
  file: Promise<string> | string,
): Promise<parsedFileFirst> => {
  let fileCode = await Promise.resolve(file);
  let internalImports = getAllImports(fileCode, matchSassString)
    .concat(getAllImports(fileCode, matchScssString))
    .map(a => `${a}.sass`);

  return {
    file: fileCode,
    internalImports,
    deps: {},
  };
};

export { parseScssFile, parseSassFile };
