'use strict';

var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);

var _StringUtils;

function _load_StringUtils() {
  return _StringUtils = require('./StringUtils');
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
}

var _oneLineObjectPattern;

function _load_oneLineObjectPattern() {
  return _oneLineObjectPattern = _interopRequireDefault(require('./oneLineObjectPattern'));
}

var _reprintComment;

function _load_reprintComment() {
  return _reprintComment = _interopRequireDefault(require('./reprintComment'));
}

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

var statement = (_jscodeshift || _load_jscodeshift()).default.template.statement;

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
      return (0, (_reprintComment || _load_reprintComment()).default)(comment);
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
  if ((_jscodeshift || _load_jscodeshift()).default.ExpressionStatement.check(node)) {
    return statement(_templateObject, node.expression);
  }

  if ((_jscodeshift || _load_jscodeshift()).default.VariableDeclaration.check(node)) {
    var kind = node.kind || 'const';
    var declaration = node.declarations[0];
    if ((_jscodeshift || _load_jscodeshift()).default.Identifier.check(declaration.id)) {
      return (_jscodeshift || _load_jscodeshift()).default.variableDeclaration(kind, [(_jscodeshift || _load_jscodeshift()).default.variableDeclarator(declaration.id, declaration.init)]);
    } else if ((_jscodeshift || _load_jscodeshift()).default.ObjectPattern.check(declaration.id)) {
      otherNodes.forEach(function (otherNode) {
        var _declaration$id$prope;

        var otherDeclaration = otherNode.declarations[0];
        (_declaration$id$prope = declaration.id.properties).push.apply(_declaration$id$prope, _toConsumableArray(otherDeclaration.id.properties));
      });
      removeDuplicatesInPlace(declaration.id.properties, function (one) {
        return one.value.name;
      });
      declaration.id.properties.sort(function (prop1, prop2) {
        return (0, (_StringUtils || _load_StringUtils()).compareStringsCapitalsLast)(prop1.value.name, prop2.value.name);
      });
      return (_jscodeshift || _load_jscodeshift()).default.variableDeclaration(kind, [(_jscodeshift || _load_jscodeshift()).default.variableDeclarator((0, (_oneLineObjectPattern || _load_oneLineObjectPattern()).default)(declaration.id), declaration.init)]);
    } else if ((_jscodeshift || _load_jscodeshift()).default.ArrayPattern.check(declaration.id)) {
      var bestList = declaration.id;
      otherNodes.forEach(function (otherNode) {
        var otherList = otherNode.declarations[0].id;
        var otherListSize = otherList.elements && otherList.elements.length;
        // TODO: support simultaneous object and array destructuring
        if (otherListSize > bestList.elements.length) {
          bestList = otherList;
        }
      });
      return (_jscodeshift || _load_jscodeshift()).default.variableDeclaration(kind, [(_jscodeshift || _load_jscodeshift()).default.variableDeclarator(bestList, declaration.init)]);
    }
  }

  if ((_jscodeshift || _load_jscodeshift()).default.ImportDeclaration.check(node)) {
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
      if ((_jscodeshift || _load_jscodeshift()).default.ImportDefaultSpecifier.check(one)) {
        return -1;
      }
      if ((_jscodeshift || _load_jscodeshift()).default.ImportDefaultSpecifier.check(two)) {
        return 1;
      }
      return (0, (_StringUtils || _load_StringUtils()).compareStringsCapitalsLast)(one.local.name, two.local.name);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludFJlcXVpcmUuanMiXSwibmFtZXMiOlsic3RhdGVtZW50IiwidGVtcGxhdGUiLCJyZXByaW50UmVxdWlyZSIsIm5vZGVzIiwiY29tbWVudHMiLCJmb3JFYWNoIiwibm9kZSIsIm5ld05vZGUiLCJyZXByaW50UmVxdWlyZUhlbHBlciIsIm1hcCIsImNvbW1lbnQiLCJvdGhlck5vZGVzIiwic2xpY2UiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiY2hlY2siLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImtpbmQiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsIklkZW50aWZpZXIiLCJpZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJpbml0IiwiT2JqZWN0UGF0dGVybiIsIm90aGVyRGVjbGFyYXRpb24iLCJvdGhlck5vZGUiLCJwcm9wZXJ0aWVzIiwicHVzaCIsInJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlIiwib25lIiwidmFsdWUiLCJuYW1lIiwic29ydCIsInByb3AxIiwicHJvcDIiLCJBcnJheVBhdHRlcm4iLCJiZXN0TGlzdCIsIm90aGVyTGlzdCIsIm90aGVyTGlzdFNpemUiLCJlbGVtZW50cyIsImxlbmd0aCIsIkltcG9ydERlY2xhcmF0aW9uIiwib3RoZXJTcGVjaWZpZXJzIiwic3BlY2lmaWVycyIsImZpbHRlciIsInNwZWNpZmllciIsImltcG9ydGVkIiwibG9jYWwiLCJ0d28iLCJJbXBvcnREZWZhdWx0U3BlY2lmaWVyIiwibGlzdCIsImdldHRlciIsImkiLCJsYWJlbCIsInNwbGljZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVlBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7Ozs7O2tKQWZBOzs7Ozs7Ozs7O0lBaUJPQSxT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QUFTd0IsdUJBQVQsQ0FBeUNzQixJQUF6QyxFQUEwREMsTUFBMUQsRUFBNEU7QUFDMUUsTUFBTTVDLE1BQTRCLEVBQWxDO0FBQ0EsT0FBSyxJQUFJNkMsSUFBSUYsS0FBS1YsTUFBTCxHQUFjLENBQTNCLEVBQThCWSxLQUFLLENBQW5DLEVBQXNDQSxHQUF0QyxFQUEyQztBQUN6QyxRQUFNQyxRQUFRRixPQUFPRCxLQUFLRSxDQUFMLENBQVAsQ0FBZDtBQUNBLFFBQUlDLFNBQVM5QyxJQUFJOEMsS0FBSixDQUFiLEVBQXlCO0FBQ3ZCSCxXQUFLSSxNQUFMLENBQVlGLENBQVosRUFBZSxDQUFmO0FBQ0Q7QUFDRDdDLFFBQUk4QyxLQUFKLElBQWEsSUFBYjtBQUNEO0FBQ0Y7O0FBRURFLE9BQU9DLE9BQVAsR0FBaUJ4RCxjQUFqQiIsImZpbGUiOiJyZXByaW50UmVxdWlyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtOb2RlfSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQge2NvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0fSBmcm9tICcuL1N0cmluZ1V0aWxzJztcbmltcG9ydCBqc2NzIGZyb20gJy4vanNjb2Rlc2hpZnQnO1xuaW1wb3J0IG9uZUxpbmVPYmplY3RQYXR0ZXJuIGZyb20gJy4vb25lTGluZU9iamVjdFBhdHRlcm4nO1xuaW1wb3J0IHJlcHJpbnRDb21tZW50IGZyb20gJy4vcmVwcmludENvbW1lbnQnO1xuXG5jb25zdCB7c3RhdGVtZW50fSA9IGpzY3MudGVtcGxhdGU7XG5cbi8qKlxuICogVGhpbiB3cmFwcGVyIHRvIHJlcHJpbnQgcmVxdWlyZXMsIGl0J3Mgd3JhcHBlZCBpbiBhIG5ldyBmdW5jdGlvbiBpbiBvcmRlciB0b1xuICogZWFzaWx5IGF0dGFjaCBjb21tZW50cyB0byB0aGUgbm9kZS5cbiAqL1xuZnVuY3Rpb24gcmVwcmludFJlcXVpcmUobm9kZXM6IEFycmF5PE5vZGU+KTogTm9kZSB7XG4gIGxldCBjb21tZW50cyA9IG51bGw7XG4gIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgY29tbWVudHMgPSBjb21tZW50cyB8fCBub2RlLmNvbW1lbnRzO1xuICB9KTtcbiAgY29uc3QgbmV3Tm9kZSA9IHJlcHJpbnRSZXF1aXJlSGVscGVyKG5vZGVzKTtcbiAgaWYgKGNvbW1lbnRzKSB7XG4gICAgbmV3Tm9kZS5jb21tZW50cyA9IGNvbW1lbnRzLm1hcChjb21tZW50ID0+IHJlcHJpbnRDb21tZW50KGNvbW1lbnQpKTtcbiAgfVxuICByZXR1cm4gbmV3Tm9kZTtcbn1cblxuLyoqXG4gKiBUaGlzIHRha2VzIGluIHJlcXVpcmUvaW1wb3J0IG5vZGVzIHdpdGggdGhlIHNhbWUgc291cmNlIGFuZCByZXByaW50cyB0aGVtXG4gKiBhcyBhIHNpbmdsZSByZXF1aXJlL2ltcG9ydC4gVGhpcyBzaG91bGQgcmVtb3ZlIHdoaXRlc3BhY2VcbiAqIGFuZCBhbGxvdyB1cyB0byBoYXZlIGEgY29uc2lzdGVudCBmb3JtYXR0aW5nIG9mIGFsbCByZXF1aXJlcy5cbiAqL1xuZnVuY3Rpb24gcmVwcmludFJlcXVpcmVIZWxwZXIobm9kZXM6IEFycmF5PE5vZGU+KTogTm9kZSB7XG4gIGNvbnN0IG5vZGUgPSBub2Rlc1swXTtcbiAgY29uc3Qgb3RoZXJOb2RlcyA9IG5vZGVzLnNsaWNlKDEpO1xuICBpZiAoanNjcy5FeHByZXNzaW9uU3RhdGVtZW50LmNoZWNrKG5vZGUpKSB7XG4gICAgcmV0dXJuIHN0YXRlbWVudGAke25vZGUuZXhwcmVzc2lvbn1gO1xuICB9XG5cbiAgaWYgKGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbi5jaGVjayhub2RlKSkge1xuICAgIGNvbnN0IGtpbmQgPSBub2RlLmtpbmQgfHwgJ2NvbnN0JztcbiAgICBjb25zdCBkZWNsYXJhdGlvbiA9IG5vZGUuZGVjbGFyYXRpb25zWzBdO1xuICAgIGlmIChqc2NzLklkZW50aWZpZXIuY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoZGVjbGFyYXRpb24uaWQsIGRlY2xhcmF0aW9uLmluaXQpXSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChqc2NzLk9iamVjdFBhdHRlcm4uY2hlY2soZGVjbGFyYXRpb24uaWQpKSB7XG4gICAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgICAgY29uc3Qgb3RoZXJEZWNsYXJhdGlvbiA9IG90aGVyTm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gICAgICAgIGRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMucHVzaCguLi5vdGhlckRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMpO1xuICAgICAgfSk7XG4gICAgICByZW1vdmVEdXBsaWNhdGVzSW5QbGFjZShkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLCBvbmUgPT4gb25lLnZhbHVlLm5hbWUpO1xuICAgICAgZGVjbGFyYXRpb24uaWQucHJvcGVydGllcy5zb3J0KChwcm9wMSwgcHJvcDIpID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0KHByb3AxLnZhbHVlLm5hbWUsIHByb3AyLnZhbHVlLm5hbWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoXG4gICAgICAgICAgb25lTGluZU9iamVjdFBhdHRlcm4oZGVjbGFyYXRpb24uaWQpLFxuICAgICAgICAgIGRlY2xhcmF0aW9uLmluaXQsXG4gICAgICAgICldLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGpzY3MuQXJyYXlQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgICAgbGV0IGJlc3RMaXN0ID0gZGVjbGFyYXRpb24uaWQ7XG4gICAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgICAgY29uc3Qgb3RoZXJMaXN0ID0gb3RoZXJOb2RlLmRlY2xhcmF0aW9uc1swXS5pZDtcbiAgICAgICAgY29uc3Qgb3RoZXJMaXN0U2l6ZSA9IG90aGVyTGlzdC5lbGVtZW50cyAmJiBvdGhlckxpc3QuZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IHNpbXVsdGFuZW91cyBvYmplY3QgYW5kIGFycmF5IGRlc3RydWN0dXJpbmdcbiAgICAgICAgaWYgKG90aGVyTGlzdFNpemUgPiBiZXN0TGlzdC5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICBiZXN0TGlzdCA9IG90aGVyTGlzdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICBraW5kLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoYmVzdExpc3QsIGRlY2xhcmF0aW9uLmluaXQpXSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGpzY3MuSW1wb3J0RGVjbGFyYXRpb24uY2hlY2sobm9kZSkpIHtcbiAgICBvdGhlck5vZGVzLmZvckVhY2gob3RoZXJOb2RlID0+IHtcbiAgICAgIGNvbnN0IG90aGVyU3BlY2lmaWVycyA9IG90aGVyTm9kZS5zcGVjaWZpZXJzXG4gICAgICAgIC5maWx0ZXIoc3BlY2lmaWVyID0+IHNwZWNpZmllci5pbXBvcnRlZCAhPSBudWxsKTtcbiAgICAgIG5vZGUuc3BlY2lmaWVycy5wdXNoKC4uLm90aGVyU3BlY2lmaWVycyk7XG4gICAgfSk7XG5cbiAgICByZW1vdmVEdXBsaWNhdGVzSW5QbGFjZShub2RlLnNwZWNpZmllcnMsIG9uZSA9PiBvbmUubG9jYWwgJiYgb25lLmxvY2FsLm5hbWUpO1xuXG4gICAgLy8gU29ydCB0aGUgc3BlY2lmaWVycy5cbiAgICBub2RlLnNwZWNpZmllcnMuc29ydCgob25lLCB0d28pID0+IHtcbiAgICAgIC8vIERlZmF1bHQgc3BlY2lmaWVyIGdvZXMgZmlyc3RcbiAgICAgIGlmIChqc2NzLkltcG9ydERlZmF1bHRTcGVjaWZpZXIuY2hlY2sob25lKSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoanNjcy5JbXBvcnREZWZhdWx0U3BlY2lmaWVyLmNoZWNrKHR3bykpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29tcGFyZVN0cmluZ3NDYXBpdGFsc0xhc3QoXG4gICAgICAgIG9uZS5sb2NhbC5uYW1lLFxuICAgICAgICB0d28ubG9jYWwubmFtZSxcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRHVwbGljYXRlc0luUGxhY2U8VDEsIFQyPihsaXN0OiBBcnJheTxUMT4sIGdldHRlcjogVDEgPT4gVDIpIHtcbiAgY29uc3QgbWFwOiB7W2tleTogVDJdOiBib29sZWFufSA9IHt9O1xuICBmb3IgKGxldCBpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IGxhYmVsID0gZ2V0dGVyKGxpc3RbaV0pO1xuICAgIGlmIChsYWJlbCAmJiBtYXBbbGFiZWxdKSB7XG4gICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICB9XG4gICAgbWFwW2xhYmVsXSA9IHRydWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXByaW50UmVxdWlyZTtcbiJdfQ==