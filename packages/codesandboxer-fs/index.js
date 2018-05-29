// @flow
const csb = require('codesandboxer');
/*::
import type { Files, Dependencies } from 'codesandboxer';
*/
const { baseFiles } = require('./constants');

const fs = require('fs');
const path = require('path');
const pkgDir = require('pkg-dir');

let count = 1;

const relToRelPkgRoot = (resolvedPath, rootDir) =>
  path.relative(rootDir, resolvedPath);

async function loadJS(resolvedPath, pkgJSON, rootDir) {
  let content = fs.readFileSync(resolvedPath, 'utf-8');
  let file = await csb.parseFile(content, pkgJSON);
  return Object.assign({}, file, {
    filePath: relToRelPkgRoot(resolvedPath, rootDir),
  });
}

async function loadJSON(resolvedPath, rootDir) {
  let file = fs.readFileSync(resolvedPath, 'utf-8');
  return {
    file,
    deps: {},
    internalImports: [],
    filePath: relToRelPkgRoot(resolvedPath, rootDir),
  };
}
/* Remove the disable once image loading has been built */
/* eslint-disable-next-line no-unused-vars */
async function loadImages(resolvedPath, filePath) {
  throw new Error(
    'The fetch image file function has not been written for fs yet',
  );
}

async function loadRelativeFile({ filePath, pkgJSON, rootDir }) {
  // This is where it will throw for jsx problems
  let absPath = path.resolve(rootDir, filePath);
  let resolvedPath = require.resolve(absPath);
  let extension = resolvedPath.match(/\.[^\.]+$/);
  if (!extension) {
    throw { key: 'fileNoExtension', path: resolvedPath };
  }

  switch (extension[0]) {
    case '.png':
    case '.jpeg':
    case '.jpg':
    case '.gif':
    case '.bmp':
    case '.tiff':
      return loadImages(resolvedPath, path);
    case '.json':
      return loadJSON(resolvedPath, rootDir);
    case '.js':
      return loadJS(resolvedPath, pkgJSON, rootDir);
    default:
      throw new Error(
        `unparseable filetype: ${extension[0]} for file ${resolvedPath}`,
      );
  }
}

async function loadInternalDependencies({
  files,
  deps,
  internalImports,
  rootDir,
  pkgJSON,
  priorPaths,
}) {
  let newFiles = await Promise.all(
    internalImports.map(filePath => {
      return loadRelativeFile({ filePath: `./${filePath}`, pkgJSON, rootDir });
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
    let moreFiles = await loadInternalDependencies({
      files,
      deps,
      rootDir,
      internalImports: moreInternalImports,
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

const getAbsFilePath = relFilePath => {
  try {
    let firstPathResolve = path.resolve(relFilePath);
    return require.resolve(firstPathResolve);
  } catch (e) {
    throw {
      key: 'noExampleFile',
      relFilePath,
    };
  }
};

const getPkgJSONPath = rootDir => {
  let fixedPath = `${rootDir}/package.json`;
  try {
    return require.resolve(fixedPath);
  } catch (e) {
    throw {
      key: 'noPKGJSON',
      fixedPath,
    };
  }
};

/*::
type Config = {
  name?: string,
  extraFiles?: Files,
  extraDependencies?: Dependencies,
}
*/

async function assembleFiles(filePath /*: string */, config /*: ?Config */) {
  let rootDir = await pkgDir(filePath);
  let absFilePath = getAbsFilePath(filePath);
  let pkgJSONPath = getPkgJSONPath(rootDir);
  let relFilePath = path.relative(rootDir, filePath);

  // $FlowFixMe - we genuinely want dynamic requires here
  let pkgJSON = require(pkgJSONPath);
  let exampleContent = fs.readFileSync(absFilePath, 'utf-8');

  let { file, deps, internalImports } = await csb.parseFile(
    exampleContent,
    pkgJSON,
  );

  let files = Object.assign({}, baseFiles, {
    'example.js': {
      content: csb.replaceImports(
        file,
        internalImports.map(m => [m, `./${csb.resolvePath(relFilePath, m)}`]),
      ),
    },
  });

  let final = await loadInternalDependencies({
    files,
    deps,
    rootDir,
    pkgJSON,
    internalImports: internalImports.map(m => csb.resolvePath(relFilePath, m)),
    priorPaths: [],
  });

  if (Object.keys(final.files).length > 120) throw { key: 'tooManyModules' };
  return csb.finaliseCSB(final, config);
}

async function assembleFilesAndPost(
  filePath /*: string */,
  config /*: Config */,
) {
  let { parameters } = await assembleFiles(filePath, config);
  let csbInfo = await csb.sendFilesToCSB(parameters);
  return csbInfo;
}

/* eslint-disable-next-line */
module.exports = { assembleFilesAndPost, assembleFiles };

// other stuff we need to handle:
// loading nonJS files
//   .jsx
//   .png +
//   .tsx
// Check we never reach above our initial scope
