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
  providedFiles?: Files,
  passedDeps?: Dependencies,
  name?: string,
) {
  let dependencies = {
    ...deps,
    ...passedDeps,
  };

  ensureReact(dependencies);

  const finalFiles = {
    ...files,
    'package.json': {
      content: newpkgJSON(dependencies, name),
    },
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
