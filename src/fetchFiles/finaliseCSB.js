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
  passedDeps: Dependencies,
) {
  let dependencies = {
    ...deps,
    ...passedDeps,
  };

  ensureReact(dependencies);

  const finalFiles = {
    ...files,
    'package.json': { content: newpkgJSON(dependencies) },
    ...providedFiles,
  };
  const parameters = getParameters({
    files: finalFiles,
    template: 'create-react-app',
  });
  return {
    files: finalFiles,
    dependencies,
    parameters,
  };
}
