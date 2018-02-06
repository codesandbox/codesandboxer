"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _define = require("codesandbox/lib/api/define");

var _constants = require("./constants");

var _parseFile = require("./parseFile");

var _parseFile2 = _interopRequireDefault(_parseFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(example, pkgJSON) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var _config$startingDeps, startingDeps, _config$providedFiles, providedFiles, exampleCode, pkgJSONCode, _ref2, deps, file, dependencies, files, parameters;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _config$startingDeps = config.startingDeps, startingDeps = _config$startingDeps === undefined ? {} : _config$startingDeps, _config$providedFiles = config.providedFiles, providedFiles = _config$providedFiles === undefined ? {} : _config$providedFiles;
            _context.next = 3;
            return Promise.resolve(example);

          case 3:
            exampleCode = _context.sent;
            _context.next = 6;
            return Promise.resolve(pkgJSON);

          case 6:
            pkgJSONCode = _context.sent;
            _context.next = 9;
            return (0, _parseFile2.default)(exampleCode, pkgJSONCode);

          case 9:
            _ref2 = _context.sent;
            deps = _ref2.deps;
            file = _ref2.file;
            dependencies = _extends({}, startingDeps, deps, _defineProperty({}, pkgJSONCode.name, pkgJSONCode.version));


            ensureReact(dependencies);

            files = _extends({}, _constants.baseFiles, {
              "example.js": { content: file },
              "package.json": { content: newpkgJSON(dependencies) }
            }, providedFiles);
            parameters = (0, _define.getParameters)({ files: files });
            return _context.abrupt("return", {
              files: files,
              dependencies: dependencies,
              parameters: parameters
            });

          case 17:
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