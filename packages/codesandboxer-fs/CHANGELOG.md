# Changelog

## 1.0.1
- [patch] [cedfb74](https://github.com/codesandbox/codesandboxer/commit/cedfb74):
  - Update repository references to point to new home.

## 1.0.0
- [major] [b46e059](https://github.com/codesandbox/codesandboxer/commit/b46e059):
  - Move codesandboxer and codesandboxer-fs to first major version, as they exist in a fairly stable and used state.
- Updated dependencies [0b60604](https://github.com/codesandbox/codesandboxer/commit/0b60604):
  - codesandboxer@1.0.0

## 0.4.7
- [patch] [82a4f5f](https://github.com/codesandbox/codesandboxer/commit/82a4f5f):

  - Fix typo that was stopping react and react-dom being ensured by the finalisation.

## 0.4.6
- [patch] af01387:

  - Share information on the main example's filename and use this in the url

## 0.4.5
- [patch] 0f3b87a:

  - Pass through template in correct spot

## 0.4.3
- [patch] 4b2b662:

  - Reorganise how templates are stored
      This is a bunch of changes that should mostly only be relevant internally.

      First is that there is a `/templates` directory instead of `constants.js` to
      store templates in. This makes it easy to read a template an easy to see how to add a new template

      Secondly, while `codesandboxer-fs` still has its own templates, it inherits templates from `codesandboxer`
      meaning that a template can be added in one and flow down to the other.

      This sets up for Vue sandboxes.
- [patch] 4b2b662:

  - Add Vue template to upload vue sandboxes
      In addition, codesandboxer will do its best to autodetect if it is
      processing a vue, react, or react-typescript sandbox, and use the
      preferred sandbox unless otherwise specified.
- Updated dependencies [9db3c25]:
  - codesandboxer@0.7.0

## 0.4.2
- [patch] 7a8ec34:

  - Fix path resolution for example path. Thanks [Gilles De Mey](https://github.com/gillesdemey) for the fix!
- Updated dependencies [d0c0cef]:
  - codesandboxer@0.6.1

## 0.4.1

- [patch] The previous version had misnamed main files for typescript. Fixing that

## 0.4.0

- [patch] We relied on `meow`, but did not have a dependency on it. We now directly depend on `meow`
- [minor] 🎉 ADD TYPESCRIPT SUPPORT 🎉 (comes with auto-detection of typescript examples)

## 0.3.1
- [patch] Allow the loading of css files; convert the json loader to a generic raw loader [becc64e](becc64e)
- [patch] Properly spread in user-provided extensions [a59ac96](a59ac96)
- [patch] Add new option to pass in 'contents' instead of requiring file path [6041b10](6041b10)

## 0.3.0

Using 0.4 of codesandboxer, leading to better analysis of imports/exports and support for parsing requires
Add a `name` flag that allows you to set the sandbox's name
Add an `allowedExtensions` flag that allows extensions to be provided (for example '.jsx')
If the entry file is of a different file type, automatically add that file type to the allowed extensions.

## 0.2.1

Actually fix bug with path resolution.

## 0.2.0

Using v0.3 of codesandboxer - API changes that have made fs work much more nicely
with codesandboxer.
dry flag is now '--dry, -D' instead of '--dry, -d' (this has been made so -d can be used with dependencies)
Added '--name' flag, which allows you to name your sandbox
Fixed a bug with path resolution that would lead to trying to access non-existent files

## 0.1.0

Fixed a pernicious bug, changed how things work, vote of confidence bump.

## 0.0.2

Added documentation

## 0.0.1

Initial Release. Very unstable, do not rely upon it.
