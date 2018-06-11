## Things I am working on

- [x] More tests, make sure there is better file coverage
- [ ] Be super careful to catch all errors
- [ ] Rewrite readme to focus on use-cases and explaining how to implement them.
- [x] For replacements and file fetching, support `requires` as well as `imports`
- [x] pull all of the logic around navigating filePaths into its own Package - not going to do this.
- [x] pull the logic around fetching and then deploying files to CSB into its own Package
- [ ] Look into supporting non-`create-react-app` uploads (Having to parse non-js files will need to be a part of this)
- [x] Make the sendFilesToCSB() function take in the files object and some other metadata instead of only ever the parameters.
- [ ] With `codesandboxer`, refactor the shape of it. Take in a single object as argument, to make it easier to pass things around, and so we stop having the problem of ever-expanding functions. Move more properties into a generic `config` object
- [x] Rename repository to `codesandboxer`, as this is now a monorepo
- [ ] Add error boundaries around the loaded example component, to allow a better debugging experience when something goes wrong.

## New packages to build

- [x] `fs-codesandboxer`, which can read from your local filesystem instead of fetching grom github or bitbucket. Can use `codesandboxer` for `parseFile()`. May need some of the assembly logic in `getFiles` exposed separate to doing the fetch.
- [x] deploy editor plugins (for vs code and atom), to open code directly from an editor. (this would rely on having `fs-codesandboxer` first)
- [x] add plugins for github/bitbucket to allow you to open a file you are viewing in a web browser in codesandbox


## Supporting other sandbox types

Generically, it would be good if codesandboxer could take in an option for the kind of sandbox it wants to generate. As we have a set of base files we need to render the example, we realistically probably want a base for each sandbox type. Bonus points if we can go any way to dynamically discovering this.

## Notes made on change alongside LBatch:

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
const rc = findRC()
const pkgJSON = ensureProjectPkgJSON({ config.pkgJSON, rc.pkgJSON, //pkgUp.pkgJSON })
const parsedEntryFile = ensureEntryFile({ config.entryFile, rc.entryFile, //defaultedEntryFileContents })
const parsedExampleFile = getExampleFile(examplePath)

const files = {
  'example.js': { content: parsedExampleFile.contents },
  'codesandboxerEntry.js': { content: parsedEntryFile.contents },
}

return await assembleAllFilesAndDeps(files, {
    ...parsedEntryFile.externalDeps,
    ...parsedExampleFile.externalDeps
  }, [
    // ...parsedEntryFile.internalDeps,
    ...parsedExampleFile.internalDeps
  ], pkgJSON, config)
```

// entryFiles cannot have internalDeps
import './styles.css'
import whatever from './example'


---

files = {
  'path/to/somewhere.js': { content: '/* the file contents */' }
}

deps = {
  package: '^1.1.0'
}

---

createParamsConfig = {
  name
}

createParameters(files, externalDependencies, initialPKGJSON config ????)

```
const sentPKGJSON = generatePkgJSON(externalDependencies, config) // ensures all packages have react and react-dom
files['package.json'] = sentPKGJSON;
files['index.html'] = <div id="app"></div><script loads app>
files['sandbox.config.json'] = JSON.stringfiy({ template: config.template || 'create-react-app-type' })
return { files, parameters: hashZeFiles(files) }
```


fetchFiles(examplePath, config))
  .then(createParameters)
  .then(sendFilesToCSB)
  .then(here is a link)


fs

default -> rc -> overrides (flags)

file-up codesandboxerrc.js

```
$ codesandboxer examplePath.js -e exampleWrapper.js -p somewhere/package.json
```


Later stuff:
TS/babelrc (file-up, then custom things)
AST instead of regex (still needs to check browser-niceness)
Relative positioning (and moving position of files)
entryFile having internalImports
