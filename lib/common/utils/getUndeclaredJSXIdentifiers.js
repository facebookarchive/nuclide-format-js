'use strict';

var _getDeclaredIdentifiers;

function _load_getDeclaredIdentifiers() {
  return _getDeclaredIdentifiers = _interopRequireDefault(require('./getDeclaredIdentifiers'));
}

var _getJSXIdentifiers;

function _load_getJSXIdentifiers() {
  return _getJSXIdentifiers = _interopRequireDefault(require('./getJSXIdentifiers'));
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

function getUndeclaredJSXIdentifiers(root, options) {
  var declaredIdentifiers = (0, (_getDeclaredIdentifiers || _load_getDeclaredIdentifiers()).default)(root, options);
  var jsxIdentifiers = (0, (_getJSXIdentifiers || _load_getJSXIdentifiers()).default)(root);
  var undeclared = new Set();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = jsxIdentifiers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var id = _step.value;

      if (!declaredIdentifiers.has(id)) {
        undeclared.add(id);
      }
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

  return undeclared;
}

module.exports = getUndeclaredJSXIdentifiers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0VW5kZWNsYXJlZEpTWElkZW50aWZpZXJzLmpzIl0sIm5hbWVzIjpbImdldFVuZGVjbGFyZWRKU1hJZGVudGlmaWVycyIsInJvb3QiLCJvcHRpb25zIiwiZGVjbGFyZWRJZGVudGlmaWVycyIsImpzeElkZW50aWZpZXJzIiwidW5kZWNsYXJlZCIsIlNldCIsImlkIiwiaGFzIiwiYWRkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQWFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQWRBOzs7Ozs7Ozs7O0FBZ0JBLFNBQVNBLDJCQUFULENBQ0VDLElBREYsRUFFRUMsT0FGRixFQUdlO0FBQ2IsTUFBTUMsc0JBQXNCLHlFQUF1QkYsSUFBdkIsRUFBNkJDLE9BQTdCLENBQTVCO0FBQ0EsTUFBTUUsaUJBQWlCLCtEQUFrQkgsSUFBbEIsQ0FBdkI7QUFDQSxNQUFNSSxhQUFhLElBQUlDLEdBQUosRUFBbkI7QUFIYTtBQUFBO0FBQUE7O0FBQUE7QUFJYix5QkFBaUJGLGNBQWpCLDhIQUFpQztBQUFBLFVBQXRCRyxFQUFzQjs7QUFDL0IsVUFBSSxDQUFDSixvQkFBb0JLLEdBQXBCLENBQXdCRCxFQUF4QixDQUFMLEVBQWtDO0FBQ2hDRixtQkFBV0ksR0FBWCxDQUFlRixFQUFmO0FBQ0Q7QUFDRjtBQVJZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBU2IsU0FBT0YsVUFBUDtBQUNEOztBQUVESyxPQUFPQyxPQUFQLEdBQWlCWCwyQkFBakIiLCJmaWxlIjoiZ2V0VW5kZWNsYXJlZEpTWElkZW50aWZpZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb259IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcblxuaW1wb3J0IGdldERlY2xhcmVkSWRlbnRpZmllcnMgZnJvbSAnLi9nZXREZWNsYXJlZElkZW50aWZpZXJzJztcbmltcG9ydCBnZXRKU1hJZGVudGlmaWVycyBmcm9tICcuL2dldEpTWElkZW50aWZpZXJzJztcblxuZnVuY3Rpb24gZ2V0VW5kZWNsYXJlZEpTWElkZW50aWZpZXJzKFxuICByb290OiBDb2xsZWN0aW9uLFxuICBvcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuKTogU2V0PHN0cmluZz4ge1xuICBjb25zdCBkZWNsYXJlZElkZW50aWZpZXJzID0gZ2V0RGVjbGFyZWRJZGVudGlmaWVycyhyb290LCBvcHRpb25zKTtcbiAgY29uc3QganN4SWRlbnRpZmllcnMgPSBnZXRKU1hJZGVudGlmaWVycyhyb290KTtcbiAgY29uc3QgdW5kZWNsYXJlZCA9IG5ldyBTZXQoKTtcbiAgZm9yIChjb25zdCBpZCBvZiBqc3hJZGVudGlmaWVycykge1xuICAgIGlmICghZGVjbGFyZWRJZGVudGlmaWVycy5oYXMoaWQpKSB7XG4gICAgICB1bmRlY2xhcmVkLmFkZChpZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlY2xhcmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFVuZGVjbGFyZWRKU1hJZGVudGlmaWVycztcbiJdfQ==