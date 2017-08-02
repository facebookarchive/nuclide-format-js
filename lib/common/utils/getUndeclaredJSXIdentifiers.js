'use strict';

var _getDeclaredIdentifiers = require('./getDeclaredIdentifiers');

var _getDeclaredIdentifiers2 = _interopRequireDefault(_getDeclaredIdentifiers);

var _getJSXIdentifiers = require('./getJSXIdentifiers');

var _getJSXIdentifiers2 = _interopRequireDefault(_getJSXIdentifiers);

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
  var declaredIdentifiers = (0, _getDeclaredIdentifiers2.default)(root, options);
  var jsxIdentifiers = (0, _getJSXIdentifiers2.default)(root);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0VW5kZWNsYXJlZEpTWElkZW50aWZpZXJzLmpzIl0sIm5hbWVzIjpbImdldFVuZGVjbGFyZWRKU1hJZGVudGlmaWVycyIsInJvb3QiLCJvcHRpb25zIiwiZGVjbGFyZWRJZGVudGlmaWVycyIsImpzeElkZW50aWZpZXJzIiwidW5kZWNsYXJlZCIsIlNldCIsImlkIiwiaGFzIiwiYWRkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFhQTs7OztBQUNBOzs7Ozs7QUFkQTs7Ozs7Ozs7OztBQWdCQSxTQUFTQSwyQkFBVCxDQUNFQyxJQURGLEVBRUVDLE9BRkYsRUFHZTtBQUNiLE1BQU1DLHNCQUFzQixzQ0FBdUJGLElBQXZCLEVBQTZCQyxPQUE3QixDQUE1QjtBQUNBLE1BQU1FLGlCQUFpQixpQ0FBa0JILElBQWxCLENBQXZCO0FBQ0EsTUFBTUksYUFBYSxJQUFJQyxHQUFKLEVBQW5CO0FBSGE7QUFBQTtBQUFBOztBQUFBO0FBSWIseUJBQWlCRixjQUFqQiw4SEFBaUM7QUFBQSxVQUF0QkcsRUFBc0I7O0FBQy9CLFVBQUksQ0FBQ0osb0JBQW9CSyxHQUFwQixDQUF3QkQsRUFBeEIsQ0FBTCxFQUFrQztBQUNoQ0YsbUJBQVdJLEdBQVgsQ0FBZUYsRUFBZjtBQUNEO0FBQ0Y7QUFSWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVNiLFNBQU9GLFVBQVA7QUFDRDs7QUFFREssT0FBT0MsT0FBUCxHQUFpQlgsMkJBQWpCIiwiZmlsZSI6ImdldFVuZGVjbGFyZWRKU1hJZGVudGlmaWVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9ufSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBnZXREZWNsYXJlZElkZW50aWZpZXJzIGZyb20gJy4vZ2V0RGVjbGFyZWRJZGVudGlmaWVycyc7XG5pbXBvcnQgZ2V0SlNYSWRlbnRpZmllcnMgZnJvbSAnLi9nZXRKU1hJZGVudGlmaWVycyc7XG5cbmZ1bmN0aW9uIGdldFVuZGVjbGFyZWRKU1hJZGVudGlmaWVycyhcbiAgcm9vdDogQ29sbGVjdGlvbixcbiAgb3B0aW9uczogU291cmNlT3B0aW9ucyxcbik6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgZGVjbGFyZWRJZGVudGlmaWVycyA9IGdldERlY2xhcmVkSWRlbnRpZmllcnMocm9vdCwgb3B0aW9ucyk7XG4gIGNvbnN0IGpzeElkZW50aWZpZXJzID0gZ2V0SlNYSWRlbnRpZmllcnMocm9vdCk7XG4gIGNvbnN0IHVuZGVjbGFyZWQgPSBuZXcgU2V0KCk7XG4gIGZvciAoY29uc3QgaWQgb2YganN4SWRlbnRpZmllcnMpIHtcbiAgICBpZiAoIWRlY2xhcmVkSWRlbnRpZmllcnMuaGFzKGlkKSkge1xuICAgICAgdW5kZWNsYXJlZC5hZGQoaWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWNsYXJlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRVbmRlY2xhcmVkSlNYSWRlbnRpZmllcnM7XG4iXX0=