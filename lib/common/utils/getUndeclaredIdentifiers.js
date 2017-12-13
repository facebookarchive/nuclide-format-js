'use strict';

var _getDeclaredIdentifiers;

function _load_getDeclaredIdentifiers() {
  return _getDeclaredIdentifiers = _interopRequireDefault(require('./getDeclaredIdentifiers'));
}

var _getNonDeclarationIdentifiers;

function _load_getNonDeclarationIdentifiers() {
  return _getNonDeclarationIdentifiers = _interopRequireDefault(require('./getNonDeclarationIdentifiers'));
}

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
  var declared = (0, (_getDeclaredIdentifiers || _load_getDeclaredIdentifiers()).default)(root, options);
  var undeclared = (0, (_getNonDeclarationIdentifiers || _load_getNonDeclarationIdentifiers()).default)(root, options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0VW5kZWNsYXJlZElkZW50aWZpZXJzLmpzIl0sIm5hbWVzIjpbImdldFVuZGVjbGFyZWRJZGVudGlmaWVycyIsInJvb3QiLCJvcHRpb25zIiwiZGVjbGFyZWQiLCJ1bmRlY2xhcmVkIiwibmFtZSIsImRlbGV0ZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFhQTtBQUFBO0FBQUE7Ozs7QUFDQTtBQUFBO0FBQUE7Ozs7QUFFQTs7O0FBaEJBOzs7Ozs7Ozs7O0FBbUJBLFNBQVNBLHdCQUFULENBQ0VDLElBREYsRUFFRUMsT0FGRixFQUdlO0FBQ2IsTUFBTUMsV0FBVyx5RUFBdUJGLElBQXZCLEVBQTZCQyxPQUE3QixDQUFqQjtBQUNBLE1BQU1FLGFBQWEscUZBQTZCSCxJQUE3QixFQUFtQ0MsT0FBbkMsQ0FBbkI7QUFDQTtBQUhhO0FBQUE7QUFBQTs7QUFBQTtBQUliLHlCQUFtQkMsUUFBbkIsOEhBQTZCO0FBQUEsVUFBbEJFLElBQWtCOztBQUMzQkQsaUJBQVdFLE1BQVgsQ0FBa0JELElBQWxCO0FBQ0Q7QUFOWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU9iLFNBQU9ELFVBQVA7QUFDRDs7QUFFREcsT0FBT0MsT0FBUCxHQUFpQlIsd0JBQWpCIiwiZmlsZSI6ImdldFVuZGVjbGFyZWRJZGVudGlmaWVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9ufSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBnZXREZWNsYXJlZElkZW50aWZpZXJzIGZyb20gJy4vZ2V0RGVjbGFyZWRJZGVudGlmaWVycyc7XG5pbXBvcnQgZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycyBmcm9tICcuL2dldE5vbkRlY2xhcmF0aW9uSWRlbnRpZmllcnMnO1xuXG4vKipcbiAqIFRoaXMgd2lsbCBnZXQgYSBsaXN0IG9mIGFsbCBpZGVudGlmaWVycyB0aGF0IGFyZSB1c2VkIGJ1dCB1bmRlY2xhcmVkLlxuICovXG5mdW5jdGlvbiBnZXRVbmRlY2xhcmVkSWRlbnRpZmllcnMoXG4gIHJvb3Q6IENvbGxlY3Rpb24sXG4gIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4pOiBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IGRlY2xhcmVkID0gZ2V0RGVjbGFyZWRJZGVudGlmaWVycyhyb290LCBvcHRpb25zKTtcbiAgY29uc3QgdW5kZWNsYXJlZCA9IGdldE5vbkRlY2xhcmF0aW9uSWRlbnRpZmllcnMocm9vdCwgb3B0aW9ucyk7XG4gIC8vIG5vdyByZW1vdmUgYW55dGhpbmcgdGhhdCB3YXMgZGVjbGFyZWRcbiAgZm9yIChjb25zdCBuYW1lIG9mIGRlY2xhcmVkKSB7XG4gICAgdW5kZWNsYXJlZC5kZWxldGUobmFtZSk7XG4gIH1cbiAgcmV0dXJuIHVuZGVjbGFyZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VW5kZWNsYXJlZElkZW50aWZpZXJzO1xuIl19