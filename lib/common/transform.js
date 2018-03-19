'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./utils/jscodeshift'));
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
  var root = (0, (_jscodeshift || _load_jscodeshift()).default)(source);

  // Add use-strict
  // TODO: implement this, make it configurable

  // Requires
  var info = (0, (_transform2 || _load_transform2()).default)(root, options);

  var output = (0, (_printRoot || _load_printRoot()).default)(root);

  // Transform that operates on the raw string output.
  output = (0, (_transform || _load_transform()).default)(output, options);

  return { output: output, info: info };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tb24vdHJhbnNmb3JtLmpzIl0sIm5hbWVzIjpbInRyYW5zZm9ybSIsInNvdXJjZSIsIm9wdGlvbnMiLCJ2YWxpZGF0ZVNvdXJjZU9wdGlvbnMiLCJyb290IiwiaW5mbyIsIm91dHB1dCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFhQTtBQUFBO0FBQUE7Ozs7QUFFQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFFQSxTQUFTQSxTQUFULENBQ0VDLE1BREYsRUFFRUMsT0FGRixFQUd1QztBQUNyQyx3Q0FBUUMscUJBQVIsQ0FBOEJELE9BQTlCOztBQUVBO0FBQ0EsTUFBTUUsT0FBTyxtREFBS0gsTUFBTCxDQUFiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNSSxPQUFPLGlEQUFrQkQsSUFBbEIsRUFBd0JGLE9BQXhCLENBQWI7O0FBRUEsTUFBSUksU0FBUywrQ0FBVUYsSUFBVixDQUFiOztBQUVBO0FBQ0FFLFdBQVMsK0NBQWlCQSxNQUFqQixFQUF5QkosT0FBekIsQ0FBVDs7QUFFQSxTQUFPLEVBQUNJLGNBQUQsRUFBU0QsVUFBVCxFQUFQO0FBQ0QsQyxDQXpDRDs7Ozs7Ozs7OztBQTJDQUUsT0FBT0MsT0FBUCxHQUFpQlIsU0FBakIiLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcbmltcG9ydCB0eXBlIHtQYXJzaW5nSW5mb30gZnJvbSAnLi9yZXF1aXJlcy90cmFuc2Zvcm0nO1xuXG5pbXBvcnQganNjcyBmcm9tICcuL3V0aWxzL2pzY29kZXNoaWZ0JztcblxuaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi9vcHRpb25zL09wdGlvbnMnO1xuaW1wb3J0IG51Y2xpZGVUcmFuc2Zvcm0gZnJvbSAnLi9udWNsaWRlL3RyYW5zZm9ybSc7XG5pbXBvcnQgcHJpbnRSb290IGZyb20gJy4vdXRpbHMvcHJpbnRSb290JztcbmltcG9ydCByZXF1aXJlc1RyYW5zZm9ybSBmcm9tICcuL3JlcXVpcmVzL3RyYW5zZm9ybSc7XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybShcbiAgc291cmNlOiBzdHJpbmcsXG4gIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4pOiB7b3V0cHV0OiBzdHJpbmcsIGluZm86IFBhcnNpbmdJbmZvfSB7XG4gIE9wdGlvbnMudmFsaWRhdGVTb3VyY2VPcHRpb25zKG9wdGlvbnMpO1xuXG4gIC8vIFBhcnNlIHRoZSBzb3VyY2UgY29kZSBvbmNlLCB0aGVuIHJldXNlIHRoZSByb290IG5vZGVcbiAgY29uc3Qgcm9vdCA9IGpzY3Moc291cmNlKTtcblxuICAvLyBBZGQgdXNlLXN0cmljdFxuICAvLyBUT0RPOiBpbXBsZW1lbnQgdGhpcywgbWFrZSBpdCBjb25maWd1cmFibGVcblxuICAvLyBSZXF1aXJlc1xuICBjb25zdCBpbmZvID0gcmVxdWlyZXNUcmFuc2Zvcm0ocm9vdCwgb3B0aW9ucyk7XG5cbiAgbGV0IG91dHB1dCA9IHByaW50Um9vdChyb290KTtcblxuICAvLyBUcmFuc2Zvcm0gdGhhdCBvcGVyYXRlcyBvbiB0aGUgcmF3IHN0cmluZyBvdXRwdXQuXG4gIG91dHB1dCA9IG51Y2xpZGVUcmFuc2Zvcm0ob3V0cHV0LCBvcHRpb25zKTtcblxuICByZXR1cm4ge291dHB1dCwgaW5mb307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhbnNmb3JtO1xuIl19