## Next feature - simple handle file graphs

### Intended user Experience:

If you provide your source reference (github, or bitbucket, repo and filepath information), CodesandboxDeployer can take the example file, and fetch additional files. By default it goes to an additional depth of 1, failing if files one further down the graph also have new internal dependencies, but the depth can be set to go deeper.

Alongside this, allow pre-loading of files by the component, and report back when we predict a deploy will fail.

This likely means we allow you to pass in an `examplePath` instead of an example.

### Expected API:

```js
import CodeSandboxer from 'react-codesandboxer';

const const repoInfo = {
  account: 'Noviny',
  repository: 'react-codesandboxer',
  host: 'github',
};

CSBWrapper = ({ examplePath = 'src/constants.js' }) => (
  <CodeSandboxer
    examplePath={examplePath}
    pkgJSON={fetch(pkgJSONPath)}
    config={{ ...repoInfo, startingDeps, providedFiles }}
    depth={3}
    preloadFiles
    onLoadFailure={(error: Object, time: 'load' | 'deploy') => console.log("error loading files, we should disable the button and possibly display user feedback", error)}
  />
)
```

* we need a way to dely fetching of pkgJSON...
* we may want to make providedFiles to require a fs location ??

### Current status:

Single File fetch works well, return the information we need. Mapping multiple file fetches is harder, and currently a work in progress. Information needs to reach a top layer between attempts to resolve. A big question is how to handle passing information back up. Should we work to format data as we get it and merge it into a big block, or should we do something less like what we will send CSB that is easier to move through, and then convert it only when we want to upload the information

### Other api

Instead of depth, a max files option may make sense, however that may make failures less predictable, as you may get 2 files in and suddenly have it stop fetching. Also makes ordering of dependencies in file change behaviour.

### Likely to change:

Internally we have been very simple about how we process files. Handling them individually, we can import and resolve imports for files in isolation. This means we don't need to store data about possible related files anywhere.

### Our new problem:

To follow imports, and make sure we only fetch files once, and can do this recursively, we need to store additional information - most importantly a way to cross-reference relative paths from different files.

This means that storing information needs to be hoisted.

An additional wrinkle is relativePaths will be different for the same file, meaning we need an idea of the absolutePath within the git file system to see if we already have the relativeFile.

This is my proposed data structure:

```js
type InternalFileShape = {
  // The actual string contents of the file to be sent to CSB
  content: string,
  // The absolutePath assuming the top of the git repository, usable in URLs and to solve relativePaths
  absolutePath: string,
  // what will be the 'name' of the file in CSB once deployed
  newPath: string,
  // A quick array of internal imports with the relativePath they had in the file
  internalImports: Array<string>,
  // A list of ['./oldPlace', './new/place/in/csb'] to run replaceImports with
  // This is very unfortunately pacakge specific...
  // with this and absolutePath we may be able to avoid this...
  internalImportsReplacements: Array<Import>,
  // The external dependencies that are used within the file
  deps: { [string]: string },
  // Show if for example we cannot resolve an import...
  predictedError?: {},
};
```

The way it works:

We receive seed data, including an examples file, a promise that resolves the file, or an examplesPath.

From that, we can resolve it into this structure.
From there, we map over the internalImports, and fetch them, mapping them to this structure, and check if they have any internal imports.

We likely want to store them using their absolutePath as a key, so we can check if that absolutePath has already been fetched.

Once all files are fetched, map the keys, and then perform the replacing of keys once all files are present in the graph.
