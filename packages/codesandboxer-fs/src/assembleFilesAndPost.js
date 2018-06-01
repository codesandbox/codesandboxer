const { sendFilesToCSB } = require('codesandboxer');
const assembleFiles = require('./assembleFiles');
/*::
import type { Config } from './flow-types'
*/

async function assembleFilesAndPost(
  filePath /*: string */,
  config /*: Config */,
) {
  let { parameters } = await assembleFiles(filePath, config);
  let csbInfo = await sendFilesToCSB(parameters);
  return csbInfo;
}

module.exports = assembleFilesAndPost;
