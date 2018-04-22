// @flow
import { getSandboxUrl } from '../constants';
import 'isomorphic-unfetch';

async function sendFilesToCSB(parameters: string) {
  let formData = new FormData();
  formData.append('parameters', parameters);

  return fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
    method: 'post',
    body: formData,
    mode: 'cors',
  })
    .then(response => response.json())
    .then(({ sandbox_id }) => ({
      sandboxId: sandbox_id,
      sandboxUrl: getSandboxUrl(sandbox_id),
    }));
}

export default sendFilesToCSB;
