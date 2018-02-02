"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require("./constants");

var getAllImports = function getAllImports(code) {
  return code.match(new RegExp(_constants.importPattern, "g")).map(function (mpt) {
    return new RegExp(_constants.importPattern).exec(mpt);
  });
};

exports.default = getAllImports;