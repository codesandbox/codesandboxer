# Changelog

## 2.1.3

Update codesandboxer version

## 2.1.2

Update codesandboxer version so the changes in 2.1.1 do not break your app

## 2.1.1

Update version of codesandboxer
This mostly incorporates API changes with codesandboxer that should not impact
those using react-coesandboxer

## 2.1.0

Add new prop `afterDeployError`, to allow responding to errors.
Add more robust erroring, so people are less lost when something goes wrong.

## 2.0.3

Update of codesandboxer after a bug in jsx component reading.

## 2.0.2

Add flag to allow the loading of jsx components.

## 2.0.1

Update codesandboxer dependency to resolve bug

## 2.0.0

Big change here is that, with the release of `codesandboxer`, `react-codesandboxer` is no longer personally carrying the file-fetching and deploying logic. This has been done to make codesandboxer more useful in more contexts, and so it can eventually support non-react sandboxes.

This also means we are using fetch instead of form submission, which means that we can return you a sandbox ID and url to your rendered child. This means you can choose how to open your sandbox, and makes it easy to open an example in an embed instead of on codesandbox itself.

There's also a small breaking change to handle a bug.

* Breaking: dependencies that cannot be found in the passed in package.json will now no longer be added to the sandbox dependencies at 'latest'. This solves a bug where packages that were reaching into a file would have all those reach-ins added as dependencies.
* Breaking: `SkipDeploy` has been renamed to `SkipRedirect` to more accurately support its role, and make the embed process naming make sense.
* Breaking: Most logic has been pushed into `codesandboxer`, a standalone package to allow the complex logic in that to exist outside a single react component.

## 1.0.0

This is not hugely different from 0.4.2, with most changes being to documentation, mostly moving it in to v1. That said, there are some nice quality of life improvements:

* Add `name` prop to set the name value of the sandbox.
* Example file is now open by default instead of index.
* Update package.json and index.js templates for clarity
* Edit pass on the documentation

## 0.4.2

* Update our import capture function to recognise `export { default } from 'somewhere'` as a valid import.
* handle multiple spaces and space-types in import capturing and comparing.

## 0.4.1

* Imports of `place` resolving to `place/index.js` were being added to codesandbox as `place.js`. They now get their correct path.

## v0.4.0

* Added changelog
* Add preload prop, allowing fetching of content to happen before it is used
* For imports without file extensions, attempt `.js`, `.json`, then `/index.js`, in node resolution order, instead of just failing
* child render function now returns `isDeploying` and `error`, no longer returns `files`.
* `onLoadComplete()` prop was added. It is called with files and parameters in an object.
* `afterDeploy()` is no longer called with the parameters and files. Use onLoadComplete to hook into this information.
