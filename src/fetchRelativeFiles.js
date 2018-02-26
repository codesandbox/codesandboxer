// @flow
import fetchRelativeFile from './fetchRelativeFile';
import parseFile from './parseFile';
import resolvePath from './resolvePath';

import type { Package, FetchConfig, Files } from './types';

// going to need filename
// figure out how to handle depth...
export default async function fetchRelativeFiles(
  basePath: string,
  file: string,
  knownReplacementKeys: Array<[string, string]>,
  pkg: Package,
  config: FetchConfig,
) {
  let { file: parsedFile, internalImports, deps } = await parseFile(file, pkg);
  let mptsToResolve = [];
  for (const mpt of internalImports) {
    const [complete, source] = mpt;
    let check = resolvePath(basePath, source);
    // hmm. We want to be able to do 1 of 2 actions
    let knownKey = knownReplacementKeys.find(k => {
      if (k[0] === source) return true;
      if (k[1] === check) return true;
      return false;
    });
    if (knownKey) {
      // Handle already having a file in our graph-ish thing. If it's on the right side,
      // this file has already had it replaced, don't worry about it. If it has
      // not been replaced, update the path.
      if ()
    } else {
      mptsToResolve.push(fetchRelativeFile(basePath, source, pkg, config));
    }
  }
  let additionalFiles = await Promise.all(mptsToResolve);
  let newReplaceMentKeys = {};
  let externalDependencies = {};
  let furtherRelativeImports = [];
  let files = {};
  for (let newFile of additionalFiles) {
    if (newFile.internalImports.length > 0) {
      furtherRelativeImports = furtherRelativeImports.concat(
        newFile.internalImports,
      );
      externalDependencies = { ...externalDependencies, ...newFile.deps };
    }
    newReplaceMentKeys[newFile.replacementKey[0]] = newFile.replacementKey[1];
    files[newFile.name] = newFile.file;
  }

  return {
    files,
    furtherRelativeImports,
    externalDependencies,
    replaceMentKeys: { ...knownReplacementKeys, ...newReplaceMentKeys },
  };
}
