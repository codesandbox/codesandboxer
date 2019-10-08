// @flow
const ensureExtensionAndTemplate = (
  extension: string,
  extensions: string[] = [],
  template?: 'create-react-app' | 'create-react-app-typescript' | 'vue-cli'
): {
  extensions: string[],
  template: 'create-react-app' | 'create-react-app-typescript' | 'vue-cli',
} => {
  let extensionsSet = new Set(['.js', '.json', ...extensions]);
  extensionsSet.add(extension);

  if (
    ['.ts', '.tsx'].includes(extension) ||
    template === 'create-react-app-typescript'
  ) {
    if (!template) template = 'create-react-app-typescript';
    extensionsSet.add('.ts');
    extensionsSet.add('.tsx');
  }

  if (extension === '.vue' || template === 'vue-cli') {
    if (!template) template = 'vue-cli';
    extensionsSet.add('.vue');
  }

  if (!template) {
    template = 'create-react-app';
  }

  return { extensions: [...extensionsSet], template };
};

export default ensureExtensionAndTemplate;

/*
That other implementation:

  if (!config.template) {
    if (['.ts', '.tsx'].includes(extension)) {
      config.template = 'create-react-app-typescript';
    } else if (extension === '.vue' && !config.template) {
      config.template = 'vue-cli';
    } else {
      config.template = 'create-react-app';
    }
  }

  let extensions = ['.js', '.json'];
  if (config.extensions) extensions = [...extensions, ...config.extensions];
  if (
    extension &&
    !baseExtensions.includes(extension) &&
    !extensions.includes(extension)
  ) {
    extensions.push(extension);
  }
*/
