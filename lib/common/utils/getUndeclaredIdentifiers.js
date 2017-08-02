'use strict';

var _getDeclaredIdentifiers = require('./getDeclaredIdentifiers');

var _getDeclaredIdentifiers2 = _interopRequireDefault(_getDeclaredIdentifiers);

var _getNonDeclarationIdentifiers = require('./getNonDeclarationIdentifiers');

var _getNonDeclarationIdentifiers2 = _interopRequireDefault(_getNonDeclarationIdentifiers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This will get a list of all identifiers that are used but undeclared.
 */
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

function getUndeclaredIdentifiers(root, options) {
  var declared = (0, _getDeclaredIdentifiers2.default)(root, options);
  var undeclared = (0, _getNonDeclarationIdentifiers2.default)(root, options);
  // now remove anything that was declared
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = declared[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var name = _step.value;

      undeclared.delete(name);
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

module.exports = getUndeclaredIdentifiers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0VW5kZWNsYXJlZElkZW50aWZpZXJzLmpzIl0sIm5hbWVzIjpbImdldFVuZGVjbGFyZWRJZGVudGlmaWVycyIsInJvb3QiLCJvcHRpb25zIiwiZGVjbGFyZWQiLCJ1bmRlY2xhcmVkIiwibmFtZSIsImRlbGV0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBYUE7Ozs7QUFDQTs7Ozs7O0FBRUE7OztBQWhCQTs7Ozs7Ozs7OztBQW1CQSxTQUFTQSx3QkFBVCxDQUNFQyxJQURGLEVBRUVDLE9BRkYsRUFHZTtBQUNiLE1BQU1DLFdBQVcsc0NBQXVCRixJQUF2QixFQUE2QkMsT0FBN0IsQ0FBakI7QUFDQSxNQUFNRSxhQUFhLDRDQUE2QkgsSUFBN0IsRUFBbUNDLE9BQW5DLENBQW5CO0FBQ0E7QUFIYTtBQUFBO0FBQUE7O0FBQUE7QUFJYix5QkFBbUJDLFFBQW5CLDhIQUE2QjtBQUFBLFVBQWxCRSxJQUFrQjs7QUFDM0JELGlCQUFXRSxNQUFYLENBQWtCRCxJQUFsQjtBQUNEO0FBTlk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFPYixTQUFPRCxVQUFQO0FBQ0Q7O0FBRURHLE9BQU9DLE9BQVAsR0FBaUJSLHdCQUFqQiIsImZpbGUiOiJnZXRVbmRlY2xhcmVkSWRlbnRpZmllcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29sbGVjdGlvbn0gZnJvbSAnLi4vdHlwZXMvYXN0JztcbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG5pbXBvcnQgZ2V0RGVjbGFyZWRJZGVudGlmaWVycyBmcm9tICcuL2dldERlY2xhcmVkSWRlbnRpZmllcnMnO1xuaW1wb3J0IGdldE5vbkRlY2xhcmF0aW9uSWRlbnRpZmllcnMgZnJvbSAnLi9nZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzJztcblxuLyoqXG4gKiBUaGlzIHdpbGwgZ2V0IGEgbGlzdCBvZiBhbGwgaWRlbnRpZmllcnMgdGhhdCBhcmUgdXNlZCBidXQgdW5kZWNsYXJlZC5cbiAqL1xuZnVuY3Rpb24gZ2V0VW5kZWNsYXJlZElkZW50aWZpZXJzKFxuICByb290OiBDb2xsZWN0aW9uLFxuICBvcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuKTogU2V0PHN0cmluZz4ge1xuICBjb25zdCBkZWNsYXJlZCA9IGdldERlY2xhcmVkSWRlbnRpZmllcnMocm9vdCwgb3B0aW9ucyk7XG4gIGNvbnN0IHVuZGVjbGFyZWQgPSBnZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzKHJvb3QsIG9wdGlvbnMpO1xuICAvLyBub3cgcmVtb3ZlIGFueXRoaW5nIHRoYXQgd2FzIGRlY2xhcmVkXG4gIGZvciAoY29uc3QgbmFtZSBvZiBkZWNsYXJlZCkge1xuICAgIHVuZGVjbGFyZWQuZGVsZXRlKG5hbWUpO1xuICB9XG4gIHJldHVybiB1bmRlY2xhcmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFVuZGVjbGFyZWRJZGVudGlmaWVycztcbiJdfQ==