"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var getDeps = function getDeps(pkgJSON, name) {
  var deps = {};
  // We are deliberately putting dependencies as the last assigned as we will care
  // most about the versions of dependencies over other types
  var dependencies = _extends({}, pkgJSON.peerDependencies, pkgJSON.devDependencies, pkgJSON.dependencies);

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
    for (var _iterator = imports[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mpt = _step.value;

      var _mpt = _slicedToArray(mpt, 2),
          complete = _mpt[0],
          name = _mpt[1];

      if (/^\./.test(name)) {
        internalImports.push(mpt);
      } else {
        var foundDeps = getDeps(pkgJSON, name);
        if (Object.keys(foundDeps).length < 1) {
          dependencies[name] = "latest";
        } else {
          dependencies = _extends({}, dependencies, foundDeps);
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