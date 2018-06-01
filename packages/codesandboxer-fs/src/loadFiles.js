// @flow
const csb = require('codesandboxer');
const loadRelativeFile = require('./loadRelativeFile');
/*::
import type { Files, Package, Dependencies } from 'codesandboxer'
type LoadFileObj = {
  files: Files,
  deps: Dependencies,
  internalImports: Array<string>,
  rootDir: string,
  pkgJSON: Package,
  extensions: Array<string>,
  priorPaths: Array<string>,
};
*/

let count = 1;

async function loadFiles(
  {
    files,
    deps,
    internalImports,
    rootDir,
    pkgJSON,
    extensions,
    priorPaths,
  } /*: LoadFileObj */,
) {
  let newFiles = await Promise.all(
    internalImports.map(filePath => {
      return loadRelativeFile({
        filePath: `./${filePath}`,
        pkgJSON,
        rootDir,
        extensions,
      });
    }),
  );

  let moreInternalImports = [];
  for (let f of newFiles) {
    files[f.filePath] = { content: f.file };
    deps = Object.assign({}, deps, f.deps);
    f.internalImports.forEach(m =>
      // I think this is wrong
      moreInternalImports.push(csb.resolvePath(f.filePath, m)),
    );
  }

  if (count > 120) {
    throw { key: 'tooManyModules' };
  } else count++;

  moreInternalImports = moreInternalImports.filter(
    mpt => !priorPaths.includes(mpt),
  );
  if (moreInternalImports.length > 0) {
    let moreFiles = await loadFiles({
      files,
      deps,
      rootDir,
      internalImports: moreInternalImports,
      extensions,
      pkgJSON,
      priorPaths: priorPaths.concat(internalImports),
    });
    return {
      files: Object.assign({}, files, moreFiles.files),
      deps: Object.assign({}, deps, moreFiles.deps),
    };
  } else {
    return { files, deps };
  }
}

module.exports = loadFiles;
