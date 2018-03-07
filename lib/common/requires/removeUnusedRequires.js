'use strict';

var _getDeclaredIdentifiers;

function _load_getDeclaredIdentifiers() {
  return _getDeclaredIdentifiers = _interopRequireDefault(require('../utils/getDeclaredIdentifiers'));
}

var _getNonDeclarationIdentifiers;

function _load_getNonDeclarationIdentifiers() {
  return _getNonDeclarationIdentifiers = _interopRequireDefault(require('../utils/getNonDeclarationIdentifiers'));
}

var _hasOneRequireDeclarationOrModuleImport;

function _load_hasOneRequireDeclarationOrModuleImport() {
  return _hasOneRequireDeclarationOrModuleImport = _interopRequireDefault(require('../utils/hasOneRequireDeclarationOrModuleImport'));
}

var _isGlobal;

function _load_isGlobal() {
  return _isGlobal = _interopRequireDefault(require('../utils/isGlobal'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('../utils/jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeUnusedRequires(root, options) {
  var used = (0, (_getNonDeclarationIdentifiers || _load_getNonDeclarationIdentifiers()).default)(root, options);
  var nonRequires = (0, (_getDeclaredIdentifiers || _load_getDeclaredIdentifiers()).default)(root, options, [function (path) {
    return !(0, (_hasOneRequireDeclarationOrModuleImport || _load_hasOneRequireDeclarationOrModuleImport()).default)(path.node);
  }]);

  (_jscodeshift || _load_jscodeshift()).default.types.visit(root.nodes()[0], {
    visitNode: function visitNode(path) {
      if ((0, (_isGlobal || _load_isGlobal()).default)(path)) {
        if ((0, (_hasOneRequireDeclarationOrModuleImport || _load_hasOneRequireDeclarationOrModuleImport()).default)(path.node)) {
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
  if ((_jscodeshift || _load_jscodeshift()).default.Identifier.check(node)) {
    ids.add(node.name);
  } else if ((_jscodeshift || _load_jscodeshift()).default.ImportDeclaration.check(node)) {
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
  } else if ((_jscodeshift || _load_jscodeshift()).default.RestElement.check(node) || (_jscodeshift || _load_jscodeshift()).default.SpreadElement.check(node) || (_jscodeshift || _load_jscodeshift()).default.SpreadProperty.check(node) || (_jscodeshift || _load_jscodeshift()).default.RestProperty.check(node)) {
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
  } else if ((_jscodeshift || _load_jscodeshift()).default.Property.check(node) || (_jscodeshift || _load_jscodeshift()).default.ObjectProperty.check(node)) {
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
  } else if ((_jscodeshift || _load_jscodeshift()).default.ObjectPattern.check(node)) {
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
  } else if ((_jscodeshift || _load_jscodeshift()).default.ArrayPattern.check(node)) {
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
  } else if ((_jscodeshift || _load_jscodeshift()).default.VariableDeclaration.check(node)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vcmVxdWlyZXMvcmVtb3ZlVW51c2VkUmVxdWlyZXMuanMiXSwibmFtZXMiOlsicmVtb3ZlVW51c2VkUmVxdWlyZXMiLCJyb290Iiwib3B0aW9ucyIsInVzZWQiLCJub25SZXF1aXJlcyIsInBhdGgiLCJub2RlIiwidHlwZXMiLCJ2aXNpdCIsIm5vZGVzIiwidmlzaXROb2RlIiwicHJ1bmVOYW1lcyIsInRyYXZlcnNlIiwiaWRzIiwiU2V0IiwiSWRlbnRpZmllciIsImNoZWNrIiwiYWRkIiwibmFtZSIsIkltcG9ydERlY2xhcmF0aW9uIiwic3BlY2lmaWVycyIsInNwZWNpZmllciIsImxvY2FsIiwiUmVzdEVsZW1lbnQiLCJTcHJlYWRFbGVtZW50IiwiU3ByZWFkUHJvcGVydHkiLCJSZXN0UHJvcGVydHkiLCJnZXQiLCJpZCIsIlByb3BlcnR5IiwiT2JqZWN0UHJvcGVydHkiLCJPYmplY3RQYXR0ZXJuIiwicHJvcGVydGllcyIsImkiLCJsZW5ndGgiLCJwcm9wUGF0aCIsIkFycmF5UGF0dGVybiIsImVsZW1lbnRzIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImlkUGF0aCIsImhhcyIsInBydW5lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQWFBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUVBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUVBLFNBQVNBLG9CQUFULENBQ0VDLElBREYsRUFFRUMsT0FGRixFQUdRO0FBQ04sTUFBTUMsT0FBTyxxRkFBNkJGLElBQTdCLEVBQW1DQyxPQUFuQyxDQUFiO0FBQ0EsTUFBTUUsY0FBYyx5RUFDbEJILElBRGtCLEVBRWxCQyxPQUZrQixFQUdsQixDQUFDO0FBQUEsV0FBUSxDQUFDLHlHQUF1Q0csS0FBS0MsSUFBNUMsQ0FBVDtBQUFBLEdBQUQsQ0FIa0IsQ0FBcEI7O0FBTUEsZ0RBQUtDLEtBQUws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OztBQUFBO0FBRS9DLDRCQUFpQmhCLFdBQVc0QixNQUFYLEVBQW1CcEMsSUFBbkIsRUFBeUJDLFdBQXpCLENBQWpCLG1JQUF3RDtBQUFBLFlBQTdDd0IsSUFBNkM7O0FBQ3REZixZQUFJSSxHQUFKLENBQVFXLElBQVI7QUFDRDtBQUo4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS2hEOztBQTFDMkY7QUFBQTtBQUFBOztBQUFBO0FBNEM1RiwwQkFBbUJmLEdBQW5CLG1JQUF3QjtBQUFBLFVBQWJLLElBQWE7O0FBQ3RCLFVBQUlmLEtBQUtxQyxHQUFMLENBQVN0QixJQUFULEtBQWtCLENBQUNkLFlBQVlvQyxHQUFaLENBQWdCdEIsSUFBaEIsQ0FBdkIsRUFBOEM7QUFDNUMsZUFBT0wsR0FBUDtBQUNEO0FBQ0Y7QUFDRDtBQWpENEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFrRDVGUixPQUFLb0MsS0FBTDs7QUFFQSxTQUFPNUIsR0FBUDtBQUNEOztBQUVENkIsT0FBT0MsT0FBUCxHQUFpQjNDLG9CQUFqQiIsImZpbGUiOiJyZW1vdmVVbnVzZWRSZXF1aXJlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9uLCBOb2RlUGF0aH0gZnJvbSAnLi4vdHlwZXMvYXN0JztcbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG5pbXBvcnQgZ2V0RGVjbGFyZWRJZGVudGlmaWVycyBmcm9tICcuLi91dGlscy9nZXREZWNsYXJlZElkZW50aWZpZXJzJztcbmltcG9ydCBnZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzIGZyb20gJy4uL3V0aWxzL2dldE5vbkRlY2xhcmF0aW9uSWRlbnRpZmllcnMnO1xuaW1wb3J0IGhhc09uZVJlcXVpcmVEZWNsYXJhdGlvbk9yTW9kdWxlSW1wb3J0XG4gIGZyb20gJy4uL3V0aWxzL2hhc09uZVJlcXVpcmVEZWNsYXJhdGlvbk9yTW9kdWxlSW1wb3J0JztcbmltcG9ydCBpc0dsb2JhbCBmcm9tICcuLi91dGlscy9pc0dsb2JhbCc7XG5pbXBvcnQganNjcyBmcm9tICcuLi91dGlscy9qc2NvZGVzaGlmdCc7XG5cbmZ1bmN0aW9uIHJlbW92ZVVudXNlZFJlcXVpcmVzKFxuICByb290OiBDb2xsZWN0aW9uLFxuICBvcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuKTogdm9pZCB7XG4gIGNvbnN0IHVzZWQgPSBnZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzKHJvb3QsIG9wdGlvbnMpO1xuICBjb25zdCBub25SZXF1aXJlcyA9IGdldERlY2xhcmVkSWRlbnRpZmllcnMoXG4gICAgcm9vdCxcbiAgICBvcHRpb25zLFxuICAgIFtwYXRoID0+ICFoYXNPbmVSZXF1aXJlRGVjbGFyYXRpb25Pck1vZHVsZUltcG9ydChwYXRoLm5vZGUpXSxcbiAgKTtcblxuICBqc2NzLnR5cGVzLnZpc2l0KHJvb3Qubm9kZXMoKVswXSwge1xuICAgIHZpc2l0Tm9kZShwYXRoKSB7XG4gICAgICBpZiAoaXNHbG9iYWwocGF0aCkpIHtcbiAgICAgICAgaWYgKGhhc09uZVJlcXVpcmVEZWNsYXJhdGlvbk9yTW9kdWxlSW1wb3J0KHBhdGgubm9kZSkpIHtcbiAgICAgICAgICBwcnVuZU5hbWVzKHBhdGgsIHVzZWQsIG5vblJlcXVpcmVzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkb24ndCB0cmF2ZXJzZSB0aGlzIHBhdGgsIHRoZXJlIGNhbm5vdCBiZSBhIHRvcGxldmVsXG4gICAgICAgIC8vIGRlY2xhcmF0aW9uIGluc2lkZSBvZiBpdFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLnRyYXZlcnNlKHBhdGgpO1xuICAgIH0sXG4gIH0pO1xufVxuXG4vLyBTaW1pbGFyIHRvIGBnZXROYW1lc0Zyb21JRGBcbmZ1bmN0aW9uIHBydW5lTmFtZXMocGF0aDogTm9kZVBhdGgsIHVzZWQ6IFNldDxzdHJpbmc+LCBub25SZXF1aXJlczogU2V0PHN0cmluZz4pOiBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IG5vZGUgPSBwYXRoLm5vZGU7XG4gIGNvbnN0IGlkcyA9IG5ldyBTZXQoKTtcbiAgaWYgKGpzY3MuSWRlbnRpZmllci5jaGVjayhub2RlKSkge1xuICAgIGlkcy5hZGQobm9kZS5uYW1lKTtcbiAgfSBlbHNlIGlmIChqc2NzLkltcG9ydERlY2xhcmF0aW9uLmNoZWNrKG5vZGUpKSB7XG4gICAgZm9yIChjb25zdCBzcGVjaWZpZXIgb2Ygbm9kZS5zcGVjaWZpZXJzKSB7XG4gICAgICBpZHMuYWRkKHNwZWNpZmllci5sb2NhbC5uYW1lKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAganNjcy5SZXN0RWxlbWVudC5jaGVjayhub2RlKSB8fFxuICAgIGpzY3MuU3ByZWFkRWxlbWVudC5jaGVjayhub2RlKSB8fFxuICAgIGpzY3MuU3ByZWFkUHJvcGVydHkuY2hlY2sobm9kZSkgfHxcbiAgICBqc2NzLlJlc3RQcm9wZXJ0eS5jaGVjayhub2RlKVxuICApIHtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIHBydW5lTmFtZXMocGF0aC5nZXQoJ2FyZ3VtZW50JyksIHVzZWQsIG5vblJlcXVpcmVzKSkge1xuICAgICAgaWRzLmFkZChpZCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGpzY3MuUHJvcGVydHkuY2hlY2sobm9kZSkgfHwganNjcy5PYmplY3RQcm9wZXJ0eS5jaGVjayhub2RlKSkge1xuICAgIGZvciAoY29uc3QgaWQgb2YgcHJ1bmVOYW1lcyhwYXRoLmdldCgndmFsdWUnKSwgdXNlZCwgbm9uUmVxdWlyZXMpKSB7XG4gICAgICBpZHMuYWRkKGlkKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoanNjcy5PYmplY3RQYXR0ZXJuLmNoZWNrKG5vZGUpKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHBhdGguZ2V0KCdwcm9wZXJ0aWVzJyk7XG4gICAgZm9yIChsZXQgaSA9IG5vZGUucHJvcGVydGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgcHJvcFBhdGggPSBwcm9wZXJ0aWVzLmdldChpKTtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgcHJ1bmVOYW1lcyhwcm9wUGF0aCwgdXNlZCwgbm9uUmVxdWlyZXMpKSB7XG4gICAgICAgIGlkcy5hZGQoaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChqc2NzLkFycmF5UGF0dGVybi5jaGVjayhub2RlKSkge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gcGF0aC5nZXQoJ2VsZW1lbnRzJyk7XG4gICAgZm9yIChsZXQgaSA9IG5vZGUuZWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgcHJ1bmVOYW1lcyhlbGVtZW50cy5nZXQoaSksIHVzZWQsIG5vblJlcXVpcmVzKSkge1xuICAgICAgICBpZHMuYWRkKGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoanNjcy5WYXJpYWJsZURlY2xhcmF0aW9uLmNoZWNrKG5vZGUpKSB7XG4gICAgY29uc3QgaWRQYXRoID0gcGF0aC5nZXQoJ2RlY2xhcmF0aW9ucycpLmdldCgwKS5nZXQoJ2lkJyk7XG4gICAgZm9yIChjb25zdCBpZCBvZiBwcnVuZU5hbWVzKGlkUGF0aCwgdXNlZCwgbm9uUmVxdWlyZXMpKSB7XG4gICAgICBpZHMuYWRkKGlkKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IG5hbWUgb2YgaWRzKSB7XG4gICAgaWYgKHVzZWQuaGFzKG5hbWUpICYmICFub25SZXF1aXJlcy5oYXMobmFtZSkpIHtcbiAgICAgIHJldHVybiBpZHM7XG4gICAgfVxuICB9XG4gIC8vIEFjdHVhbGx5IHJlbW92ZXMgdGhlIHJlcXVpcmUvaW1wb3J0IGlmIG5vIG5hbWUgd2FzIHVzZWRcbiAgcGF0aC5wcnVuZSgpO1xuXG4gIHJldHVybiBpZHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVtb3ZlVW51c2VkUmVxdWlyZXM7XG4iXX0=