"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getAllImports = require("./getAllImports");

var _getAllImports2 = _interopRequireDefault(_getAllImports);

var _parseDeps2 = require("./parseDeps");

var _parseDeps3 = _interopRequireDefault(_parseDeps2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseFile = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file, pkgJSON) {
    var fileCode, pkgJSONContent, imports, _parseDeps, deps, internalImports;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _promise2.default.resolve(file);

          case 2:
            fileCode = _context.sent;
            _context.next = 5;
            return _promise2.default.resolve(pkgJSON);

          case 5:
            pkgJSONContent = _context.sent;
            imports = (0, _getAllImports2.default)(fileCode);
            _parseDeps = (0, _parseDeps3.default)(pkgJSONContent, imports), deps = _parseDeps.deps, internalImports = _parseDeps.internalImports;
            return _context.abrupt("return", _promise2.default.resolve({ file: fileCode, deps: deps, internalImports: internalImports }));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function parseFile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = parseFile;