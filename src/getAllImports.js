// @flow
import { importPattern } from "./constants";
import type { Import } from "./types";

const getAllImports = (code: string): Array<?Import> => {
  let imports = code.match(new RegExp(importPattern, "g"));
  if (imports) return imports.map(mpt => new RegExp(importPattern).exec(mpt));
  else return [];
};

export default getAllImports;
