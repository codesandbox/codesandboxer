#!/usr/bin/env node
'use strict';

const meow = require('meow');
const { assembleFiles, assembleFilesAndPost } = require('./index');
const path = require('path');

let cli = meow(
  `
    Usage
      $ codesandboxer <filePath> ?<pkgJSONPath>

    Options
      --dry, -d Instead of deploying, display what will be deployed
      --allowJSXExtension Parse jsx files as if they were javascript files
      --list, -l Print out the array of files that are uploaded

    Examples
      $ codesandboxer some/react/component.js
`,
  {
    flags: {
      dry: {
        type: 'boolean',
        alias: 'd',
      },
      list: {
        type: 'boolean',
        alias: 'l',
      },
    },
  },
);

async function CLIStuff(cli) {
  let [filePath, pkgJSONPath] = cli.input;

  if (cli.flags.allowJSXExtension) {
    return console.error(
      'The allowJSXExtension flag has not yet been implemented',
    );
  }

  if (!filePath)
    return console.error(
      'No filePath was passed in. Please pass in the path to the file you want to sandbox',
    );

  try {
    if (cli.flags.dry) {
      let results = await assembleFiles(filePath, pkgJSONPath);
      console.log(results);
    } else {
      let results = await assembleFilesAndPost(filePath, pkgJSONPath);
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
            e.filePath,
          )}`,
        );
      case 'tooManyModules':
        return console.error(
          `The number of files this will upload to codesandbox is Too Damn High, and we can't do it, sorry.`,
        );
      default:
        return console.error(e);
    }
  }
}

CLIStuff(cli);
