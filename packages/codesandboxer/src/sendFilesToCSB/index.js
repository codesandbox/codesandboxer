// @flow
import { getSandboxUrl } from '../constants';
import 'isomorphic-unfetch';
import FormData from 'form-data';

async function sendFilesToCSB(
  parameters: string,
  config?: { fileName?: string, type?: string },
): Promise<{ sandboxId: string, sandboxUrl: string }> {
  if (!config) config = {};
  let fileName = config.fileName ? config.fileName : 'example';
  let type = config.type ? config.type : 's';
  let formData = new FormData();
  formData.append('parameters', parameters);

  return fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
    method: 'post',
    body: formData,
    mode: 'cors',
  })
    .then(response => response.json())
    .then(({ errors, sandbox_id }) => {
      if (errors) throw errors;
      return {
        sandboxId: sandbox_id,
        sandboxUrl: getSandboxUrl(sandbox_id, type, fileName),
      };
    });
}

export default sendFilesToCSB;
