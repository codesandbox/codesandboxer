// @flow
export default function resolvePath(
  basePath: string,
  relativePath: string
): string {
  let newSegments = basePath.split('/').filter(a => a);
  let relativeSegments = relativePath.split('/').filter(a => a);
  let segment = relativeSegments.shift();

  // For our use-case, the basePath is always a file, not a directory.
  // This means we can do this safely.
  if (segment === '..' || segment === '.') newSegments.pop();

  while (segment) {
    switch (segment) {
      case '.':
        break;
      case '..':
        if (newSegments.length < 1) {
          throw new Error('Trying to access a filepath outside our scope');
        }
        newSegments.pop();
        break;
      default:
        newSegments.push(segment);
    }
    segment = relativeSegments.shift();
  }
  return newSegments.join('/');
}
