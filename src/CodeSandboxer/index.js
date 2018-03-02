// @flow
import React, { Component, type Node } from 'react';
import type { Package, Files, FetchConfig } from '../types';
import fetchFiles from '../fetchFiles';
import NodeResolver from 'react-node-resolver';

const codesandboxURL = 'https://codesandbox.io/api/v1/sandboxes/define';

type State = {
  parameters: string,
  isLoading: boolean,
  error?: {
    name: string,
    description?: string,
    cointent?: string,
  },
};

type Props = {
  /* The absolute path to the example within the git file structure */
  examplePath: string,
  /* This is all the information we need to fetch information from github or bitbucket */
  gitInfo: FetchConfig,
  /* Pass in the example as code to prevent it being fetched */
  example?: string | Promise<string>,
  /* Either take in a package.json object, or a string as the path of the package.json */
  pkgJSON?: Package | string | Promise<Package | string>,
  /* paths in the example that we do not want to be pulled from their relativeLocation */
  importReplacements: Array<[string, string]>,
  /* Dependencies we always include. Most likely react and react-dom */
  dependencies?: { [string]: string },
  /* Do not actually deploy to codesanbox. Used to for testing alongside afterDeploy */
  skipDeploy?: boolean,
  ignoreInternalImports?: boolean,
  /* function that can be called once the deploy has occurred, useful if you want to give feedback or test how CSB is working */
  afterDeploy?: (
    { parameters: string, files: Files } | { error: any },
  ) => mixed,
  /* Pass in files separately to fetching them. Useful to go alongisde specific replacements in importReplacements */
  providedFiles?: Files,
  /* The trigger element */
  children: State => Node,
  /* Consumers may need access to the wrapper's style */
  style: Object,
};

export default class CodeSandboxDeployer extends Component<Props, State> {
  form: HTMLFormElement | null;
  button: HTMLElement | null;

  state = { parameters: '', isLoading: false };
  static defaultProps = {
    children: () => <button type="submit">Deploy to CodeSandbox</button>,
    dependencies: {},
    providedFiles: {},
    importReplacements: [],
    style: { display: 'inline-block' },
  };

  deployToCSB = (e: MouseEvent) => {
    const {
      examplePath,
      pkgJSON,
      gitInfo,
      dependencies,
      skipDeploy,
      afterDeploy,
      importReplacements,
      providedFiles,
      example,
    } = this.props;
    e.preventDefault();

    this.setState({ isLoading: true });
    fetchFiles(this.props)
      .then(({ parameters, files }) => {
        this.setState({ parameters, isLoading: false }, () => {
          if (!skipDeploy && this.form) this.form.submit();
          if (afterDeploy) afterDeploy({ parameters, files });
        });
      })
      .catch(error => {
        if (afterDeploy) afterDeploy({ error });
      });
  };
  componentDidMount() {
    if (this.button) this.button.addEventListener('click', this.deployToCSB);
  }
  componentWillUnmount() {
    if (this.button) this.button.removeEventListener('click', this.deployToCSB);
  }

  getButton = (ref) => {
    if (!ref) return;
    this.button = ref;
  }
  getForm = (ref) => {
    if (!ref) return;
    this.form = ref;
  }

  render() {
    return (
      <form
        action="https://codesandbox.io/api/v1/sandboxes/define"
        method="POST"
        onSubmit={this.deployToCSB}
        ref={this.getForm}
        style={this.props.style}
        target="_blank"
      >
        <input type="hidden" name="parameters" value={this.state.parameters} />
        <NodeResolver innerRef={this.getButton}>
          {this.props.children(this.state)}
        </NodeResolver>
      </form>
    );
  }
}
