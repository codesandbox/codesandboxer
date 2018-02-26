'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

var getAllImports = function getAllImports(code) {
  var imports = code.match(new RegExp(_constants.importPattern, 'g'));
  if (imports) return imports.map(function (mpt) {
    return new RegExp(_constants.importPattern).exec(mpt);
  });else return [];
};
exports.default = getAllImports;