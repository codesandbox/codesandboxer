let scopedPkgRegex = /^(@[^\/]+\/[^\/]+)\/.+/;
let pkgRegex = /^([^@][^\/]+)\/.+/;

const parsePkgName = mpt => {
  if (mpt.match(scopedPkgRegex)) {
    return mpt.match(scopedPkgRegex)[1];
  } else if (mpt.match(pkgRegex)) {
    return mpt.match(pkgRegex)[1];
  } else {
    return mpt;
  }
};

export default parsePkgName;
