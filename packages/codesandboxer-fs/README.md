# codesandboxer-fs

Deploy a single javascript file to codesandbox as a react entry point, bundling up other files you need, as well as the relevant dependencies, using `codesandboxer`'s default package under the hood to bundle files.

## Installation

```
$ yarn global add codesandboxer-fs
```

or

```
$ npm i -g codesandboxer-fs
```

## Base Usage

```
$ codesandboxer some/file/path.js
```

This will take this file, upload it and its dependent files to codesandbox, and assume that the file passed in is a renderable react component. It will also bundle any needed dependencies from your `package.json`

The response will look something like

```json
{
  sandboxId: "481nzy3v84",
  sandboxUrl: "https://codesandbox.io/s/481nzy3v84?module=/example.js"
}
```

which will be printed to your console.

`codesandboxer-fs` uses the context of the package the target file is from, bases its available npm dependencies on that file's `package.json`, and will not include files imported from places outside this scope.

## Flags

* `--dry -d` - this flag bundles the files, and prints them to the console, as well as the parameter to be sent to codesandbox.

## Why use this instead of the codesandbox cli?

The codesandbox CLI is intended to upload an entire create-react-app project, and as such is not designed to cherry-pick a file. Codesandboxer's goal is fundamentally different, in that it wants to focus on a single component, such as an example. Codesandboxer is going to be more useful if you want to share proposed changes to a component within an existing project with someone, while codesandbox will be better for uploading and looking at an entire website.
