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

function transform(source, options) {
  (_Options || _load_Options()).default.validateSourceOptions(options);

  // Parse the source code once, then reuse the root node
  var root = (0, (_jscodeshift || _load_jscodeshift()).default)(source, { parser: (0, (_getParser || _load_getParser()).default)('babylon') });

  // Add use-strict
  // TODO: implement this, make it configurable

  // Requires
  (0, (_transform2 || _load_transform2()).default)(root, options);

  var output = (0, (_printRoot || _load_printRoot()).default)(root);

  // Transform that operates on the raw string output.
  output = (0, (_transform || _load_transform()).default)(output, options);

  return output;
} /*
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   */

module.exports = transform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtLmpzIl0sIm5hbWVzIjpbInRyYW5zZm9ybSIsInNvdXJjZSIsIm9wdGlvbnMiLCJ2YWxpZGF0ZVNvdXJjZU9wdGlvbnMiLCJyb290IiwicGFyc2VyIiwib3V0cHV0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQVlBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUVBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQW1DQyxPQUFuQyxFQUFtRTtBQUNqRSx3Q0FBUUMscUJBQVIsQ0FBOEJELE9BQTlCOztBQUVBO0FBQ0EsTUFBTUUsT0FBTyxtREFBS0gsTUFBTCxFQUFhLEVBQUNJLFFBQVEsK0NBQVUsU0FBVixDQUFULEVBQWIsQ0FBYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQWtCRCxJQUFsQixFQUF3QkYsT0FBeEI7O0FBRUEsTUFBSUksU0FBUywrQ0FBVUYsSUFBVixDQUFiOztBQUVBO0FBQ0FFLFdBQVMsK0NBQWlCQSxNQUFqQixFQUF5QkosT0FBekIsQ0FBVDs7QUFFQSxTQUFPSSxNQUFQO0FBQ0QsQyxDQXRDRDs7Ozs7Ozs7OztBQXdDQUMsT0FBT0MsT0FBUCxHQUFpQlIsU0FBakIiLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcblxuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuaW1wb3J0IGdldFBhcnNlciBmcm9tICdqc2NvZGVzaGlmdC9kaXN0L2dldFBhcnNlcic7XG5cbmltcG9ydCBPcHRpb25zIGZyb20gJy4vb3B0aW9ucy9PcHRpb25zJztcbmltcG9ydCBudWNsaWRlVHJhbnNmb3JtIGZyb20gJy4vbnVjbGlkZS90cmFuc2Zvcm0nO1xuaW1wb3J0IHByaW50Um9vdCBmcm9tICcuL3V0aWxzL3ByaW50Um9vdCc7XG5pbXBvcnQgcmVxdWlyZXNUcmFuc2Zvcm0gZnJvbSAnLi9yZXF1aXJlcy90cmFuc2Zvcm0nO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm0oc291cmNlOiBzdHJpbmcsIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpOiBzdHJpbmcge1xuICBPcHRpb25zLnZhbGlkYXRlU291cmNlT3B0aW9ucyhvcHRpb25zKTtcblxuICAvLyBQYXJzZSB0aGUgc291cmNlIGNvZGUgb25jZSwgdGhlbiByZXVzZSB0aGUgcm9vdCBub2RlXG4gIGNvbnN0IHJvb3QgPSBqc2NzKHNvdXJjZSwge3BhcnNlcjogZ2V0UGFyc2VyKCdiYWJ5bG9uJyl9KTtcblxuICAvLyBBZGQgdXNlLXN0cmljdFxuICAvLyBUT0RPOiBpbXBsZW1lbnQgdGhpcywgbWFrZSBpdCBjb25maWd1cmFibGVcblxuICAvLyBSZXF1aXJlc1xuICByZXF1aXJlc1RyYW5zZm9ybShyb290LCBvcHRpb25zKTtcblxuICBsZXQgb3V0cHV0ID0gcHJpbnRSb290KHJvb3QpO1xuXG4gIC8vIFRyYW5zZm9ybSB0aGF0IG9wZXJhdGVzIG9uIHRoZSByYXcgc3RyaW5nIG91dHB1dC5cbiAgb3V0cHV0ID0gbnVjbGlkZVRyYW5zZm9ybShvdXRwdXQsIG9wdGlvbnMpO1xuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNmb3JtO1xuIl19