# Changelog

## 0.2.2

Use the formData package for deploys instead of the native web formData. This is to allow codesandboxer to be node-compatible.

## 0.2.1

An internal call of `fetchRelativeFile` was not being passed the new 'config' object, causing an error in file fetching. It is now being passed the correct object.

## 0.2.0

Add a new argument to `fetchFiles`, and `fetchRelativeFile` that is a config object.

To the config object add `allowJSX` as a property with a boolean value.

Codesandboxer can now load jsx files if you opt into it.

- allow loading of JSX files
- Add tests using fixtures in repo to test file resolution

## 0.1.1

Stop using * import due to struggles with transform-runtime

## 0.1.0

Be extracted from react-codesandboxer
