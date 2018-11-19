# CodeSandboxer

A quick loader to load an example into `codesandbox`. Takes in an entry file from github or bitbucket that loads a react component and upload it to codesandbox.

All you need to provide are the repository information, the path to the example, and the path to the `package.json`.

## What it Does

Codesandbox collects files starting from a single example file and uploads the bundle to codesandbox, returning you the sandbox ID that these files generate. It includes by default an index file to render your example.

## Why this is cool

### Intelligently Fetches Dependencies

Using the example file and the `package.json`, dependencies that the example uses will be added to the sandbox, and everything else will be left.

### Dynamic Import Following

When codesandbox is pointed at a file, it can resolve relative imports into that file, meaning that examples relying on utils or images will resolve correctly.

### Customisable Usages

Codesandboxer is set up so if you provide your git information and a relative path to where the example is in the repository, it will take care of everything for you. Alternatively, if you have some of the content, or wish to edit it (for example replacing particular relative imports before upload) you can deeply customise the information before it is sent.

You can use this purely to help format your files for codesandbox, or you can rely much more heavily on it to do work for you.

## API

### Quick Start

There is an assumed workflow to codesandboxer:

```js
import {
  fetchFiles,
  finaliseCSB,
  sendFilesToCSB
} from 'codesandboxer'

/*
fetchedInfo is an object containing `files`, the internal exports of the target file, and `dependencies`, the external dependencies of all files.
*/
let fetchedInfo = await fetchFiles({
  examplePath: 'fixtures/simple'
  gitInfo: {
    host: 'github',
    account: 'Noviny',
    repository: 'codesandboxer',
  }
})

// This also returns a finalised files and finalised dependencies property, in case you want to introspect those before sending.
let finalisedInformation = finaliseCSB(fetchedInfo)
let csbInfo = await sendFilesToCSB(finalisedInformation.parameters)
console.log('Our sandbox\'s ID:', csbInfo.sandboxId)
console.log('Simple sandbox URL:', csbInfo.sandboxUrl)
```

In addition to these three main functions in the workflow, there are also several helper functions that can be used separately. We are going to look at the three main functions first, then the helper functions.

### fetchFiles()

`fetchFiles` takes in the necessary information to assemble your files bundle, and returns a promise with with an object that contains:

`files`: An object of the files that are to be included in the bundle, with the entry file named as 'example.js'

`dependencies`: An object containing all the external dependencies that will be required from npm to assemble your package.

It takes a single argument which is an object, the properties of which are detailed below.

Note that only the examplePath and gitInfo are required. Everything else can be inferred.

#### `examplePath`: string

examplePath is always required, and is a path relative to the root of the git repository. Assuming no example is provided, this file will be fetched from github or bitbucket.

#### `gitInfo`:

An object containing the information to make fetch requests from github or bitbucket. There are three mandatory properties and one optional property.

* account: the name of the account the repository is under
* repository: the repository name
* host: where your content is hosted, accepts 'bitbucket' or 'github'
* branch: optionally you can define what branch to pull from (fun fact, also accepts git hashes). Defaults to master if no branch is required.

This information is needed to fetch any additional files needed.

#### pkgJSON

This is an optional property, that can include a package.JSON's contents as an object or a string which is the path relative to the git source directory to fetch the `package.json` from your git repository. pkgJSON finally accepts a promise that can be resolve to either of these two other types.

The contents of the eventual resolved `package.json` will be used to get the correct version ranges of packages your example is relying upon, and assemble a package.json for codesandbox to use in pulling them in.

#### importReplacements: Array

importReplacements are used before parsing what imports are needed by a file, to allow you to keep control of what files are uploaded.

The biggest use-case of this is if you are relying on your `src/` directory, but want to use your package from npm in the uploaded example.

If you pass in a path ending in a \*, it will replace all that match the start of the pattern with the new pattern.

We also expose the logic that replaces imports as `replaceImports()`, in case you want to transform a file before passing it to us.

