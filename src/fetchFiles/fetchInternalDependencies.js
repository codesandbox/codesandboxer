// @flow
import type { Files, Package, FetchConfig, Import } from '../types';

import fetchRelativeFile from '../fetchRelativeFile';
import resolveFilePath from './resolveFilePath';
import resolvePath from '../utils/resolvePath';

export default async function fetchInternalDependencies(
  internalImports: Array<string>,
  files: Files,
  pkg: Package,
  deps: { [string]: string },
  gitInfo: FetchConfig,
  importReplacements: Array<Import>,
) {
  let newFiles = await Promise.all(
    internalImports.map(path =>
      fetchRelativeFile(path, pkg, importReplacements, gitInfo).then(r => ({
        ...r,
        path: path,
      })),
    ),
  );

  let moreInternalImports = [];
  for (let f of newFiles) {
    files[resolveFilePath(f.path)] = { content: f.file };
    deps = { ...deps, ...f.deps };
    f.internalImports.forEach(m =>
      moreInternalImports.push(resolvePath(f.path, m)),
    );
  }
  moreInternalImports = moreInternalImports.filter(
    mpt => !files[resolveFilePath(mpt)],
  );
  if (moreInternalImports.length > 0) {
    let moreFiles = await fetchInternalDependencies(
      moreInternalImports,
      files,
      pkg,
      deps,
      gitInfo,
      importReplacements,
    );
    return {
      files: { ...files, ...moreFiles.files },
      deps: { ...deps, ...moreFiles.deps },
    };
  } else {
    return { files, deps };
  }
}
