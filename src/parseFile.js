// @flow
import { getParameters } from "codesandbox/lib/api/define";
import { importPattern, baseFiles } from "./constants";
import replaceImport from "./replaceImport";
import getAllImports from "./getAllImports";
import parseDeps from "./parseDeps";
import type { Config, Import, Package } from "./types";

const ParseFile = async (
  file: Promise<string> | string,
  pkgJSON: Promise<Package> | Package,
  config: Config = {}
): Promise<{
  file: string,
  deps: { [string]: string },
  internalImports: Array<?Import>
}> => {
  let { originLocation = "", startingDeps = {}, providedFiles = {} } = config;
  let fileCode = typeof file === "string" ? file : await file;
  let pkgJSONContent = typeof pkgJSON === "string" ? pkgJSON : await pkgJSON;

  // We immediately replace references to the source with references to the package.
  // This should likely be moved to the consumer to do. Need to find a helpful
  // way to help the consumer do this
  fileCode = replaceImport(fileCode, originLocation, pkgJSONContent);

  const imports = getAllImports(fileCode);
  // instead of handling imports up here, we should just pass back the unsafe imports we found
  let { deps, exampleCode, internalImports } = parseDeps(
    fileCode,
    pkgJSONContent,
    imports,
    config
  );

  return Promise.resolve({ file: exampleCode, deps, internalImports });
};

export default ParseFile;
