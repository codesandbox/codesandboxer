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
import templates from '../templates';

export default async function({
  examplePath,
  pkgJSON,
  gitInfo,
  importReplacements = [],
  example,
  extensions = [],
  template,
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
  template?: 'create-react-app' | 'create-react-app-typescript' | 'vue-cli',
}) {
  let extensionsSet = new Set(extensions);
  let extension = path.extname(examplePath) || '.js';

  extensionsSet.add(extension);

  if (
    ['.ts', '.tsx'].includes(extension) ||
    template === 'create-react-app-typescript'
  ) {
    if (!template) template = 'create-react-app-typescript';
    extensionsSet.add('.ts');
    extensionsSet.add('.tsx');
  }

  if (extension === '.vue' || template === 'vue-cli') {
    if (!template) template = 'vue-cli';
    extensionsSet.add('.vue');
  }

  let baseFilesToUse = templates[template];
  if (!baseFilesToUse) baseFilesToUse = templates['create-react-app'];
  if (!template) template = 'create-react-app';

  let config = { extensions, template };
  let pkg = await ensurePKGJSON(pkgJSON, importReplacements, gitInfo, config);

  let { file, deps, internalImports } = await ensureExample(
    example,
    importReplacements,
    pkg,
    examplePath,
    gitInfo,
    config,
  );

  let fileName = `example${extension}`;

  let files = {
    ...baseFilesToUse,
    [fileName]: {
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
  return { ...final, template, fileName };
}
