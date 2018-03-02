# CodeSandboxer

```js
import React, { Component } from 'react';
import CodeSandboxer from 'react-codesandboxer';

export default () => (
  <CodeSandboxer
    examplePath="examples/file.js"
    gitInfo={{
      account: 'noviny',
      repository: 'react-codesandboxer',
      host: 'github',
    }}
  >
    {() => <button type="submit">Upload to codesandbox</button>}
  </CodSandboxer>
);
```

## What does this actually do?

With the minimal options provided, the sandboxer can fetch the file contents from github, as well as the relevant imports of that file (both internal and external)

## Quick gotchas

1. If the example file does not exist at the source, the deploy will fail. You can get around this by passing in the file's contents directly as the prop `example`.
2. We follow relative imports in the example, so the example still works when uploaded. The fewer files your example depends upon, the faster it will be. (we will only ever fetch a file once, even if multiple things depend upon it)
3. While it's not enforced, making sure you have a submit button at the top level is important for accessibility.

## Component's Props

### `examplePath: string`

The absolute path to the example within the git file structure

### `gitInfo: FetchConfig`

This is all the information we need to fetch information from github or bitbucket

### `example?: string | Promise<string>`

Pass in the example as code to prevent it being fetched

### `pkgJSON?: Package | string | Promise<Package | string>`

Either take in a package.json object, or a string as the path of the package.json

### `importReplacements: Array<[string, string]>`

Paths in the example that we do not want to be pulled from their relativeLocation

### `dependencies?: { [string]: string }`

Dependencies we always include. Most likely react and react-dom

### `skipDeploy?: boolean`

Do not actually deploy to codesanbox. Used to for testing alongside the return values of the render prop.

### `afterDeploy?: ({ parameters: string, files: Files } | { error: any }) => mixed`

NOTE: 0.4 will deprecate afterDeploy, as all information from it is no in the render prop
function that can be called once the deploy has occurred, useful if you want to give feedback or test how CSB is working

### `providedFiles?: Files`

Pass in files separately to fetching them. Useful to go alongisde specific replacements in importReplacements

### `children: State => Node`

Render prop that return `isLoading`, `files` and `error`. This is the recommended way to respond to the contents of react-codesandboxer, NOT the afterDeploy function.

## A slightly more complicated example:

```js
import pkgJSON from '../package.json';

<CodeSandboxer
  examplePath="deeply/nested/thing/some-example.js"
  pkgJSON={pkgJSON}
  gitInfo={{
    account: 'noviny',
    repository: 'react-codesandbox',
    branch: 'master',
    host: 'github',
  }}
  importReplacements={[['src', pkgJSON.name]]}
  dependencies={{
    '@atlaskit/css-reset': 'latest',
    [pkgJSON.name]: pkgJSON.version,
  }}
  providedFiles={{ 'index.js': content: { 'abcde....' } }}
  afterDeploy={console.log}
>
  {({ isLoading }) =>
    isLoading ? <div>Uploading</div> : <div>Upload to codesandbox</div>
  }
</CodeSandboxer>
```

This shows off some more advanced usage:

* We are providing the pkgJSON as an object, so it does not need to be fetched (this also accepts a promise that resolves to a pkgJSON)
* We are specifying a branch to pull files from (also accepts git hashes)
* We are replacing src files with a reference to the package, so the package's own internals are pulled from npm (this is a nice optimisation in component docs)
* We have a collection of dependencies we always include
* We are providing our own index, allowing us to add the `css-reset` to it. We can also pass in extra files
* We are logging after a deploy
* We have provided a custom button component

## Other helper methods

### parseFile(file pkgJSON)

Takes in the example code, and returns an object of the following:

```js
{
  file: string,
  deps: { [string]: string },
  internalImports: Array<string>,
}
```

`file` is the passed in file, or the value of a passed in argument.
`deps` are the dependencies of the file, using the value in the pkgJSON dependency, or 'latest' if the version is not found.
`internalImports` are an array of the strings of the relative path of the internal imports, to allow you to know where the code reaches into the file structure.

### replaceImports(example, [[../src, 'external-package'], [../src/\*, 'external-package/lib/']])

This function replaces an array of array of imports, with the first string in the array being the current import, and the second being the replacement.

If you pass in a path ending in a \*, it will replace all that match the start of the pattern with the new pattern.

NOTE: the importReplacements prop takes in absolute paths (relative to the git root directory) not the relative paths in examples. This is so we can transform these paths in all files that we encounter.
