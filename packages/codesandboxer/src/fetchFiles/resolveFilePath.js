// @flow
export default function resolveFilePath(path: string): string {
  let fileMatch = path.match(/.+(\..+)$/);
  if (!fileMatch) {
    return `${path}.js`;
  } else {
    return path;
  }
}
