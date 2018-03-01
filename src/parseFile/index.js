// @flow
import getAllImports from '../utils/getAllImports';
import parseDeps from './parseDeps';
import type { Import, Package, ParsedFile } from '../types';

const parseFile = async (
  file: Promise<string> | string,
  pkgJSON: Promise<Package> | Package,
): Promise<ParsedFile> => {
  let fileCode = await Promise.resolve(file);
  let pkgJSONContent = await Promise.resolve(pkgJSON);

  const imports = getAllImports(fileCode);
  let { deps, internalImports } = parseDeps(pkgJSONContent, imports);

  return {
    file: fileCode,
    deps,
    internalImports: internalImports.map(m => m[1]),
  };
};

export default parseFile;
