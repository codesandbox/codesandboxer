// @flow
const assembleFiles = require('./src/assembleFiles');
const assembleFilesAndPost = require('./src/assembleFilesAndPost');

/* eslint-disable-next-line */
module.exports = { assembleFilesAndPost, assembleFiles };

// other stuff we need to handle:
// loading nonJS files
//   .tsx
// Check we never reach above our initial scope
