'use strict';

var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);

var _StringUtils = require('./StringUtils');

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

var _oneLineObjectPattern = require('./oneLineObjectPattern');

var _oneLineObjectPattern2 = _interopRequireDefault(_oneLineObjectPattern);

var _reprintComment = require('./reprintComment');

var _reprintComment2 = _interopRequireDefault(_reprintComment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); } /*
                                                                                                                                                   * Copyright (c) 2015-present, Facebook, Inc.
                                                                                                                                                   * All rights reserved.
                                                                                                                                                   *
                                                                                                                                                   * This source code is licensed under the license found in the LICENSE file in
                                                                                                                                                   * the root directory of this source tree.
                                                                                                                                                   *
                                                                                                                                                   * 
                                                                                                                                                   */

var statement = _jscodeshift2.default.template.statement;

/**
 * Thin wrapper to reprint requires, it's wrapped in a new function in order to
 * easily attach comments to the node.
 */

function reprintRequire(nodes) {
  var comments = null;
  nodes.forEach(function (node) {
    comments = comments || node.comments;
  });
  var newNode = reprintRequireHelper(nodes);
  if (comments) {
    newNode.comments = comments.map(function (comment) {
      return (0, _reprintComment2.default)(comment);
    });
  }
  return newNode;
}

/**
 * This takes in require/import nodes with the same source and reprints them
 * as a single require/import. This should remove whitespace
 * and allow us to have a consistent formatting of all requires.
 */
function reprintRequireHelper(nodes) {
  var node = nodes[0];
  var otherNodes = nodes.slice(1);
  if (_jscodeshift2.default.ExpressionStatement.check(node)) {
    return statement(_templateObject, node.expression);
  }

  if (_jscodeshift2.default.VariableDeclaration.check(node)) {
    var kind = node.kind || 'const';
    var declaration = node.declarations[0];
    if (_jscodeshift2.default.Identifier.check(declaration.id)) {
      return _jscodeshift2.default.variableDeclaration(kind, [_jscodeshift2.default.variableDeclarator(declaration.id, declaration.init)]);
    } else if (_jscodeshift2.default.ObjectPattern.check(declaration.id)) {
      otherNodes.forEach(function (otherNode) {
        var _declaration$id$prope;

        var otherDeclaration = otherNode.declarations[0];
        (_declaration$id$prope = declaration.id.properties).push.apply(_declaration$id$prope, _toConsumableArray(otherDeclaration.id.properties));
      });
      declaration.id.properties.sort(function (prop1, prop2) {
        return (0, _StringUtils.compareStringsCapitalsLast)(prop1.key.name, prop2.key.name);
      });
      return _jscodeshift2.default.variableDeclaration(kind, [_jscodeshift2.default.variableDeclarator((0, _oneLineObjectPattern2.default)(declaration.id), declaration.init)]);
    } else if (_jscodeshift2.default.ArrayPattern.check(declaration.id)) {
      var bestList = declaration.id;
      otherNodes.forEach(function (otherNode) {
        var otherList = otherNode.declarations[0].id;
        var otherListSize = otherList.elements && otherList.elements.length;
        // TODO: support simultaneous object and array destructuring
        if (otherListSize > bestList.elements.length) {
          bestList = otherList;
        }
      });
      return _jscodeshift2.default.variableDeclaration(kind, [_jscodeshift2.default.variableDeclarator(bestList, declaration.init)]);
    }
  }

  if (_jscodeshift2.default.ImportDeclaration.check(node) && node.importKind === 'type') {
    otherNodes.forEach(function (otherNode) {
      var _node$specifiers;

      var otherSpecifiers = otherNode.specifiers.filter(function (specifier) {
        return specifier.imported != null;
      });
      (_node$specifiers = node.specifiers).push.apply(_node$specifiers, _toConsumableArray(otherSpecifiers));
    });

    removeDuplicatesInPlace(node.specifiers, function (one) {
      return one.imported && one.imported.name;
    });

    // Sort the specifiers.
    node.specifiers.sort(function (one, two) {
      // Default specifier goes first
      if (_jscodeshift2.default.ImportDefaultSpecifier.check(one)) {
        return -1;
      }
      if (_jscodeshift2.default.ImportDefaultSpecifier.check(two)) {
        return 1;
      }
      return (0, _StringUtils.compareStringsCapitalsLast)(one.imported.name, two.imported.name);
    });
    return node;
  }

  return node;
}

