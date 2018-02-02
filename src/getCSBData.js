import { getParameters } from "codesandbox/lib/api/define";
import { importPattern, baseFiles } from "./constants";
import replaceImport from "./replaceImport";
import getAllImports from "./getAllImports";

const newpkgJSON = dependencies => `{
  "name": "simple-example",
  "version": "0.0.0",
  "description": "A simple example deployed to CodeSandbox",
  "main": "index.js",
  "dependencies": ${JSON.stringify(dependencies)}
}`;

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

const ensureReact = deps => {
  if (!deps.react && !deps["react-dom"]) {
    deps.react = "latest";
    deps["react-dom"] = "latest";
  } else if (!deps.react) {
    deps.react = deps["react-dom"];
  } else if (!deps["react-dom"]) {
    deps["react-dom"] = deps.react;
  }
};

const getCSBData = async (
  example: Promise<string> | string,
  pkgJSON: Promise<string> | string,
  { originLocation = "", startingDeps = {}, providedFiles = {} } = {}
) => {
  let exampleCode = typeof example === "string" ? example : await example;
  let pkgJSONCode = typeof pkgJSON === "string" ? pkgJSON : await pkgJSON;

  const deps = Object.assign({}, startingDeps, {
    [pkgJSON.name]: pkgJSON.version
  });
  const imports = getAllImports(exampleCode);

  for (let mpt of imports) {
    let [complete, source] = mpt;
    // We check if the import we are examining is a relative or an absolute path
    if (/^\./.test(source) && originLocation === source) {
      exampleCode = replaceImport(exampleCode, source, pkgJSON.name);
      // onInternalImports(exampleCode, source, config)
    } else {
      // onExternalImports(exampleCode, source, config)
      addDep(pkgJSON, source, deps);
    }
    // onAllImports(exampleCode, source, config)
  }
  ensureReact(deps);

  const files = Object.assign(
    {},
    baseFiles,
    {
      "example.js": { content: exampleCode },
      "package.json": { content: newpkgJSON(deps) }
    },
    providedFiles
  );

  const data = { parameters: getParameters({ files }) };

  return Promise.resolve({ files, params: getParameters({ files }) });
};

export default getCSBData;
