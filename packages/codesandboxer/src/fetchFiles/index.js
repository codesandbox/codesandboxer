// @flow
import resolvePath from '../utils/resolvePath';
import replaceImports from '../replaceImports';

import ensureExample from './ensureExample';
import ensurePKGJSON from './ensurePkgJSON';
import fetchInternalDependencies from './fetchInternalDependencies';

import type {
  Package,
  GitInfo,
  Dependencies,
  Files,
  ImportReplacement,
} from '../types';
import { baseFiles } from '../constants';

export default async function({
  examplePath,
  pkgJSON,
  gitInfo,
  importReplacements = [],
  example,
  extensions = [],
}: {
  examplePath: string,
  pkgJSON?: Package | string | Promise<Package | string>,
  gitInfo: GitInfo,
  importReplacements?: Array<ImportReplacement>,
  dependencies?: Dependencies,
  providedFiles?: Files,
  example?: string | Promise<string>,
  name?: string,
  extensions: string[],
}) {
  let extension = examplePath.match(/.+(\..+)$/);
  if (extension && !['.js', '.json'].includes(extension[1])) {
    if (['.ts', '.tsx'].includes(extension[1])) {
      extensions.concat(['.ts', '.tsx']);
    } else {
      extensions.push(extension[1]);
    }
  }
  let config = { extensions };
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
