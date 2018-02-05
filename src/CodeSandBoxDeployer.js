// @flow
import React, { Component, type Node } from "react";
import getCSBData from "./getCSBData";
import type { Package, Config, Files } from "./types";

const codesandboxURL = "https://codesandbox.io/api/v1/sandboxes/define";

type Props = {
  example: Promise<string> | string,
  pkgJSON: Promise<Package> | Package,
  config: Config,
  skipDeploy: boolean,
  children?: Node,
  afterDeploy: ({ parameters: string, files: Files } | { error: any }) => mixed
};

type State = {
  parameters: string
};

export default class CodeSandboxDeployer extends Component<Props, State> {
  form: HTMLFormElement | null;

  state = { parameters: "" };
  static defaultProps = {
    children: <button type="submit">Deploy to CodeSandbox</button>
  };

  deployToCSB = (e: MouseEvent) => {
    const { example, pkgJSON, config, skipDeploy, afterDeploy } = this.props;
    e.preventDefault();
    // this is always a promise, accepts example as a promise. accept pkgJSON as a promise
    getCSBData(example, pkgJSON, config)
      .then(({ parameters, files }) => {
        this.setState({ parameters }, () => {
          if (!skipDeploy && this.form) this.form.submit();
          if (afterDeploy) afterDeploy({ parameters, files });
        });
      })
      .catch(error => {
        if (afterDeploy) afterDeploy({ error });
      });
  };

  render() {
    const {
      skipDeploy,
      example,
      pkgJSON,
      config,
      afterDeploy,
      children,
      ...rest
    } = this.props;

    return (
      <span>
        <form
          onSubmit={this.deployToCSB}
          action="https://codesandbox.io/api/v1/sandboxes/define"
          method="POST"
          target="_blank"
          ref={r => {
            this.form = r;
          }}
        >
          <input
            type="hidden"
            name="parameters"
            value={this.state.parameters}
          />
          {children}
        </form>
      </span>
    );
  }
}
