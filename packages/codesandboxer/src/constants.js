// @flow
import type { Dependencies } from './types';

export const baseFiles = {
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
import App from './example';

ReactDOM.render(
<App />,
document.getElementById('root')
);`,
  },
};

export const newpkgJSON = (
  dependencies: Dependencies,
  name?: string = 'codesandboxer-example',
) => `{
  "name": "${name}",
  "version": "0.0.0",
  "description": "A simple example deployed using react-codesandboxer",
  "main": "index.js",
  "dependencies": {
    ${Object.keys(dependencies)
      .map(k => `"${k}": "${dependencies[k]}"`)
      .join(',\n    ')}
  }
}`;

export const codesandboxURL =
  'https://codesandbox.io/api/v1/sandboxes/define?query=module=/example.js';
export const codesandboxURLJSON =
  'https://codesandbox.io/api/v1/sandboxes/define?json=1';

export const getSandboxUrl = (id: string, type?: string = 's') =>
  `https://codesandbox.io/${type}/${id}?module=/example`;
