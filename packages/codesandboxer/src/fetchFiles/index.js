// @flow
import resolvePath from '../utils/resolvePath';
import replaceImports from '../replaceImports';

import ensureExample from './ensureExample';
import ensurePKGJSON from './ensurePkgJSON';
import fetchInternalDependencies from './fetchInternalDependencies';
import path from 'path-browserify';

import type {
  Package,
  GitInfo,
  Dependencies,
  Files,
  ImportReplacement,
} from '../types';
import { baseFiles, baseFilesTS } from '../constants';

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
  let extension = path.extname(examplePath) || '.js';
  let baseFilesToUse = baseFiles;

  if (extension && !['.js', '.json'].includes(extension)) {
    if (['.ts', '.tsx'].includes(extension)) {
      extensions.push('.ts', '.tsx');
      baseFilesToUse = baseFilesTS;
    } else {
      extensions.push(extension);
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
    ...baseFilesToUse,
    [`example${extension}`]: {
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
    [examplePath],
  );
  return final;
}