function removeDuplicatesInPlace(list, getter) {
  var map = {};
  for (var i = list.length - 1; i >= 0; i--) {
    var label = getter(list[i]);
    if (label && map[label]) {
      list.splice(i, 1);
    }
    map[label] = true;
  }
}

module.exports = reprintRequire;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludFJlcXVpcmUuanMiXSwibmFtZXMiOlsic3RhdGVtZW50IiwidGVtcGxhdGUiLCJyZXByaW50UmVxdWlyZSIsIm5vZGVzIiwiY29tbWVudHMiLCJmb3JFYWNoIiwibm9kZSIsIm5ld05vZGUiLCJyZXByaW50UmVxdWlyZUhlbHBlciIsIm1hcCIsImNvbW1lbnQiLCJvdGhlck5vZGVzIiwic2xpY2UiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiY2hlY2siLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImtpbmQiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsIklkZW50aWZpZXIiLCJpZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJpbml0IiwiT2JqZWN0UGF0dGVybiIsIm90aGVyRGVjbGFyYXRpb24iLCJvdGhlck5vZGUiLCJwcm9wZXJ0aWVzIiwicHVzaCIsInNvcnQiLCJwcm9wMSIsInByb3AyIiwia2V5IiwibmFtZSIsIkFycmF5UGF0dGVybiIsImJlc3RMaXN0Iiwib3RoZXJMaXN0Iiwib3RoZXJMaXN0U2l6ZSIsImVsZW1lbnRzIiwibGVuZ3RoIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJpbXBvcnRLaW5kIiwib3RoZXJTcGVjaWZpZXJzIiwic3BlY2lmaWVycyIsImZpbHRlciIsInNwZWNpZmllciIsImltcG9ydGVkIiwicmVtb3ZlRHVwbGljYXRlc0luUGxhY2UiLCJvbmUiLCJ0d28iLCJJbXBvcnREZWZhdWx0U3BlY2lmaWVyIiwibGlzdCIsImdldHRlciIsImkiLCJsYWJlbCIsInNwbGljZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tKQWZBOzs7Ozs7Ozs7O0lBaUJPQSxTLEdBQWEsc0JBQUtDLFEsQ0FBbEJELFM7O0FBRVA7Ozs7O0FBSUEs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QThCYyxLQUFLLENBQW5DLEVBQXNDQSxHQUF0QyxFQUEyQztBQUN6QyxRQUFNQyxRQUFRRixPQUFPRCxLQUFLRSxDQUFMLENBQVAsQ0FBZDtBQUNBLFFBQUlDLFNBQVM5QyxJQUFJOEMsS0FBSixDQUFiLEVBQXlCO0FBQ3ZCSCxXQUFLSSxNQUFMLENBQVlGLENBQVosRUFBZSxDQUFmO0FBQ0Q7QUFDRDdDLFFBQUk4QyxLQUFKLElBQWEsSUFBYjtBQUNEO0FBQ0Y7O0FBRURFLE9BQU9DLE9BQVAsR0FBaUJ4RCxjQUFqQiIsImZpbGUiOiJyZXByaW50UmVxdWlyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtOb2RlfSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQge2NvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0fSBmcm9tICcuL1N0cmluZ1V0aWxzJztcbmltcG9ydCBqc2NzIGZyb20gJ2pzY29kZXNoaWZ0JztcbmltcG9ydCBvbmVMaW5lT2JqZWN0UGF0dGVybiBmcm9tICcuL29uZUxpbmVPYmplY3RQYXR0ZXJuJztcbmltcG9ydCByZXByaW50Q29tbWVudCBmcm9tICcuL3JlcHJpbnRDb21tZW50JztcblxuY29uc3Qge3N0YXRlbWVudH0gPSBqc2NzLnRlbXBsYXRlO1xuXG4vKipcbiAqIFRoaW4gd3JhcHBlciB0byByZXByaW50IHJlcXVpcmVzLCBpdCdzIHdyYXBwZWQgaW4gYSBuZXcgZnVuY3Rpb24gaW4gb3JkZXIgdG9cbiAqIGVhc2lseSBhdHRhY2ggY29tbWVudHMgdG8gdGhlIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIHJlcHJpbnRSZXF1aXJlKG5vZGVzOiBBcnJheTxOb2RlPik6IE5vZGUge1xuICBsZXQgY29tbWVudHMgPSBudWxsO1xuICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIGNvbW1lbnRzID0gY29tbWVudHMgfHwgbm9kZS5jb21tZW50cztcbiAgfSk7XG4gIGNvbnN0IG5ld05vZGUgPSByZXByaW50UmVxdWlyZUhlbHBlcihub2Rlcyk7XG4gIGlmIChjb21tZW50cykge1xuICAgIG5ld05vZGUuY29tbWVudHMgPSBjb21tZW50cy5tYXAoY29tbWVudCA9PiByZXByaW50Q29tbWVudChjb21tZW50KSk7XG4gIH1cbiAgcmV0dXJuIG5ld05vZGU7XG59XG5cbi8qKlxuICogVGhpcyB0YWtlcyBpbiByZXF1aXJlL2ltcG9ydCBub2RlcyB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmQgcmVwcmludHMgdGhlbVxuICogYXMgYSBzaW5nbGUgcmVxdWlyZS9pbXBvcnQuIFRoaXMgc2hvdWxkIHJlbW92ZSB3aGl0ZXNwYWNlXG4gKiBhbmQgYWxsb3cgdXMgdG8gaGF2ZSBhIGNvbnNpc3RlbnQgZm9ybWF0dGluZyBvZiBhbGwgcmVxdWlyZXMuXG4gKi9cbmZ1bmN0aW9uIHJlcHJpbnRSZXF1aXJlSGVscGVyKG5vZGVzOiBBcnJheTxOb2RlPik6IE5vZGUge1xuICBjb25zdCBub2RlID0gbm9kZXNbMF07XG4gIGNvbnN0IG90aGVyTm9kZXMgPSBub2Rlcy5zbGljZSgxKTtcbiAgaWYgKGpzY3MuRXhwcmVzc2lvblN0YXRlbWVudC5jaGVjayhub2RlKSkge1xuICAgIHJldHVybiBzdGF0ZW1lbnRgJHtub2RlLmV4cHJlc3Npb259YDtcbiAgfVxuXG4gIGlmIChqc2NzLlZhcmlhYmxlRGVjbGFyYXRpb24uY2hlY2sobm9kZSkpIHtcbiAgICBjb25zdCBraW5kID0gbm9kZS5raW5kIHx8ICdjb25zdCc7XG4gICAgY29uc3QgZGVjbGFyYXRpb24gPSBub2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgICBpZiAoanNjcy5JZGVudGlmaWVyLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgICAgcmV0dXJuIGpzY3MudmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAga2luZCxcbiAgICAgICAgW2pzY3MudmFyaWFibGVEZWNsYXJhdG9yKGRlY2xhcmF0aW9uLmlkLCBkZWNsYXJhdGlvbi5pbml0KV0sXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoanNjcy5PYmplY3RQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgICAgb3RoZXJOb2Rlcy5mb3JFYWNoKG90aGVyTm9kZSA9PiB7XG4gICAgICAgIGNvbnN0IG90aGVyRGVjbGFyYXRpb24gPSBvdGhlck5vZGUuZGVjbGFyYXRpb25zWzBdO1xuICAgICAgICBkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLnB1c2goLi4ub3RoZXJEZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzKTtcbiAgICAgIH0pO1xuICAgICAgZGVjbGFyYXRpb24uaWQucHJvcGVydGllcy5zb3J0KChwcm9wMSwgcHJvcDIpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0KHByb3AxLmtleS5uYW1lLCBwcm9wMi5rZXkubmFtZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBqc2NzLnZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgIGtpbmQsXG4gICAgICAgIFtqc2NzLnZhcmlhYmxlRGVjbGFyYXRvcihcbiAgICAgICAgICBvbmVMaW5lT2JqZWN0UGF0dGVybihkZWNsYXJhdGlvbi5pZCksXG4gICAgICAgICAgZGVjbGFyYXRpb24uaW5pdCxcbiAgICAgICAgKV0sXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoanNjcy5BcnJheVBhdHRlcm4uY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgICBsZXQgYmVzdExpc3QgPSBkZWNsYXJhdGlvbi5pZDtcbiAgICAgIG90aGVyTm9kZXMuZm9yRWFjaChvdGhlck5vZGUgPT4ge1xuICAgICAgICBjb25zdCBvdGhlckxpc3QgPSBvdGhlck5vZGUuZGVjbGFyYXRpb25zWzBdLmlkO1xuICAgICAgICBjb25zdCBvdGhlckxpc3RTaXplID0gb3RoZXJMaXN0LmVsZW1lbnRzICYmIG90aGVyTGlzdC5lbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIC8vIFRPRE86IHN1cHBvcnQgc2ltdWx0YW5lb3VzIG9iamVjdCBhbmQgYXJyYXkgZGVzdHJ1Y3R1cmluZ1xuICAgICAgICBpZiAob3RoZXJMaXN0U2l6ZSA+IGJlc3RMaXN0LmVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIGJlc3RMaXN0ID0gb3RoZXJMaXN0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBqc2NzLnZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgIGtpbmQsXG4gICAgICAgIFtqc2NzLnZhcmlhYmxlRGVjbGFyYXRvcihiZXN0TGlzdCwgZGVjbGFyYXRpb24uaW5pdCldLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoanNjcy5JbXBvcnREZWNsYXJhdGlvbi5jaGVjayhub2RlKSAmJiBub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJykge1xuICAgIG90aGVyTm9kZXMuZm9yRWFjaChvdGhlck5vZGUgPT4ge1xuICAgICAgY29uc3Qgb3RoZXJTcGVjaWZpZXJzID0gb3RoZXJOb2RlLnNwZWNpZmllcnNcbiAgICAgICAgLmZpbHRlcihzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLmltcG9ydGVkICE9IG51bGwpO1xuICAgICAgbm9kZS5zcGVjaWZpZXJzLnB1c2goLi4ub3RoZXJTcGVjaWZpZXJzKTtcbiAgICB9KTtcblxuICAgIHJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlKG5vZGUuc3BlY2lmaWVycywgb25lID0+IG9uZS5pbXBvcnRlZCAmJiBvbmUuaW1wb3J0ZWQubmFtZSk7XG5cbiAgICAvLyBTb3J0IHRoZSBzcGVjaWZpZXJzLlxuICAgIG5vZGUuc3BlY2lmaWVycy5zb3J0KChvbmUsIHR3bykgPT4ge1xuICAgICAgLy8gRGVmYXVsdCBzcGVjaWZpZXIgZ29lcyBmaXJzdFxuICAgICAgaWYgKGpzY3MuSW1wb3J0RGVmYXVsdFNwZWNpZmllci5jaGVjayhvbmUpKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChqc2NzLkltcG9ydERlZmF1bHRTcGVjaWZpZXIuY2hlY2sodHdvKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21wYXJlU3RyaW5nc0NhcGl0YWxzTGFzdChcbiAgICAgICAgb25lLmltcG9ydGVkLm5hbWUsXG4gICAgICAgIHR3by5pbXBvcnRlZC5uYW1lLFxuICAgICAgKVxuICAgIH0pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlPFQxLCBUMj4obGlzdDogQXJyYXk8VDE+LCBnZXR0ZXI6IFQxID0+IFQyKSB7XG4gIGNvbnN0IG1hcCA9IHt9O1xuICBmb3IgKGxldCBpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IGxhYmVsID0gZ2V0dGVyKGxpc3RbaV0pO1xuICAgIGlmIChsYWJlbCAmJiBtYXBbbGFiZWxdKSB7XG4gICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICB9XG4gICAgbWFwW2xhYmVsXSA9IHRydWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXByaW50UmVxdWlyZTtcbiJdfQ==