// @flow
import type { Dependencies } from '../types';
export default (
  dependencies: Dependencies,
  name?: string = 'codesandboxer-example',
  main: string = 'index.js'
) => `{
  "name": "${name}",
  "version": "0.0.0",
  "description": "A simple example deployed using react-codesandboxer",
  "main": "${main}",
  "dependencies": {
    ${Object.keys(dependencies)
      .map(k => `"${k}": "${dependencies[k]}"`)
      .join(',\n    ')}
  }
}`;
