'use strict';

var _getDeclaredIdentifiers = require('../utils/getDeclaredIdentifiers');

var _getDeclaredIdentifiers2 = _interopRequireDefault(_getDeclaredIdentifiers);

var _getNonDeclarationIdentifiers = require('../utils/getNonDeclarationIdentifiers');

var _getNonDeclarationIdentifiers2 = _interopRequireDefault(_getNonDeclarationIdentifiers);

var _hasOneRequireDeclarationOrModuleImport = require('../utils/hasOneRequireDeclarationOrModuleImport');

var _hasOneRequireDeclarationOrModuleImport2 = _interopRequireDefault(_hasOneRequireDeclarationOrModuleImport);

var _isGlobal = require('../utils/isGlobal');

var _isGlobal2 = _interopRequireDefault(_isGlobal);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeUnusedRequires(root, options) {
  var used = (0, _getNonDeclarationIdentifiers2.default)(root, options);
  var nonRequires = (0, _getDeclaredIdentifiers2.default)(root, options, [function (path) {
    return !(0, _hasOneRequireDeclarationOrModuleImport2.default)(path.node);
  }]);

  _jscodeshift2.default.types.visit(root.nodes()[0], {
    visitNode: function visitNode(path) {
      if ((0, _isGlobal2.default)(path)) {
        if ((0, _hasOneRequireDeclarationOrModuleImport2.default)(path.node)) {
          pruneNames(path, used, nonRequires);
        }
        // don't traverse this path, there cannot be a toplevel
        // declaration inside of it
        return false;
      }
      this.traverse(path);
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
  } else if (_jscodeshift2.default.ImportDeclaration.check(node)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = node.specifiers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var specifier = _step.value;

        ids.add(specifier.local.name);
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
  } else if (_jscodeshift2.default.RestElement.check(node) || _jscodeshift2.default.SpreadElement.check(node) || _jscodeshift2.default.SpreadProperty.check(node) || _jscodeshift2.default.RestProperty.check(node)) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = pruneNames(path.get('argument'), used, nonRequires)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var id = _step2.value;

        ids.add(id);
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
  } else if (_jscodeshift2.default.Property.check(node) || _jscodeshift2.default.ObjectProperty.check(node)) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = pruneNames(path.get('value'), used, nonRequires)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _id = _step3.value;

        ids.add(_id);
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
  } else if (_jscodeshift2.default.ObjectPattern.check(node)) {
    var properties = path.get('properties');
    for (var i = node.properties.length - 1; i >= 0; i--) {
      var propPath = properties.get(i);
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = pruneNames(propPath, used, nonRequires)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _id2 = _step4.value;

          ids.add(_id2);
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
  } else if (_jscodeshift2.default.ArrayPattern.check(node)) {
    var elements = path.get('elements');
    for (var _i = node.elements.length - 1; _i >= 0; _i--) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = pruneNames(elements.get(_i), used, nonRequires)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _id3 = _step5.value;

          ids.add(_id3);
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
  } else if (_jscodeshift2.default.VariableDeclaration.check(node)) {
    var idPath = path.get('declarations').get(0).get('id');
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = pruneNames(idPath, used, nonRequires)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var _id4 = _step6.value;

        ids.add(_id4);
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
  }

  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = ids[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var name = _step7.value;

      if (used.has(name) && !nonRequires.has(name)) {
        return ids;
      }
    }
    // Actually removes the require/import if no name was used
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7.return) {
        _iterator7.return();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }

  path.prune();

  return ids;
}

