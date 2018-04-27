// @flow

import fetchRelativeFile from '../fetchRelativeFile';
import replaceImports from '../replaceImports';
import absolutesToRelative from '../utils/absolutesToRelative';
import parseFile from '../parseFile';

import type { Import, Package, GitInfo, Config } from '../types';

export default async function ensureExample(
  example?: string | Promise<string>,
  importReplacements: Array<Import>,
  pkg: Package,
  examplePath: string,
  gitInfo: GitInfo,
  config: Config,
) {
  if (example) {
    let exampleContent = await Promise.resolve(example);
    let content = replaceImports(
      exampleContent,
      importReplacements.map(m => [
        absolutesToRelative(examplePath, m[0]),
        m[1],
      ]),
    );
    return parseFile(content, pkg);
  } else {
    return fetchRelativeFile(
      examplePath,
      pkg,
      importReplacements,
      gitInfo,
      config,
    );
  }
}
