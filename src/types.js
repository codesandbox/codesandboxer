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
