const getBaseFiles = fileName => ({
  'index.html': {
    content: '<div id="root"></div>',
  },
  'index.js': {
    content: `/**
  This CodeSandbox has been automatically generated using
  \`codesandboxer\`. If you're curious how that happened, you can
  check out our docs here: https://github.com/codesandbox/codesandboxer

  If you experience any struggles with this sandbox, please raise an issue
  on github. :)
*/
import Vue from "vue";
import Example from './${fileName}';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#root",
  components: { Example },
  template: "<Example/>"
});
`,
  },
});

module.exports = getBaseFiles;
