// @flow
import replaceImport from '../utils/replaceImport';
import type { ImportReplacement } from '../types';

export default function(code: string, oldAndNew: Array<ImportReplacement>) {
  let newCode = code;
  for (let mpt of oldAndNew) {
    let [oldSource, newSource] = mpt;

    newCode = replaceImport(newCode, oldSource, newSource);
  }
  return newCode;
}