module.exports = removeUnusedRequires;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvcmVtb3ZlVW51c2VkUmVxdWlyZXMuanMiXSwibmFtZXMiOlsicmVtb3ZlVW51c2VkUmVxdWlyZXMiLCJyb290Iiwib3B0aW9ucyIsInVzZWQiLCJub25SZXF1aXJlcyIsInBhdGgiLCJub2RlIiwidHlwZXMiLCJ2aXNpdCIsIm5vZGVzIiwidmlzaXROb2RlIiwicHJ1bmVOYW1lcyIsInRyYXZlcnNlIiwiaWRzIiwiU2V0IiwiSWRlbnRpZmllciIsImNoZWNrIiwiYWRkIiwibmFtZSIsIkltcG9ydERlY2xhcmF0aW9uIiwic3BlY2lmaWVycyIsInNwZWNpZmllciIsImxvY2FsIiwiUmVzdEVsZW1lbnQiLCJTcHJlYWRFbGVtZW50IiwiU3ByZWFkUHJvcGVydHkiLCJSZXN0UHJvcGVydHkiLCJnZXQiLCJpZCIsIlByb3BlcnR5IiwiT2JqZWN0UHJvcGVydHkiLCJPYmplY3RQYXR0ZXJuIiwicHJvcGVydGllcyIsImkiLCJsZW5ndGgiLCJwcm9wUGF0aCIsIkFycmF5UGF0dGVybiIsImVsZW1lbnRzIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImlkUGF0aCIsImhhcyIsInBydW5lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFhQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTQSxvQkFBVCxDQUNFQyxJQURGLEVBRUVDLE9BRkYsRUFHUTtBQUNOLE1BQU1DLE9BQU8sNENBQTZCRixJQUE3QixFQUFtQ0MsT0FBbkMsQ0FBYjtBQUNBLE1BQU1FLGNBQWMsc0NBQ2xCSCxJQURrQixFQUVsQkMsT0FGa0IsRUFHbEIsQ0FBQztBQUFBLFdBQVEsQ0FBQyxzREFBdUNHLEtBQUtDLElBQTVDLENBQVQ7QUFBQSxHQUFELENBSGtCLENBQXBCOztBQU1BLHdCQUFLQyxLQUFMLENBQVdDLEtBQVgsQ0FBaUJQLEtBQUtRLEtBQUwsR0FBYSxDQUFiLENBQWpCLEVBQWtD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QXlCQyxXQUF6QixDQUFqQixtSUFBd0Q7QUFBQSxZQUE3Q3dCLElBQTZDOztBQUN0RGYsWUFBSUksR0FBSixDQUFRVyxJQUFSO0FBQ0Q7QUFKOEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtoRDs7QUExQzJGO0FBQUE7QUFBQTs7QUFBQTtBQTRDNUYsMEJBQW1CZixHQUFuQixtSUFBd0I7QUFBQSxVQUFiSyxJQUFhOztBQUN0QixVQUFJZixLQUFLcUMsR0FBTCxDQUFTdEIsSUFBVCxLQUFrQixDQUFDZCxZQUFZb0MsR0FBWixDQUFnQnRCLElBQWhCLENBQXZCLEVBQThDO0FBQzVDLGVBQU9MLEdBQVA7QUFDRDtBQUNGO0FBQ0Q7QUFqRDRGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBa0Q1RlIsT0FBS29DLEtBQUw7O0FBRUEsU0FBTzVCLEdBQVA7QUFDRDs7QUFFRDZCLE9BQU9DLE9BQVAsR0FBaUIzQyxvQkFBakIiLCJmaWxlIjoicmVtb3ZlVW51c2VkUmVxdWlyZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29sbGVjdGlvbiwgTm9kZVBhdGh9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcblxuaW1wb3J0IGdldERlY2xhcmVkSWRlbnRpZmllcnMgZnJvbSAnLi4vdXRpbHMvZ2V0RGVjbGFyZWRJZGVudGlmaWVycyc7XG5pbXBvcnQgZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycyBmcm9tICcuLi91dGlscy9nZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzJztcbmltcG9ydCBoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb25Pck1vZHVsZUltcG9ydFxuICBmcm9tICcuLi91dGlscy9oYXNPbmVSZXF1aXJlRGVjbGFyYXRpb25Pck1vZHVsZUltcG9ydCc7XG5pbXBvcnQgaXNHbG9iYWwgZnJvbSAnLi4vdXRpbHMvaXNHbG9iYWwnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG5mdW5jdGlvbiByZW1vdmVVbnVzZWRSZXF1aXJlcyhcbiAgcm9vdDogQ29sbGVjdGlvbixcbiAgb3B0aW9uczogU291cmNlT3B0aW9ucyxcbik6IHZvaWQge1xuICBjb25zdCB1c2VkID0gZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycyhyb290LCBvcHRpb25zKTtcbiAgY29uc3Qgbm9uUmVxdWlyZXMgPSBnZXREZWNsYXJlZElkZW50aWZpZXJzKFxuICAgIHJvb3QsXG4gICAgb3B0aW9ucyxcbiAgICBbcGF0aCA9PiAhaGFzT25lUmVxdWlyZURlY2xhcmF0aW9uT3JNb2R1bGVJbXBvcnQocGF0aC5ub2RlKV0sXG4gICk7XG5cbiAganNjcy50eXBlcy52aXNpdChyb290Lm5vZGVzKClbMF0sIHtcbiAgICB2aXNpdE5vZGUocGF0aCkge1xuICAgICAgaWYgKGlzR2xvYmFsKHBhdGgpKSB7XG4gICAgICAgIGlmIChoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb25Pck1vZHVsZUltcG9ydChwYXRoLm5vZGUpKSB7XG4gICAgICAgICAgcHJ1bmVOYW1lcyhwYXRoLCB1c2VkLCBub25SZXF1aXJlcyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZG9uJ3QgdHJhdmVyc2UgdGhpcyBwYXRoLCB0aGVyZSBjYW5ub3QgYmUgYSB0b3BsZXZlbFxuICAgICAgICAvLyBkZWNsYXJhdGlvbiBpbnNpZGUgb2YgaXRcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy50cmF2ZXJzZShwYXRoKTtcbiAgICB9LFxuICB9KTtcbn1cblxuLy8gU2ltaWxhciB0byBgZ2V0TmFtZXNGcm9tSURgXG5mdW5jdGlvbiBwcnVuZU5hbWVzKHBhdGg6IE5vZGVQYXRoLCB1c2VkOiBTZXQ8c3RyaW5nPiwgbm9uUmVxdWlyZXM6IFNldDxzdHJpbmc+KTogU2V0PHN0cmluZz4ge1xuICBjb25zdCBub2RlID0gcGF0aC5ub2RlO1xuICBjb25zdCBpZHMgPSBuZXcgU2V0KCk7XG4gIGlmIChqc2NzLklkZW50aWZpZXIuY2hlY2sobm9kZSkpIHtcbiAgICBpZHMuYWRkKG5vZGUubmFtZSk7XG4gIH0gZWxzZSBpZiAoanNjcy5JbXBvcnREZWNsYXJhdGlvbi5jaGVjayhub2RlKSkge1xuICAgIGZvciAoY29uc3Qgc3BlY2lmaWVyIG9mIG5vZGUuc3BlY2lmaWVycykge1xuICAgICAgaWRzLmFkZChzcGVjaWZpZXIubG9jYWwubmFtZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIGpzY3MuUmVzdEVsZW1lbnQuY2hlY2sobm9kZSkgfHxcbiAgICBqc2NzLlNwcmVhZEVsZW1lbnQuY2hlY2sobm9kZSkgfHxcbiAgICBqc2NzLlNwcmVhZFByb3BlcnR5LmNoZWNrKG5vZGUpIHx8XG4gICAganNjcy5SZXN0UHJvcGVydHkuY2hlY2sobm9kZSlcbiAgKSB7XG4gICAgZm9yIChjb25zdCBpZCBvZiBwcnVuZU5hbWVzKHBhdGguZ2V0KCdhcmd1bWVudCcpLCB1c2VkLCBub25SZXF1aXJlcykpIHtcbiAgICAgIGlkcy5hZGQoaWQpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChqc2NzLlByb3BlcnR5LmNoZWNrKG5vZGUpIHx8IGpzY3MuT2JqZWN0UHJvcGVydHkuY2hlY2sobm9kZSkpIHtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHBydW5lTmFtZXMocGF0aC5nZXQoJ3ZhbHVlJyksIHVzZWQsIG5vblJlcXVpcmVzKSkge1xuICAgICAgaWRzLmFkZChpZCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGpzY3MuT2JqZWN0UGF0dGVybi5jaGVjayhub2RlKSkge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBwYXRoLmdldCgncHJvcGVydGllcycpO1xuICAgIGZvciAobGV0IGkgPSBub2RlLnByb3BlcnRpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IHByb3BQYXRoID0gcHJvcGVydGllcy5nZXQoaSk7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHBydW5lTmFtZXMocHJvcFBhdGgsIHVzZWQsIG5vblJlcXVpcmVzKSkge1xuICAgICAgICBpZHMuYWRkKGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoanNjcy5BcnJheVBhdHRlcm4uY2hlY2sobm9kZSkpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IHBhdGguZ2V0KCdlbGVtZW50cycpO1xuICAgIGZvciAobGV0IGkgPSBub2RlLmVsZW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBmb3IgKGNvbnN0IGlkIG9mIHBydW5lTmFtZXMoZWxlbWVudHMuZ2V0KGkpLCB1c2VkLCBub25SZXF1aXJlcykpIHtcbiAgICAgICAgaWRzLmFkZChpZCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbi5jaGVjayhub2RlKSkge1xuICAgIGNvbnN0IGlkUGF0aCA9IHBhdGguZ2V0KCdkZWNsYXJhdGlvbnMnKS5nZXQoMCkuZ2V0KCdpZCcpO1xuICAgIGZvciAoY29uc3QgaWQgb2YgcHJ1bmVOYW1lcyhpZFBhdGgsIHVzZWQsIG5vblJlcXVpcmVzKSkge1xuICAgICAgaWRzLmFkZChpZCk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBuYW1lIG9mIGlkcykge1xuICAgIGlmICh1c2VkLmhhcyhuYW1lKSAmJiAhbm9uUmVxdWlyZXMuaGFzKG5hbWUpKSB7XG4gICAgICByZXR1cm4gaWRzO1xuICAgIH1cbiAgfVxuICAvLyBBY3R1YWxseSByZW1vdmVzIHRoZSByZXF1aXJlL2ltcG9ydCBpZiBubyBuYW1lIHdhcyB1c2VkXG4gIHBhdGgucHJ1bmUoKTtcblxuICByZXR1cm4gaWRzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZVVudXNlZFJlcXVpcmVzO1xuIl19