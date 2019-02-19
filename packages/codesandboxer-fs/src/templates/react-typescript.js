const getBaseFilesTS = fileName => ({
  'index.html': {
    content: '<div id="root"></div>',
  },
  'index.tsx': {
    content: `/**
  This CodeSandbox has been automatically generated using
  \`codesandboxer\`. If you're curious how that happened, you can
  check out our docs here: https://github.com/codesandbox/codesandboxer

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

module.exports = getBaseFilesTS;
