// @flow
import fetchRelativeFile from '../fetchRelativeFile';
import type { Package, Import, FetchConfig } from '../types';

export default async function ensurePKGJSON(
  maybePkg?: Package | string | Promise<Package | string>,
  importReplacements: Array<Import>,
  gitInfo: FetchConfig,
): Promise<Package> {
  let pkg = await Promise.resolve(maybePkg);
  if (typeof pkg === 'object') {
    return pkg;
  } else if (typeof pkg === 'string') {
    return fetchRelativeFile(
      pkg,
      // $FlowFixMe - we know here that this will not be a js file, the only time we NEED a pkg
      {},
      importReplacements,
      gitInfo,
    ).then(({ file }) => JSON.parse(file));
  } else if (!pkg) {
    return fetchRelativeFile(
      'package.json',
      // $FlowFixMe - we know here that this will not be a js file, the only time we NEED a pkg
      {},
      importReplacements,
      gitInfo,
    ).then(({ file }) => JSON.parse(file));
  } else throw new Error('could not understand passed in package.json');
}
