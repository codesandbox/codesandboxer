# React-CodeSandboxer

A simple react component that allows you to deploy example code to `Codesandbox`. It can take a `file` content, or fetch an example file from github or bitbucket.

For fetching files, it will add both internal and external imports to the example, allowing you to build complex examples when you need to.

This is a client-side implementation of a workflow using `codesandboxer`

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
4. You may find console errors from failed fetch requests. Codesandboxer captures and handles these errors, but we cannot stop them appearing in the console. See [minutiae](../../MINUTIAE.md) for details on why.

## Props we super definitely need

With `gitInfo` and `examplePath`, we can take care of everything else for you, fetching all the example, and then fetching all other imports. Without this, things break.

### `examplePath: string`

The absolute path to the example within the git file structure. This is used for fetching the example and other files that exist relative to the example.

### `gitInfo: GitInfo`

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

## Props You Definitely Probably Want To Provide

While these props aren't necessary to have codesandboxer work, you will almost always want to configure these, to make sure the example you get on codesandbox is the same as the example when run in its local context.

### `children: ({ error, isLoading, isDeploying, sandboxId, sandboxUrl }) => Node`

Render prop that return `isLoading`, `files` and `error`. This is the recommended way to respond to the contents of `react-codesandboxer` if you want to change the appearance of the button.

Children also receives the `sandboxId` and the `sandboxUrl` once those exist.

### `pkgJSON?: Package | string | Promise<Package | string>`

The contents of the `package.json`. This is used to find the correct versions for imported npm packages used in your example and other files pulled in. If no package.json is provided, each package will use `latest` from npm. It has effectively 4 ways to pass in the package.JSON

- Pass in the package itself as an object.
- Pass in a string which is the git path to the package
- Pass in a promise that resolves to:
  - An object that represents the package.json
  - A stringified version of the package.json object.

### `importReplacements?: Array<[string, string]>`

Paths in the example that we do not want to be pulled from their relative location. These should be given as absolute git paths. This is most commonly used if your examples are pulling in something such as `src`, and you want to rely on the npm version of the component in codesandbox.

### `dependencies?: { [string]: string }`

Dependencies to always include, even if they are not found in any file that was passed in. If you are using `importReplacements`, anything that is being added by it should go here as well. We always include react and react-dom for you.

## Cool Props To Add Niceness

These props are less needed, and more to allow different use-cases, or some amount of debugging. You do not need to worry too much about them, but you can get some cool things done using them.

### `example?: string | Promise<string>`

Pass in the example as code to prevent it being fetched. This can be used when you want to perform any transformation on the example. If you pass in a promise, the returned value of the promise will be used. This can be useful if you are performing your own fetch or similar to get your example's raw contents.

### `name: string`

Name for the codesandbox instance. This sets the package name in the uploaded `package.json`, which in turn sets the sandbox name.

### `afterDeployError?: ({ name: string, description?: string, content?: string, }) => mixed`

Function that is called when an error occurs in the deploy process, with details of the error.

### `autoDeploy?: boolean`

Deploy the sandbox when component mounts, instead of waiting for the button to be clicked. You should only need to autodeploy if you plan on opening the sandbox immediately, such as in an iframe.

### `preload?: boolean`

Load the files when component mounts, instead of waiting for the button to be clicked. This doesn't deploy the sandbox on mount yet, it only preloads all the data it needs to deploy.

### onLoadComplete?: ({ parameters: string, files: Files } | { error: any }) => mixed,

Function called once loading has finished, whether this is from preload or from a button press. It returns an object with the parameters string to submit to CodeSandbox as well as the unprocessed files object. If there is an error, the error will be returned instead.

### `afterDeploy?: (sandboxUrl: string, sandboxId: string) => mixed`

Function called once the deploy has occurred. This function is given both the base sandboxUrl that we open by default, as well as the sandboxId so you can generate your own urls, such as an embed url.

### `providedFiles?: Files`

Pass in files separately to fetching them. Useful to go alongside specific replacements in importReplacements.

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

### `skipRedirect?: boolean`

Do not open the sandbox once the data has been sent. Using this along with the `afterDeploy` prop can allow you to handle what is done with the sandbox, including loading an embed using the ID.

#### `extensions?: Array<string>`

An array of extensions that will be treated as javascript files. For example, if you pass in [`.jsx`], when loading files, we will attempt to fetch `.jsx` files as well as `.js` and `.json` files. The extension type of your example is automatically added, so if you pass in the `examplePath` `my/cool/example.jsx`, you will not need to pass in the jsx extension.

If your example file is fo type `.ts` or `.tsx` both are added.

### `template?: string`

This template prop sets what codesandbox template to use. Currently we support:

- `create-react-app`
- `create-react-app-typescript`

We auto-detect which one we think we should use, so you should only need to provide this if you want to override our selected template.

Unsupported templates will still cause the bundled files to be sent to codesandbox under that template, but the bundling may fail.

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

- We are providing the pkgJSON as an object, so it does not need to be fetched (this also accepts a promise that resolves to a pkgJSON)
- We are specifying a branch to pull files from (also accepts git hashes)
- We are replacing src files with a reference to the package, so the package's own internals are pulled from npm (this is a nice optimisation in component docs)
- We have a collection of dependencies we always include
- We are providing our own index, allowing us to add the `css-reset` to it. We can also pass in extra files
- We are logging after a deploy
- We have provided a custom button component
