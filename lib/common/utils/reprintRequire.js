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
      removeDuplicatesInPlace(declaration.id.properties, function (one) {
        return one.value.name;
      });
      declaration.id.properties.sort(function (prop1, prop2) {
        return (0, _StringUtils.compareStringsCapitalsLast)(prop1.value.name, prop2.value.name);
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
      return one.local && one.local.name;
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
      return (0, _StringUtils.compareStringsCapitalsLast)(one.local.name, two.local.name);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludFJlcXVpcmUuanMiXSwibmFtZXMiOlsic3RhdGVtZW50IiwidGVtcGxhdGUiLCJyZXByaW50UmVxdWlyZSIsIm5vZGVzIiwiY29tbWVudHMiLCJmb3JFYWNoIiwibm9kZSIsIm5ld05vZGUiLCJyZXByaW50UmVxdWlyZUhlbHBlciIsIm1hcCIsImNvbW1lbnQiLCJvdGhlck5vZGVzIiwic2xpY2UiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiY2hlY2siLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImtpbmQiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsIklkZW50aWZpZXIiLCJpZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJpbml0IiwiT2JqZWN0UGF0dGVybiIsIm90aGVyRGVjbGFyYXRpb24iLCJvdGhlck5vZGUiLCJwcm9wZXJ0aWVzIiwicHVzaCIsInJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlIiwib25lIiwidmFsdWUiLCJuYW1lIiwic29ydCIsInByb3AxIiwicHJvcDIiLCJBcnJheVBhdHRlcm4iLCJiZXN0TGlzdCIsIm90aGVyTGlzdCIsIm90aGVyTGlzdFNpemUiLCJlbGVtZW50cyIsImxlbmd0aCIsIkltcG9ydERlY2xhcmF0aW9uIiwiaW1wb3J0S2luZCIsIm90aGVyU3BlY2lmaWVycyIsInNwZWNpZmllcnMiLCJmaWx0ZXIiLCJzcGVjaWZpZXIiLCJpbXBvcnRlZCIsImxvY2FsIiwidHdvIiwiSW1wb3J0RGVmYXVsdFNwZWNpZmllciIsImxpc3QiLCJnZXR0ZXIiLCJpIiwibGFiZWwiLCJzcGxpY2UiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBWUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztrSkFmQTs7Ozs7Ozs7OztJQWlCT0EsUyxHQUFhLHNCQUFLQyxRLENBQWxCRCxTOztBQUVQ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U3dCLHVCQUFULENBQXlDdUIsSUFBekMsRUFBMERDLE1BQTFELEVBQTRFO0FBQzFFLE1BQU03QyxNQUE0QixFQUFsQztBQUNBLE9BQUssSUFBSThDLElBQUlGLEtBQUtYLE1BQUwsR0FBYyxDQUEzQixFQUE4QmEsS0FBSyxDQUFuQyxFQUFzQ0EsR0FBdEMsRUFBMkM7QUFDekMsUUFBTUMsUUFBUUYsT0FBT0QsS0FBS0UsQ0FBTCxDQUFQLENBQWQ7QUFDQSxRQUFJQyxTQUFTL0MsSUFBSStDLEtBQUosQ0FBYixFQUF5QjtBQUN2QkgsV0FBS0ksTUFBTCxDQUFZRixDQUFaLEVBQWUsQ0FBZjtBQUNEO0FBQ0Q5QyxRQUFJK0MsS0FBSixJQUFhLElBQWI7QUFDRDtBQUNGOztBQUVERSxPQUFPQyxPQUFQLEdBQWlCekQsY0FBakIiLCJmaWxlIjoicmVwcmludFJlcXVpcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Tm9kZX0gZnJvbSAnLi4vdHlwZXMvYXN0JztcblxuaW1wb3J0IHtjb21wYXJlU3RyaW5nc0NhcGl0YWxzTGFzdH0gZnJvbSAnLi9TdHJpbmdVdGlscyc7XG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5pbXBvcnQgb25lTGluZU9iamVjdFBhdHRlcm4gZnJvbSAnLi9vbmVMaW5lT2JqZWN0UGF0dGVybic7XG5pbXBvcnQgcmVwcmludENvbW1lbnQgZnJvbSAnLi9yZXByaW50Q29tbWVudCc7XG5cbmNvbnN0IHtzdGF0ZW1lbnR9ID0ganNjcy50ZW1wbGF0ZTtcblxuLyoqXG4gKiBUaGluIHdyYXBwZXIgdG8gcmVwcmludCByZXF1aXJlcywgaXQncyB3cmFwcGVkIGluIGEgbmV3IGZ1bmN0aW9uIGluIG9yZGVyIHRvXG4gKiBlYXNpbHkgYXR0YWNoIGNvbW1lbnRzIHRvIHRoZSBub2RlLlxuICovXG5mdW5jdGlvbiByZXByaW50UmVxdWlyZShub2RlczogQXJyYXk8Tm9kZT4pOiBOb2RlIHtcbiAgbGV0IGNvbW1lbnRzID0gbnVsbDtcbiAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICBjb21tZW50cyA9IGNvbW1lbnRzIHx8IG5vZGUuY29tbWVudHM7XG4gIH0pO1xuICBjb25zdCBuZXdOb2RlID0gcmVwcmludFJlcXVpcmVIZWxwZXIobm9kZXMpO1xuICBpZiAoY29tbWVudHMpIHtcbiAgICBuZXdOb2RlLmNvbW1lbnRzID0gY29tbWVudHMubWFwKGNvbW1lbnQgPT4gcmVwcmludENvbW1lbnQoY29tbWVudCkpO1xuICB9XG4gIHJldHVybiBuZXdOb2RlO1xufVxuXG4vKipcbiAqIFRoaXMgdGFrZXMgaW4gcmVxdWlyZS9pbXBvcnQgbm9kZXMgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kIHJlcHJpbnRzIHRoZW1cbiAqIGFzIGEgc2luZ2xlIHJlcXVpcmUvaW1wb3J0LiBUaGlzIHNob3VsZCByZW1vdmUgd2hpdGVzcGFjZVxuICogYW5kIGFsbG93IHVzIHRvIGhhdmUgYSBjb25zaXN0ZW50IGZvcm1hdHRpbmcgb2YgYWxsIHJlcXVpcmVzLlxuICovXG5mdW5jdGlvbiByZXByaW50UmVxdWlyZUhlbHBlcihub2RlczogQXJyYXk8Tm9kZT4pOiBOb2RlIHtcbiAgY29uc3Qgbm9kZSA9IG5vZGVzWzBdO1xuICBjb25zdCBvdGhlck5vZGVzID0gbm9kZXMuc2xpY2UoMSk7XG4gIGlmIChqc2NzLkV4cHJlc3Npb25TdGF0ZW1lbnQuY2hlY2sobm9kZSkpIHtcbiAgICByZXR1cm4gc3RhdGVtZW50YCR7bm9kZS5leHByZXNzaW9ufWA7XG4gIH1cblxuICBpZiAoanNjcy5WYXJpYWJsZURlY2xhcmF0aW9uLmNoZWNrKG5vZGUpKSB7XG4gICAgY29uc3Qga2luZCA9IG5vZGUua2luZCB8fCAnY29uc3QnO1xuICAgIGNvbnN0IGRlY2xhcmF0aW9uID0gbm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gICAgaWYgKGpzY3MuSWRlbnRpZmllci5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICAgIHJldHVybiBqc2NzLnZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgIGtpbmQsXG4gICAgICAgIFtqc2NzLnZhcmlhYmxlRGVjbGFyYXRvcihkZWNsYXJhdGlvbi5pZCwgZGVjbGFyYXRpb24uaW5pdCldLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGpzY3MuT2JqZWN0UGF0dGVybi5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICAgIG90aGVyTm9kZXMuZm9yRWFjaChvdGhlck5vZGUgPT4ge1xuICAgICAgICBjb25zdCBvdGhlckRlY2xhcmF0aW9uID0gb3RoZXJOb2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgICAgICAgZGVjbGFyYXRpb24uaWQucHJvcGVydGllcy5wdXNoKC4uLm90aGVyRGVjbGFyYXRpb24uaWQucHJvcGVydGllcyk7XG4gICAgICB9KTtcbiAgICAgIHJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlKGRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMsIG9uZSA9PiBvbmUudmFsdWUubmFtZSk7XG4gICAgICBkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLnNvcnQoKHByb3AxLCBwcm9wMikgPT4ge1xuICAgICAgICByZXR1cm4gY29tcGFyZVN0cmluZ3NDYXBpdGFsc0xhc3QocHJvcDEudmFsdWUubmFtZSwgcHJvcDIudmFsdWUubmFtZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBqc2NzLnZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgIGtpbmQsXG4gICAgICAgIFtqc2NzLnZhcmlhYmxlRGVjbGFyYXRvcihcbiAgICAgICAgICBvbmVMaW5lT2JqZWN0UGF0dGVybihkZWNsYXJhdGlvbi5pZCksXG4gICAgICAgICAgZGVjbGFyYXRpb24uaW5pdCxcbiAgICAgICAgKV0sXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoanNjcy5BcnJheVBhdHRlcm4uY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgICBsZXQgYmVzdExpc3QgPSBkZWNsYXJhdGlvbi5pZDtcbiAgICAgIG90aGVyTm9kZXMuZm9yRWFjaChvdGhlck5vZGUgPT4ge1xuICAgICAgICBjb25zdCBvdGhlckxpc3QgPSBvdGhlck5vZGUuZGVjbGFyYXRpb25zWzBdLmlkO1xuICAgICAgICBjb25zdCBvdGhlckxpc3RTaXplID0gb3RoZXJMaXN0LmVsZW1lbnRzICYmIG90aGVyTGlzdC5lbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIC8vIFRPRE86IHN1cHBvcnQgc2ltdWx0YW5lb3VzIG9iamVjdCBhbmQgYXJyYXkgZGVzdHJ1Y3R1cmluZ1xuICAgICAgICBpZiAob3RoZXJMaXN0U2l6ZSA+IGJlc3RMaXN0LmVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIGJlc3RMaXN0ID0gb3RoZXJMaXN0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBqc2NzLnZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgIGtpbmQsXG4gICAgICAgIFtqc2NzLnZhcmlhYmxlRGVjbGFyYXRvcihiZXN0TGlzdCwgZGVjbGFyYXRpb24uaW5pdCldLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZiAoanNjcy5JbXBvcnREZWNsYXJhdGlvbi5jaGVjayhub2RlKSAmJiBub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJykge1xuICAgIG90aGVyTm9kZXMuZm9yRWFjaChvdGhlck5vZGUgPT4ge1xuICAgICAgY29uc3Qgb3RoZXJTcGVjaWZpZXJzID0gb3RoZXJOb2RlLnNwZWNpZmllcnNcbiAgICAgICAgLmZpbHRlcihzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLmltcG9ydGVkICE9IG51bGwpO1xuICAgICAgbm9kZS5zcGVjaWZpZXJzLnB1c2goLi4ub3RoZXJTcGVjaWZpZXJzKTtcbiAgICB9KTtcblxuICAgIHJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlKG5vZGUuc3BlY2lmaWVycywgb25lID0+IG9uZS5sb2NhbCAmJiBvbmUubG9jYWwubmFtZSk7XG5cbiAgICAvLyBTb3J0IHRoZSBzcGVjaWZpZXJzLlxuICAgIG5vZGUuc3BlY2lmaWVycy5zb3J0KChvbmUsIHR3bykgPT4ge1xuICAgICAgLy8gRGVmYXVsdCBzcGVjaWZpZXIgZ29lcyBmaXJzdFxuICAgICAgaWYgKGpzY3MuSW1wb3J0RGVmYXVsdFNwZWNpZmllci5jaGVjayhvbmUpKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChqc2NzLkltcG9ydERlZmF1bHRTcGVjaWZpZXIuY2hlY2sodHdvKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21wYXJlU3RyaW5nc0NhcGl0YWxzTGFzdChcbiAgICAgICAgb25lLmxvY2FsLm5hbWUsXG4gICAgICAgIHR3by5sb2NhbC5uYW1lLFxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufVxuXG5mdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVzSW5QbGFjZTxUMSwgVDI+KGxpc3Q6IEFycmF5PFQxPiwgZ2V0dGVyOiBUMSA9PiBUMikge1xuICBjb25zdCBtYXA6IHtba2V5OiBUMl06IGJvb2xlYW59ID0ge307XG4gIGZvciAobGV0IGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgY29uc3QgbGFiZWwgPSBnZXR0ZXIobGlzdFtpXSk7XG4gICAgaWYgKGxhYmVsICYmIG1hcFtsYWJlbF0pIHtcbiAgICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgICBtYXBbbGFiZWxdID0gdHJ1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcHJpbnRSZXF1aXJlO1xuIl19