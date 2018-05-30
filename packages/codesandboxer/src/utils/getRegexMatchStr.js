/*
The below implementation takes its cues from the following repo:
https://github.com/mathieudutour/deps-regex

We have modified it so that it also supports the syntax:

export a from 'b'
*/

let matchingName = '\\s*(?:[\\w${},\\s*]+)\\s*';
// strings passed to matchingDeps require a trailing opening bracket. This is to
// allow replaceImport to pass in partial paths, so we can match against a file
// pattern.
let matchAnyDep = `([^'"\`]+)(`;
let matchingDeps = (deps = matchAnyDep) => `\s*['"\`])${deps}['"\`]\s*`;

// $1 and $3 capture groups are used for 'require' statements, while $4 and $6
// are used for 'import' statements
const getRegexStr = deps => {
  return (
    // the first half of this regex matches require statements
    `((?:(?:var|const|let)${matchingName}=\\s*)?require\\(${matchingDeps(
      deps,
    )}\\);?)` +
    // the second half of this regex matches imports
    `|((?:import|export)(?:${matchingName}from\\s*)?${matchingDeps(deps)};?)`
  );
};

export default getRegexStr;
