'use strict';

var _getDeclaredIdentifiers = require('../utils/getDeclaredIdentifiers');

var _getDeclaredIdentifiers2 = _interopRequireDefault(_getDeclaredIdentifiers);

var _getNonDeclarationIdentifiers = require('../utils/getNonDeclarationIdentifiers');

var _getNonDeclarationIdentifiers2 = _interopRequireDefault(_getNonDeclarationIdentifiers);

var _hasOneRequireDeclaration = require('../utils/hasOneRequireDeclaration');

var _hasOneRequireDeclaration2 = _interopRequireDefault(_hasOneRequireDeclaration);

var _isGlobal = require('../utils/isGlobal');

var _isGlobal2 = _interopRequireDefault(_isGlobal);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeUnusedRequires(root, options) {
  var used = (0, _getNonDeclarationIdentifiers2.default)(root, options);
  var nonRequires = (0, _getDeclaredIdentifiers2.default)(root, options, [function (path) {
    return !(0, _hasOneRequireDeclaration2.default)(path.node);
  }]);

  _jscodeshift2.default.types.visit(root.nodes()[0], {
    visitVariableDeclaration: function visitVariableDeclaration(path) {
      if ((0, _isGlobal2.default)(path) && (0, _hasOneRequireDeclaration2.default)(path.node)) {
        pruneNames(path, used, nonRequires);
      }
      // don't traverse this path, there cannot be a toplevel
      // declaration inside of it
      return false;
    }
  });
}

// Similar to `getNamesFromID`
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

