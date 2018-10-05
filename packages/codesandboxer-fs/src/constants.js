const getBaseFiles = fileName => ({
  'index.html': {
    content: '<div id="root"></div>',
  },
  'index.js': {
    content: `/**
  This CodeSandbox has been automatically generated using
  \`codesandboxer\`. If you're curious how that happened, you can
  check out our docs here: https://github.com/noviny/codesandboxer

  If you experience any struggles with this sandbox, please raise an issue
  on github. :)
*/
import React from 'react';
import ReactDOM from 'react-dom';
import Component from './${fileName}';

ReactDOM.render(
  <div>
    <h3>Component imported with codesandboxer:</h3>
    <p>(It may need additional props to get it rendering well)</p>
    <Component />
  </div>,
document.getElementById('root')
);`,
  },
});

const getBaseFilesTS = fileName => ({
  'index.html': {
    content: '<div id="root"></div>',
  },
  'index.tsx': {
    content: `/**
  This CodeSandbox has been automatically generated using
  \`codesandboxer\`. If you're curious how that happened, you can
  check out our docs here: https://github.com/noviny/codesandboxer

  If you experience any struggles with this sandbox, please raise an issue
  on github. :)
*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './${fileName}';

ReactDOM.render(
<App />,
document.getElementById('root')
);`,
  },
});

const baseExtensions = [
  '.png',
  '.jpeg',
  '.jpg',
  '.gif',
  '.bmp',
  '.tiff',
  '.json',
  '.js',
];

module.exports = { getBaseFiles, baseExtensions, getBaseFilesTS };
