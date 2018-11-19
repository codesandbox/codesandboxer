// @flow
import React, { Component, type Node } from 'react';
import NodeResolver from 'react-node-resolver';

import {
  fetchFiles,
  sendFilesToCSB,
  getSandboxUrl,
  finaliseCSB,
  type Package,
  type Files,
  type GitInfo,
  type ImportReplacement,
} from 'codesandboxer';

type Error = {
  name: string,
  description?: string,
  content?: string,
};

type State = {
  parameters: string,
  isLoading: boolean,
  isDeploying: boolean,
  sandboxId?: string,
  sandboxUrl?: string,
  deployPromise?: Promise<any>,
  files?: Files,
  error?: Error,
};

type Props = {
  /* The absolute path to the example within the git file structure */
  examplePath: string,
  /* Name for the codesandbox instance */
  name?: string,
  /* This is all the information we need to fetch information from github or bitbucket */
  gitInfo: GitInfo,
  /* Pass in the example as code to prevent it being fetched */
  example?: string | Promise<string>,
  /* Either take in a package.json object, or a string as the path of the package.json */
  pkgJSON?: Package | string | Promise<Package | string>,
  /* paths in the example that we do not want to be pulled from their relativeLocation */
  importReplacements?: Array<ImportReplacement>,
  /* Dependencies we always include. Most likely react and react-dom */
  dependencies?: { [string]: string },
  /* Do not actually deploy to codesanbox. Used to for testing alongside the return values of the render prop. */
  skipRedirect?: boolean,
  ignoreInternalImports?: boolean,
  /* Load the files when component mounts, instead of waiting for the button to be clicked */
  preload?: boolean,
  /* Deploy the sandbox when component mounts, instead of waiting for the button to be clicked */
  autoDeploy?: boolean,
  /* Called once loading has finished, whether it preloaded or not */
  onLoadComplete?: (
    { parameters: string, files: Files } | { error: any },
  ) => mixed,
  /* Called once a deploy has occurred. This will still be called if skipRedirect is chosen */
  afterDeploy?: (sandboxUrl: string, sandboxId: string) => mixed,
  /* Called once a deploy has occurred. This will still be called if skipRedirect is chosen */
  afterDeployError?: Error => mixed,
  /* Pass in files separately to fetching them. Useful to go alongisde specific replacements in importReplacements */
  providedFiles?: Files,
  /* Render prop that return `isLoading`and `error`. */
  children: (obj: {
    isLoading: boolean,
    files?: Files,
    sandboxId?: string,
    sandboxUrl?: string,
  }) => Node,
  /* Consumers may need access to the wrapper's style */
  style: Object,
  /* allow codesandboxer to accept jsx properties */
  extensions: string[],
  template?: 'create-react-app' | 'create-react-app-typescript' | 'vue-cli',
};

export default class CodeSandboxDeployer extends Component<Props, State> {
  button: HTMLElement | null;

  state: State = {
    parameters: '',
    isLoading: false,
    isDeploying: false,
  };
  static defaultProps = {
    children: () => <button type="submit">Deploy to CodeSandbox</button>,
    pkgJSON: {},
    dependencies: {},
    providedFiles: {},
    importReplacements: [],
    extensions: [],
    style: { display: 'inline-block' },
  };

  loadFiles = () => {
    let { onLoadComplete, providedFiles, dependencies, name } = this.props;

    // by assembling a deploy promise, we can save it for later if loadFiles is
    // being called by `preload`, and preload can use it once it is ready.
    // We return deployPromise at the end so that non-preloaded calls can then be
    // resolved
    let deployPromise = fetchFiles(this.props)
      .then(fetchedInfo => {
        let { parameters } = finaliseCSB(fetchedInfo, {
          extraFiles: providedFiles,
          extraDependencies: dependencies,
          name,
        });
        this.setState(
          { parameters, isLoading: false, files: fetchedInfo.files },
          () => {
            if (onLoadComplete) {
              onLoadComplete({ parameters, files: fetchedInfo.files });
            }
          },
        );
      })
      .catch(error => {
        this.setState({ error, isLoading: false });
        if (onLoadComplete) onLoadComplete({ error });
      });

    this.setState({
      isLoading: true,
      deployPromise,
    });

    return deployPromise;
  };

  deploy = () => {
    let { afterDeploy, skipRedirect, afterDeployError } = this.props;
    let { parameters, error } = this.state;
    if (error) return;

    sendFilesToCSB(parameters)
      .then(({ sandboxId, sandboxUrl }) => {
        this.setState({
          sandboxId,
          sandboxUrl,
          isDeploying: false,
          isLoading: false,
        });
        if (!skipRedirect) {
          window.open(sandboxUrl);
        }
        if (afterDeploy) {
          afterDeploy(getSandboxUrl(sandboxId, 'embed'), sandboxId);
        }
      })
      .catch(errors => {
        if (afterDeployError) {
          afterDeployError({
            name: 'error deploying to codesandbox',
            content: errors,
          });
        }
        this.setState({
          error: {
            name: 'error deploying to codesandbox',
            content: errors,
          },
        });
      });
  };

  deployToCSB = (e?: MouseEvent) => {
    const { deployPromise, isDeploying } = this.state;
    if (e) {
      e.preventDefault();
    }
    if (isDeploying) return null;
    this.setState({ isDeploying: true });

    if (deployPromise) {
      deployPromise.then(this.deploy);
    } else {
      this.loadFiles().then(this.deploy);
    }
  };

  componentDidMount() {
    if (this.props.autoDeploy) {
      this.deployToCSB();
      return;
    }

    if (this.button) this.button.addEventListener('click', this.deployToCSB);
    if (this.props.preload) this.loadFiles();
  }
  componentWillUnmount() {
    if (this.button) this.button.removeEventListener('click', this.deployToCSB);
  }

  getButton = (ref: HTMLElement | null) => {
    if (!ref) return;
    this.button = ref;
  };

  render() {
    const { isLoading, isDeploying, error, sandboxId, sandboxUrl } = this.state;
    return (
      <NodeResolver innerRef={this.getButton}>
        {this.props.children({
          isLoading,
          isDeploying,
          error,
          sandboxId,
          sandboxUrl,
        })}
      </NodeResolver>
    );
  }
}
