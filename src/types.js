export type Config = {
  startingDeps?: { [string]: string },
  providedFiles?: { [string]: string },
  // This is all the info you need to make request to the BB servers
  bb: {
    path: string,
    accountName: string,
    repoSlug: string,
    revision: string,
  },
  // some github config blob, don't know what we need here yet
  gh: {},
};

export type Files = {
  [string]: {
    content: string,
  },
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
