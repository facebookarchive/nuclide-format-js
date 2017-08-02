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
    // Sort the specifiers.
    node.specifiers.sort(function (one, two) {
      return (0, _StringUtils.compareStringsCapitalsLast)(one.imported.name, two.imported.name);
    });
    return node;
  }

  return node;
}

module.exports = reprintRequire;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludFJlcXVpcmUuanMiXSwibmFtZXMiOlsic3RhdGVtZW50IiwidGVtcGxhdGUiLCJyZXByaW50UmVxdWlyZSIsIm5vZGVzIiwiY29tbWVudHMiLCJmb3JFYWNoIiwibm9kZSIsIm5ld05vZGUiLCJyZXByaW50UmVxdWlyZUhlbHBlciIsIm1hcCIsImNvbW1lbnQiLCJvdGhlck5vZGVzIiwic2xpY2UiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiY2hlY2siLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImtpbmQiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsIklkZW50aWZpZXIiLCJpZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJpbml0IiwiT2JqZWN0UGF0dGVybiIsIm90aGVyRGVjbGFyYXRpb24iLCJvdGhlck5vZGUiLCJwcm9wZXJ0aWVzIiwicHVzaCIsInNvcnQiLCJwcm9wMSIsInByb3AyIiwia2V5IiwibmFtZSIsIkFycmF5UGF0dGVybiIsImJlc3RMaXN0Iiwib3RoZXJMaXN0Iiwib3RoZXJMaXN0U2l6ZSIsImVsZW1lbnRzIiwibGVuZ3RoIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJpbXBvcnRLaW5kIiwib3RoZXJTcGVjaWZpZXJzIiwic3BlY2lmaWVycyIsImZpbHRlciIsInNwZWNpZmllciIsImltcG9ydGVkIiwib25lIiwidHdvIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQVlBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7a0pBZkE7Ozs7Ozs7Ozs7SUFpQk9BLFMsR0FBYSxzQkFBS0MsUSxDQUFsQkQsUzs7QUFFUDs7Ozs7QUFJQSxTQUFTRSxjQUFULENBQXdCQyxLQUF4QixFQUFrRDtBQUNoRCxNQUFJQyxXQUFXLElBQWY7QUFDQUQsUUFBTUUsT0FBTixDQUFjLGdCQUFRO0FBQ3BCRCxl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LFVBQUwsS0FBb0IsTUFBOUQsRUFBc0U7QUFDcEUvQixlQUFXTixPQUFYLENBQW1CLHFCQUFhO0FBQUE7O0FBQzlCLFVBQU1zQyxrQkFBa0JoQixVQUFVaUIsVUFBVixDQUNyQkMsTUFEcUIsQ0FDZDtBQUFBLGVBQWFDLFVBQVVDLFFBQVYsSUFBc0IsSUFBbkM7QUFBQSxPQURjLENBQXhCO0FBRUEsK0JBQUtILFVBQUwsRUFBZ0JmLElBQWhCLDRDQUF3QmMsZUFBeEI7QUFDRCxLQUpEO0FBS0E7QUFDQXJDLFNBQUtzQyxVQUFMLENBQWdCZCxJQUFoQixDQUFxQixVQUFDa0IsR0FBRCxFQUFNQyxHQUFOO0FBQUEsYUFBYyw2Q0FDakNELElBQUlELFFBQUosQ0FBYWIsSUFEb0IsRUFFakNlLElBQUlGLFFBQUosQ0FBYWIsSUFGb0IsQ0FBZDtBQUFBLEtBQXJCO0FBSUEsV0FBTzVCLElBQVA7QUFDRDs7QUFFRCxTQUFPQSxJQUFQO0FBQ0Q7O0FBRUQ0QyxPQUFPQyxPQUFQLEdBQWlCakQsY0FBakIiLCJmaWxlIjoicmVwcmludFJlcXVpcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Tm9kZX0gZnJvbSAnLi4vdHlwZXMvYXN0JztcblxuaW1wb3J0IHtjb21wYXJlU3RyaW5nc0NhcGl0YWxzTGFzdH0gZnJvbSAnLi9TdHJpbmdVdGlscyc7XG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5pbXBvcnQgb25lTGluZU9iamVjdFBhdHRlcm4gZnJvbSAnLi9vbmVMaW5lT2JqZWN0UGF0dGVybic7XG5pbXBvcnQgcmVwcmludENvbW1lbnQgZnJvbSAnLi9yZXByaW50Q29tbWVudCc7XG5cbmNvbnN0IHtzdGF0ZW1lbnR9ID0ganNjcy50ZW1wbGF0ZTtcblxuLyoqXG4gKiBUaGluIHdyYXBwZXIgdG8gcmVwcmludCByZXF1aXJlcywgaXQncyB3cmFwcGVkIGluIGEgbmV3IGZ1bmN0aW9uIGluIG9yZGVyIHRvXG4gKiBlYXNpbHkgYXR0YWNoIGNvbW1lbnRzIHRvIHRoZSBub2RlLlxuICovXG5mdW5jdGlvbiByZXByaW50UmVxdWlyZShub2RlczogQXJyYXk8Tm9kZT4pOiBOb2RlIHtcbiAgbGV0IGNvbW1lbnRzID0gbnVsbDtcbiAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICBjb21tZW50cyA9IGNvbW1lbnRzIHx8IG5vZGUuY29tbWVudHM7XG4gIH0pO1xuICBjb25zdCBuZXdOb2RlID0gcmVwcmludFJlcXVpcmVIZWxwZXIobm9kZXMpO1xuICBpZiAoY29tbWVudHMpIHtcbiAgICBuZXdOb2RlLmNvbW1lbnRzID0gY29tbWVudHMubWFwKGNvbW1lbnQgPT4gcmVwcmludENvbW1lbnQoY29tbWVudCkpO1xuICB9XG4gIHJldHVybiBuZXdOb2RlO1xufVxuXG4vKipcbiAqIFRoaXMgdGFrZXMgaW4gcmVxdWlyZS9pbXBvcnQgbm9kZXMgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kIHJlcHJpbnRzIHRoZW1cbiAqIGFzIGEgc2luZ2xlIHJlcXVpcmUvaW1wb3J0LiBUaGlzIHNob3VsZCByZW1vdmUgd2hpdGVzcGFjZVxuICogYW5kIGFsbG93IHVzIHRvIGhhdmUgYSBjb25zaXN0ZW50IGZvcm1hdHRpbmcgb2YgYWxsIHJlcXVpcmVzLlxuICovXG5mdW5jdGlvbiByZXByaW50UmVxdWlyZUhlbHBlcihub2RlczogQXJyYXk8Tm9kZT4pOiBOb2RlIHtcbiAgY29uc3Qgbm9kZSA9IG5vZGVzWzBdO1xuICBjb25zdCBvdGhlck5vZGVzID0gbm9kZXMuc2xpY2UoMSk7XG4gIGlmIChqc2NzLkV4cHJlc3Npb25TdGF0ZW1lbnQuY2hlY2sobm9kZSkpIHtcbiAgICByZXR1cm4gc3RhdGVtZW50YCR7bm9kZS5leHByZXNzaW9ufWA7XG4gIH1cblxuICBpZiAoanNjcy5WYXJpYWJsZURlY2xhcmF0aW9uLmNoZWNrKG5vZGUpKSB7XG4gICAgY29uc3Qga2luZCA9IG5vZGUua2luZCB8fCAnY29uc3QnO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gbm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gICAgaWYgKGpzY3MuSWRlbnRpZmllci5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICAgIHJldHVybiBqc2NzLnZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgIGtpbmQsXG4gICAgICAgIFtqc2NzLnZhcmlhYmxlRGVjbGFyYXRvcihkZWNsYXJhdGlvbi5pZCwgZGVjbGFyYXRpb24uaW5pdCldLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGpzY3MuT2JqZWN0UGF0dGVybi5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICAgIG90aGVyTm9kZXMuZm9yRWFjaChvdGhlck5vZGUgPT4ge1xuICAgICAgICBjb25zdCBvdGhlckRlY2xhcmF0aW9uID0gb3RoZXJOb2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgICAgICAgZGVjbGFyYXRpb24uaWQucHJvcGVydGllcy5wdXNoKC4uLm90aGVyRGVjbGFyYXRpb24uaWQucHJvcGVydGllcyk7XG4gICAgICB9KTtcbiAgICAgIGRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMuc29ydCgocHJvcDEsIHByb3AyKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wYXJlU3RyaW5nc0NhcGl0YWxzTGFzdChwcm9wMS5rZXkubmFtZSwgcHJvcDIua2V5Lm5hbWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoXG4gICAgICAgICAgb25lTGluZU9iamVjdFBhdHRlcm4oZGVjbGFyYXRpb24uaWQpLFxuICAgICAgICAgIGRlY2xhcmF0aW9uLmluaXQsXG4gICAgICAgICldLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGpzY3MuQXJyYXlQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgICAgbGV0IGJlc3RMaXN0ID0gZGVjbGFyYXRpb24uaWQ7XG4gICAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgICAgY29uc3Qgb3RoZXJMaXN0ID0gb3RoZXJOb2RlLmRlY2xhcmF0aW9uc1swXS5pZDtcbiAgICAgICAgY29uc3Qgb3RoZXJMaXN0U2l6ZSA9IG90aGVyTGlzdC5lbGVtZW50cyAmJiBvdGhlckxpc3QuZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IHNpbXVsdGFuZW91cyBvYmplY3QgYW5kIGFycmF5IGRlc3RydWN0dXJpbmdcbiAgICAgICAgaWYgKG90aGVyTGlzdFNpemUgPiBiZXN0TGlzdC5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBiZXN0TGlzdCA9IG90aGVyTGlzdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoYmVzdExpc3QsIGRlY2xhcmF0aW9uLmluaXQpXSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGpzY3MuSW1wb3J0RGVjbGFyYXRpb24uY2hlY2sobm9kZSkgJiYgbm9kZS5pbXBvcnRLaW5kID09PSAndHlwZScpIHtcbiAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgIGNvbnN0IG90aGVyU3BlY2lmaWVycyA9IG90aGVyTm9kZS5zcGVjaWZpZXJzXG4gICAgICAgIC5maWx0ZXIoc3BlY2lmaWVyID0+IHNwZWNpZmllci5pbXBvcnRlZCAhPSBudWxsKTtcbiAgICAgIG5vZGUuc3BlY2lmaWVycy5wdXNoKC4uLm90aGVyU3BlY2lmaWVycyk7XG4gICAgfSk7XG4gICAgLy8gU29ydCB0aGUgc3BlY2lmaWVycy5cbiAgICBub2RlLnNwZWNpZmllcnMuc29ydCgob25lLCB0d28pID0+IGNvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0KFxuICAgICAgb25lLmltcG9ydGVkLm5hbWUsXG4gICAgICB0d28uaW1wb3J0ZWQubmFtZSxcbiAgICApKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcHJpbnRSZXF1aXJlO1xuIl19