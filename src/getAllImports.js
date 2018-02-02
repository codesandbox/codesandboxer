import { importPattern } from "./constants";

const getAllImports = code =>
  code
    .match(new RegExp(importPattern, "g"))
    .map(mpt => new RegExp(importPattern).exec(mpt));

export default getAllImports;
