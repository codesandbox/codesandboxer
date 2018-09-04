// @flow
const rp2 = (base, rel) => {
  // this logic is designed to prevent us leaving our current scope
  switch (rel[0]) {
    case '..': {
      if (base.length < 1) {
        throw new Error(
          `invalid relative path from ${base.join('/')} to ${rel.join('/')}`,
        );
      }
      return rp2(base.slice(0, -1), rel.slice(1));
    }
    default: {
      return `${base.concat(rel).join('/')}`;
    }
  }
};

const resolvePath = (basePath: string, relativePath: string): string => {
  let base = basePath.split('/').filter(a => a);
  let rel = relativePath.split('/').filter(a => a);

  let val = '';
  switch (rel[0]) {
    case '.':
      // We are assuming that the base is always a file path
      val = base
        .slice(0, -1)
        .concat(rel.slice(1))
        .join('/');
      break;
    case '..':
      // this logic is designed to prevent us leaving our current scope
      if (base.length < 1) {
        throw new Error(
          `invalid relative path from ${basePath} to ${relativePath}`,
        );
      }
      val = rp2(base.slice(0, -1), rel);
      break;
    default:
      // TODO: Decide if this is correct or terribly wrong
      val = base.concat(rel).join('/');
  }

  return val;
};

export default resolvePath;
