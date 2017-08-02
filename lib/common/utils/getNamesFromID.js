'use strict';

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

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

function getNamesFromID(node) {
  var ids = new Set();
  if (_jscodeshift2.default.Identifier.check(node) || _jscodeshift2.default.JSXIdentifier.check(node)) {
    ids.add(node.name);
  } else if (_jscodeshift2.default.RestElement.check(node) || _jscodeshift2.default.SpreadElement.check(node) || _jscodeshift2.default.SpreadProperty.check(node) || _jscodeshift2.default.RestProperty.check(node)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = getNamesFromID(node.argument)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var id = _step.value;

        ids.add(id);
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
  } else if (_jscodeshift2.default.ObjectPattern.check(node)) {
    node.properties.forEach(function (prop) {
      // Generally props have a value, if it is a spread property it doesn't.
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = getNamesFromID(prop.value || prop)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _id = _step2.value;

          ids.add(_id);
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
    });
  } else if (_jscodeshift2.default.ArrayPattern.check(node)) {
    node.elements.forEach(function (element) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = getNamesFromID(element)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _id2 = _step3.value;

          ids.add(_id2);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    });
  }
  return ids;
}

module.exports = getNamesFromID;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0TmFtZXNGcm9tSUQuanMiXSwibmFtZXMiOlsiZ2V0TmFtZXNGcm9tSUQiLCJub2RlIiwiaWRzIiwiU2V0IiwiSWRlbnRpZmllciIsImNoZWNrIiwiSlNYSWRlbnRpZmllciIsImFkZCIsIm5hbWUiLCJSZXN0RWxlbWVudCIsIlNwcmVhZEVsZW1lbnQiLCJTcHJlYWRQcm9wZXJ0eSIsIlJlc3RQcm9wZXJ0eSIsImFyZ3VtZW50IiwiaWQiLCJPYmplY3RQYXR0ZXJuIiwicHJvcGVydGllcyIsImZvckVhY2giLCJwcm9wIiwidmFsdWUiLCJBcnJheVBhdHRlcm4iLCJlbGVtZW50cyIsImVsZW1lbnQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQVlBOzs7Ozs7QUFaQTs7Ozs7Ozs7OztBQWNBLFNBQVNBLGNBQVQsQ0FBd0JDLElBQXhCLEVBQWlEO0FBQy9DLE1BQU1DLE1BQU0sSUFBSUMsR0FBSixFQUFaO0FBQ0EsTUFBSSxzQkFBS0MsVUFBTCxDQUFnQkMsS0FBaEIsQ0FBc0JKLElBQXRCLEtBQStCLHNCQUFLSyxhQUFMLENBQW1CRCxLQUFuQixDQUF5QkosSUFBekIsQ0FBbkMsRUFBbUU7QUFDakVDLFFBQUlLLEdBQUosQ0FBUU4sS0FBS08sSUFBYjtBQUNELEdBRkQsTUFFTyxJQUNMLHNCQUFLQyxXQUFMLENBQWlCSixLQUFqQixDQUF1QkosSUFBdkIsS0FDQSxzQkFBS1MsYUFBTCxDQUFtQkwsS0FBbkIsQ0FBeUJKLElBQXpCLENBREEsSUFFQSxzQkFBS1UsY0FBTCxDQUFvQk4sS0FBcEIsQ0FBMEJKLElBQTFCLENBRkEsSUFHQSxzQkFBS1csWUFBTCxDQUFrQlAsS0FBbEIsQ0FBd0JKLElBQXhCLENBSkssRUFLTDtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNBLDJCQUFpQkQsZUFBZUMsS0FBS1ksUUFBcEIsQ0FBakIsOEhBQWdEO0FBQUEsWUFBckNDLEVBQXFDOztBQUM5Q1osWUFBSUssR0FBSixDQUFRTyxFQUFSO0FBQ0Q7QUFIRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUQsR0FUTSxNQVNBLElBQUksc0JBQUtDLGFBQUwsQ0FBbUJWLEtBQW5CLENBQXlCSixJQUF6QixDQUFKLEVBQW9DO0FBQ3pDQSxTQUFLZSxVQUFMLENBQWdCQyxPQUFoQixDQUF3QixnQkFBUTtBQUM5QjtBQUQ4QjtBQUFBO0FBQUE7O0FBQUE7QUFFOUIsOEJBQWlCakIsZUFBZWtCLEtBQUtDLEtBQUwsSUFBY0QsSUFBN0IsQ0FBakIsbUlBQXFEO0FBQUEsY0FBMUNKLEdBQTBDOztBQUNuRFosY0FBSUssR0FBSixDQUFRTyxHQUFSO0FBQ0Q7QUFKNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUsvQixLQUxEO0FBTUQsR0FQTSxNQU9BLElBQUksc0JBQUtNLFlBQUwsQ0FBa0JmLEtBQWxCLENBQXdCSixJQUF4QixDQUFKLEVBQW1DO0FBQ3hDQSxTQUFLb0IsUUFBTCxDQUFjSixPQUFkLENBQXNCLG1CQUFXO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQy9CLDhCQUFpQmpCLGVBQWVzQixPQUFmLENBQWpCLG1JQUEwQztBQUFBLGNBQS9CUixJQUErQjs7QUFDeENaLGNBQUlLLEdBQUosQ0FBUU8sSUFBUjtBQUNEO0FBSDhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJaEMsS0FKRDtBQUtEO0FBQ0QsU0FBT1osR0FBUDtBQUNEOztBQUVEcUIsT0FBT0MsT0FBUCxHQUFpQnhCLGNBQWpCIiwiZmlsZSI6ImdldE5hbWVzRnJvbUlELmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge05vZGV9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCBqc2NzIGZyb20gJ2pzY29kZXNoaWZ0JztcblxuZnVuY3Rpb24gZ2V0TmFtZXNGcm9tSUQobm9kZTogTm9kZSk6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgaWRzID0gbmV3IFNldCgpO1xuICBpZiAoanNjcy5JZGVudGlmaWVyLmNoZWNrKG5vZGUpIHx8IGpzY3MuSlNYSWRlbnRpZmllci5jaGVjayhub2RlKSkge1xuICAgIGlkcy5hZGQobm9kZS5uYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICBqc2NzLlJlc3RFbGVtZW50LmNoZWNrKG5vZGUpIHx8XG4gICAganNjcy5TcHJlYWRFbGVtZW50LmNoZWNrKG5vZGUpIHx8XG4gICAganNjcy5TcHJlYWRQcm9wZXJ0eS5jaGVjayhub2RlKSB8fFxuICAgIGpzY3MuUmVzdFByb3BlcnR5LmNoZWNrKG5vZGUpXG4gICkge1xuICAgIGZvciAoY29uc3QgaWQgb2YgZ2V0TmFtZXNGcm9tSUQobm9kZS5hcmd1bWVudCkpIHtcbiAgICAgIGlkcy5hZGQoaWQpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChqc2NzLk9iamVjdFBhdHRlcm4uY2hlY2sobm9kZSkpIHtcbiAgICBub2RlLnByb3BlcnRpZXMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIC8vIEdlbmVyYWxseSBwcm9wcyBoYXZlIGEgdmFsdWUsIGlmIGl0IGlzIGEgc3ByZWFkIHByb3BlcnR5IGl0IGRvZXNuJ3QuXG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGdldE5hbWVzRnJvbUlEKHByb3AudmFsdWUgfHwgcHJvcCkpIHtcbiAgICAgICAgaWRzLmFkZChpZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoanNjcy5BcnJheVBhdHRlcm4uY2hlY2sobm9kZSkpIHtcbiAgICBub2RlLmVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGdldE5hbWVzRnJvbUlEKGVsZW1lbnQpKSB7XG4gICAgICAgIGlkcy5hZGQoaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBpZHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmFtZXNGcm9tSUQ7XG4iXX0=