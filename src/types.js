export type Config = {
  originLocation?: string,
  startingDeps?: { [string]: string },
  providedFiles?: { [string]: string }
};

export type Files = {
  [string]: {
    content: string
  }
};

export type Package = {
  name: string,
  version: string,
  depencies: {
    [string]: string
  },
  devDependencies: {
    [string]: string
  },
  peerDependencies: {
    [string]: string
  }
};

export type Import = [string, string];