#### example

If you do not want the example content to be fetched (for example, you have access to the raw code, or want to transform it yourself before analysis), you can pass in the example file as raw here (just a string). You can also pass a promise that resolves to an example's file's contents.

#### extensions

An array of extensions that will be treated as javascript files. For example, if you pass in [`.jsx`], when loading files, we will attempt to fetch `.jsx` files as well as `.js` and `.json` files. The extension type of your example is automatically added, so if you pass in the `examplePath` `my/cool/example.jsx`, you will not need to pass in the jsx extension.

If your example file is fo type `.ts` or `.tsx` both are added.

### finaliseCSB(compiledInfo, config)

The FinaliseCSB function is used to generate a parameter hash of the file contents that can be sent to codesandbox using `sendFilesToCSB`. It takes in the result of `fetchFiles`, however is separate so you can intercept files and either examine or modify them before it is sent to codesandbox.

The config object is optional, and can have any of the following properties:

#### name

The name for the sandbox once created.

#### extraFiles

Pass in files separately to fetching them. Useful to go alongisde specific replacements in importReplacements.

The shape of the files object is

```
{
  fileName: {
    content: string
  }
}
```

The filename is the absolute path where it will be created on CodeSandbox, and the content is the file's contents as a string.

If a fileName exists in your provided files, it will not be fetched when it is referenced.

#### extraDependencies

An object with packages formatted in the same way as the dependencies in a `package.json` which will always be included in a sandbox, even if it is not found within the example's tree.

### sendFilesToCSB()

Accepts the generated `parameters` from the codesandbox API, and posts them for you, returning a promise that resolves to an object that has both the sandbox ID, as well as the base URL to open the sandbox on the example page.

### parseFile(file, pkgJSON)

`parseFile` is our internal method for finding all the import information about a file.

It accepts a raw file, or a promise that resolves to a raw file, and a `package.json` as an object, or a promise that resolves to a package.json as an object.

It returns an object with the shape:

```
{
  file: // the raw file code
  deps: // the external dependencies of the package with the version range from the package.json
  internalImports: // a list of the internal imports that the file relies upon.
}
```

### replaceImports(code, Array<[old, new]>)

The internal method we use to replace imports. This takes in a raw file, and an array of imports to replace. The first item in the array is what will be replaced, and the second is what it will be replaced with.

If you pass in a path ending in a \*, it will replace all that match the start of the pattern with the new pattern.

### fetchRelativeFile( path, pkg, importReplacements: Array<[string, string]>, gitInfo, config)

This function takes in a path to a file relative to the git route, and along with the git information, fetches. It will also replace the imports as provided for javascript files.

It return a promise with a parsed file which is an object that looks like:

```
{
  file: string,
  deps: { [string]: string },
  internalImports: Array<string>,
  path: // the new path that this file will be added to within codesandbox, and which other files can now use as an importReplacement,
}
```

Currently the shape of the config object should be `{ allowJSX: boolean }`. If the config object is not provided, this defaults to false.

### getSandboxUrl(id, type)

Passed in a sandbox id, return a url to that sandbox. Optionally takes in a type which can be used to make the url an embed url by passing in the type `'embed'`.

## Things to do better

### Support commonJS modules

Currently we are scanning for import statements, and commonJS requires are not supported.

### Support beyond react

The principal developer of this works in a react context, however the core good features (file fetching from relative imports, and packages, parsing all those files into a bundle codesandbox understands, posting to codesandbox) are valuable to any codesandbox project.

If you want to use codesandboxer to upload something other than react, please get in contact with us so we can help out.

### Does not play nicely with inline webpack loaders

If you are using inline webpack loaders, we don't know how to parse those. This is not on our roadmap to support.

### Designed browser-first

As `codesandboxer` is designed to operate from the browser, it's not using an AST to parse the files it is reading. If you are using it in a node context, implementing this functionality using an AST generator such as babel will likely lead to safer, more precise code.
