'use strict';

var _getJSXIdentifierName;

function _load_getJSXIdentifierName() {
  return _getJSXIdentifierName = _interopRequireDefault(require('./getJSXIdentifierName'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This will get a list of identifiers for JSXElements in the AST
 */
function getJSXIdentifiers(root) {
  var ids = new Set();
  root
  // There should be an opening element for every single closing element so
  // we can just look for opening ones
  .find((_jscodeshift || _load_jscodeshift()).default.JSXOpeningElement).forEach(function (path) {
    (0, (_getJSXIdentifierName || _load_getJSXIdentifierName()).default)(path).forEach(function (node) {
      ids.add(node.name);
    });
  });
  return ids;
} /*
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   */

module.exports = getJSXIdentifiers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0SlNYSWRlbnRpZmllcnMuanMiXSwibmFtZXMiOlsiZ2V0SlNYSWRlbnRpZmllcnMiLCJyb290IiwiaWRzIiwiU2V0IiwiZmluZCIsIkpTWE9wZW5pbmdFbGVtZW50IiwiZm9yRWFjaCIsInBhdGgiLCJhZGQiLCJub2RlIiwibmFtZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFFQTs7O0FBR0EsU0FBU0EsaUJBQVQsQ0FBMkJDLElBQTNCLEVBQTBEO0FBQ3hELE1BQU1DLE1BQU0sSUFBSUMsR0FBSixFQUFaO0FBQ0FGO0FBQ0U7QUFDQTtBQUZGLEdBR0dHLElBSEgsQ0FHUSw4Q0FBS0MsaUJBSGIsRUFJR0MsT0FKSCxDQUlXLGdCQUFRO0FBQ2YseUVBQXFCQyxJQUFyQixFQUEyQkQsT0FBM0IsQ0FBbUMsZ0JBQVE7QUFDekNKLFVBQUlNLEdBQUosQ0FBUUMsS0FBS0MsSUFBYjtBQUNELEtBRkQ7QUFHRCxHQVJIO0FBU0EsU0FBT1IsR0FBUDtBQUNELEMsQ0E5QkQ7Ozs7Ozs7Ozs7QUFnQ0FTLE9BQU9DLE9BQVAsR0FBaUJaLGlCQUFqQiIsImZpbGUiOiJnZXRKU1hJZGVudGlmaWVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9ufSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQgZ2V0SlNYSWRlbnRpZmllck5hbWUgZnJvbSAnLi9nZXRKU1hJZGVudGlmaWVyTmFtZSc7XG5pbXBvcnQganNjcyBmcm9tICcuL2pzY29kZXNoaWZ0JztcblxuLyoqXG4gKiBUaGlzIHdpbGwgZ2V0IGEgbGlzdCBvZiBpZGVudGlmaWVycyBmb3IgSlNYRWxlbWVudHMgaW4gdGhlIEFTVFxuICovXG5mdW5jdGlvbiBnZXRKU1hJZGVudGlmaWVycyhyb290OiBDb2xsZWN0aW9uKTogU2V0PHN0cmluZz4ge1xuICBjb25zdCBpZHMgPSBuZXcgU2V0KCk7XG4gIHJvb3RcbiAgICAvLyBUaGVyZSBzaG91bGQgYmUgYW4gb3BlbmluZyBlbGVtZW50IGZvciBldmVyeSBzaW5nbGUgY2xvc2luZyBlbGVtZW50IHNvXG4gICAgLy8gd2UgY2FuIGp1c3QgbG9vayBmb3Igb3BlbmluZyBvbmVzXG4gICAgLmZpbmQoanNjcy5KU1hPcGVuaW5nRWxlbWVudClcbiAgICAuZm9yRWFjaChwYXRoID0+IHtcbiAgICAgIGdldEpTWElkZW50aWZpZXJOYW1lKHBhdGgpLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIGlkcy5hZGQobm9kZS5uYW1lKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICByZXR1cm4gaWRzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEpTWElkZW50aWZpZXJzO1xuIl19