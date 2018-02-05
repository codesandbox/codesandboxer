"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _replaceImport = require("./replaceImport");

var _replaceImport2 = _interopRequireDefault(_replaceImport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addDep = function addDep(pkgJSON, name, deps) {
  // We are deliberately putting depencies as the last assigned as we will care
  // most about the versions of depencies over other types
  var dependencies = Object.assign({}, pkgJSON.peerDependencies, pkgJSON.devDependencies, pkgJSON.dependencies);

  for (var dependency in dependencies) {
    if (name.includes(dependency)) deps[dependency] = dependencies[dependency];
  }
};

var parseDeps = function parseDeps(example, pkgJSON, imports) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _config$originLocatio = config.originLocation,
      originLocation = _config$originLocatio === undefined ? "" : _config$originLocatio,
      _config$startingDeps = config.startingDeps,
      startingDeps = _config$startingDeps === undefined ? {} : _config$startingDeps,
      _config$providedFiles = config.providedFiles,
      providedFiles = _config$providedFiles === undefined ? {} : _config$providedFiles;

  var exampleCode = example;
  var dependencies = {};
  var internalImports = [];
  // This is a common pattern of going over mpt of imports. Have not found a neat function extraction for it.
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = imports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mpt = _step.value;

      var _mpt = _slicedToArray(mpt, 2),
          complete = _mpt[0],
          source = _mpt[1];

      if (/^\./.test(source)) {
        internalImports.push(mpt);
      } else {
        addDep(pkgJSON, source, dependencies);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return { deps: dependencies, exampleCode: exampleCode, internalImports: internalImports };
};

exports.default = parseDeps;