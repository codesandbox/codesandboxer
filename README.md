# CodeSandboxer

====
A documentation update is currently underway. Below is the simplest use-case for the deployer at this time.
====

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
    {() => <div>Upload to codesandbox</div>}
  </CodSandboxer>
);
```

## What does this actually do?

With the minimal options provided, the sandboxer can fetch the file contents from github, as well as the relevant imports of that file (both internal and external)

## Quick gotchas

1. If the example file does not exist at the source, the deploy will fail. You can get around this by passing in the file's contents directly as the prop `example`.
2. We follow relative imports in the example, so the example still works when uploaded. The fewer files your example depends upon, the faster it will be. (we will only ever fetch a file once, even if multiple things depend upon it)

## A slightly more complicated example:

```js
<CodeSandboxer
  examplePath="deeply/nested/thing/some-example.js"
  pkgJSON={pkgJSON}
  gitInfo={{
    account: 'atlassian',
    repository: 'atlaskit-mk-2',
    branch: 'master',
    host: 'bitbucket',
  }}
  importReplacements={[['src', pkgJSON.name]]}
  dependencies={{
    '@atlaskit/css-reset': 'latest',
    [pkgJSON.name]: pkgJSON.version,
  }}
  extraFiles={{ 'index.js': 'abcde....' }}
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
