// @flow
import getParameters from './getParameters';
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
    template?: string,
    main?: string,
  },
) {
  if (!config) config = {};
  let {
    extraFiles,
    extraDependencies,
    name,
    template = 'create-react-app',
    main,
  } = config;
  let dependencies = {
    ...deps,
    ...extraDependencies,
  };

  main =
    !main && template === 'create-react-app-typescript'
      ? 'index.tsx'
      : 'index.js';

  ensureReact(dependencies);

  const finalFiles = {
    ...files,
    'package.json': {
      content: newpkgJSON(dependencies, name, main),
    },
    'sandbox.config.json': {
      content: JSON.stringify({
        template: template,
      }),
    },
    ...extraFiles,
  };
  const parameters = getParameters({
    files: finalFiles,
  });
  return {
    files: finalFiles,
    dependencies,
    parameters,
  };
}
