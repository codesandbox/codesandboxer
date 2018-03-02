// @flow
import resolvePath from '../utils/resolvePath';
import replaceImports from '../replaceImports';

import resolveFilePath from './resolveFilePath';
import ensureExample from './ensureExample';
import ensurePKGJSON from './ensurePkgJSON';
import fetchInternalDependencies from './fetchInternalDependencies';

import type {
  Package,
  FetchConfig,
  Dependencies,
  Import,
  Files,
} from '../types';
import finaliseCSB from './finaliseCSB';
import { baseFiles } from '../constants';

export default async function({
  examplePath,
  pkgJSON,
  gitInfo,
  importReplacements,
  dependencies = {},
  providedFiles = {},
  example,
}: {
  examplePath: string,
  pkgJSON?: Package | string | Promise<Package | string>,
  gitInfo: FetchConfig,
  importReplacements: Array<Import>,
  dependencies?: Dependencies,
  providedFiles?: Files,
  example?: string | Promise<string>,
}) {
  let pkg = await ensurePKGJSON(pkgJSON, importReplacements, gitInfo);

  let { file, deps, internalImports } = await ensureExample(
    example,
    importReplacements,
    pkg,
    examplePath,
    gitInfo,
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
  );
  return finaliseCSB(final, providedFiles, dependencies);
}
