// @flow
import type { Import } from '../types';

let matchingDeps = '\\s*[\'"`]([^\'"`]+)[\'"`]\\s*';
let matchingName = '\\s*(?:[\\w${},\\s*]+)\\s*';
// the first half of this regex matches require statements
let regex =
  '(?:(?:var|const|let)' +
  matchingName +
  '=\\s*)?require\\(' +
  matchingDeps +
  '\\);?';

// the second half of this regex matches imports
regex +=
  '|(?:import|export)(?:' + matchingName + 'from\\s*)?' + matchingDeps + ';?';

const getAllImports = (code: string): Array<Import> => {
  let matcher = new RegExp(regex, 'g');
  let matches = [];
  let m = matcher.exec(code);

  while (m) {
    matcher = new RegExp(regex, 'g');
    matches.push(m[1] || m[2] || m[3] || m[4]);
    code = code.slice(m.index + m[0].length);
    m = matcher.exec(code);
  }
  return matches;
};

export default getAllImports;
