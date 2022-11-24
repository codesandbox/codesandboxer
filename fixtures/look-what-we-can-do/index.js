import React from 'react';
import { css } from 'emotion';

import HiddenBonus from './hidden-bonus';

let showHiddenBonus = true;

let box = css`
    border 4px solid pink;
    padding: 5px 30px;
`;

export default () => (
  <div className={box}>
    <h1>Thanks for Reading!</h1>
    <p>
      This is just a super simple example build to show you how codesandboxer
      works.
    </p>
    {showHiddenBonus ? <HiddenBonus /> : null}
  </div>
);
