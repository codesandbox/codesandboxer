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
    } else {
      mptsToResolve.push(fetchRelativeFile(basePath, source, pkg, config));
    }
  }
  let additionalFiles = await Promise.all(mptsToResolve);
  let newReplaceMentKeys = [];
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
    newReplaceMentKeys.push(newFile.replacementKey);
    files[newFile.name] = newFile.file;
  }

  return {
    files,
    furtherRelativeImports,
    externalDependencies,
    replaceMentKeys: [...knownReplacementKeys, ...newReplaceMentKeys],
  };
}

// What this file needs to do: From a file, resolve all imports, and provide Information
// on how to update the file, and then (maybe) repeat this for the found files

// Information we need to do this:
// The contents of the original file
// A relative location for the original file to allow us to resolve away from
// For any other files we have: Their new name/path and their original name/path

// const getABunchOfFiles = (absoluteFilePath,/* very not absolute */file, existingFileKeys, pkgJSON) => {
//   parseFile(file) // get the imports we need to resolve
//   filterToFilesToFetch
//   arrayOfData = mapParseFileToFilesToFetch()
//   let {
//     newFiles // Correctly formatted CSB data of those files' contents
//     someModificationData // How to modify the selected file, and additional files
//   }
//   return {
//     modifiedOriginalFile // update its devDependencies
//     newFiles
//     newFileKeys
//   }
// }

const getABunchOfFiles = async (
  absoluteFilePath,
  pkg,
  arrayOfImportsToFetch: Array<string>,
  config,
) => {
  let baseFileData = await Promise.all(
    arrayOfImportsToFetch.map(mpt =>
      fetchRelativeFile(absoluteFilePath, mpt, pkg, config),
    ),
  );

  for (let file of baseFileData) {
    // accumulate replaceMentKeys
    // accumulate file object to extend main file object
    // accumulate additional
  }

  let replaceMentKeys = baseFileData.map(a => a.replacementKey);
  let files = baseFileData.reduce((r, ({ name, file }) => ))
  let {
    files,
    replaceMentKeys,
  }
};

const recursivelyGetABunchOfFilesToDepth = () => {
  parseFile();
  if (relativeImports) {
    let newFilesAndData = relativeImports.map(getABunchOfFiles);
  }
  const someData = getABunchOfFiles(/* from file */);
  mapRelevantDataToAccumulators;
  if (stillNeedToFetchThings) {
  }
};

// We need to store additional information on the file object.
// What internalImports it has
  // Whether those internalImports have been updated...
  //


/*

Okay, we now have a full absolute and relative path concept...

*/
