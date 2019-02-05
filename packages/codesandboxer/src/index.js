// @flow
// exposed mostly for codesandboxer-fs to use
export { parseFile, parseScssFile, parseSassFile } from './parseFile';
export { default as replaceImports } from './replaceImports';
export { default as resolvePath } from './utils/resolvePath';

// intended effective API
export { default as fetchFiles } from './fetchFiles';
export {
  default as ensureExtensionAndTemplate,
} from './fetchFiles/ensureExtensionAndTemplate';
export { default as sendFilesToCSB } from './sendFilesToCSB';
export { default as finaliseCSB } from './finaliseCSB';
export { getSandboxUrl } from './constants';
export { templates } from './templates';

// I don't know why this is exposed
export { default as fetchRelativeFile } from './fetchRelativeFile';

export type {
  GitInfo,
  Files,
  ParsedFile,
  parsedFileFirst,
  Package,
  Dependencies,
  Import,
  ImportReplacement,
} from './types';
