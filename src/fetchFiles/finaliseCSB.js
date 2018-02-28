// @flow
import { getParameters } from 'codesandbox/lib/api/define';
import type { Files, Dependencies, Package } from '../types';
const newpkgJSON = dependencies => `{
  "name": "simple-example",
  "version": "0.0.0",
  "description": "A simple example deployed to CodeSandbox",
  "main": "index.js",
  "dependencies": ${JSON.stringify(dependencies)}
}`;

const ensureReact = deps => {
  if (!deps.react && !deps['react-dom']) {
    deps.react = 'latest';
    deps['react-dom'] = 'latest';
  } else if (!deps.react) {
    deps.react = deps['react-dom'];
  } else if (!deps['react-dom']) {
    deps['react-dom'] = deps.react;
  }
};

export default function(
  { files, deps }: { files: Files, deps: Dependencies },
  providedFiles: Files,
) {
  let dependencies = {
    ...deps,
  };

  ensureReact(dependencies);

  const finalFiles = {
    ...files,
    'package.json': { content: newpkgJSON(dependencies) },
    ...providedFiles,
  };
  const parameters = getParameters({ finalFiles });
  return {
    files: finalFiles,
    dependencies,
    parameters,
  };
}
