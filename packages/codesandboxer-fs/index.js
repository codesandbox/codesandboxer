const csb = require('codesandboxer');

// All of these need to be exposed in some way
const resolvePath = require('codesandboxer/dist/utils/resolvePath').default;
const finaliseCSB = require('codesandboxer/dist/fetchFiles/finaliseCSB')
  .default;
const { baseFiles } = require('codesandboxer/dist/constants');

const fs = require('fs');
const path = require('path');
const pkgUp = require('pkg-up');
const pkgDir = require('pkg-dir');

let count = 1;

const relToAbs = (filePath, resolvedPath) => {
  let fp2 = filePath.replace(/^\.\//, '');
  let hasExtension = fp2.match(/\./);
  let r;

  if (hasExtension) {
    return fp2;
  } else {
    r = new RegExp(`${fp2}(.+)`);
  }
  let match = resolvedPath.match(r);
  return resolvedPath.match(r)[0];
};

async function loadJS(resolvedPath, pkgJSON, filePath) {
  let content = fs.readFileSync(resolvedPath, 'utf-8');
  let file = await csb.parseFile(content, pkgJSON);
  return Object.assign({}, file, {
    filePath: relToAbs(filePath, resolvedPath),
  });
}

async function loadJSON(resolvedPath, filePath) {
  let file = fs.readFileSync(resolvedPath, 'utf-8');
  return {
    file,
    deps: {},
    internalImports: [],
    filePath: relToAbs(filePath, resolvedPath),
  };
}

async function loadImages(resolvedPath, filePath) {
  throw new Error(
    'The fetch image file function has not been written for fs yet',
  );
}

async function fetchRelativeFile({ filePath, pkgJSON, rootDir }) {
  // This is where it will throw for jsx problems
  let absPath = path.resolve(rootDir, filePath);
  let resolvedPath = require.resolve(absPath);
  let extension = resolvedPath.match(/\.[^\.]+$/);

  switch (extension[0]) {
    case '.png':
    case '.jpeg':
    case '.jpg':
    case '.gif':
    case '.bmp':
    case '.tiff':
      return loadImages(url, path);
    case '.json':
      return loadJSON(resolvedPath, filePath);
    case '.js':
      return loadJS(resolvedPath, pkgJSON, filePath);
    default:
      throw new Error(
        `unparseable filetype: ${extension[0]} for file ${resolvedPath}`,
      );
  }
}

async function fetchInternalDependencies({
  files,
  deps,
  internalImports,
  rootDir,
  pkgJSON,
  priorPaths,
}) {
  let newFiles = await Promise.all(
    internalImports.map(filePath =>
      fetchRelativeFile({ filePath: `./${filePath}`, pkgJSON, rootDir }),
    ),
  );

  let moreInternalImports = [];
  for (let f of newFiles) {
    files[f.filePath] = { content: f.file };
    deps = Object.assign({}, deps, f.deps);
    f.internalImports.forEach(m =>
      // I think this is wrong
      moreInternalImports.push(resolvePath(f.filePath, m)),
    );
  }

  if (count > 120) {
    throw { key: 'tooManyModules' };
  } else count++;

  moreInternalImports = moreInternalImports.filter(
    mpt => !priorPaths.includes(mpt),
  );
  if (moreInternalImports.length > 0) {
    let moreFiles = await fetchInternalDependencies({
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
    console.log(e);
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

async function assembleFiles(relFilePath) {
  let rootDir = await pkgDir(relFilePath);
  let absFilePath = getAbsFilePath(relFilePath);
  let pkgJSONPath = getPkgJSONPath(rootDir);
  let pathRelativeToRoot = path.relative(path.dirname(absFilePath), rootDir);

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
        internalImports.map(m => [
          m,
          `./${resolvePath(pathRelativeToRoot, m)}`,
        ]),
      ),
    },
  });

  let final = await fetchInternalDependencies({
    files,
    deps,
    rootDir,
    pkgJSON,
    internalImports: internalImports.map(m =>
      resolvePath(pathRelativeToRoot, m),
    ),
    priorPaths: [],
  });

  if (Object.keys(final.files).length > 120) throw { key: 'tooManyModules' };
  return finaliseCSB(final);
}

async function assembleFilesAndPost(filePath) {
  let { parameters } = await assembleFiles(filePath);
  let csbInfo = await csb.sendFilesToCSB(parameters);
  return csbInfo;
}

module.exports = { assembleFilesAndPost, assembleFiles };

// other stuff we need to handle:
// loading nonJS files
//   .jsx
//   .png +
// Add .bin
// Check we never reach above our initial scope
