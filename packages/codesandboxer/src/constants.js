// @flow

export const codesandboxURL =
  'https://codesandbox.io/api/v1/sandboxes/define?query=module=/example.js';
export const codesandboxURLJSON =
  'https://codesandbox.io/api/v1/sandboxes/define?json=1';

export const getSandboxUrl = (
  id: string,
  type?: string = 's',
  fileName?: string = 'example'
) => `https://codesandbox.io/${type}/${id}?module=/${fileName}`;
