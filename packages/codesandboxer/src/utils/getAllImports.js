// @flow
import type { Import } from '../types';
import getRegexStr from './getRegexMatchStr';

const getAllImports = (code: string): Array<Import> => {
  let matcher = new RegExp(getRegexStr(), 'g');
  let matches = [];
  let m = matcher.exec(code);

  while (m) {
    // $1 and $3 capture groups are used for 'require' statements, while $4 and $6
    // are used for 'import' statements
    if (m[1] && m[2] && m[3]) {
      matches.push(m[2]);
    } else if (m[4] && m[5] && m[6]) {
      matches.push(m[5]);
    }
    code = code.slice(m.index + m[0].length);
    matcher = new RegExp(getRegexStr(), 'g');
    m = matcher.exec(code);
  }
  return matches;
};

export default getAllImports;
