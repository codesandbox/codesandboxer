// @flow
import resolvePath from '../utils/resolvePath';
import replaceImports from '../replaceImports';

import ensureExample from './ensureExample';
import ensurePKGJSON from './ensurePkgJSON';
import fetchInternalDependencies from './fetchInternalDependencies';

import type { Package, GitInfo, Dependencies, Import, Files } from '../types';
import { baseFiles } from '../constants';

export default async function({
  examplePath,
  pkgJSON,
  gitInfo,
  importReplacements,
  example,
  allowJSX,
}: {
  examplePath: string,
  pkgJSON?: Package | string | Promise<Package | string>,
  gitInfo: GitInfo,
  importReplacements: Array<Import>,
  dependencies?: Dependencies,
  providedFiles?: Files,
  example?: string | Promise<string>,
  name?: string,
  allowJSX?: boolean,
}) {
  let config = { allowJSX: !!allowJSX };
  let pkg = await ensurePKGJSON(pkgJSON, importReplacements, gitInfo, config);

  let { file, deps, internalImports } = await ensureExample(
    example,
    importReplacements,
    pkg,
    examplePath,
    gitInfo,
    config,
  );

  let files = {
    ...baseFiles,
    'example.js': {
      content: replaceImports(
        file,
        internalImports.map(m => [m, `./${resolvePath(examplePath, m)}`]),
      ),
    },
  };

  let final = await fetchInternalDependencies(
    internalImports.map(m => resolvePath(examplePath, m)),
    files,
    pkg,
    deps,
    gitInfo,
    importReplacements,
    config,
  );
  return final;
}
