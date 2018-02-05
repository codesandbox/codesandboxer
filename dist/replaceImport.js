"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replaceImport;
function replaceImport(code, oldSource, newSource) {
  var oldImport = new RegExp("import [^\"']+ from [\"']" + oldSource + "[\"']");
  if (oldImport.test(code)) {
    return code.replace(oldSource, newSource);
  } else {
    return code;
  }
}