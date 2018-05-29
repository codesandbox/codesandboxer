// @flow
const assembleFiles = require('./assembleFiles');
const assembleFilesAndPost = require('./assembleFilesAndPost');

/* eslint-disable-next-line */
module.exports = { assembleFilesAndPost, assembleFiles };

// other stuff we need to handle:
// loading nonJS files
//   .jsx
//   .png +
//   .tsx
// Check we never reach above our initial scope
