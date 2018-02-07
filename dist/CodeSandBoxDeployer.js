"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _getCSBData = require("./getCSBData");

var _getCSBData2 = _interopRequireDefault(_getCSBData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var codesandboxURL = "https://codesandbox.io/api/v1/sandboxes/define";

var CodeSandboxDeployer = function (_Component) {
  (0, _inherits3.default)(CodeSandboxDeployer, _Component);

  function CodeSandboxDeployer() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, CodeSandboxDeployer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = CodeSandboxDeployer.__proto__ || (0, _getPrototypeOf2.default)(CodeSandboxDeployer)).call.apply(_ref, [this].concat(args))), _this), _this.state = { parameters: "" }, _this.deployToCSB = function (e) {
      var _this$props = _this.props,
          example = _this$props.example,
          pkgJSON = _this$props.pkgJSON,
          config = _this$props.config,
          skipDeploy = _this$props.skipDeploy,
          afterDeploy = _this$props.afterDeploy;

      e.preventDefault();
      // this is always a promise, accepts example as a promise. accept pkgJSON as a promise
      (0, _getCSBData2.default)(example, pkgJSON, config).then(function (_ref2) {
        var parameters = _ref2.parameters,
            files = _ref2.files;

        _this.setState({ parameters: parameters }, function () {
          if (!skipDeploy && _this.form) _this.form.submit();
          if (afterDeploy) afterDeploy({ parameters: parameters, files: files });
        });
      }).catch(function (error) {
        if (afterDeploy) afterDeploy({ error: error });
      });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(CodeSandboxDeployer, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          skipDeploy = _props.skipDeploy,
          example = _props.example,
          pkgJSON = _props.pkgJSON,
          config = _props.config,
          afterDeploy = _props.afterDeploy,
          children = _props.children,
          rest = (0, _objectWithoutProperties3.default)(_props, ["skipDeploy", "example", "pkgJSON", "config", "afterDeploy", "children"]);


      return _react2.default.createElement(
        "form",
        {
          style: { display: "inline-block" },
          onSubmit: this.deployToCSB,
          action: "https://codesandbox.io/api/v1/sandboxes/define",
          method: "POST",
          target: "_blank",
          ref: function ref(r) {
            _this2.form = r;
          }
        },
        _react2.default.createElement("input", { type: "hidden", name: "parameters", value: this.state.parameters }),
        children
      );
    }
  }]);
  return CodeSandboxDeployer;
}(_react.Component);

CodeSandboxDeployer.defaultProps = {
  children: _react2.default.createElement(
    "button",
    { type: "submit" },
    "Deploy to CodeSandbox"
  )
};
exports.default = CodeSandboxDeployer;