import React, { Component } from "react";
import CSB2Transformer from "./getCSBData";

const codesandboxURL = "https://codesandbox.io/api/v1/sandboxes/define";

export default class CodeSandboxDeployer extends Component<{}, {}> {
  state = { parameters: "" };

  deployToCSB = e => {
    const { example, pkgJSON, config, skipDeploy, afterDeploy } = this.props;
    e.preventDefault();
    // this is always a promise, accepts example as a promise. accept pkgJSON as a promise
    CSB2Transformer(example, pkgJSON, config)
      .then(({ params, data }) => {
        this.setState({ parameters: params }, () => {
          if (!skipDeploy) this.form.submit();
          if (afterDeploy) afterDeploy({ params, data });
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
      Button,
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
