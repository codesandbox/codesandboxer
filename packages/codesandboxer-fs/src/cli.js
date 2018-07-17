#!/usr/bin/env node
// @flow
'use strict';

const meow = require('meow');
const assembleFiles = require('./assembleFiles');
const assembleFilesAndPost = require('./assembleFilesAndPost');
const path = require('path');
const pkgDir = require('pkg-dir');

const depInPkgJSON = (pkgJson, name) => {
  if (pkgJson.dependencies[name]) return pkgJson.dependencies[name];
  if (pkgJson.devDependencies[name]) return pkgJson.devDependencies[name];
  if (pkgJson.peerDependencies[name]) return pkgJson.peerDependencies[name];
  return null;
};

let cli = meow(
  `
    Usage
      $ codesandboxer <filePath>
      upload the file, and other files within its package, to codesandbox.

    Options
      --dry, -D Instead of deploying, display what will be deployed
      --name, -n Name your sandbox
      --allowedExtensions List of extensions that will be treated as if they
      were javascript files. Most common examples are .jsx or .ts files

      Unimplemented options (coming soon)

      --files, -f Provide a list of files that will be included even if they do
      not end up in the graph. Format: fileA.js,fileB.js,fileC.js
      --dependencies -d A list of dependencies to include, even if they are not
      mentioned

    Examples
      $ codesandboxer some/react/component.js
`,
  {
    flags: {
      dry: {
        type: 'boolean',
        alias: 'D',
      },
      name: {
        type: 'string',
        alias: 'n',
      },
      allowedExtensions: {
        type: 'string',
        description: 'Pass in extensions that can be used in addition to .js',
        help: 'allowedExtensions is not yet implemented',
      },
      files: {
        alias: 'f',
        type: 'string',
        description:
          'Provide a list of files that will be included even if they do not get imported',
        help: 'files is not yet implemented',
      },
      dependencies: {
        alias: 'd',
        type: 'string',
        description:
          'A list of dependencies to include, even if they are not mentioned in the bundled files',
        help: 'dependencies is not yet implemented',
      },
      sandboxTemplate: {
        alias: 't',
        type: 'string',
        description: 'Change the sandbox type from create-react-app',
        help: 'sandboxTemplate is not yet implemented',
      },
    },
  },
);

async function CLIStuff(cliData) {
  let [filePath] = cliData.input;
  let config = {};

  if (!filePath) {
    return console.error(
      'No filePath was passed in. Please pass in the path to the file you want to sandbox',
    );
  }

  if (cliData.flags.name) config.name = cliData.flags.name;
  if (cliData.flags.allowedExtensions) {
    config.extensions = cliData.flags.allowedExtensions.split(',');
  }

  if (cliData.flags.files) {
    // This is harder than it initially looks. We are going to need to get some
    // It mostly mirrors assembleFiles, but likely demands that it keeps its
    // own location.
    // I think you need to be able to pass in both, but assumed place should
    // be the relative package location
    return console.error(
      'We have not implemented the files flag yet to allow you to pass in custom files',
    );
  }
  if (cliData.flags.dependencies) {
    let packageDir = await pkgDir(filePath);
    // $FlowFixMe - we are aware this is bad
    const pkgJSON = require(`${packageDir}/package.json`);
    // Once again, we likely want some config info ahead of time. Here we want the pkgJSON
    //
    config.extraDependencies = {};
    let depsArray = cliData.flags.dependencies.split(',');
    for (let dep of depsArray) {
      let matcher = dep.match(/(.+)(?:@(.+))?/);
      // The first item in the array is unused, and is declared so we can get
      // the second two.
      // eslint-disable-next-line no-unused-vars
      let [whole, name, version] = matcher;
      if (version) {
        config.extraDependencies[name] = version;
      } else if (depInPkgJSON(pkgJSON, name)) {
        config.extraDependencies[name] = depInPkgJSON(pkgJSON, name);
      } else {
        console.warn(
          'could not find version for',
          name,
          'defaulting to "latest"',
        );
        config.extraDependencies[name] = 'latest';
      }
    }
    return console.error('We have not implemented the dependencies flag yet.');
  }
  if (cliData.flags.sandboxTemplate) {
    config.template = cliData.flags.sandboxTemplate;
  }

  try {
    if (cliData.flags.dry) {
      let results = await assembleFiles(filePath, config);
      console.log(
        'dry done, here is a list of the files to be uploaded:\n',
        Object.keys(results.files).join('\n'),
      );
    } else {
      let results = await assembleFilesAndPost(filePath, {
        name: cliData.flags.name,
        ...config,
      });
      console.log(results);
    }
  } catch (e) {
    switch (e.key) {
      case 'noPKGJSON':
        return console.error(
          `we could not resolve a package.json at ${e.fixedPath}`,
        );
      case 'noExampleFile':
        return console.error(
          `we could not resolve the example file ${filePath}\nWe tried to resolve this at: ${path.resolve(
            process.cwd(),
            e.relFilePath,
          )}`,
        );
      case 'tooManyModules':
        return console.error(
          "The number of files this will upload to codesandbox is Too Damn High, and we can't do it, sorry.",
        );
      default:
        return console.error(e);
    }
  }
}

CLIStuff(cli);
