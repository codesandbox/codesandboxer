// @flow
import replaceImport from "./replaceImport";

export default function(code: string, oldAndNew: Array<[string, string]>) {
  let newCode = code;
  for (let mpt of oldAndNew) {
    let [oldSource, newSource] = mpt;
    newCode = replaceImport(newCode, oldSource, newSource);
  }
  return newCode;
}
