// @flow
import getParameters from './getParameters';
import type { Files, Dependencies } from '../types';
import newpkgJSON from '../templates/packagejson';

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

const ensureVue = deps => {
  if (!deps.vue) {
    deps.vue = 'latest';
  }
};

export default function(
  {
    files,
    deps,
    template = 'create-react-app',
  }: { files: Files, deps: Dependencies, template?: string },
  config: ?{
    fileName?: string,
    extraFiles?: Files,
    extraDependencies?: Dependencies,
    name?: string,
    main?: string,
  },
) {
  if (!config) config = {};
  let {
    extraFiles,
    extraDependencies,
    name,
    main,
    fileName = 'example',
  } = config;
  let dependencies = {
    ...deps,
    ...extraDependencies,
  };

  main =
    !main && template === 'create-react-app-typescript'
      ? 'index.tsx'
      : 'index.js';

  if (
    template === 'create-react-app' ||
    template === 'create-react-app-typesctipt'
  ) {
    ensureReact(dependencies);
  }

  if (template === 'vue-cli') {
    ensureVue(dependencies);
  }

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
    fileName,
  };
}
