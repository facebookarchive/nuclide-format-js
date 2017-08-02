'use strict';

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

var _getParser = require('jscodeshift/dist/getParser');

var _getParser2 = _interopRequireDefault(_getParser);

var _Options = require('./options/Options');

var _Options2 = _interopRequireDefault(_Options);

var _transform = require('./nuclide/transform');

var _transform2 = _interopRequireDefault(_transform);

var _printRoot = require('./utils/printRoot');

var _printRoot2 = _interopRequireDefault(_printRoot);

var _transform3 = require('./requires/transform');

var _transform4 = _interopRequireDefault(_transform3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transform(source, options) {
  _Options2.default.validateSourceOptions(options);

  // Parse the source code once, then reuse the root node
  var root = (0, _jscodeshift2.default)(source, { parser: (0, _getParser2.default)('babylon') });

  // Add use-strict
  // TODO: implement this, make it configurable

  // Requires
  (0, _transform4.default)(root, options);

  var output = (0, _printRoot2.default)(root);

  // Transform that operates on the raw string output.
  output = (0, _transform2.default)(output, options);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtLmpzIl0sIm5hbWVzIjpbInRyYW5zZm9ybSIsInNvdXJjZSIsIm9wdGlvbnMiLCJ2YWxpZGF0ZVNvdXJjZU9wdGlvbnMiLCJyb290IiwicGFyc2VyIiwib3V0cHV0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFZQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQW1DQyxPQUFuQyxFQUFtRTtBQUNqRSxvQkFBUUMscUJBQVIsQ0FBOEJELE9BQTlCOztBQUVBO0FBQ0EsTUFBTUUsT0FBTywyQkFBS0gsTUFBTCxFQUFhLEVBQUNJLFFBQVEseUJBQVUsU0FBVixDQUFULEVBQWIsQ0FBYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMkJBQWtCRCxJQUFsQixFQUF3QkYsT0FBeEI7O0FBRUEsTUFBSUksU0FBUyx5QkFBVUYsSUFBVixDQUFiOztBQUVBO0FBQ0FFLFdBQVMseUJBQWlCQSxNQUFqQixFQUF5QkosT0FBekIsQ0FBVDs7QUFFQSxTQUFPSSxNQUFQO0FBQ0QsQyxDQXRDRDs7Ozs7Ozs7OztBQXdDQUMsT0FBT0MsT0FBUCxHQUFpQlIsU0FBakIiLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcblxuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuaW1wb3J0IGdldFBhcnNlciBmcm9tICdqc2NvZGVzaGlmdC9kaXN0L2dldFBhcnNlcic7XG5cbmltcG9ydCBPcHRpb25zIGZyb20gJy4vb3B0aW9ucy9PcHRpb25zJztcbmltcG9ydCBudWNsaWRlVHJhbnNmb3JtIGZyb20gJy4vbnVjbGlkZS90cmFuc2Zvcm0nO1xuaW1wb3J0IHByaW50Um9vdCBmcm9tICcuL3V0aWxzL3ByaW50Um9vdCc7XG5pbXBvcnQgcmVxdWlyZXNUcmFuc2Zvcm0gZnJvbSAnLi9yZXF1aXJlcy90cmFuc2Zvcm0nO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm0oc291cmNlOiBzdHJpbmcsIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpOiBzdHJpbmcge1xuICBPcHRpb25zLnZhbGlkYXRlU291cmNlT3B0aW9ucyhvcHRpb25zKTtcblxuICAvLyBQYXJzZSB0aGUgc291cmNlIGNvZGUgb25jZSwgdGhlbiByZXVzZSB0aGUgcm9vdCBub2RlXG4gIGNvbnN0IHJvb3QgPSBqc2NzKHNvdXJjZSwge3BhcnNlcjogZ2V0UGFyc2VyKCdiYWJ5bG9uJyl9KTtcblxuICAvLyBBZGQgdXNlLXN0cmljdFxuICAvLyBUT0RPOiBpbXBsZW1lbnQgdGhpcywgbWFrZSBpdCBjb25maWd1cmFibGVcblxuICAvLyBSZXF1aXJlc1xuICByZXF1aXJlc1RyYW5zZm9ybShyb290LCBvcHRpb25zKTtcblxuICBsZXQgb3V0cHV0ID0gcHJpbnRSb290KHJvb3QpO1xuXG4gIC8vIFRyYW5zZm9ybSB0aGF0IG9wZXJhdGVzIG9uIHRoZSByYXcgc3RyaW5nIG91dHB1dC5cbiAgb3V0cHV0ID0gbnVjbGlkZVRyYW5zZm9ybShvdXRwdXQsIG9wdGlvbnMpO1xuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNmb3JtO1xuIl19