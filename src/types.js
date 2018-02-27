export type Config = {
  startingDeps?: { [string]: string },
  providedFiles?: { [string]: string },
};

export type FetchConfig = {
  account: string,
  repository: string,
  branch?: string,
  host: 'bitbucket' | 'github',
};

export type Files = {
  [string]: {
    content: string,
  },
};

export type ParsedFile = {
  file: string,
  deps: { [string]: string },
  internalImports: Array<Import>,
};

export type Package = {
  name: string,
  version: string,
  depencies: {
    [string]: string,
  },
  devDependencies: {
    [string]: string,
  },
  peerDependencies: {
    [string]: string,
  },
};

export type Import = [string, string];

type InternalFileShape = {
  // The actual string contents of the file to be sent to CSB
  content: string,
  // The absolutePath assuming the top of the git repository, usable in URLs and to solve relativePaths
  absolutePath: string,
  // what will be the 'name' of the file in CSB once deployed
  newPath: string,
  // A quick array of internal imports with the relativePath they had in the file
  internalImports: Array<string>,
  // A list of ['./oldPlace', './new/place/in/csb'] to run replaceImports with
  // This is very unfortunately pacakge specific...
  // with this and absolutePath we may be able to avoid this...
  internalImportsReplacements: Array<Import>,
  // The external dependencies that are used within the file
  deps: { [string]: string },
  // Show if for example we cannot resolve an import...
  predictedError?: {},
};

export type FilesArray = Array<InternalFileShape>;

const replaceInternalImports = (
  content: string,
  internalImports: Array<Import>,
  filesArr: FilesArray,
) => {
  let importsMap = internalImports.map(m => {
    let path = resolvePath(absolutePath, m);
    let existentFile = filesArr.find(
      ({ absolutePath }) => absolutePath === path,
    );
    if (!existentFile) {
      // This is technically an error state
      return undefined;
    }
    return [m, `./${path}`];
  });

  return replaceImports(content, importsMap);
};

const convertFilesArrayToFiles = (arr: FilesArray): Files => {
  return arr.reduce(
    acc,
    ({ content, internalImports, deps }) => {
      if (fileData.internalImports)
        content = replaceInternalImports(content, internalImports, arr);

      return {
        files: {
          ...acc.files,
          [newPath]: {
            content,
          },
        },
        deps: {
          ...acc.deps,
          ...deps,
        },
        // Something with the predictedError
      };
    },
    {
      files: {},
      deps: {},
    },
  );
};
