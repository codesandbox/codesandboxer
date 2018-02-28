# CodeSandboxer

====
A documentation update is currently underway. Below is the simplest use-case for the deployer at this time.
====

```js
import React, { Component } from 'react';
import CodeSandboxer from 'react-codesandboxer';

export default () => (
  <CodeSandboxer
    examplePath="examples/file.js"
    gitInfo={{
      account: 'noviny',
      repository: 'react-codesandboxer',
      host: 'github',
    }}
  />
);
```

## What does this actually do?

With the minimal options provided, the sandboxer can fetch the file contents from github, as well as the relevant imports of that file (both internal and external)

## Quick gotchas

1. If the example file does not exist at the source, the deploy will fail. You can get around this by passing in the file's contents directly as the prop `example`.
2. We follow relative imports in the example, so the example still works when uploaded. The fewer files your example depends upon, the faster it will be. (we will only ever fetch a file once, even if multiple things depend upon it)

## A slightly more complicated example:

```js
<CodeSandboxer
  examplePath="deeply/nested/thing/some-example.js"
  pkgJSON={pkgJSON}
  gitInfo={{
    account: 'atlassian',
    repository: 'atlaskit-mk-2',
    branch: 'master',
    host: 'bitbucket',
  }}
  importReplacements={[['../src', pkgJSON.name]]}
  dependencies={{
    '@atlaskit/css-reset': 'latest',
    [pkgJSON.name]: pkgJSON.version,
  }}
  extraFiles={{ 'index.js': 'abcde....' }}
  afterDeploy={console.log}
>
  {deployButton({ isDisabled: false })}
</CodeSandboxer>
```

This shows off some more advanced usage:

* We are providing the pkgJSON as an object, so it does not need to be fetched (this also accepts a promise that resolves to a pkgJSON)
* We are specifying a branch to pull files from (also accepts git hashes)
* We are replacing src files with a reference to the package, so the package's own internals are pulled from npm (this is a nice optimisation in component docs)
* We have a collection of dependencies we always include
* We are providing our own index, allowing us to add the `css-reset` to it. We can also pass in extra files
* We are logging after a deploy
* We have provided a custom button component

=====
IMPORTANT: 0.3 of `react-codesandboxer` is a massive API change, needed to get us into a state where we could take some complexity back from the users. The below documentation is out of date
=====

## Usage Best Practices:

CodeSandboxer assumes that there is a single file that exports a react component which it can rely on as its entry point.

A quick drop-in react component that allows you to deploy an example react component to CodeSandbox, along
with several helper methods that may help assemble an example for deploy.

```js
import CodeSandboxer, {
  getAllImports,
  replaceImport,
  getCSBData,
} from 'CodeSandboxer';
```

## CodeSandboxer Component

```js
const exampleComponent = `import React, { Component } from 'react';
import Select from 'react-select';

export default class App extends Component {
  state = {
    selectedOption: '',
  }
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(\`Selected: \${selectedOption.label}\`);
  }
  render() {
  	const { selectedOption } = this.state;
  	const value = selectedOption && selectedOption.value;

    return (
      <Select
        name="form-field-name"
        value={value}
        onChange={this.handleChange}
        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
      />
    );
  }
}
`

<CodeSandboxDeployer
  Button={<button>Click Here!</button>}
  example={exampleComponent}
  pkgJSON={/* file contents of the pkgJSON */}
  config={{
      originLocation: '../src',
      startingDeps: { 'some-dependency': '^1.5.0' },
      providedFiles: {/* file data properly configured and ready to go */}
  }}
/>
```

The CodeSandboxer collects the imports from an example, and uses the `package.json` to find the correct version your example was running, or falls back to the latest version of that component if it does not know them.

The `originLocation` config option can be used if you are importing from a `src` directory for a local component.

Clicking the button will open your example in CodeSandbox in a new tab.

_NOTE_ - the CodeSandboxer will not understand how to transform relative paths in your example, nor provide files for them. Using the helper methods provided, you can get additional files that you need, however CodeSandboxer will work best with flatter examples

## getCSBData()

`getCSBData` is the underlying function that assembles the data. it takes in an example, a pkgJSON and a config object, and returns a promise containing:

```js
{
  params: 'asdfasdfasdfasdfasdf...',
  files: {},
}
```

The `param` are a string representation of the data, which can be sumbitted to codesandbox's endpoint.

The `files` are the json version of the data transmitted in params, if you want to inspect the transformation before submitting it.

## getAllImports()

Takes in the example code, and return an array containing all the imports. Each import is represented by an array showing the full import statement, and then the 'source' of the import, where it is coming from.

## replaceImport

```js
replaceImport(example, '../src', 'external-package');
```

Replaces where a file is being imported from, to help flatten structures.
