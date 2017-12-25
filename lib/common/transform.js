'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
}

var _getParser;

function _load_getParser() {
  return _getParser = _interopRequireDefault(require('jscodeshift/dist/getParser'));
}

var _Options;

function _load_Options() {
  return _Options = _interopRequireDefault(require('./options/Options'));
}

var _transform;

function _load_transform() {
  return _transform = _interopRequireDefault(require('./nuclide/transform'));
}

var _printRoot;

function _load_printRoot() {
  return _printRoot = _interopRequireDefault(require('./utils/printRoot'));
}

var _transform2;

function _load_transform2() {
  return _transform2 = _interopRequireDefault(require('./requires/transform'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

function transform(source, options) {
  (_Options || _load_Options()).default.validateSourceOptions(options);

  // Parse the source code once, then reuse the root node
  var root = (0, (_jscodeshift || _load_jscodeshift()).default)(source, { parser: (0, (_getParser || _load_getParser()).default)('babylon') });

  // Add use-strict
  // TODO: implement this, make it configurable

  // Requires
  var info = (0, (_transform2 || _load_transform2()).default)(root, options);

  var output = (0, (_printRoot || _load_printRoot()).default)(root);

  // Transform that operates on the raw string output.
  output = (0, (_transform || _load_transform()).default)(output, options);

  return { output: output, info: info };
}

module.exports = transform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtLmpzIl0sIm5hbWVzIjpbInRyYW5zZm9ybSIsInNvdXJjZSIsIm9wdGlvbnMiLCJ2YWxpZGF0ZVNvdXJjZU9wdGlvbnMiLCJyb290IiwicGFyc2VyIiwiaW5mbyIsIm91dHB1dCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFhQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFFQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFuQkE7Ozs7Ozs7Ozs7QUFxQkEsU0FBU0EsU0FBVCxDQUNFQyxNQURGLEVBRUVDLE9BRkYsRUFHdUM7QUFDckMsd0NBQVFDLHFCQUFSLENBQThCRCxPQUE5Qjs7QUFFQTtBQUNBLE1BQU1FLE9BQU8sbURBQUtILE1BQUwsRUFBYSxFQUFDSSxRQUFRLCtDQUFVLFNBQVYsQ0FBVCxFQUFiLENBQWI7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLE1BQU1DLE9BQU8saURBQWtCRixJQUFsQixFQUF3QkYsT0FBeEIsQ0FBYjs7QUFFQSxNQUFJSyxTQUFTLCtDQUFVSCxJQUFWLENBQWI7O0FBRUE7QUFDQUcsV0FBUywrQ0FBaUJBLE1BQWpCLEVBQXlCTCxPQUF6QixDQUFUOztBQUVBLFNBQU8sRUFBQ0ssY0FBRCxFQUFTRCxVQUFULEVBQVA7QUFDRDs7QUFFREUsT0FBT0MsT0FBUCxHQUFpQlQsU0FBakIiLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcbmltcG9ydCB0eXBlIHtQYXJzaW5nSW5mb30gZnJvbSAnLi9yZXF1aXJlcy90cmFuc2Zvcm0nO1xuXG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5pbXBvcnQgZ2V0UGFyc2VyIGZyb20gJ2pzY29kZXNoaWZ0L2Rpc3QvZ2V0UGFyc2VyJztcblxuaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9vcHRpb25zL09wdGlvbnMnO1xuaW1wb3J0IG51Y2xpZGVUcmFuc2Zvcm0gZnJvbSAnLi9udWNsaWRlL3RyYW5zZm9ybSc7XG5pbXBvcnQgcHJpbnRSb290IGZyb20gJy4vdXRpbHMvcHJpbnRSb290JztcbmltcG9ydCByZXF1aXJlc1RyYW5zZm9ybSBmcm9tICcuL3JlcXVpcmVzL3RyYW5zZm9ybSc7XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybShcbiAgc291cmNlOiBzdHJpbmcsXG4gIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4pOiB7b3V0cHV0OiBzdHJpbmcsIGluZm86IFBhcnNpbmdJbmZvfSB7XG4gIE9wdGlvbnMudmFsaWRhdGVTb3VyY2VPcHRpb25zKG9wdGlvbnMpO1xuXG4gIC8vIFBhcnNlIHRoZSBzb3VyY2UgY29kZSBvbmNlLCB0aGVuIHJldXNlIHRoZSByb290IG5vZGVcbiAgY29uc3Qgcm9vdCA9IGpzY3Moc291cmNlLCB7cGFyc2VyOiBnZXRQYXJzZXIoJ2JhYnlsb24nKX0pO1xuXG4gIC8vIEFkZCB1c2Utc3RyaWN0XG4gIC8vIFRPRE86IGltcGxlbWVudCB0aGlzLCBtYWtlIGl0IGNvbmZpZ3VyYWJsZVxuXG4gIC8vIFJlcXVpcmVzXG4gIGNvbnN0IGluZm8gPSByZXF1aXJlc1RyYW5zZm9ybShyb290LCBvcHRpb25zKTtcblxuICBsZXQgb3V0cHV0ID0gcHJpbnRSb290KHJvb3QpO1xuXG4gIC8vIFRyYW5zZm9ybSB0aGF0IG9wZXJhdGVzIG9uIHRoZSByYXcgc3RyaW5nIG91dHB1dC5cbiAgb3V0cHV0ID0gbnVjbGlkZVRyYW5zZm9ybShvdXRwdXQsIG9wdGlvbnMpO1xuXG4gIHJldHVybiB7b3V0cHV0LCBpbmZvfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmFuc2Zvcm07XG4iXX0=