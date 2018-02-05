"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _define = require("codesandbox/lib/api/define");

var _constants = require("./constants");

var _replaceImport = require("./replaceImport");

var _replaceImport2 = _interopRequireDefault(_replaceImport);

var _getAllImports = require("./getAllImports");

var _getAllImports2 = _interopRequireDefault(_getAllImports);

var _parseDeps2 = require("./parseDeps");

var _parseDeps3 = _interopRequireDefault(_parseDeps2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ParseFile = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file, pkgJSON) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var _config$originLocatio, originLocation, _config$startingDeps, startingDeps, _config$providedFiles, providedFiles, fileCode, pkgJSONContent, imports, _parseDeps, deps, exampleCode, internalImports;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _config$originLocatio = config.originLocation, originLocation = _config$originLocatio === undefined ? "" : _config$originLocatio, _config$startingDeps = config.startingDeps, startingDeps = _config$startingDeps === undefined ? {} : _config$startingDeps, _config$providedFiles = config.providedFiles, providedFiles = _config$providedFiles === undefined ? {} : _config$providedFiles;

            if (!(typeof file === "string")) {
              _context.next = 5;
              break;
            }

            _context.t0 = file;
            _context.next = 8;
            break;

          case 5:
            _context.next = 7;
            return file;

          case 7:
            _context.t0 = _context.sent;

          case 8:
            fileCode = _context.t0;

            if (!(typeof pkgJSON === "string")) {
              _context.next = 13;
              break;
            }

            _context.t1 = pkgJSON;
            _context.next = 16;
            break;

          case 13:
            _context.next = 15;
            return pkgJSON;

          case 15:
            _context.t1 = _context.sent;

          case 16:
            pkgJSONContent = _context.t1;


            // We immediately replace references to the source with references to the package.
            // This should likely be moved to the consumer to do. Need to find a helpful
            // way to help the consumer do this
            fileCode = (0, _replaceImport2.default)(fileCode, originLocation, pkgJSONContent);

            imports = (0, _getAllImports2.default)(fileCode);
            // instead of handling imports up here, we should just pass back the unsafe imports we found

            _parseDeps = (0, _parseDeps3.default)(fileCode, pkgJSONContent, imports, config), deps = _parseDeps.deps, exampleCode = _parseDeps.exampleCode, internalImports = _parseDeps.internalImports;
            return _context.abrupt("return", Promise.resolve({ file: exampleCode, deps: deps, internalImports: internalImports }));

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function ParseFile(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = ParseFile;