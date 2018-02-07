"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replaceImport;
function replaceImport(code, oldSource, newSource) {
  var oldImport = new RegExp("(import [^\"']+ from [\"'])" + oldSource.replace(/\*$/, "[^\"']*") + "([\"'])", "g");
  return code.replace(oldImport, "$1" + newSource + "$2");
}