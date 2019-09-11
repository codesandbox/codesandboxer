## Things I am working on

- [ ] Be super careful to catch all errors
- [x] Rewrite readme to focus on use-cases and explaining how to implement them.
- [x] Look into supporting non-`create-react-app` uploads (Having to parse
      non-js files will need to be a part of this)
- [ ] With `codesandboxer`, refactor the shape of it. Take in a single object as
      argument, to make it easier to pass things around, and so we stop having
      the problem of ever-expanding functions. Move more properties into a
      generic `config` object
- [x] Add error boundaries around the loaded example component, to allow a
      better debugging experience when something goes wrong.

## New packages to build

- [ ] `codesandboxer-loader` - use `codesandboxer-fs` to create the data object
      to be sent to codesandbox
- [ ] `gatsby-plugin-codesandboxer` -

## Supporting other sandbox types

We currently support react and react-typescript sandboxes If you pass in the
`template` string, you can change your sandbox kind.

## Notes made on change alongside LBatch:

```
fetchRelativePkgJSON(componentFile)
compositData(entryFile, componentFile, gitConfig)

fetchRelativePkgJSON(examplePath)
.then(({
  pkgJSONPath,
}) =>

from componentFile, fetch pkgJSON using pkgUp
fetch entryFile and its dependents

config = {
  gitConfig: {} | fs,
  pkgJSON?: {} | Promise({}), // if no pkgJSON is given, pkgUp to a pkgJSON,
  entryFilePath?: string // if not provided sub in default file contents,
}

fetchFiles(examplePath, config)

ensureEntryFile() => (
  if
)

const parsedFile = {
  file: { 'name/path.js': '/* */' },
  internalDependencies: [],
  extternalDependencies: {},
}
```

```js
const rc = findRC()
const pkgJSON = ensureProjectPkgJSON({ config.pkgJSON, rc.pkgJSON /*, pkgUp.pkgJSON*/ })
const parsedEntryFile = ensureEntryFile({ config.entryFile, rc.entryFile /*, defaultedEntryFileContents*/ })
const parsedExampleFile = getExampleFile(examplePath)

const files = {
  'example.js': { content: parsedExampleFile.contents },
  'codesandboxerEntry.js': { content: parsedEntryFile.contents },
}

return assembleAllFilesAndDeps(files, {
    ...parsedEntryFile.externalDeps,
    ...parsedExampleFile.externalDeps
  }, [
    // ...parsedEntryFile.internalDeps,
    ...parsedExampleFile.internalDeps,
  ], pkgJSON, config)
```

```
// entryFiles cannot have internalDeps
import './styles.css'
import whatever from './example'
```

---

```js
files = {
  'path/to/somewhere.js': { content: '/* the file contents */' },
};

deps = {
  package: '^1.1.0',
};
```

---
```
createParamsConfig = { name }

createParameters(files, externalDependencies, initialPKGJSON config ????)
```

```js
const sentPKGJSON = generatePkgJSON(externalDependencies, config) // ensures all packages have react and react-dom
files['package.json'] = sentPKGJSON;
files['index.html'] = <div id="app"></div><script loads app>
files['sandbox.config.json'] = JSON.stringfiy({ template: config.template || 'create-react-app-type' })
return { files, parameters: hashZeFiles(files) }
```

```
fetchFiles(examplePath, config))
  .then(createParameters)
  .then(sendFilesToCSB)
  .then(here is a link)

default -> rc -> overrides (flags)

file-up codesandboxerrc.js
```

```bash
$ codesandboxer examplePath.js -e exampleWrapper.js -p somewhere/package.json
```

Later stuff:

- TS/babelrc (file-up, then custom things)
- AST instead of regex (still needs to check browser-niceness)
- Relative positioning (and moving position of files)
- entryFile having internalImports
