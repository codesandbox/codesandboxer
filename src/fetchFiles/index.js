// @flow
import fetchRelativeFile from '../fetchRelativeFile';
import resolvePath from '../utils/resolvePath';
import resolveFilePath from '../utils/resolveFilePath';
import replaceImports from '../replaceImports';
import parseFile from '../parseFile';
import type {
  Package,
  FetchConfig,
  Dependencies,
  Import,
  Files,
} from '../types';
import finaliseCSB from './finaliseCSB';
import { baseFiles } from '../constants';

let count = 0;

async function ensurePKGJSON(
  maybePkg,
  importReplacements,
  gitInfo,
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

async function ensureExample(
  example,
  importReplacements,
  pkg,
  examplePath,
  gitInfo,
) {
  if (example) {
    let exampleContent = await Promise.resolve(example);
    let content = replaceImports(exampleContent, importReplacements);
    return parseFile(content, pkg);
  } else {
    return fetchRelativeFile(examplePath, pkg, importReplacements, gitInfo);
  }
}

async function fetchInternalDependencies(
  internalImports: Array<string>,
  files: Files,
  pkg: Package,
  deps: { [string]: string },
  gitInfo: FetchConfig,
  importReplacements: Array<Import>,
) {
  count++;
  if (count > 30) throw new Error('count escape');
  let newFiles = await Promise.all(
    internalImports.map(path =>
      fetchRelativeFile(path, pkg, importReplacements, gitInfo).then(r => ({
        ...r,
        path: path,
      })),
    ),
  );
  let moreInternalImports = [];
  for (let f of newFiles) {
    files[resolveFilePath(f.path)] = { content: f.file };
    deps = { ...deps, ...f.deps };
    f.internalImports.forEach(m =>
      moreInternalImports.push(resolvePath(f.path, m)),
    );
  }
  moreInternalImports = moreInternalImports.filter(
    mpt => !files[resolveFilePath(mpt)],
  );
  if (moreInternalImports.length > 0) {
    let moreFiles = await fetchInternalDependencies(
      moreInternalImports,
      files,
      pkg,
      deps,
      gitInfo,
      importReplacements,
    );
    return {
      files: { ...files, ...moreFiles.files },
      deps: { ...deps, ...moreFiles.deps },
    };
  } else {
    return { files, deps };
  }
}

export default async function(
  examplePath: string,
  initialPkg: Package | string | Promise<Package | string> | void,
  gitInfo: FetchConfig,
  importReplacements: Array<Import>,
  dependencies: Dependencies = {},
  providedFiles: Files = {},
  example?: string | Promise<string>,
) {
  let pkg = await ensurePKGJSON(initialPkg, importReplacements, gitInfo);

  let { file, deps, internalImports } = await ensureExample(
    example,
    importReplacements,
    pkg,
    examplePath,
    gitInfo,
  );

  let files = {
    ...baseFiles,
    'example.js': {
      content: replaceImports(
        file,
        internalImports.map(m => [m, `./${resolvePath(examplePath, m)}`]),
      ),
    },
  };

  let final = await fetchInternalDependencies(
    internalImports.map(m => resolvePath(examplePath, m)),
    files,
    pkg,
    deps,
    gitInfo,
    importReplacements,
  );
  return finaliseCSB(final, providedFiles);
}
