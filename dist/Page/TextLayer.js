'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../shared/utils');

var _propTypes3 = require('../shared/propTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Render disproportion above which font will be considered broken and fallback will be used
var BROKEN_FONT_ALARM_THRESHOLD = 0.1;

var TextLayer = function (_Component) {
  (0, _inherits3.default)(TextLayer, _Component);

  function TextLayer() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, TextLayer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = TextLayer.__proto__ || (0, _getPrototypeOf2.default)(TextLayer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      textItems: null
    }, _this.onGetTextSuccess = function (textContent) {
      var textItems = null;
      if (textContent) {
        textItems = textContent.items;
      }

      (0, _utils.callIfDefined)(_this.context.onGetTextSuccess, textItems);

      _this.setState({ textItems: textItems });
    }, _this.onGetTextError = function (error) {
      if (error.name === 'RenderingCancelledException' || error.name === 'PromiseCancelledException') {
        return;
      }

      (0, _utils.errorOnDev)(error.message, error);

      (0, _utils.callIfDefined)(_this.context.onGetTextError, error);

      _this.setState({ textItems: false });
    }, _this.getElementWidth = function (element) {
      var _this2 = _this,
          sideways = _this2.sideways;

      return element.getBoundingClientRect()[sideways ? 'height' : 'width'];
    }, _this.renderTextItem = function (textItem, itemIndex) {
      var _this3 = _this,
          viewport = _this3.unrotatedViewport,
          defaultSideways = _this3.defaultSideways;
      var scale = _this.context.scale;

      var _viewport$viewBox = (0, _slicedToArray3.default)(viewport.viewBox, 4),
          xMin = _viewport$viewBox[0],
          yMin = _viewport$viewBox[1],
          /* xMax */yMax = _viewport$viewBox[3];

      var fontName = textItem.fontName,
          transform = textItem.transform;

      var _transform = (0, _slicedToArray3.default)(transform, 6),
          fontHeightPx = _transform[0],
          fontWidthPx = _transform[1],
          offsetX = _transform[2],
          offsetY = _transform[3],
          x = _transform[4],
          y = _transform[5];

      var fontSizePx = defaultSideways ? fontWidthPx : fontHeightPx;
      var top = defaultSideways ? x + offsetX : yMax - yMin - (y + offsetY);
      var left = defaultSideways ? y : x;

      var fontSize = fontSizePx * scale + 'px';

      return _react2.default.createElement(
        'div',
        {
          key: itemIndex,
          style: {
            height: '1em',
            fontFamily: fontName,
            fontSize: fontSize,
            position: 'absolute',
            top: (top + yMin) * scale + 'px',
            left: (left - xMin) * scale + 'px',
            transformOrigin: 'left bottom',
            whiteSpace: 'pre',
            pointerEvents: 'all'
          },
          ref: function ref(_ref2) {
            if (!_ref2) {
              return;
            }

            _this.alignTextItem(_ref2, textItem);
          }
        },
        textItem.str
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(TextLayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getTextContent();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps, nextContext) {
      if (nextContext.page !== this.context.page) {
        this.getTextContent(nextContext);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      (0, _utils.cancelRunningTask)(this.runningTask);
    }
  }, {
    key: 'getTextContent',
    value: function getTextContent() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.context;
      var page = context.page;


      if (!page) {
        throw new Error('Attempted to load page text content, but no page was specified.');
      }

      if (this.state.textItems !== null) {
        this.setState({ textItems: null });
      }

      this.runningTask = (0, _utils.makeCancellable)(page.getTextContent());

      return this.runningTask.promise.then(this.onGetTextSuccess).catch(this.onGetTextError);
    }
  }, {
    key: 'getFontData',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(fontFamily) {
        var page, font;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                page = this.context.page;
                _context.next = 3;
                return page.commonObjs.ensureObj(fontFamily);

              case 3:
                font = _context.sent;
                return _context.abrupt('return', font.data);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getFontData(_x2) {
        return _ref3.apply(this, arguments);
      }

      return getFontData;
    }()
  }, {
    key: 'alignTextItem',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(element, textItem) {
        var scale, targetWidth, fontData, actualWidth, widthDisproportion, repairsNeeded, fallbackFontName, ascent;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (element) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return');

              case 2:

                element.style.transform = '';

                scale = this.props.scale;
                targetWidth = textItem.width * scale;
                _context2.next = 7;
                return this.getFontData(textItem.fontName);

              case 7:
                fontData = _context2.sent;
                actualWidth = this.getElementWidth(element);
                widthDisproportion = Math.abs(targetWidth / actualWidth - 1);
                repairsNeeded = widthDisproportion > BROKEN_FONT_ALARM_THRESHOLD;

                if (repairsNeeded) {
                  fallbackFontName = fontData ? fontData.fallbackName : 'sans-serif';

                  element.style.fontFamily = fallbackFontName;

                  actualWidth = this.getElementWidth(element);
                }

                ascent = fontData ? fontData.ascent : 1;

                element.style.transform = 'scaleX(' + targetWidth / actualWidth + ') translateY(' + (1 - ascent) * 100 + '%)';

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function alignTextItem(_x3, _x4) {
        return _ref4.apply(this, arguments);
      }

      return alignTextItem;
    }()
  }, {
    key: 'renderTextItems',
    value: function renderTextItems() {
      var textItems = this.state.textItems;


      if (!textItems) {
        return null;
      }

      return textItems.map(this.renderTextItem);
    }
  }, {
    key: 'render',
    value: function render() {
      var viewport = this.unrotatedViewport,
          rotate = this.rotate;


      return _react2.default.createElement(
        'div',
        {
          className: 'react-pdf__Page__textContent',
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: viewport.width + 'px',
            height: viewport.height + 'px',
            color: 'transparent',
            transform: 'translate(-50%, -50%) rotate(' + rotate + 'deg)',
            pointerEvents: 'none'
          }
        },
        this.renderTextItems()
      );
    }
  }, {
    key: 'unrotatedViewport',
    get: function get() {
      var _context3 = this.context,
          page = _context3.page,
          scale = _context3.scale;


      return page.getViewport(scale);
    }

    /**
     * It might happen that the page is rotated by default. In such cases, we shouldn't rotate
     * text content.
     */

  }, {
    key: 'rotate',
    get: function get() {
      var _context4 = this.context,
          page = _context4.page,
          rotate = _context4.rotate;

      return rotate - page.rotate;
    }
  }, {
    key: 'sideways',
    get: function get() {
      var rotate = this.rotate;

      return rotate % 180 !== 0;
    }
  }, {
    key: 'defaultSideways',
    get: function get() {
      var rotation = this.unrotatedViewport.rotation;

      return rotation % 180 !== 0;
    }
  }]);
  return TextLayer;
}(_react.Component);

exports.default = TextLayer;


TextLayer.contextTypes = {
  onGetTextError: _propTypes2.default.func,
  onGetTextSuccess: _propTypes2.default.func,
  page: _propTypes3.isPage.isRequired,
  rotate: _propTypes3.isRotate,
  scale: _propTypes2.default.number
};