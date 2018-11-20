const { sendFilesToCSB } = require('codesandboxer');
const assembleFiles = require('./assembleFiles');
/*::
import type { Config } from './flow-types'
*/

async function assembleFilesAndPost(
  filePath /*: string */,
  config /*: Config */,
) {
  let { parameters, fileName } = await assembleFiles(filePath, config);
  let csbInfo = await sendFilesToCSB(parameters, { fileName });
  return csbInfo;
}

module.exports = assembleFilesAndPost;
