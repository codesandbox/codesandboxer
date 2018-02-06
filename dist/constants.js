"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var importPattern = exports.importPattern = "import [^\"']+ from [\"']([^\"']+)[\"']";

var baseFiles = exports.baseFiles = {
  "index.html": {
    content: '<div id="root"></div>'
  },
  "index.js": {
    content: "/**\n  This CodeSandbox has been automatically generated using a cool tool.\n\n  This generator does not follow relative imports beyond those that reference the\n  module root, and as such, other relative imports may fail to load.\n\n  If you are experiencing difficulty contact @noviny on twitter\n*/\nimport React from 'react';\nimport ReactDOM from 'react-dom';\nimport Example from './example';\n\nReactDOM.render(\n<Example />,\ndocument.getElementById('root')\n);"
  }
};