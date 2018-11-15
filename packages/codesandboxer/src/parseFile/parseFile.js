// @flow
import getAllImports from '../utils/getAllImports';
import parseDeps from './parseDeps';
import type { Package, parsedFileFirst } from '../types';

const parseFile = async (
  file: Promise<string> | string,
  pkgJSON: Promise<Package> | Package,
): Promise<parsedFileFirst> => {
  let fileCode = await Promise.resolve(file);
  let pkgJSONContent = await Promise.resolve(pkgJSON);
  let imports = getAllImports(fileCode);
  let { deps, internalImports } = parseDeps(pkgJSONContent, imports);

  return {
    file: fileCode,
    deps,
    internalImports,
  };
};

export default parseFile;
