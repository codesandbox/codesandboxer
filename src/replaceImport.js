// @flow
export default function replaceImport(
  code: string,
  oldSource: string,
  newSource: string
): string {
  const oldImport = new RegExp(`import [^"']+ from ["']${oldSource}["']`);
  if (oldImport.test(code)) {
    return code.replace(oldSource, newSource);
  } else {
    return code;
  }
}
