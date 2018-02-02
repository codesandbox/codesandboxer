"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _define = require("codesandbox/lib/api/define");

var _constants = require("./constants");

var _replaceImport = require("./replaceImport");

var _replaceImport2 = _interopRequireDefault(_replaceImport);

var _getAllImports = require("./getAllImports");

var _getAllImports2 = _interopRequireDefault(_getAllImports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var newpkgJSON = function newpkgJSON(dependencies) {
  return "{\n  \"name\": \"simple-example\",\n  \"version\": \"0.0.0\",\n  \"description\": \"A simple example deployed to CodeSandbox\",\n  \"main\": \"index.js\",\n  \"dependencies\": " + JSON.stringify(dependencies) + "\n}";
};

var addDep = function addDep(pkgJSON, name, deps) {
  // We are deliberately putting depencies as the last assigned as we will care
  // most about the versions of depencies over other types
  var dependencies = Object.assign({}, pkgJSON.peerDependencies, pkgJSON.devDependencies, pkgJSON.dependencies);

  for (var dependency in dependencies) {
    if (name.includes(dependency)) deps[dependency] = dependencies[dependency];
  }
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
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$originLocation = _ref2.originLocation,
        originLocation = _ref2$originLocation === undefined ? "" : _ref2$originLocation,
        _ref2$startingDeps = _ref2.startingDeps,
        startingDeps = _ref2$startingDeps === undefined ? {} : _ref2$startingDeps,
        _ref2$providedFiles = _ref2.providedFiles,
        providedFiles = _ref2$providedFiles === undefined ? {} : _ref2$providedFiles;

    var exampleCode, pkgJSONCode, deps, imports, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, mpt, _mpt, complete, source, files, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof example === "string")) {
              _context.next = 4;
              break;
            }

            _context.t0 = example;
            _context.next = 7;
            break;

          case 4:
            _context.next = 6;
            return example;

          case 6:
            _context.t0 = _context.sent;

          case 7:
            exampleCode = _context.t0;

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
            deps = Object.assign({}, startingDeps, _defineProperty({}, pkgJSON.name, pkgJSON.version));
            imports = (0, _getAllImports2.default)(exampleCode);
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 21;


            for (_iterator = imports[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              mpt = _step.value;
              _mpt = _slicedToArray(mpt, 2), complete = _mpt[0], source = _mpt[1];
              // We check if the import we are examining is a relative or an absolute path

              if (/^\./.test(source) && originLocation === source) {
                exampleCode = (0, _replaceImport2.default)(exampleCode, source, pkgJSON.name);
                // onInternalImports(exampleCode, source, config)
              } else {
                // onExternalImports(exampleCode, source, config)
                addDep(pkgJSON, source, deps);
              }
              // onAllImports(exampleCode, source, config)
            }
            _context.next = 29;
            break;

          case 25:
            _context.prev = 25;
            _context.t2 = _context["catch"](21);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 29:
            _context.prev = 29;
            _context.prev = 30;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 32:
            _context.prev = 32;

            if (!_didIteratorError) {
              _context.next = 35;
              break;
            }

            throw _iteratorError;

          case 35:
            return _context.finish(32);

          case 36:
            return _context.finish(29);

          case 37:
            ensureReact(deps);

            files = Object.assign({}, _constants.baseFiles, {
              "example.js": { content: exampleCode },
              "package.json": { content: newpkgJSON(deps) }
            }, providedFiles);
            data = { parameters: (0, _define.getParameters)({ files: files }) };
            return _context.abrupt("return", Promise.resolve({ files: files, params: (0, _define.getParameters)({ files: files }) }));

          case 41:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[21, 25, 29, 37], [30,, 32, 36]]);
  }));

  return function getCSBData(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = getCSBData;