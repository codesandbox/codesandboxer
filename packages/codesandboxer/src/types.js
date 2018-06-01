// @flow
export type GitInfo = {
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
  internalImports: Array<string>,
  path: string,
};

export type parsedFileFirst = {
  file: string,
  deps: { [string]: string },
  internalImports: Array<string>,
};

export type Package = {
  name: string,
  version: string,
  dependencies: {
    [string]: string,
  },
  devDependencies: {
    [string]: string,
  },
  peerDependencies: {
    [string]: string,
  },
};

export type Dependencies = { [string]: string };

export type Config = { allowJSX?: boolean };

export type Import = string;

export type ImportReplacement = [string, string];
