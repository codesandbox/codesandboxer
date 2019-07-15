# Changelog

## 3.1.5

### Patch Changes

- [patch][2c210fa](https://github.com/codesandbox/codesandboxer/commit/2c210fa):
  Last publish did not have correct dists - republishing

## 3.1.4

### Patch Changes

- [patch][a4400e5](https://github.com/codesandbox/codesandboxer/commit/a4400e5):
  Update dependencies

## 3.1.3

- [patch][cedfb74](https://github.com/codesandbox/codesandboxer/commit/cedfb74):
  - Update repository references to point to new home.

## 3.1.2

- [patch][7c16efb](https://github.com/codesandbox/codesandboxer/commit/7c16efb):
  - Load files again upon deploy if specific props have been changed
- Updated dependencies [0b60604](https://github.com/codesandbox/codesandboxer/commit/0b60604):
- Updated dependencies [b46e059](https://github.com/codesandbox/codesandboxer/commit/b46e059):
  - codesandboxer@1.0.0

## 3.1.1

- [patch] af01387:

  - Handle passing through the fileName path

## 3.1.0

- [minor] 4b2b662:

  - Add autoload option to react-codesandboxer - should only be used to automatically open iframes

- Updated dependencies [9db3c25]:
  - codesandboxer@0.7.0

## 3.0.1

- Updated dependencies [d0c0cef]:
  - codesandboxer@0.6.1

## 3.0.0

- [minor] 🎉 ADD TYPESCRIPT SUPPORT 🎉 (comes with auto-detection of typescript examples)
- [BREAKING] remove the `allowJSX` prop, replacing it with the `extensions` prop.
- [minor] Add `template` prop, so you can directly set the codesandbox template to use in uploading.

## 2.1.4

- [patch] When there is an error in assembling a sandbox, do not try and deploy the sandbox anyway [e20b3c0](e20b3c0)
- [patch] Updated dependencies [becc64e](becc64e)
  - codesandboxer@0.5.0

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

- Breaking: dependencies that cannot be found in the passed in package.json will now no longer be added to the sandbox dependencies at 'latest'. This solves a bug where packages that were reaching into a file would have all those reach-ins added as dependencies.
- Breaking: `SkipDeploy` has been renamed to `SkipRedirect` to more accurately support its role, and make the embed process naming make sense.
- Breaking: Most logic has been pushed into `codesandboxer`, a standalone package to allow the complex logic in that to exist outside a single react component.

## 1.0.0

This is not hugely different from 0.4.2, with most changes being to documentation, mostly moving it in to v1. That said, there are some nice quality of life improvements:

- Add `name` prop to set the name value of the sandbox.
- Example file is now open by default instead of index.
- Update package.json and index.js templates for clarity
- Edit pass on the documentation

## 0.4.2

- Update our import capture function to recognise `export { default } from 'somewhere'` as a valid import.
- handle multiple spaces and space-types in import capturing and comparing.

## 0.4.1

- Imports of `place` resolving to `place/index.js` were being added to codesandbox as `place.js`. They now get their correct path.

## v0.4.0

- Added changelog
- Add preload prop, allowing fetching of content to happen before it is used
- For imports without file extensions, attempt `.js`, `.json`, then `/index.js`, in node resolution order, instead of just failing
- child render function now returns `isDeploying` and `error`, no longer returns `files`.
- `onLoadComplete()` prop was added. It is called with files and parameters in an object.
- `afterDeploy()` is no longer called with the parameters and files. Use onLoadComplete to hook into this information.
