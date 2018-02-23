// @flow
import type { Package, Import } from './types';

const getDeps = (pkgJSON, name) => {
  let deps = {};
  // We are deliberately putting dependencies as the last assigned as we will care
  // most about the versions of dependencies over other types
  const dependencies = {
    ...pkgJSON.peerDependencies,
    ...pkgJSON.devDependencies,
    ...pkgJSON.dependencies,
  };

  for (let dependency in dependencies) {
    if (name.includes(dependency)) {
      deps[dependency] = dependencies[dependency];
    }
  }
  return deps;
};

const parseDeps = (
  pkgJSON: Package,
  imports: Import,
): {
  deps: { [string]: string },
  internalImports: Array<?Import>,
} => {
  let dependencies = {};
  let internalImports = [];
  // This is a common pattern of going over mpt of imports. Have not found a neat function extraction for it.
  for (let mpt of imports) {
    let [complete, name] = mpt;
    if (/^\./.test(name)) {
      internalImports.push(mpt);
    } else {
      let foundDeps = getDeps(pkgJSON, name);
      if (Object.keys(foundDeps).length < 1) {
        dependencies[name] = 'latest';
      } else {
        dependencies = { ...dependencies, ...foundDeps };
      }
    }
  }
  return { deps: dependencies, internalImports };
};

export default parseDeps;
