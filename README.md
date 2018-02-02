# CodeSandboxer

A quick drop-in react component that allows you to deploy an example react component to CodeSandbox, along
with several helper methods that may help assemble an example for deploy.

```js
import CodeSandboxer, { getAllImports, replaceImport, getCSBData } from 'CodeSandboxer';
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

*NOTE* - the CodeSandboxer will not understand how to transform relative paths in your example, nor provide files for them. Using the helper methods provided, you can get additional files that you need, however CodeSandboxer will work best with flatter examples

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
