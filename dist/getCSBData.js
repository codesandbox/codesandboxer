'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _define = require('codesandbox/lib/api/define');

var _constants = require('./constants');

var _parseFile = require('./parseFile');

var _parseFile2 = _interopRequireDefault(_parseFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var newpkgJSON = function newpkgJSON(dependencies) {
  return '{\n  "name": "simple-example",\n  "version": "0.0.0",\n  "description": "A simple example deployed to CodeSandbox",\n  "main": "index.js",\n  "dependencies": ' + (0, _stringify2.default)(dependencies) + '\n}';
};


var ensureReact = function ensureReact(deps) {
  if (!deps.react && !deps['react-dom']) {
    deps.react = 'latest';
    deps['react-dom'] = 'latest';
  } else if (!deps.react) {
    deps.react = deps['react-dom'];
  } else if (!deps['react-dom']) {
    deps['react-dom'] = deps.react;
  }
};

var getCSBData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(example, pkgJSON) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var _ref2, _ref2$providedDeps, providedDeps, _ref2$providedFiles, providedFiles, exampleCode, pkgJSONCode, _ref3, deps, file, dependencies, files, parameters;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _promise2.default.resolve(config);

          case 2:
            _ref2 = _context.sent;
            _ref2$providedDeps = _ref2.providedDeps;
            providedDeps = _ref2$providedDeps === undefined ? {} : _ref2$providedDeps;
            _ref2$providedFiles = _ref2.providedFiles;
            providedFiles = _ref2$providedFiles === undefined ? {} : _ref2$providedFiles;
            _context.next = 9;
            return _promise2.default.resolve(example);

          case 9:
            exampleCode = _context.sent;
            _context.next = 12;
            return _promise2.default.resolve(pkgJSON);

          case 12:
            pkgJSONCode = _context.sent;
            _context.next = 15;
            return (0, _parseFile2.default)(exampleCode, pkgJSONCode);

          case 15:
            _ref3 = _context.sent;
            deps = _ref3.deps;
            file = _ref3.file;
            dependencies = (0, _extends4.default)({}, deps, (0, _defineProperty3.default)({}, pkgJSONCode.name, pkgJSONCode.version), providedDeps);


            ensureReact(dependencies);

            files = (0, _extends4.default)({}, _constants.baseFiles, {
              'example.js': { content: file },
              'package.json': { content: newpkgJSON(dependencies) }
            }, providedFiles);
            parameters = (0, _define.getParameters)({ files: files });
            return _context.abrupt('return', {
              files: files,
              dependencies: dependencies,
              parameters: parameters
            });

          case 23:
          case 'end':
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