// @flow
const rp2 = (base, rel) => {
  switch (rel[0]) {
    case '..': {
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

  // if the relative path is too long, we won't be able to resolve it.
  if (rel.length > base.length + 1) {
    // TODO: Discuss what a good 'failcase' behaviour is for paths we can't resolve
    return basePath;
  }
  let val = '';
  switch (rel[0]) {
    case '.':
      val = base
        .slice(0, -1)
        .concat(rel.slice(1))
        .join('/');
      break;
    case '..':
      val = rp2(base.slice(0, -1), rel);
      break;
    default:
      // TODO: Decide if this is correct or terribly wrong
      val = base.concat(rel).join('/');
  }

  return val;
};

export default resolvePath;
