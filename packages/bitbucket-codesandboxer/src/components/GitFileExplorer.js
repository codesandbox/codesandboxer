import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pMemoize from 'p-memoize';
import AsyncSelect from 'react-select/lib/Async';
import * as bitbucket from '../utils/bitbucket';

type State = {
  inputValue: string,
};
const propTypes = {
  onFileSelect: PropTypes.func,
  repoName: PropTypes.string,
  repoOwner: PropTypes.string,
  repoRef: PropTypes.string,
};

const memoizedBBCall = pMemoize(bitbucket.getBitbucketDir);

function bbDirListToOptions(dirList) {
  return dirList.map(file => {
    const isDir = file.type === 'directory';
    const label = isDir ? `📂 ${file.path}/` : `📄 ${file.path}`;
    const value = isDir ? `${file.path}/` : file.path;
    return {
      value,
      label,
      isDir,
    };
  });
}

function inputValueToDirPath(inputValue) {
  const re = /(\S+\/).*/;
  const match = inputValue.match(re);
  if (!match) return '/';
  return match[1];
}

function filterOptions(options, inputValue) {
  if (!inputValue) return options;
  return options.filter(option => option.value.startsWith(inputValue));
}

export default class GitFileExplorer extends Component<*, State> {
  state = {
    inputValue: '',
    menuIsOpen: true,
    message: 'Uploading packages/core/avatar/examples/BasicAvatar.jsx',
  };
  handleInputChange = (newValue: string, actionMeta) => {
    const { action } = actionMeta;
    if (action === 'input-change' || actionMeta.custom) {
      this.setState({ inputValue: newValue || '' });
      return newValue;
    }
    return this.state.inputValue;
  };
  handleSetValue = selected => {
    this.setState({
      inputValue: selected.value,
      menuIsOpen: selected.isDir,
      message: !selected.isDir ? 'Uploading ' + selected.value : '',
    });
    // THIS IS NAUGHTY
    this.selectRef.handleInputChange(selected.value, { custom: true });
    if (!selected.isDir) {
      this.props.onFileSelect(selected.value);
    }
  };
  getOptions = async inputValue => {
    const { repoOwner, repoName, branch } = this.props;
    const gitInfo = {
      account: repoOwner,
      repository: repoName,
      branch,
    };
    const dirPath = inputValueToDirPath(inputValue);
    const dir = await memoizedBBCall(gitInfo, dirPath);
    const options = bbDirListToOptions(dir);
    return filterOptions(options, inputValue);
  };
  render() {
    const { repoOwner, repoName, branch } = this.props;
    const linkUrl = `https://bitbucket.org/${repoOwner}/${repoName}/src/${branch}`;
    return (
      <div>
        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
          Fetching files from: <a href={linkUrl}>{linkUrl}</a>
        </div>
        <AsyncSelect
          loadOptions={this.getOptions}
          defaultOptions
          onInputChange={this.handleInputChange}
          closeMenuOnSelect={false}
          onChange={this.handleSetValue}
          menuIsOpen={this.state.menuIsOpen}
          inputValue={this.state.inputValue}
          ref={ref => {
            this.selectRef = ref;
          }}
        />
        <div style={{ marginTop: '10px' }}>{this.state.message}</div>
      </div>
    );
  }
}
GitFileExplorer.propTypes = propTypes;
