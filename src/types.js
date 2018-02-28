// @flow
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

export type Import = [string, string];
