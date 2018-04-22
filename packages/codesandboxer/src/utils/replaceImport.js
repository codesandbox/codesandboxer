// @flow

export default function replaceImport(
  code: string,
  oldSource: string,
  newSource: string,
): string {
  let matchString = '';

  if (oldSource.match(/\*$/)) {
    matchString = `(import [^"']+ from ["'])${oldSource.replace(
      /\*$/,
      `([^"']*`,
    )}["'])`;
  } else {
    matchString = `(import [^"']+ from ["'])${oldSource}(["'])`;
  }
  const oldImport = new RegExp(matchString, 'g');

  return code.replace(oldImport, `$1${newSource}$2`);
}
