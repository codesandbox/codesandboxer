# Changelog

## 1.0.1
- [patch] [cedfb74](https://github.com/codesandbox/codesandboxer/commit/cedfb74):
  - Update repository references to point to new home.

## 1.0.0
- [minor] [0b60604](https://github.com/codesandbox/codesandboxer/commit/0b60604):
  - Centralise decision around what template to use into one location, and allow it to be exported for downstream packages.
- [major] [b46e059](https://github.com/codesandbox/codesandboxer/commit/b46e059):
  - Move codesandboxer and codesandboxer-fs to first major version, as they exist in a fairly stable and used state.

## 0.7.2
- [patch] [82a4f5f](https://github.com/codesandbox/codesandboxer/commit/82a4f5f):

  - Fix typo that was stopping react and react-dom being ensured by the finalisation.

## 0.7.1
- [patch] af01387:

  - Share information on the main example's filename and use this in the url

## 0.7.0
- [patch] 4b2b662:

  - Reorganise how templates are stored
      This is a bunch of changes that should mostly only be relevant internally.

      First is that there is a `/templates` directory instead of `constants.js` to
      store templates in. This makes it easy to read a template an easy to see how to add a new template

      Secondly, while `codesandboxer-fs` still has its own templates, it inherits templates from `codesandboxer`
      meaning that a template can be added in one and flow down to the other.

      This sets up for Vue sandboxes.
- [minor] 9db3c25:

  - template is now passed to 'finaliseCSB' as part of the first object not the second object.
- [patch] 4b2b662:

  - Add Vue template to upload vue sandboxes
      In addition, codesandboxer will do its best to autodetect if it is
      processing a vue, react, or react-typescript sandbox, and use the
      preferred sandbox unless otherwise specified.

## 0.6.1
- [patch] d0c0cef:

  - Add basic support for sass and scss being uploaded

## 0.6.0

- [minor] 🎉 ADD TYPESCRIPT SUPPORT 🎉 (comes with auto-detection of typescript examples)
- [patch] Use `path-browserify` for most path actions, making the code more reliable
- [patch] Import statements now no longer need a variable declaration to be parsed
- [BREAKING] Remove the `allowJSX` config option - this is replaced by `extensions`, an array of allowed additional extensions
  - the file type of the example file is automatically added, so if your example is a `.jsx` file you no longer need to pass anything in. If it is a `.ts` or `.tsx` file, it will add both extensions as allowed extensions. Overall, you probably don't need it.

## 0.5.0
- [minor] Allow the loading of css files; convert the json loader to a generic raw loader [becc64e](becc64e)

## 0.4.0

- Rewrote logic that handles parsing imports. As well as just being a bit more secure, it now correctly support:
  - require statements as well as imports
  - `export a from 'b'` syntax

## 0.3.0

BREAKING - fetchFiles now returns just the { files, deps } object, which was previously returned as files. It no longer return parameters or name.
BREAKING - finaliseCSB is now exported. The API for this function has changed dramatically as well. This function accepts the mix of files, deps, and several other passed in values, and is used to generate the parameter hash.

The new workflow goes fetchFiles() -> finaliseCSB() -> sendFilesToCSB, with the ability to put your own logic in between these.

FEATURE - resolvePath is now exported. This is to support codesandboxer-fs, which wants to rely upon it.

## 0.2.2

Use the formData package for deploys instead of the native web formData. This is to allow codesandboxer to be node-compatible.

## 0.2.1

An internal call of `fetchRelativeFile` was not being passed the new 'config' object, causing an error in file fetching. It is now being passed the correct object.

## 0.2.0

Add a new argument to `fetchFiles`, and `fetchRelativeFile` that is a config object.

To the config object add `allowJSX` as a property with a boolean value.

Codesandboxer can now load jsx files if you opt into it.

* allow loading of JSX files
* Add tests using fixtures in repo to test file resolution

## 0.1.1

Stop using \* import due to struggles with transform-runtime

## 0.1.0

Be extracted from react-codesandboxer
