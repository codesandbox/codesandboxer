/*
Things we need:

gitSiteConfig
exampleFileContents (maybe as a promise)
exampleFilePath - where in the git path the example file is
initialReplacementKeys 
*/
const initialContext = example => {
  // map InitialReplacementKeys to their location in the fs
  // if !exampleFileContents fetch contents from exampleFileContents + gitSiteConfig
  // parseFile contents to get the relativeImports
  // map relativeImports
};
