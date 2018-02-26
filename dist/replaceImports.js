'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = function (code, oldAndNew) {
  var newCode = code;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(oldAndNew), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var mpt = _step.value;

      var _mpt = (0, _slicedToArray3.default)(mpt, 2),
          oldSource = _mpt[0],
          newSource = _mpt[1];

      newCode = (0, _replaceImport2.default)(newCode, oldSource, newSource);
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

  return newCode;
};

var _replaceImport = require('./replaceImport');

var _replaceImport2 = _interopRequireDefault(_replaceImport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }