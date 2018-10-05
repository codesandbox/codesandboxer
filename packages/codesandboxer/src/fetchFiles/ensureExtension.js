// @flow
import path from 'path-browserify';

export default function ensureExtension(filePath: string): string {
  if (!path.extname(filePath)) {
    return `${filePath}.js`;
  } else {
    return filePath;
  }
}
