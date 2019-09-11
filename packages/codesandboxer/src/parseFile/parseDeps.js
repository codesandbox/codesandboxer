// @flow
import type { Package, Import } from '../types';

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
    // This exists because we need to resolve dependencies when files within
    // the dependency are being accessed directly. This may cause sandboxes
    // to depend on things they are not using very occasionally.
    if (name.includes(dependency)) {
      deps[dependency] = dependencies[dependency];
    }
  }
  return deps;
};

const parseDeps = (
  pkgJSON: Package,
  imports: Array<Import>
): {
  deps: { [string]: string },
  internalImports: Array<Import>,
} => {
  let dependencies = {};
  let internalImports = [];
  // This is a common pattern of going over mpt of imports. Have not found a neat function extraction for it.
  for (let mpt of imports) {
    /* We are naming complete for readability, however the variable is not used. */
    /* eslint-disable-next-line no-unused-vars */
    if (/^\./.test(mpt)) {
      internalImports.push(mpt);
    } else {
      let foundDeps = getDeps(pkgJSON, mpt);
      if (Object.keys(foundDeps).length < 1 && mpt !== pkgJSON.name) {
        console.warn(`Could not find dependency version for ${mpt}`);
      } else {
        dependencies = { ...dependencies, ...foundDeps };
      }
    }
  }
  return { deps: dependencies, internalImports };
};

export default parseDeps;
