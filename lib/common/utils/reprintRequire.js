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

  if (_jscodeshift2.default.ImportDeclaration.check(node)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludFJlcXVpcmUuanMiXSwibmFtZXMiOlsic3RhdGVtZW50IiwidGVtcGxhdGUiLCJyZXByaW50UmVxdWlyZSIsIm5vZGVzIiwiY29tbWVudHMiLCJmb3JFYWNoIiwibm9kZSIsIm5ld05vZGUiLCJyZXByaW50UmVxdWlyZUhlbHBlciIsIm1hcCIsImNvbW1lbnQiLCJvdGhlck5vZGVzIiwic2xpY2UiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiY2hlY2siLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImtpbmQiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsIklkZW50aWZpZXIiLCJpZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJpbml0IiwiT2JqZWN0UGF0dGVybiIsIm90aGVyRGVjbGFyYXRpb24iLCJvdGhlck5vZGUiLCJwcm9wZXJ0aWVzIiwicHVzaCIsInJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlIiwib25lIiwidmFsdWUiLCJuYW1lIiwic29ydCIsInByb3AxIiwicHJvcDIiLCJBcnJheVBhdHRlcm4iLCJiZXN0TGlzdCIsIm90aGVyTGlzdCIsIm90aGVyTGlzdFNpemUiLCJlbGVtZW50cyIsImxlbmd0aCIsIkltcG9ydERlY2xhcmF0aW9uIiwib3RoZXJTcGVjaWZpZXJzIiwic3BlY2lmaWVycyIsImZpbHRlciIsInNwZWNpZmllciIsImltcG9ydGVkIiwibG9jYWwiLCJ0d28iLCJJbXBvcnREZWZhdWx0U3BlY2lmaWVyIiwibGlzdCIsImdldHRlciIsImkiLCJsYWJlbCIsInNwbGljZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tKQWZBOzs7Ozs7Ozs7O0lBaUJPQSxTLEdBQWEsc0JBQUtDLFEsQ0FBbEJELFM7O0FBRVA7Ozs7O0FBSUEsU0FB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RTtBQUMxRSxNQUFNNUMsTUFBNEIsRUFBbEM7QUFDQSxPQUFLLElBQUk2QyxJQUFJRixLQUFLVixNQUFMLEdBQWMsQ0FBM0IsRUFBOEJZLEtBQUssQ0FBbkMsRUFBc0NBLEdBQXRDLEVBQTJDO0FBQ3pDLFFBQU1DLFFBQVFGLE9BQU9ELEtBQUtFLENBQUwsQ0FBUCxDQUFkO0FBQ0EsUUFBSUMsU0FBUzlDLElBQUk4QyxLQUFKLENBQWIsRUFBeUI7QUFDdkJILFdBQUtJLE1BQUwsQ0FBWUYsQ0FBWixFQUFlLENBQWY7QUFDRDtBQUNEN0MsUUFBSThDLEtBQUosSUFBYSxJQUFiO0FBQ0Q7QUFDRjs7QUFFREUsT0FBT0MsT0FBUCxHQUFpQnhELGNBQWpCIiwiZmlsZSI6InJlcHJpbnRSZXF1aXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge05vZGV9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5cbmltcG9ydCB7Y29tcGFyZVN0cmluZ3NDYXBpdGFsc0xhc3R9IGZyb20gJy4vU3RyaW5nVXRpbHMnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuaW1wb3J0IG9uZUxpbmVPYmplY3RQYXR0ZXJuIGZyb20gJy4vb25lTGluZU9iamVjdFBhdHRlcm4nO1xuaW1wb3J0IHJlcHJpbnRDb21tZW50IGZyb20gJy4vcmVwcmludENvbW1lbnQnO1xuXG5jb25zdCB7c3RhdGVtZW50fSA9IGpzY3MudGVtcGxhdGU7XG5cbi8qKlxuICogVGhpbiB3cmFwcGVyIHRvIHJlcHJpbnQgcmVxdWlyZXMsIGl0J3Mgd3JhcHBlZCBpbiBhIG5ldyBmdW5jdGlvbiBpbiBvcmRlciB0b1xuICogZWFzaWx5IGF0dGFjaCBjb21tZW50cyB0byB0aGUgbm9kZS5cbiAqL1xuZnVuY3Rpb24gcmVwcmludFJlcXVpcmUobm9kZXM6IEFycmF5PE5vZGU+KTogTm9kZSB7XG4gIGxldCBjb21tZW50cyA9IG51bGw7XG4gIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgY29tbWVudHMgPSBjb21tZW50cyB8fCBub2RlLmNvbW1lbnRzO1xuICB9KTtcbiAgY29uc3QgbmV3Tm9kZSA9IHJlcHJpbnRSZXF1aXJlSGVscGVyKG5vZGVzKTtcbiAgaWYgKGNvbW1lbnRzKSB7XG4gICAgbmV3Tm9kZS5jb21tZW50cyA9IGNvbW1lbnRzLm1hcChjb21tZW50ID0+IHJlcHJpbnRDb21tZW50KGNvbW1lbnQpKTtcbiAgfVxuICByZXR1cm4gbmV3Tm9kZTtcbn1cblxuLyoqXG4gKiBUaGlzIHRha2VzIGluIHJlcXVpcmUvaW1wb3J0IG5vZGVzIHdpdGggdGhlIHNhbWUgc291cmNlIGFuZCByZXByaW50cyB0aGVtXG4gKiBhcyBhIHNpbmdsZSByZXF1aXJlL2ltcG9ydC4gVGhpcyBzaG91bGQgcmVtb3ZlIHdoaXRlc3BhY2VcbiAqIGFuZCBhbGxvdyB1cyB0byBoYXZlIGEgY29uc2lzdGVudCBmb3JtYXR0aW5nIG9mIGFsbCByZXF1aXJlcy5cbiAqL1xuZnVuY3Rpb24gcmVwcmludFJlcXVpcmVIZWxwZXIobm9kZXM6IEFycmF5PE5vZGU+KTogTm9kZSB7XG4gIGNvbnN0IG5vZGUgPSBub2Rlc1swXTtcbiAgY29uc3Qgb3RoZXJOb2RlcyA9IG5vZGVzLnNsaWNlKDEpO1xuICBpZiAoanNjcy5FeHByZXNzaW9uU3RhdGVtZW50LmNoZWNrKG5vZGUpKSB7XG4gICAgcmV0dXJuIHN0YXRlbWVudGAke25vZGUuZXhwcmVzc2lvbn1gO1xuICB9XG5cbiAgaWYgKGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbi5jaGVjayhub2RlKSkge1xuICAgIGNvbnN0IGtpbmQgPSBub2RlLmtpbmQgfHwgJ2NvbnN0JztcbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IG5vZGUuZGVjbGFyYXRpb25zWzBdO1xuICAgIGlmIChqc2NzLklkZW50aWZpZXIuY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoZGVjbGFyYXRpb24uaWQsIGRlY2xhcmF0aW9uLmluaXQpXSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChqc2NzLk9iamVjdFBhdHRlcm4uY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgICAgY29uc3Qgb3RoZXJEZWNsYXJhdGlvbiA9IG90aGVyTm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gICAgICAgIGRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMucHVzaCguLi5vdGhlckRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMpO1xuICAgICAgfSk7XG4gICAgICByZW1vdmVEdXBsaWNhdGVzSW5QbGFjZShkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLCBvbmUgPT4gb25lLnZhbHVlLm5hbWUpO1xuICAgICAgZGVjbGFyYXRpb24uaWQucHJvcGVydGllcy5zb3J0KChwcm9wMSwgcHJvcDIpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0KHByb3AxLnZhbHVlLm5hbWUsIHByb3AyLnZhbHVlLm5hbWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoXG4gICAgICAgICAgb25lTGluZU9iamVjdFBhdHRlcm4oZGVjbGFyYXRpb24uaWQpLFxuICAgICAgICAgIGRlY2xhcmF0aW9uLmluaXQsXG4gICAgICAgICldLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGpzY3MuQXJyYXlQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgICAgbGV0IGJlc3RMaXN0ID0gZGVjbGFyYXRpb24uaWQ7XG4gICAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgICAgY29uc3Qgb3RoZXJMaXN0ID0gb3RoZXJOb2RlLmRlY2xhcmF0aW9uc1swXS5pZDtcbiAgICAgICAgY29uc3Qgb3RoZXJMaXN0U2l6ZSA9IG90aGVyTGlzdC5lbGVtZW50cyAmJiBvdGhlckxpc3QuZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IHNpbXVsdGFuZW91cyBvYmplY3QgYW5kIGFycmF5IGRlc3RydWN0dXJpbmdcbiAgICAgICAgaWYgKG90aGVyTGlzdFNpemUgPiBiZXN0TGlzdC5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBiZXN0TGlzdCA9IG90aGVyTGlzdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoYmVzdExpc3QsIGRlY2xhcmF0aW9uLmluaXQpXSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGpzY3MuSW1wb3J0RGVjbGFyYXRpb24uY2hlY2sobm9kZSkpIHtcbiAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgIGNvbnN0IG90aGVyU3BlY2lmaWVycyA9IG90aGVyTm9kZS5zcGVjaWZpZXJzXG4gICAgICAgIC5maWx0ZXIoc3BlY2lmaWVyID0+IHNwZWNpZmllci5pbXBvcnRlZCAhPSBudWxsKTtcbiAgICAgIG5vZGUuc3BlY2lmaWVycy5wdXNoKC4uLm90aGVyU3BlY2lmaWVycyk7XG4gICAgfSk7XG5cbiAgICByZW1vdmVEdXBsaWNhdGVzSW5QbGFjZShub2RlLnNwZWNpZmllcnMsIG9uZSA9PiBvbmUubG9jYWwgJiYgb25lLmxvY2FsLm5hbWUpO1xuXG4gICAgLy8gU29ydCB0aGUgc3BlY2lmaWVycy5cbiAgICBub2RlLnNwZWNpZmllcnMuc29ydCgob25lLCB0d28pID0+IHtcbiAgICAgIC8vIERlZmF1bHQgc3BlY2lmaWVyIGdvZXMgZmlyc3RcbiAgICAgIGlmIChqc2NzLkltcG9ydERlZmF1bHRTcGVjaWZpZXIuY2hlY2sob25lKSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoanNjcy5JbXBvcnREZWZhdWx0U3BlY2lmaWVyLmNoZWNrKHR3bykpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tcGFyZVN0cmluZ3NDYXBpdGFsc0xhc3QoXG4gICAgICAgIG9uZS5sb2NhbC5uYW1lLFxuICAgICAgICB0d28ubG9jYWwubmFtZSxcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRHVwbGljYXRlc0luUGxhY2U8VDEsIFQyPihsaXN0OiBBcnJheTxUMT4sIGdldHRlcjogVDEgPT4gVDIpIHtcbiAgY29uc3QgbWFwOiB7W2tleTogVDJdOiBib29sZWFufSA9IHt9O1xuICBmb3IgKGxldCBpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IGxhYmVsID0gZ2V0dGVyKGxpc3RbaV0pO1xuICAgIGlmIChsYWJlbCAmJiBtYXBbbGFiZWxdKSB7XG4gICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICB9XG4gICAgbWFwW2xhYmVsXSA9IHRydWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXByaW50UmVxdWlyZTtcbiJdfQ==