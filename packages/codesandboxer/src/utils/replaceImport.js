// @flow
import getRegexMatchStr from './getRegexMatchStr';

export default function replaceImport(
  code: string,
  oldSource: string,
  newSource: string
): string {
  let matchString = '';

  if (oldSource.match(/\*$/)) {
    matchString = `${oldSource.replace(/\*$/, '()([^"\']*')}`;
  } else {
    matchString = `(${oldSource})(`;
  }

  let regexMatchStr = getRegexMatchStr(matchString);

  let newRegex = new RegExp(regexMatchStr, 'g');
  // $1 and $3 capture groups are used for 'require' statements, while $4 and $6
  // are used for 'import' statements
  return code.replace(newRegex, `$1$4${newSource}$3$6`);
}
