# React-CodeSandboxer

A simple react component that allows you to deploy example code to `Codesandbox`. It can take a `file` content, or fetch an example file from github or bitbucket.

For fetching files, it will add both internal and external imports to the example, allowing you to build complex examples when you need to.

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
    {() => <button type="submit">Upload to CodeSandbox</button>}
  </CodeSandboxer>
);
```

## What does this actually do?

With the minimal options provided, the sandboxer can fetch the file contents from github, as well as the relevant imports of that file (both internal and external)

## Quick gotchas

1. If the example file does not exist at the source, the deploy will fail. You can get around this by passing in the file's contents directly as the prop `example`.
2. We follow relative imports in the example, so the example still works when uploaded. The fewer files your example depends upon, the faster it will be. (we will only ever fetch a file once, even if multiple things depend upon it)
3. While it's not enforced, making sure you have a button with the type 'sumbit' at the top level is important for accessibility.
4. You may find console errors from failed fetch requests. Codesandboxer captures and handles these errors, but we cannot stop them appearing in the console. See [minutiae](/MINUTIAE.md) for details on why.

## Component's Props

### `examplePath: string`

The absolute path to the example within the git file structure. This is used for fetching the example and other files that exist relative to the example.

### `gitInfo: FetchConfig`

This is all the information we need to fetch information from github or bitbucket. The format is:

```
{
  account: string,
  repository: string,
  branch?: string,
  host: 'bitbucket' | 'github',
}
```

If no branch is provided, you will have your code deployed from master. Host is not defaulted.

### `children: ({ error, isLoading, isDeploying }) => Node`

Render prop that return `isLoading`, `files` and `error`. This is the recommended way to respond to the contents of react-codesandboxer if you want to change the appearance of the button.

### `pkgJSON?: Package | string | Promise<Package | string>`

The contents of the `package.json`. This is used to find the correct versions for imported npm packages used in your example and other files pulled in. If no package.json is provided, each package will use `latest` from npm. It has effectively 4 ways to pass in the package.JSON

* Pass in the package itself as an object.
* Pass in a string which is the git path to the package
* Pass in a promise that resolves to:
  * An object that represents the package.json
  * A stringified version of the package.json object.

### `example?: string | Promise<string>`

Pass in the example as code to prevent it being fetched. This can be used when you want to perform any transformation on the example. If you pass in a promise, the returned value of the promise will be used. This can be useful if you are performing your own fetch or similar to get your example's raw contents.

### `preload?: boolean`

Load the files when component mounts, instead of waiting for the button to be clicked.

### `importReplacements?: Array<[string, string]>`

Paths in the example that we do not want to be pulled from their relative location. These should be given as absolute git paths.

### `dependencies?: { [string]: string }`

Dependencies to always include. We always include react and react-dom for you. If you are replacing a relative import with a dependency, you will need to add it here.

### onLoadComplete?: ({ parameters: string, files: Files } | { error: any }) => mixed,

Function called once loading has finished, whether this is from preload or from a button press. It returns an object with the parameters string to submit to CodeSandbox as well as the unprocessed files object. If there is an error, the error will be returned instead.

### `afterDeploy?: () => mixed`

Function called once the deploy has occurred. It is given no values.

### `providedFiles?: Files`

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

### `skipDeploy?: boolean`

Do not actually deploy to CodeSandbox. Used to for testing alongside the return values of the render prop.

## A slightly more complicated example:

```js
import pkgJSON from '../package.json';

<CodeSandboxer
  examplePath="deeply/nested/thing/some-example.js"
  pkgJSON={pkgJSON}
  gitInfo={{
    account: 'noviny',
    repository: 'react-CodeSandbox',
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
  {({ isLoading, error }) =>
    isLoading
      ? <div>Uploading</div>
      : (
        <button type="submit"  disabled={!!error}>
          Upload to CodeSandbox
        </button>  
      )
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
