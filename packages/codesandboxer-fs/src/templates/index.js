const react = require('./react');
const reactTypescript = require('./react-typescript');
const vue = require('./vue');
const { templates } = require('codesandboxer');

module.exports = {
  ...templates,
  'create-react-app': react,
  'create-react-app-typescript': reactTypescript,
  'vue-cli': vue,
};
