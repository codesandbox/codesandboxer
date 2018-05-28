// @flow
import { getParameters } from 'codesandbox/lib/api/define';
import type { Files, Dependencies } from '../types';
import { newpkgJSON } from '../constants';

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
  config: ?{
    extraFiles?: Files,
    extraDependencies?: Dependencies,
    name?: string,
  },
) {
  if (!config) config = {};
  let { extraFiles, extraDependencies, name } = config;
  let dependencies = {
    ...deps,
    ...extraDependencies,
  };

  ensureReact(dependencies);

  const finalFiles = {
    ...files,
    'package.json': {
      content: newpkgJSON(dependencies, name),
    },
    ...extraFiles,
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
