// @flow
import getAllImports from './getAllImports';
import parseDeps from './parseDeps';
import type { Import, Package } from './types';

const parseFile = async (
  file: Promise<string> | string,
  pkgJSON: Promise<Package> | Package,
): Promise<{
  file: string,
  deps: { [string]: string },
  internalImports: Array<?Import>,
}> => {
  let fileCode = await Promise.resolve(file);
  let pkgJSONContent = await Promise.resolve(pkgJSON);

  const imports = getAllImports(fileCode);
  let { deps, internalImports } = parseDeps(pkgJSONContent, imports);

  return Promise.resolve({ file: fileCode, deps, internalImports });
};

export default parseFile;
