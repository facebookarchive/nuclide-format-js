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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludFJlcXVpcmUuanMiXSwibmFtZXMiOlsic3RhdGVtZW50IiwidGVtcGxhdGUiLCJyZXByaW50UmVxdWlyZSIsIm5vZGVzIiwiY29tbWVudHMiLCJmb3JFYWNoIiwibm9kZSIsIm5ld05vZGUiLCJyZXByaW50UmVxdWlyZUhlbHBlciIsIm1hcCIsImNvbW1lbnQiLCJvdGhlck5vZGVzIiwic2xpY2UiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiY2hlY2siLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImtpbmQiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsIklkZW50aWZpZXIiLCJpZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJpbml0IiwiT2JqZWN0UGF0dGVybiIsIm90aGVyRGVjbGFyYXRpb24iLCJvdGhlck5vZGUiLCJwcm9wZXJ0aWVzIiwicHVzaCIsInNvcnQiLCJwcm9wMSIsInByb3AyIiwia2V5IiwibmFtZSIsIkFycmF5UGF0dGVybiIsImJlc3RMaXN0Iiwib3RoZXJMaXN0Iiwib3RoZXJMaXN0U2l6ZSIsImVsZW1lbnRzIiwibGVuZ3RoIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJpbXBvcnRLaW5kIiwib3RoZXJTcGVjaWZpZXJzIiwic3BlY2lmaWVycyIsImZpbHRlciIsInNwZWNpZmllciIsImltcG9ydGVkIiwicmVtb3ZlRHVwbGljYXRlc0luUGxhY2UiLCJvbmUiLCJ0d28iLCJJbXBvcnREZWZhdWx0U3BlY2lmaWVyIiwibGlzdCIsImdldHRlciIsImkiLCJsYWJlbCIsInNwbGljZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tKQWZBOzs7Ozs7Ozs7O0lBaUJPQSxTLEdBQWEsc0JBQUtDLFEsQ0FBbEJELFM7O0FBRVA7Ozs7O0FBSUEs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RUFBOEJjLEtBQUssQ0FBbkMsRUFBc0NBLEdBQXRDLEVBQTJDO0FBQ3pDLFFBQU1DLFFBQVFGLE9BQU9ELEtBQUtFLENBQUwsQ0FBUCxDQUFkO0FBQ0EsUUFBSUMsU0FBUzlDLElBQUk4QyxLQUFKLENBQWIsRUFBeUI7QUFDdkJILFdBQUtJLE1BQUwsQ0FBWUYsQ0FBWixFQUFlLENBQWY7QUFDRDtBQUNEN0MsUUFBSThDLEtBQUosSUFBYSxJQUFiO0FBQ0Q7QUFDRjs7QUFFREUsT0FBT0MsT0FBUCxHQUFpQnhELGNBQWpCIiwiZmlsZSI6InJlcHJpbnRSZXF1aXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge05vZGV9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCB7Y29tcGFyZVN0cmluZ3NDYXBpdGFsc0xhc3R9IGZyb20gJy4vU3RyaW5nVXRpbHMnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuaW1wb3J0IG9uZUxpbmVPYmplY3RQYXR0ZXJuIGZyb20gJy4vb25lTGluZU9iamVjdFBhdHRlcm4nO1xuaW1wb3J0IHJlcHJpbnRDb21tZW50IGZyb20gJy4vcmVwcmludENvbW1lbnQnO1xuXG5jb25zdCB7c3RhdGVtZW50fSA9IGpzY3MudGVtcGxhdGU7XG5cbi8qKlxuICogVGhpbiB3cmFwcGVyIHRvIHJlcHJpbnQgcmVxdWlyZXMsIGl0J3Mgd3JhcHBlZCBpbiBhIG5ldyBmdW5jdGlvbiBpbiBvcmRlciB0b1xuICogZWFzaWx5IGF0dGFjaCBjb21tZW50cyB0byB0aGUgbm9kZS5cbiAqL1xuZnVuY3Rpb24gcmVwcmludFJlcXVpcmUobm9kZXM6IEFycmF5PE5vZGU+KTogTm9kZSB7XG4gIGxldCBjb21tZW50cyA9IG51bGw7XG4gIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgY29tbWVudHMgPSBjb21tZW50cyB8fCBub2RlLmNvbW1lbnRzO1xuICB9KTtcbiAgY29uc3QgbmV3Tm9kZSA9IHJlcHJpbnRSZXF1aXJlSGVscGVyKG5vZGVzKTtcbiAgaWYgKGNvbW1lbnRzKSB7XG4gICAgbmV3Tm9kZS5jb21tZW50cyA9IGNvbW1lbnRzLm1hcChjb21tZW50ID0+IHJlcHJpbnRDb21tZW50KGNvbW1lbnQpKTtcbiAgfVxuICByZXR1cm4gbmV3Tm9kZTtcbn1cblxuLyoqXG4gKiBUaGlzIHRha2VzIGluIHJlcXVpcmUvaW1wb3J0IG5vZGVzIHdpdGggdGhlIHNhbWUgc291cmNlIGFuZCByZXByaW50cyB0aGVtXG4gKiBhcyBhIHNpbmdsZSByZXF1aXJlL2ltcG9ydC4gVGhpcyBzaG91bGQgcmVtb3ZlIHdoaXRlc3BhY2VcbiAqIGFuZCBhbGxvdyB1cyB0byBoYXZlIGEgY29uc2lzdGVudCBmb3JtYXR0aW5nIG9mIGFsbCByZXF1aXJlcy5cbiAqL1xuZnVuY3Rpb24gcmVwcmludFJlcXVpcmVIZWxwZXIobm9kZXM6IEFycmF5PE5vZGU+KTogTm9kZSB7XG4gIGNvbnN0IG5vZGUgPSBub2Rlc1swXTtcbiAgY29uc3Qgb3RoZXJOb2RlcyA9IG5vZGVzLnNsaWNlKDEpO1xuICBpZiAoanNjcy5FeHByZXNzaW9uU3RhdGVtZW50LmNoZWNrKG5vZGUpKSB7XG4gICAgcmV0dXJuIHN0YXRlbWVudGAke25vZGUuZXhwcmVzc2lvbn1gO1xuICB9XG5cbiAgaWYgKGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbi5jaGVjayhub2RlKSkge1xuICAgIGNvbnN0IGtpbmQgPSBub2RlLmtpbmQgfHwgJ2NvbnN0JztcbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IG5vZGUuZGVjbGFyYXRpb25zWzBdO1xuICAgIGlmIChqc2NzLklkZW50aWZpZXIuY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoZGVjbGFyYXRpb24uaWQsIGRlY2xhcmF0aW9uLmluaXQpXSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChqc2NzLk9iamVjdFBhdHRlcm4uY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgICAgY29uc3Qgb3RoZXJEZWNsYXJhdGlvbiA9IG90aGVyTm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gICAgICAgIGRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMucHVzaCguLi5vdGhlckRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMpO1xuICAgICAgfSk7XG4gICAgICBkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLnNvcnQoKHByb3AxLCBwcm9wMikgPT4ge1xuICAgICAgICByZXR1cm4gY29tcGFyZVN0cmluZ3NDYXBpdGFsc0xhc3QocHJvcDEua2V5Lm5hbWUsIHByb3AyLmtleS5uYW1lKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGpzY3MudmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAga2luZCxcbiAgICAgICAgW2pzY3MudmFyaWFibGVEZWNsYXJhdG9yKFxuICAgICAgICAgIG9uZUxpbmVPYmplY3RQYXR0ZXJuKGRlY2xhcmF0aW9uLmlkKSxcbiAgICAgICAgICBkZWNsYXJhdGlvbi5pbml0LFxuICAgICAgICApXSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChqc2NzLkFycmF5UGF0dGVybi5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICAgIGxldCBiZXN0TGlzdCA9IGRlY2xhcmF0aW9uLmlkO1xuICAgICAgb3RoZXJOb2Rlcy5mb3JFYWNoKG90aGVyTm9kZSA9PiB7XG4gICAgICAgIGNvbnN0IG90aGVyTGlzdCA9IG90aGVyTm9kZS5kZWNsYXJhdGlvbnNbMF0uaWQ7XG4gICAgICAgIGNvbnN0IG90aGVyTGlzdFNpemUgPSBvdGhlckxpc3QuZWxlbWVudHMgJiYgb3RoZXJMaXN0LmVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgLy8gVE9ETzogc3VwcG9ydCBzaW11bHRhbmVvdXMgb2JqZWN0IGFuZCBhcnJheSBkZXN0cnVjdHVyaW5nXG4gICAgICAgIGlmIChvdGhlckxpc3RTaXplID4gYmVzdExpc3QuZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgYmVzdExpc3QgPSBvdGhlckxpc3Q7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGpzY3MudmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAga2luZCxcbiAgICAgICAgW2pzY3MudmFyaWFibGVEZWNsYXJhdG9yKGJlc3RMaXN0LCBkZWNsYXJhdGlvbi5pbml0KV0sXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChqc2NzLkltcG9ydERlY2xhcmF0aW9uLmNoZWNrKG5vZGUpICYmIG5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGUnKSB7XG4gICAgb3RoZXJOb2Rlcy5mb3JFYWNoKG90aGVyTm9kZSA9PiB7XG4gICAgICBjb25zdCBvdGhlclNwZWNpZmllcnMgPSBvdGhlck5vZGUuc3BlY2lmaWVyc1xuICAgICAgICAuZmlsdGVyKHNwZWNpZmllciA9PiBzcGVjaWZpZXIuaW1wb3J0ZWQgIT0gbnVsbCk7XG4gICAgICBub2RlLnNwZWNpZmllcnMucHVzaCguLi5vdGhlclNwZWNpZmllcnMpO1xuICAgIH0pO1xuXG4gICAgcmVtb3ZlRHVwbGljYXRlc0luUGxhY2Uobm9kZS5zcGVjaWZpZXJzLCBvbmUgPT4gb25lLmltcG9ydGVkICYmIG9uZS5pbXBvcnRlZC5uYW1lKTtcblxuICAgIC8vIFNvcnQgdGhlIHNwZWNpZmllcnMuXG4gICAgbm9kZS5zcGVjaWZpZXJzLnNvcnQoKG9uZSwgdHdvKSA9PiB7XG4gICAgICAvLyBEZWZhdWx0IHNwZWNpZmllciBnb2VzIGZpcnN0XG4gICAgICBpZiAoanNjcy5JbXBvcnREZWZhdWx0U3BlY2lmaWVyLmNoZWNrKG9uZSkpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGpzY3MuSW1wb3J0RGVmYXVsdFNwZWNpZmllci5jaGVjayh0d28pKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0KFxuICAgICAgICBvbmUuaW1wb3J0ZWQubmFtZSxcbiAgICAgICAgdHdvLmltcG9ydGVkLm5hbWUsXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlPFQxLCBUMj4obGlzdDogQXJyYXk8VDE+LCBnZXR0ZXI6IFQxID0+IFQyKSB7XG4gIGNvbnN0IG1hcDoge1trZXk6IFQyXTogYm9vbGVhbn0gPSB7fTtcbiAgZm9yIChsZXQgaSA9IGxpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBjb25zdCBsYWJlbCA9IGdldHRlcihsaXN0W2ldKTtcbiAgICBpZiAobGFiZWwgJiYgbWFwW2xhYmVsXSkge1xuICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICAgIG1hcFtsYWJlbF0gPSB0cnVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVwcmludFJlcXVpcmU7XG4iXX0=