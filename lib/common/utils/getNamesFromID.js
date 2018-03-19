'use strict';

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
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

function getNamesFromID(node) {
  var ids = new Set();
  if ((_jscodeshift || _load_jscodeshift()).default.Identifier.check(node) || (_jscodeshift || _load_jscodeshift()).default.JSXIdentifier.check(node)) {
    ids.add(node.name);
  } else if ((_jscodeshift || _load_jscodeshift()).default.RestElement.check(node) || (_jscodeshift || _load_jscodeshift()).default.SpreadElement.check(node) || (_jscodeshift || _load_jscodeshift()).default.SpreadProperty.check(node) || (_jscodeshift || _load_jscodeshift()).default.RestProperty.check(node)) {
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
  } else if ((_jscodeshift || _load_jscodeshift()).default.ObjectPattern.check(node)) {
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
  } else if ((_jscodeshift || _load_jscodeshift()).default.ArrayPattern.check(node)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0TmFtZXNGcm9tSUQuanMiXSwibmFtZXMiOlsiZ2V0TmFtZXNGcm9tSUQiLCJub2RlIiwiaWRzIiwiU2V0IiwiSWRlbnRpZmllciIsImNoZWNrIiwiSlNYSWRlbnRpZmllciIsImFkZCIsIm5hbWUiLCJSZXN0RWxlbWVudCIsIlNwcmVhZEVsZW1lbnQiLCJTcHJlYWRQcm9wZXJ0eSIsIlJlc3RQcm9wZXJ0eSIsImFyZ3VtZW50IiwiaWQiLCJPYmplY3RQYXR0ZXJuIiwicHJvcGVydGllcyIsImZvckVhY2giLCJwcm9wIiwidmFsdWUiLCJBcnJheVBhdHRlcm4iLCJlbGVtZW50cyIsImVsZW1lbnQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBWUE7QUFBQTtBQUFBOzs7O0FBWkE7Ozs7Ozs7Ozs7QUFjQSxTQUFTQSxjQUFULENBQXdCQyxJQUF4QixFQUFpRDtBQUMvQyxNQUFNQyxNQUFNLElBQUlDLEdBQUosRUFBWjtBQUNBLE1BQUksOENBQUtDLFVBQUwsQ0FBZ0JDLEtBQWhCLENBQXNCSixJQUF0QixLQUErQiw4Q0FBS0ssYUFBTCxDQUFtQkQsS0FBbkIsQ0FBeUJKLElBQXpCLENBQW5DLEVBQW1FO0FBQ2pFQyxRQUFJSyxHQUFKLENBQVFOLEtBQUtPLElBQWI7QUFDRCxHQUZELE1BRU8sSUFDTCw4Q0FBS0MsV0FBTCxDQUFpQkosS0FBakIsQ0FBdUJKLElBQXZCLEtBQ0EsOENBQUtTLGFBQUwsQ0FBbUJMLEtBQW5CLENBQXlCSixJQUF6QixDQURBLElBRUEsOENBQUtVLGNBQUwsQ0FBb0JOLEtBQXBCLENBQTBCSixJQUExQixDQUZBLElBR0EsOENBQUtXLFlBQUwsQ0FBa0JQLEtBQWxCLENBQXdCSixJQUF4QixDQUpLLEVBS0w7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDQSwyQkFBaUJELGVBQWVDLEtBQUtZLFFBQXBCLENBQWpCLDhIQUFnRDtBQUFBLFlBQXJDQyxFQUFxQzs7QUFDOUNaLFlBQUlLLEdBQUosQ0FBUU8sRUFBUjtBQUNEO0FBSEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlELEdBVE0sTUFTQSxJQUFJLDhDQUFLQyxhQUFMLENBQW1CVixLQUFuQixDQUF5QkosSUFBekIsQ0FBSixFQUFvQztBQUN6Q0EsU0FBS2UsVUFBTCxDQUFnQkMsT0FBaEIsQ0FBd0IsZ0JBQVE7QUFDOUI7QUFEOEI7QUFBQTtBQUFBOztBQUFBO0FBRTlCLDhCQUFpQmpCLGVBQWVrQixLQUFLQyxLQUFMLElBQWNELElBQTdCLENBQWpCLG1JQUFxRDtBQUFBLGNBQTFDSixHQUEwQzs7QUFDbkRaLGNBQUlLLEdBQUosQ0FBUU8sR0FBUjtBQUNEO0FBSjZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLL0IsS0FMRDtBQU1ELEdBUE0sTUFPQSxJQUFJLDhDQUFLTSxZQUFMLENBQWtCZixLQUFsQixDQUF3QkosSUFBeEIsQ0FBSixFQUFtQztBQUN4Q0EsU0FBS29CLFFBQUwsQ0FBY0osT0FBZCxDQUFzQixtQkFBVztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUMvQiw4QkFBaUJqQixlQUFlc0IsT0FBZixDQUFqQixtSUFBMEM7QUFBQSxjQUEvQlIsSUFBK0I7O0FBQ3hDWixjQUFJSyxHQUFKLENBQVFPLElBQVI7QUFDRDtBQUg4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSWhDLEtBSkQ7QUFLRDtBQUNELFNBQU9aLEdBQVA7QUFDRDs7QUFFRHFCLE9BQU9DLE9BQVAsR0FBaUJ4QixjQUFqQiIsImZpbGUiOiJnZXROYW1lc0Zyb21JRC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtOb2RlfSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQganNjcyBmcm9tICcuL2pzY29kZXNoaWZ0JztcblxuZnVuY3Rpb24gZ2V0TmFtZXNGcm9tSUQobm9kZTogTm9kZSk6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgaWRzID0gbmV3IFNldCgpO1xuICBpZiAoanNjcy5JZGVudGlmaWVyLmNoZWNrKG5vZGUpIHx8IGpzY3MuSlNYSWRlbnRpZmllci5jaGVjayhub2RlKSkge1xuICAgIGlkcy5hZGQobm9kZS5uYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICBqc2NzLlJlc3RFbGVtZW50LmNoZWNrKG5vZGUpIHx8XG4gICAganNjcy5TcHJlYWRFbGVtZW50LmNoZWNrKG5vZGUpIHx8XG4gICAganNjcy5TcHJlYWRQcm9wZXJ0eS5jaGVjayhub2RlKSB8fFxuICAgIGpzY3MuUmVzdFByb3BlcnR5LmNoZWNrKG5vZGUpXG4gICkge1xuICAgIGZvciAoY29uc3QgaWQgb2YgZ2V0TmFtZXNGcm9tSUQobm9kZS5hcmd1bWVudCkpIHtcbiAgICAgIGlkcy5hZGQoaWQpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChqc2NzLk9iamVjdFBhdHRlcm4uY2hlY2sobm9kZSkpIHtcbiAgICBub2RlLnByb3BlcnRpZXMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIC8vIEdlbmVyYWxseSBwcm9wcyBoYXZlIGEgdmFsdWUsIGlmIGl0IGlzIGEgc3ByZWFkIHByb3BlcnR5IGl0IGRvZXNuJ3QuXG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGdldE5hbWVzRnJvbUlEKHByb3AudmFsdWUgfHwgcHJvcCkpIHtcbiAgICAgICAgaWRzLmFkZChpZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoanNjcy5BcnJheVBhdHRlcm4uY2hlY2sobm9kZSkpIHtcbiAgICBub2RlLmVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIGdldE5hbWVzRnJvbUlEKGVsZW1lbnQpKSB7XG4gICAgICAgIGlkcy5hZGQoaWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBpZHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmFtZXNGcm9tSUQ7XG4iXX0=