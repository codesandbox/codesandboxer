// @flow
export const importPattern = `import [^"']+ from ["']([^"']+)["']`;

export const baseFiles = {
  "index.html": {
    content: '<div id="root"></div>'
  },
  "index.js": {
    content: `/**
  This CodeSandbox has been automatically generated using a cool tool.

  This generator does not follow relative imports beyond those that reference the
  module root, and as such, other relative imports may fail to load.

  If you are experiencing difficulty contact @noviny on twitter
*/
import React from 'react';
import ReactDOM from 'react-dom';
import Example from './example';

ReactDOM.render(
<Example />,
document.getElementById('root')
);`
  }
};

// import {
//   foo
// } from 'asdf'
