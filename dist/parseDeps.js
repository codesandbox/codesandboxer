"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDeps = function getDeps(pkgJSON, name) {
  var deps = {};
  // We are deliberately putting dependencies as the last assigned as we will care
  // most about the versions of dependencies over other types
  var dependencies = (0, _extends3.default)({}, pkgJSON.peerDependencies, pkgJSON.devDependencies, pkgJSON.dependencies);

  for (var dependency in dependencies) {
    if (name.includes(dependency)) {
      deps[dependency] = dependencies[dependency];
    }
  }
  return deps;
};


var parseDeps = function parseDeps(pkgJSON, imports) {
  var dependencies = {};
  var internalImports = [];
  // This is a common pattern of going over mpt of imports. Have not found a neat function extraction for it.
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(imports), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mpt = _step.value;

      var _mpt = (0, _slicedToArray3.default)(mpt, 2),
          complete = _mpt[0],
          name = _mpt[1];

      if (/^\./.test(name)) {
        internalImports.push(mpt);
      } else {
        var foundDeps = getDeps(pkgJSON, name);
        if ((0, _keys2.default)(foundDeps).length < 1) {
          dependencies[name] = "latest";
        } else {
          dependencies = (0, _extends3.default)({}, dependencies, foundDeps);
        }
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

  return { deps: dependencies, internalImports: internalImports };
};

exports.default = parseDeps;