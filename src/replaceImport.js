// @flow
export default function replaceImport(
  code: string,
  oldSource: string,
  newSource: string
): string {
  const oldImport = new RegExp(
    `(import [^"']+ from ["'])${oldSource.replace(/\*$/, `[^"']*`)}(["'])`,
    "g"
  );
  return code.replace(oldImport, `$1${newSource}$2`);
}