function pruneNames(path, used, nonRequires) {
  var node = path.node;
  var ids = new Set();
  if (_jscodeshift2.default.Identifier.check(node)) {
    ids.add(node.name);
  } else if (_jscodeshift2.default.RestElement.check(node) || _jscodeshift2.default.SpreadElement.check(node) || _jscodeshift2.default.SpreadProperty.check(node) || _jscodeshift2.default.RestProperty.check(node)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = pruneNames(path.get('argument'), used, nonRequires)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
  } else if (_jscodeshift2.default.Property.check(node) || _jscodeshift2.default.ObjectProperty.check(node)) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = pruneNames(path.get('value'), used, nonRequires)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
  } else if (_jscodeshift2.default.ObjectPattern.check(node)) {
    var properties = path.get('properties');
    for (var i = node.properties.length - 1; i >= 0; i--) {
      var propPath = properties.get(i);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = pruneNames(propPath, used, nonRequires)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
    }
  } else if (_jscodeshift2.default.ArrayPattern.check(node)) {
    var elements = path.get('elements');
    for (var _i = node.elements.length - 1; _i >= 0; _i--) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = pruneNames(elements.get(_i), used, nonRequires)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _id3 = _step4.value;

          ids.add(_id3);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  } else if (_jscodeshift2.default.VariableDeclaration.check(node)) {
    var idPath = path.get('declarations').get(0).get('id');
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = pruneNames(idPath, used, nonRequires)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _id4 = _step5.value;

        ids.add(_id4);
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }
  }

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = ids[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var name = _step6.value;

      if (used.has(name) && !nonRequires.has(name)) {
        return ids;
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  path.prune();

  return ids;
}

module.exports = removeUnusedRequires;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvcmVtb3ZlVW51c2VkUmVxdWlyZXMuanMiXSwibmFtZXMiOlsicmVtb3ZlVW51c2VkUmVxdWlyZXMiLCJyb290Iiwib3B0aW9ucyIsInVzZWQiLCJub25SZXF1aXJlcyIsInBhdGgiLCJub2RlIiwidHlwZXMiLCJ2aXNpdCIsIm5vZGVzIiwidmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uIiwicHJ1bmVOYW1lcyIsImlkcyIsIlNldCIsIklkZW50aWZpZXIiLCJjaGVjayIsImFkZCIsIm5hbWUiLCJSZXN0RWxlbWVudCIsIlNwcmVhZEVsZW1lbnQiLCJTcHJlYWRQcm9wZXJ0eSIsIlJlc3RQcm9wZXJ0eSIsImdldCIsImlkIiwiUHJvcGVydHkiLCJPYmplY3RQcm9wZXJ0eSIsIk9iamVjdFBhdHRlcm4iLCJwcm9wZXJ0aWVzIiwiaSIsImxlbmd0aCIsInByb3BQYXRoIiwiQXJyYXlQYXR0ZXJuIiwiZWxlbWVudHMiLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiaWRQYXRoIiwiaGFzIiwicHJ1bmUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQWFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNBLG9CQUFULENBQ0VDLElBREYsRUFFRUMsT0FGRixFQUdRO0FBQ04sTUFBTUMsT0FBTyw0Q0FBNkJGLElBQTdCLEVBQW1DQyxPQUFuQyxDQUFiO0FBQ0EsTUFBTUUsY0FBYyxzQ0FDbEJILElBRGtCLEVBRWxCQyxPQUZrQixFQUdsQixDQUFDO0FBQUEsV0FBUSxDQUFDLHdDQUF5QkcsS0FBS0MsSUFBOUIsQ0FBVDtBQUFBLEdBQUQsQ0FIa0IsQ0FBcEI7O0FBTUEsd0JBQUtDLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQlAsS0FBS1EsS0FBTCxHQUFhLENBQWIsQ0FBakIsRUFBa0M7QUFDaENDLDRCQURnQyxvQ0FDUEwsSUFETyxFQUNEO0FBQzdCLFVBQUksd0JBQVNB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QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQTZDNUZQLE9BQUsrQixLQUFMOztBQUVBLFNBQU94QixHQUFQO0FBQ0Q7O0FBRUR5QixPQUFPQyxPQUFQLEdBQWlCdEMsb0JBQWpCIiwiZmlsZSI6InJlbW92ZVVudXNlZFJlcXVpcmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBnZXREZWNsYXJlZElkZW50aWZpZXJzIGZyb20gJy4uL3V0aWxzL2dldERlY2xhcmVkSWRlbnRpZmllcnMnO1xuaW1wb3J0IGdldE5vbkRlY2xhcmF0aW9uSWRlbnRpZmllcnMgZnJvbSAnLi4vdXRpbHMvZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycyc7XG5pbXBvcnQgaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uIGZyb20gJy4uL3V0aWxzL2hhc09uZVJlcXVpcmVEZWNsYXJhdGlvbic7XG5pbXBvcnQgaXNHbG9iYWwgZnJvbSAnLi4vdXRpbHMvaXNHbG9iYWwnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG5mdW5jdGlvbiByZW1vdmVVbnVzZWRSZXF1aXJlcyhcbiAgcm9vdDogQ29sbGVjdGlvbixcbiAgb3B0aW9uczogU291cmNlT3B0aW9ucyxcbik6IHZvaWQge1xuICBjb25zdCB1c2VkID0gZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycyhyb290LCBvcHRpb25zKTtcbiAgY29uc3Qgbm9uUmVxdWlyZXMgPSBnZXREZWNsYXJlZElkZW50aWZpZXJzKFxuICAgIHJvb3QsXG4gICAgb3B0aW9ucyxcbiAgICBbcGF0aCA9PiAhaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uKHBhdGgubm9kZSldLFxuICApO1xuXG4gIGpzY3MudHlwZXMudmlzaXQocm9vdC5ub2RlcygpWzBdLCB7XG4gICAgdmlzaXRWYXJpYWJsZURlY2xhcmF0aW9uKHBhdGgpIHtcbiAgICAgIGlmIChpc0dsb2JhbChwYXRoKSAmJiBoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb24ocGF0aC5ub2RlKSkge1xuICAgICAgICBwcnVuZU5hbWVzKHBhdGgsIHVzZWQsIG5vblJlcXVpcmVzKTtcbiAgICAgIH1cbiAgICAgIC8vIGRvbid0IHRyYXZlcnNlIHRoaXMgcGF0aCwgdGhlcmUgY2Fubm90IGJlIGEgdG9wbGV2ZWxcbiAgICAgIC8vIGRlY2xhcmF0aW9uIGluc2lkZSBvZiBpdFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gIH0pO1xufVxuXG4vLyBTaW1pbGFyIHRvIGBnZXROYW1lc0Zyb21JRGBcbmZ1bmN0aW9uIHBydW5lTmFtZXMocGF0aDogTm9kZVBhdGgsIHVzZWQ6IFNldDxzdHJpbmc+LCBub25SZXF1aXJlczogU2V0PHN0cmluZz4pOiBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IG5vZGUgPSBwYXRoLm5vZGU7XG4gIGNvbnN0IGlkcyA9IG5ldyBTZXQoKTtcbiAgaWYgKGpzY3MuSWRlbnRpZmllci5jaGVjayhub2RlKSkge1xuICAgIGlkcy5hZGQobm9kZS5uYW1lKTtcbiAgfSBlbHNlIGlmIChcbiAgICBqc2NzLlJlc3RFbGVtZW50LmNoZWNrKG5vZGUpIHx8XG4gICAganNjcy5TcHJlYWRFbGVtZW50LmNoZWNrKG5vZGUpIHx8XG4gICAganNjcy5TcHJlYWRQcm9wZXJ0eS5jaGVjayhub2RlKSB8fFxuICAgIGpzY3MuUmVzdFByb3BlcnR5LmNoZWNrKG5vZGUpXG4gICkge1xuICAgIGZvciAoY29uc3QgaWQgb2YgcHJ1bmVOYW1lcyhwYXRoLmdldCgnYXJndW1lbnQnKSwgdXNlZCwgbm9uUmVxdWlyZXMpKSB7XG4gICAgICBpZHMuYWRkKGlkKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoanNjcy5Qcm9wZXJ0eS5jaGVjayhub2RlKSB8fCBqc2NzLk9iamVjdFByb3BlcnR5LmNoZWNrKG5vZGUpKSB7XG4gICAgZm9yIChjb25zdCBpZCBvZiBwcnVuZU5hbWVzKHBhdGguZ2V0KCd2YWx1ZScpLCB1c2VkLCBub25SZXF1aXJlcykpIHtcbiAgICAgIGlkcy5hZGQoaWQpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChqc2NzLk9iamVjdFBhdHRlcm4uY2hlY2sobm9kZSkpIHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcGF0aC5nZXQoJ3Byb3BlcnRpZXMnKTtcbiAgICBmb3IgKGxldCBpID0gbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBwcm9wUGF0aCA9IHByb3BlcnRpZXMuZ2V0KGkpO1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBwcnVuZU5hbWVzKHByb3BQYXRoLCB1c2VkLCBub25SZXF1aXJlcykpIHtcbiAgICAgICAgaWRzLmFkZChpZCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGpzY3MuQXJyYXlQYXR0ZXJuLmNoZWNrKG5vZGUpKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBwYXRoLmdldCgnZWxlbWVudHMnKTtcbiAgICBmb3IgKGxldCBpID0gbm9kZS5lbGVtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBwcnVuZU5hbWVzKGVsZW1lbnRzLmdldChpKSwgdXNlZCwgbm9uUmVxdWlyZXMpKSB7XG4gICAgICAgIGlkcy5hZGQoaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChqc2NzLlZhcmlhYmxlRGVjbGFyYXRpb24uY2hlY2sobm9kZSkpIHtcbiAgICBjb25zdCBpZFBhdGggPSBwYXRoLmdldCgnZGVjbGFyYXRpb25zJykuZ2V0KDApLmdldCgnaWQnKTtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHBydW5lTmFtZXMoaWRQYXRoLCB1c2VkLCBub25SZXF1aXJlcykpIHtcbiAgICAgIGlkcy5hZGQoaWQpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoY29uc3QgbmFtZSBvZiBpZHMpIHtcbiAgICBpZiAodXNlZC5oYXMobmFtZSkgJiYgIW5vblJlcXVpcmVzLmhhcyhuYW1lKSkge1xuICAgICAgcmV0dXJuIGlkcztcbiAgICB9XG4gIH1cbiAgcGF0aC5wcnVuZSgpO1xuXG4gIHJldHVybiBpZHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVtb3ZlVW51c2VkUmVxdWlyZXM7XG4iXX0=