'use strict';

var _getDeclaredIdentifiers;

function _load_getDeclaredIdentifiers() {
  return _getDeclaredIdentifiers = _interopRequireDefault(require('./getDeclaredIdentifiers'));
}

var _getDeclaredTypes;

function _load_getDeclaredTypes() {
  return _getDeclaredTypes = _interopRequireDefault(require('./getDeclaredTypes'));
}

var _getNonDeclarationTypes;

function _load_getNonDeclarationTypes() {
  return _getNonDeclarationTypes = _interopRequireDefault(require('./getNonDeclarationTypes'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This will get a list of all types that are used but undeclared.
 */
function getUndeclaredTypes(root, options) {
  var declaredIdentifiers = (0, (_getDeclaredIdentifiers || _load_getDeclaredIdentifiers()).default)(root, options);
  var declaredTypes = (0, (_getDeclaredTypes || _load_getDeclaredTypes()).default)(root, options);

  var undeclared = (0, (_getNonDeclarationTypes || _load_getNonDeclarationTypes()).default)(root);
  // now remove anything that was declared
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = declaredIdentifiers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = declaredTypes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _name = _step2.value;

      undeclared.delete(_name);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return undeclared;
} /*
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   */

module.exports = getUndeclaredTypes;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0VW5kZWNsYXJlZFR5cGVzLmpzIl0sIm5hbWVzIjpbImdldFVuZGVjbGFyZWRUeXBlcyIsInJvb3QiLCJvcHRpb25zIiwiZGVjbGFyZWRJZGVudGlmaWVycyIsImRlY2xhcmVkVHlwZXMiLCJ1bmRlY2xhcmVkIiwibmFtZSIsImRlbGV0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFhQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFFQTs7O0FBR0EsU0FBU0Esa0JBQVQsQ0FDRUMsSUFERixFQUVFQyxPQUZGLEVBR2U7QUFDYixNQUFNQyxzQkFBc0IseUVBQXVCRixJQUF2QixFQUE2QkMsT0FBN0IsQ0FBNUI7QUFDQSxNQUFNRSxnQkFBZ0IsNkRBQWlCSCxJQUFqQixFQUF1QkMsT0FBdkIsQ0FBdEI7O0FBRUEsTUFBTUcsYUFBYSx5RUFBdUJKLElBQXZCLENBQW5CO0FBQ0E7QUFMYTtBQUFBO0FBQUE7O0FBQUE7QUFNYix5QkFBbUJFLG1CQUFuQiw4SEFBd0M7QUFBQSxVQUE3QkcsSUFBNkI7O0FBQ3RDRCxpQkFBV0UsTUFBWCxDQUFrQkQsSUFBbEI7QUFDRDtBQVJZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBU2IsMEJBQW1CRixhQUFuQixtSUFBa0M7QUFBQSxVQUF2QkUsS0FBdUI7O0FBQ2hDRCxpQkFBV0UsTUFBWCxDQUFrQkQsS0FBbEI7QUFDRDtBQVhZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBWWIsU0FBT0QsVUFBUDtBQUNELEMsQ0FwQ0Q7Ozs7Ozs7Ozs7QUFzQ0FHLE9BQU9DLE9BQVAsR0FBaUJULGtCQUFqQiIsImZpbGUiOiJnZXRVbmRlY2xhcmVkVHlwZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29sbGVjdGlvbn0gZnJvbSAnLi4vdHlwZXMvYXN0JztcbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG5pbXBvcnQgZ2V0RGVjbGFyZWRJZGVudGlmaWVycyBmcm9tICcuL2dldERlY2xhcmVkSWRlbnRpZmllcnMnO1xuaW1wb3J0IGdldERlY2xhcmVkVHlwZXMgZnJvbSAnLi9nZXREZWNsYXJlZFR5cGVzJztcbmltcG9ydCBnZXROb25EZWNsYXJhdGlvblR5cGVzIGZyb20gJy4vZ2V0Tm9uRGVjbGFyYXRpb25UeXBlcyc7XG5cbi8qKlxuICogVGhpcyB3aWxsIGdldCBhIGxpc3Qgb2YgYWxsIHR5cGVzIHRoYXQgYXJlIHVzZWQgYnV0IHVuZGVjbGFyZWQuXG4gKi9cbmZ1bmN0aW9uIGdldFVuZGVjbGFyZWRUeXBlcyhcbiAgcm9vdDogQ29sbGVjdGlvbixcbiAgb3B0aW9uczogU291cmNlT3B0aW9ucyxcbik6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgZGVjbGFyZWRJZGVudGlmaWVycyA9IGdldERlY2xhcmVkSWRlbnRpZmllcnMocm9vdCwgb3B0aW9ucyk7XG4gIGNvbnN0IGRlY2xhcmVkVHlwZXMgPSBnZXREZWNsYXJlZFR5cGVzKHJvb3QsIG9wdGlvbnMpO1xuXG4gIGNvbnN0IHVuZGVjbGFyZWQgPSBnZXROb25EZWNsYXJhdGlvblR5cGVzKHJvb3QpO1xuICAvLyBub3cgcmVtb3ZlIGFueXRoaW5nIHRoYXQgd2FzIGRlY2xhcmVkXG4gIGZvciAoY29uc3QgbmFtZSBvZiBkZWNsYXJlZElkZW50aWZpZXJzKSB7XG4gICAgdW5kZWNsYXJlZC5kZWxldGUobmFtZSk7XG4gIH1cbiAgZm9yIChjb25zdCBuYW1lIG9mIGRlY2xhcmVkVHlwZXMpIHtcbiAgICB1bmRlY2xhcmVkLmRlbGV0ZShuYW1lKTtcbiAgfVxuICByZXR1cm4gdW5kZWNsYXJlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRVbmRlY2xhcmVkVHlwZXM7XG4iXX0=