// @flow
import resolvePath from '../utils/resolvePath';
import replaceImports from '../replaceImports';

import ensureExample from './ensureExample';
import ensurePKGJSON from './ensurePkgJSON';
import ensureExtensionAndTemplate from './ensureExtensionAndTemplate';
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
  let extension = path.extname(examplePath) || '.js';
  let config = ensureExtensionAndTemplate(extension, extensions, template);
  let pkg = await ensurePKGJSON(pkgJSON, importReplacements, gitInfo, config);

  let { file, deps, internalImports } = await ensureExample(
    example,
    importReplacements,
    pkg,
    examplePath,
    gitInfo,
    config
  );

  let fileName = `example${extension}`;

  let files = {
    ...templates[config.template],
    [fileName]: {
      content: replaceImports(
        file,
        internalImports.map(m => [m, `./${resolvePath(examplePath, m)}`])
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
    [examplePath]
  );
  return { ...final, template: config.template, fileName };
}
