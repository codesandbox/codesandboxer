// @flow
import type {
  Files,
  Package,
  GitInfo,
  ImportReplacement,
  Config,
} from '../types';

import fetchRelativeFile from '../fetchRelativeFile';
import ensureExtension from './ensureExtension';
import resolvePath from '../utils/resolvePath';

export default async function fetchInternalDependencies(
  internalImports: Array<string>,
  files: Files,
  pkg: Package,
  deps: { [string]: string },
  gitInfo: GitInfo,
  importReplacements: Array<ImportReplacement>,
  config: Config,
) {
  let newFiles = await Promise.all(
    internalImports.map(path =>
      fetchRelativeFile(path, pkg, importReplacements, gitInfo, config),
    ),
  );

  let moreInternalImports = [];
  for (let f of newFiles) {
    files[ensureExtension(f.path)] = { content: f.file };
    deps = { ...deps, ...f.deps };
    f.internalImports.forEach(m =>
      moreInternalImports.push(resolvePath(f.path, m)),
    );
  }
  moreInternalImports = moreInternalImports.filter(
    mpt => !files[ensureExtension(mpt)],
  );
  if (moreInternalImports.length > 0) {
    let moreFiles = await fetchInternalDependencies(
      moreInternalImports,
      files,
      pkg,
      deps,
      gitInfo,
      importReplacements,
      config,
    );
    return {
      files: { ...files, ...moreFiles.files },
      deps: { ...deps, ...moreFiles.deps },
    };
  } else {
    return { files, deps };
  }
}
