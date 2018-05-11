import React from 'react';
import Simple from './deeperRelativeImport/withRelativeImport';

export default () => (
  <div>
    <p>Here we are importing a simple component and rendering it:</p>
    <Simple />
  </div>
);
