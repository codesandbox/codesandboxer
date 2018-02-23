// @flow
import { getParameters } from 'codesandbox/lib/api/define';
import { baseFiles } from './constants';
import type { Config, Package, Files } from './types';
import parseFile from './parseFile';

const newpkgJSON = dependencies => `{
  "name": "simple-example",
  "version": "0.0.0",
  "description": "A simple example deployed to CodeSandbox",
  "main": "index.js",
  "dependencies": ${JSON.stringify(dependencies)}
}`;

const ensureReact = deps => {
  if (!deps.react && !deps['react-dom']) {
    deps.react = 'latest';
    deps['react-dom'] = 'latest';
  } else if (!deps.react) {
    deps.react = deps['react-dom'];
  } else if (!deps['react-dom']) {
    deps['react-dom'] = deps.react;
  }
};

const getCSBData = async (
  example: Promise<string> | string,
  pkgJSON: Promise<Package> | Package,
  config: Promise<Config> | Config = {},
): Promise<{
  files: Files,
  dependencies: { [string]: string, react: string, 'react-dom': string },
  parameters: string,
}> => {
  let { providedDeps = {}, providedFiles = {} } = await Promise.resolve(config);
  let exampleCode = await Promise.resolve(example);
  let pkgJSONCode = await Promise.resolve(pkgJSON);

  let { deps, file } = await parseFile(exampleCode, pkgJSONCode);

  let dependencies = {
    ...deps,
    [pkgJSONCode.name]: pkgJSONCode.version,
    ...providedDeps,
  };

  ensureReact(dependencies);

  const files = {
    ...baseFiles,
    'example.js': { content: file },
    'package.json': { content: newpkgJSON(dependencies) },
    ...providedFiles,
  };

  const parameters = getParameters({ files });

  return {
    files,
    dependencies,
    parameters,
  };
};

export default getCSBData;
