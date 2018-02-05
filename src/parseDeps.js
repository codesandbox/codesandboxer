// @flow
import replaceImport from "./replaceImport";
import type { Package, Config, Import } from "./types";
const addDep = (pkgJSON, name, deps) => {
  // We are deliberately putting depencies as the last assigned as we will care
  // most about the versions of depencies over other types
  const dependencies = Object.assign(
    {},
    pkgJSON.peerDependencies,
    pkgJSON.devDependencies,
    pkgJSON.dependencies
  );

  for (let dependency in dependencies) {
    if (name.includes(dependency)) deps[dependency] = dependencies[dependency];
  }
};

const parseDeps = (
  example: string,
  pkgJSON: Package,
  imports: Import,
  config: Config = {}
): {
  exampleCode: string,
  deps: { [string]: string },
  internalImports: Array<?Import>
} => {
  let { startingDeps = {}, providedFiles = {} } = config;
  let exampleCode = example;
  let dependencies = {};
  let internalImports = [];
  // This is a common pattern of going over mpt of imports. Have not found a neat function extraction for it.
  for (let mpt of imports) {
    let [complete, source] = mpt;
    if (/^\./.test(source)) {
      internalImports.push(mpt);
    } else {
      addDep(pkgJSON, source, dependencies);
    }
  }
  return { deps: dependencies, exampleCode, internalImports };
};

export default parseDeps;
