# Changelog

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
