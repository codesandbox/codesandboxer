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

### Current status:

Single File fetch works well, return the information we need. Mapping multiple file fetches is harder, and currently a work in progress. Information needs to reach a top layer between attempts to resolve. A big question is how to handle passing information back up. Should we work to format data as we get it and merge it into a big block, or should we do something less like what we will send CSB that is easier to move through, and then convert it only when we want to upload the information

### Other api

Instead of depth, a max files option may make sense, however that may make failures feel worse.
