// @flow
import { getParameters } from "codesandbox/lib/api/define";
import { baseFiles } from "./constants";
import type { Config, Package, Files } from "./types";
import parseFile from "./parseFile";

const newpkgJSON = dependencies => `{
  "name": "simple-example",
  "version": "0.0.0",
  "description": "A simple example deployed to CodeSandbox",
  "main": "index.js",
  "dependencies": ${JSON.stringify(dependencies)}
}`;

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
  pkgJSON: Promise<Package> | Package,
  config: Config = {}
): Promise<{
  files: Files,
  dependencies: { [string]: string, react: string, "react-dom": string },
  parameters: string
}> => {
  let { startingDeps = {}, providedFiles = {} } = config;
  let exampleCode = typeof example === "string" ? example : await example;
  let pkgJSONCode = typeof pkgJSON === "string" ? pkgJSON : await pkgJSON;

  let { deps, file } = await parseFile(exampleCode, pkgJSONCode, config);

  let dependencies = {
    ...startingDeps,
    ...deps,
    [pkgJSONCode.name]: pkgJSONCode.version
  };

  ensureReact(dependencies);

  const files = Object.assign(
    {},
    baseFiles,
    {
      "example.js": { content: file },
      "package.json": { content: newpkgJSON(dependencies) }
    },
    providedFiles
  );

  const parameters = getParameters({ files });

  return {
    files,
    dependencies,
    parameters
  };
};

export default getCSBData;
