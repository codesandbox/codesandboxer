"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getAllImports = require("./getAllImports");

var _getAllImports2 = _interopRequireDefault(_getAllImports);

var _parseDeps2 = require("./parseDeps");

var _parseDeps3 = _interopRequireDefault(_parseDeps2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var parseFile = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file, pkgJSON) {
    var fileCode, pkgJSONContent, imports, _parseDeps, deps, internalImports;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.resolve(file);

          case 2:
            fileCode = _context.sent;
            _context.next = 5;
            return Promise.resolve(pkgJSON);

          case 5:
            pkgJSONContent = _context.sent;
            imports = (0, _getAllImports2.default)(fileCode);
            _parseDeps = (0, _parseDeps3.default)(pkgJSONContent, imports), deps = _parseDeps.deps, internalImports = _parseDeps.internalImports;
            return _context.abrupt("return", Promise.resolve({ file: fileCode, deps: deps, internalImports: internalImports }));

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