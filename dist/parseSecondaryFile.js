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

var newpkgJSON = function newpkgJSON(dependencies) {
  return "{\n  \"name\": \"simple-example\",\n  \"version\": \"0.0.0\",\n  \"description\": \"A simple example deployed to CodeSandbox\",\n  \"main\": \"index.js\",\n  \"dependencies\": " + JSON.stringify(dependencies) + "\n}";
};

var ensureReact = function ensureReact(deps) {
  if (!deps.react && !deps["react-dom"]) {
    deps.react = "latest";
    deps["react-dom"] = "latest";
  } else if (!deps.react) {
    deps.react = deps["react-dom"];
  } else if (!deps["react-dom"]) {
    deps["react-dom"] = deps.react;
  }
};

var getCSBData = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file, pkgJSON) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$originLocation = _ref2.originLocation,
        originLocation = _ref2$originLocation === undefined ? "" : _ref2$originLocation,
        _ref2$startingDeps = _ref2.startingDeps,
        startingDeps = _ref2$startingDeps === undefined ? {} : _ref2$startingDeps,
        _ref2$providedFiles = _ref2.providedFiles,
        providedFiles = _ref2$providedFiles === undefined ? {} : _ref2$providedFiles;

    var fileCode, pkgJSONCode, imports, _parseDeps, dependencies, exampleCode;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof file === "string")) {
              _context.next = 4;
              break;
            }

            _context.t0 = file;
            _context.next = 7;
            break;

          case 4:
            _context.next = 6;
            return file;

          case 6:
            _context.t0 = _context.sent;

          case 7:
            fileCode = _context.t0;

            if (!(typeof pkgJSON === "string")) {
              _context.next = 12;
              break;
            }

            _context.t1 = pkgJSON;
            _context.next = 15;
            break;

          case 12:
            _context.next = 14;
            return pkgJSON;

          case 14:
            _context.t1 = _context.sent;

          case 15:
            pkgJSONCode = _context.t1;
            imports = (0, _getAllImports2.default)(fileCode);
            _parseDeps = (0, _parseDeps3.default)(pkgJSON, imports, config), dependencies = _parseDeps.dependencies, exampleCode = _parseDeps.exampleCode;


            ensureReact(depenencies);

            return _context.abrupt("return", Promise.resolve({ file: exampleCode, dependencies: dependencies }));

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getCSBData(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = getCSBData;