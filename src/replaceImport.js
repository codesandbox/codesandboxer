export default function replaceImport (code, oldSource, newSource) {
  const oldImport = new RegExp(`import [^"']+ from ["']${oldSource}["']`);
  if (oldImport.test(code)) {
    return code.replace(oldSource, newSource);
  } else {
    return code;
  }
};
