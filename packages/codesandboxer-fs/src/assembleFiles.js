// @flow
const {
  parseFile,
  replaceImports,
  resolvePath,
  finaliseCSB,
  ensureExtensionAndTemplate,
} = require('codesandboxer');

/*::
import type { Config } from './types';
*/
const templates = require('./templates');

const loadFiles = require('./loadFiles');
const resolve = require('resolve');

const fs = require('fs');
const path = require('path');
const pkgDir = require('pkg-dir');

const getAbsFilePath = (relFilePath, extensions) => {
  try {
    let firstPathResolve = path.resolve(relFilePath);
    let a = resolve.sync(firstPathResolve, { extensions });
    return a;
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
    return resolve.sync(fixedPath);
  } catch (e) {
    throw {
      key: 'noPKGJSON',
      fixedPath,
    };
  }
};

async function assembleFiles(filePath /*: string */, config /*: ?Config */) {
  if (!config) config = {};

  let extension = path.extname(filePath) || '.js';
  const extensionAndTemplate = ensureExtensionAndTemplate(
    extension,
    config.extensions,
    config.template,
  );

  config = { ...config, ...extensionAndTemplate };

  let rootDir = await pkgDir(filePath);
  let absFilePath = config.contents
    ? filePath
    : getAbsFilePath(filePath, config.extensions);
  let pkgJSONPath = getPkgJSONPath(rootDir);
  let relFilePath = path.relative(rootDir, filePath);

  // $FlowFixMe - we genuinely want dynamic requires here
  let pkgJSON = require(pkgJSONPath);
  let exampleContent = config.contents || fs.readFileSync(absFilePath, 'utf-8');

  let { file, deps, internalImports } = await parseFile(
    exampleContent,
    pkgJSON,
  );

  let newFileLocation = `example`;

  let template = templates[config.template];
  if (!template) template = templates['create-react-app'];

  let baseFiles = template(newFileLocation);
  let newFileExtension = extension || '.js';
  config.fileName = newFileLocation + newFileExtension;

  let files = {
    ...baseFiles,
    ...{
      [config.fileName]: {
        content: replaceImports(
          file,
          internalImports.map(m => [m, `./${resolvePath(relFilePath, m)}`]),
        ),
      },
    },
  };

  let final = await loadFiles({
    files,
    deps,
    rootDir,
    pkgJSON,
    extensions: config.extensions,
    internalImports: internalImports.map(m =>
      resolvePath(path.relative(rootDir, filePath), m),
    ),
    priorPaths: [],
  });

  if (Object.keys(final.files).length > 120) throw { key: 'tooManyModules' };
  return finaliseCSB({ ...final, template: config.template }, config);
}

module.exports = assembleFiles;
