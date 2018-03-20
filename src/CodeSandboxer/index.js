// @flow
import React, { Component, type Node } from 'react';
import type { Package, Files, FetchConfig } from '../types';
import fetchFiles from '../fetchFiles';
import NodeResolver from 'react-node-resolver';

const codesandboxURL =
  'https://codesandbox.io/api/v1/sandboxes/define?query=module=/example.js';
const codesandboxURLJSON =
  'https://codesandbox.io/api/v1/sandboxes/define?json=1';

const getSandboxUrl = (id, type = 's') =>
  `https://codesandbox.io/${type}/${id}?module=/example.js`;

type State = {
  parameters: string,
  isLoading: boolean,
  isDeploying: boolean,
  deployPromise?: Promise<any>,
  files?: Files,
  error?: {
    name: string,
    description?: string,
    cointent?: string,
  },
};

let IFrame = ({ src }) => (
  <iframe
    src={src}
    style={{
      width: '100%',
      height: '500px',
      border: 0,
      borderRadius: '4px',
      overflow: 'hidden',
    }}
    sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
  />
);

type Props = {
  /* The absolute path to the example within the git file structure */
  examplePath: string,
  /* Name for the codesandbox instance */
  name?: string,
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
  /* Do not actually deploy to codesanbox. Used to for testing alongside the return values of the render prop. */
  skipDeploy?: boolean,
  ignoreInternalImports?: boolean,
  /* Load the files when component mounts, instead of waiting for the button to be clicked */
  preload?: boolean,
  /* Called once loading has finished, whether it preloaded or not */
  onLoadComplete?: (
    { parameters: string, files: Files } | { error: any },
  ) => mixed,
  /* Called once a deploy has occurred. This will still be called if skipDeploy is chosen */
  afterDeploy?: () => mixed,
  /* Pass in files separately to fetching them. Useful to go alongisde specific replacements in importReplacements */
  providedFiles?: Files,
  /* Render prop that return `isLoading`and `error`. */
  children: (obj: { isLoading: boolean, files?: Files }) => Node,
  /* Consumers may need access to the wrapper's style */
  style: Object,
};

export default class CodeSandboxDeployer extends Component<Props, State> {
  form: HTMLFormElement | null;
  button: HTMLElement | null;

  state = {
    parameters: '',
    isLoading: false,
    isDeploying: false,
    deployPromise: undefined,
    files: undefined,
    error: undefined,
  };
  static defaultProps = {
    children: () => <button type="submit">Deploy to CodeSandbox</button>,
    pkgJSON: {},
    dependencies: {},
    providedFiles: {},
    importReplacements: [],
    style: { display: 'inline-block' },
  };

  IFrame = () =>
    this.state.embedUrl ? (
      <iframe
        src={this.state.embedUrl}
        style={{
          width: '100%',
          height: '500px',
          border: 0,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      />
    ) : null;

  loadFiles = () => {
    let { skipDeploy, onLoadComplete } = this.props;

    // by assembling a deploy promise, we can save it for later if loadFiles is
    // being called by `preload`, and preload can use it once it is ready.
    // We return deployPromise at the end so that non-preloaded calls can then be
    // resolved
    let deployPromise = fetchFiles(this.props)
      .then(({ parameters, files }) => {
        this.setState({ parameters, isLoading: false, files }, () => {
          if (onLoadComplete) onLoadComplete({ parameters, files });
        });
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
    let { afterDeploy, skipDeploy } = this.props;
    let formData = new FormData();
    formData.append('parameters', this.state.parameters);

    fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
      method: 'post',
      body: formData,
      mode: 'cors',
    })
      .then(r => r.json())
      .then(({ sandbox_id }) => {
        this.setState({
          sandboxId: sandbox_id,
          sandboxUrl: getSandboxUrl(sandbox_id),
          embedUrl: getSandboxUrl(sandbox_id, 'embed'),
        });
        if (!skipDeploy) {
          window.open(getSandboxUrl(sandbox_id));
        }
        if (afterDeploy)
          afterDeploy(getSandboxUrl(sandbox_id, 'embed'), sandbox_id);
      });

    // if (!this.props.skipDeploy && this.form) this.form.submit();
    // if (this.props.afterDeploy) this.props.afterDeploy();
  };

  deployToCSB = (e: MouseEvent) => {
    const { preload } = this.props;
    const { isLoading, parameters, deployPromise, isDeploying } = this.state;
    e.preventDefault();
    if (isDeploying) return null;
    this.setState({ isDeploying: true });

    if (deployPromise) {
      deployPromise.then(this.deploy);
    } else {
      this.loadFiles().then(this.deploy);
    }
  };

  componentDidMount() {
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
  getForm = (ref: HTMLFormElement | null) => {
    if (!ref) return;
    this.form = ref;
  };

  render() {
    const {
      isLoading,
      isDeploying,
      error,
      sandboxId,
      sandboxUrl,
      embedUrl,
    } = this.state;
    return (
      <form
        action={codesandboxURL}
        method="POST"
        onSubmit={this.deployToCSB}
        ref={this.getForm}
        style={this.props.style}
        target="_blank"
      >
        <input type="hidden" name="parameters" value={this.state.parameters} />
        <NodeResolver innerRef={this.getButton}>
          {this.props.children({
            isLoading,
            isDeploying,
            error,
            sandboxId,
            sandboxUrl,
            embedUrl,
            IFrame: embedUrl && this.IFrame,
          })}
        </NodeResolver>
      </form>
    );
  }
}
