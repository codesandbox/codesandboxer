"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _CSBTransformer = require("./CSBTransformer");

var _CSBTransformer2 = _interopRequireDefault(_CSBTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var codesandboxURL = "https://codesandbox.io/api/v1/sandboxes/define";

var CodeSandboxDeployer = function (_Component) {
  _inherits(CodeSandboxDeployer, _Component);

  function CodeSandboxDeployer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CodeSandboxDeployer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CodeSandboxDeployer.__proto__ || Object.getPrototypeOf(CodeSandboxDeployer)).call.apply(_ref, [this].concat(args))), _this), _this.state = { parameters: "" }, _this.deployToCSB = function (e) {
      var _this$props = _this.props,
          example = _this$props.example,
          pkgJSON = _this$props.pkgJSON,
          config = _this$props.config,
          skipDeploy = _this$props.skipDeploy,
          afterDeploy = _this$props.afterDeploy;

      e.preventDefault();
      // this is always a promise, accepts example as a promise. accept pkgJSON as a promise
      (0, _CSBTransformer2.default)(example, pkgJSON, config).then(function (_ref2) {
        var params = _ref2.params,
            data = _ref2.data;

        _this.setState({ parameters: params }, function () {
          if (!skipDeploy) _this.form.submit();
          if (afterDeploy) afterDeploy({ params: params, data: data });
        });
      }).catch(function (error) {
        if (afterDeploy) afterDeploy({ error: error });
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CodeSandboxDeployer, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          skipDeploy = _props.skipDeploy,
          example = _props.example,
          pkgJSON = _props.pkgJSON,
          config = _props.config,
          Button = _props.Button,
          afterDeploy = _props.afterDeploy,
          children = _props.children,
          rest = _objectWithoutProperties(_props, ["skipDeploy", "example", "pkgJSON", "config", "Button", "afterDeploy", "children"]);

      return _react2.default.createElement(
        "span",
        null,
        _react2.default.createElement(
          "form",
          {
            onSubmit: this.deployToCSB,
            action: "https://codesandbox.io/api/v1/sandboxes/define",
            method: "POST",
            target: "_blank",
            ref: function ref(r) {
              _this2.form = r;
            }
          },
          _react2.default.createElement("input", {
            type: "hidden",
            name: "parameters",
            value: this.state.parameters
          }),
          children
        )
      );
    }
  }]);

  return CodeSandboxDeployer;
}(_react.Component);

exports.default = CodeSandboxDeployer;