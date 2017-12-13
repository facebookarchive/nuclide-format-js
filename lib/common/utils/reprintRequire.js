'use strict';

var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);

var _StringUtils;

function _load_StringUtils() {
  return _StringUtils = require('./StringUtils');
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvcmVwcmludFJlcXVpcmUuanMiXSwibmFtZXMiOlsic3RhdGVtZW50IiwidGVtcGxhdGUiLCJyZXByaW50UmVxdWlyZSIsIm5vZGVzIiwiY29tbWVudHMiLCJmb3JFYWNoIiwibm9kZSIsIm5ld05vZGUiLCJyZXByaW50UmVxdWlyZUhlbHBlciIsIm1hcCIsImNvbW1lbnQiLCJvdGhlck5vZGVzIiwic2xpY2UiLCJFeHByZXNzaW9uU3RhdGVtZW50IiwiY2hlY2siLCJleHByZXNzaW9uIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsImtpbmQiLCJkZWNsYXJhdGlvbiIsImRlY2xhcmF0aW9ucyIsIklkZW50aWZpZXIiLCJpZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJpbml0IiwiT2JqZWN0UGF0dGVybiIsIm90aGVyRGVjbGFyYXRpb24iLCJvdGhlck5vZGUiLCJwcm9wZXJ0aWVzIiwicHVzaCIsInJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlIiwib25lIiwidmFsdWUiLCJuYW1lIiwic29ydCIsInByb3AxIiwicHJvcDIiLCJBcnJheVBhdHRlcm4iLCJiZXN0TGlzdCIsIm90aGVyTGlzdCIsIm90aGVyTGlzdFNpemUiLCJlbGVtZW50cyIsImxlbmd0aCIsIkltcG9ydERlY2xhcmF0aW9uIiwib3RoZXJTcGVjaWZpZXJzIiwic3BlY2lmaWVycyIsImZpbHRlciIsInNwZWNpZmllciIsImltcG9ydGVkIiwibG9jYWwiLCJ0d28iLCJJbXBvcnREZWZhdWx0U3BlY2lmaWVyIiwibGlzdCIsImdldHRlciIsImkiLCJsYWJlbCIsInNwbGljZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQVlBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7OztBQUNBO0FBQUE7QUFBQTs7Ozs7O2tKQWZBOzs7Ozs7Ozs7O0lBaUJPQSxTLEdBQWEsOENBQUtDLFEsQ0FBbEJELFM7O0FBRVA7Ozs7OztBQUlBLFNBQVNFLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQWtEO0FBQ2hELE1BQUlDLFdBQVcsSUFBZjtBQUNBRCxRQUFNRSxPQUFOLENBQWMsZ0JBQVE7QUFDcEJELGVBQVdBLFlBQVlFLEtBQUtGLFFBQTVCO0FBQ0QsR0FGRDtBQUdBLE1BQU1HLFVBQVVDLHFCQUFxQkwsS0FBckIsQ0FBaEI7QUFDQSxNQUFJQyxRQUFKLEVBQWM7QUFDWkcsWUFBUUgsUUFBUixHQUFtQkEsU0FBU0ssR0FBVCxDQUFhO0FBQUEsYUFBVyx5REFBZUMsT0FBZixDQUFYO0FBQUEsS0FBYixDQUFuQjtBQUNEO0FBQ0QsU0FBT0gsT0FBUDtBQUNEOztBQUVEOzs7OztBQUtBLFNBQVNDLG9CQUFULENBQThCTCxLQUE5QixFQUF3RDtBQUN0RCxNQUFNRyxPQUFPSCxNQUFNLENBQU4sQ0FBYjtBQUNBLE1BQU1RLGFBQWFSLE1BQU1TLEtBQU4sQ0FBWSxDQUFaLENBQW5CO0FBQ0EsTUFBSSw4Q0FBS0MsbUJBQUwsQ0FBeUJDLEtBQXpCLENBQStCUixJQUEvQixDQUFKLEVBQTBDO0FBQ3hDLFdBQU9OLFNBQVAsa0JBQW1CTSxLQUFLUyxVQUF4QjtBQUNEOztBQUVELE1BQUksOENBQUtDLG1CQUFMLENBQXlCRixLQUF6QixDQUErQlIsSUFBL0IsQ0FBSixFQUEwQztBQUN4QyxRQUFNVyxPQUFPWCxLQUFLVyxJQUFMLElBQWEsT0FBMUI7QUFDQSxRQUFNQyxjQUFjWixLQUFLYSxZQUFMLENBQWtCLENBQWxCLENBQXBCO0FBQ0EsUUFBSSw4Q0FBS0MsVUFBTCxDQUFnQk4sS0FBaEIsQ0FBc0JJLFlBQVlHLEVBQWxDLENBQUosRUFBMkM7QUFDekMsYUFBTyw4Q0FBS0MsbUJBQUwsQ0FDTEwsSUFESyxFQUVMLENBQUMsOENBQUtNLGtCQUFMLENBQXdCTCxZQUFZRyxFQUFwQyxFQUF3Q0gsWUFBWU0sSUFBcEQsQ0FBRCxDQUZLLENBQVA7QUFJRCxLQUxELE1BS08sSUFBSSw4Q0FBS0MsYUFBTCxDQUFtQlgsS0FBbkIsQ0FBeUJJLFlBQVlHLEVBQXJDLENBQUosRUFBOEM7QUFDbkRWLGlCQUFXTixPQUFYLENBQW1CLHFCQUFhO0FBQUE7O0FBQzlCLFlBQU1xQixtQkFBbUJDLFVBQVVSLFlBQVYsQ0FBdUIsQ0FBdkIsQ0FBekI7QUFDQSw2Q0FBWUUsRUFBWixDQUFlTyxVQUFmLEVBQTBCQyxJQUExQixpREFBa0NILGlCQUFpQkwsRUFBakIsQ0FBb0JPLFVBQXREO0FBQ0QsT0FIRDtBQUlBRSw4QkFBd0JaLFlBQVlHLEVBQVosQ0FBZU8sVUFBdkMsRUFBbUQ7QUFBQSxlQUFPRyxJQUFJQyxLQUFKLENBQVVDLElBQWpCO0FBQUEsT0FBbkQ7QUFDQWYsa0JBQVlHLEVBQVosQ0FBZU8sVUFBZixDQUEwQk0sSUFBMUIsQ0FBK0IsVUFBQ0MsS0FBRCxFQUFRQyxLQUFSLEVBQWtCO0FBQy9DLGVBQU8sc0VBQTJCRCxNQUFNSCxLQUFOLENBQVlDLElBQXZDLEVBQTZDRyxNQUFNSixLQUFOLENBQVlDLElBQXpELENBQVA7QUFDRCxPQUZEO0FBR0EsYUFBTyw4Q0FBS1gsbUJBQUwsQ0FDTEwsSUFESyxFQUVMLENBQUMsOENBQUtNLGtCQUFMLENBQ0MscUVBQXFCTCxZQUFZRyxFQUFqQyxDQURELEVBRUNILFlBQVlNLElBRmIsQ0FBRCxDQUZLLENBQVA7QUFPRCxLQWhCTSxNQWdCQSxJQUFJLDhDQUFLYSxZQUFMLENBQWtCdkIsS0FBbEIsQ0FBd0JJLFlBQVlHLEVBQXBDLENBQUosRUFBNkM7QUFDbEQsVUFBSWlCLFdBQVdwQixZQUFZRyxFQUEzQjtBQUNBVixpQkFBV04sT0FBWCxDQUFtQixxQkFBYTtBQUM5QixZQUFNa0MsWUFBWVosVUFBVVIsWUFBVixDQUF1QixDQUF2QixFQUEwQkUsRUFBNUM7QUFDQSxZQUFNbUIsZ0JBQWdCRCxVQUFVRSxRQUFWLElBQXNCRixVQUFVRSxRQUFWLENBQW1CQyxNQUEvRDtBQUNBO0FBQ0EsWUFBSUYsZ0JBQWdCRixTQUFTRyxRQUFULENBQWtCQyxNQUF0QyxFQUE4QztBQUM1Q0oscUJBQVdDLFNBQVg7QUFDRDtBQUNGLE9BUEQ7QUFRQSxhQUFPLDhDQUFLakIsbUJBQUwsQ0FDTEwsSUFESyxFQUVMLENBQUMsOENBQUtNLGtCQUFMLENBQXdCZSxRQUF4QixFQUFrQ3BCLFlBQVlNLElBQTlDLENBQUQsQ0FGSyxDQUFQO0FBSUQ7QUFDRjs7QUFFRCxNQUFJLDhDQUFLbUIsaUJBQUwsQ0FBdUI3QixLQUF2QixDQUE2QlIsSUFBN0IsQ0FBSixFQUF3QztBQUN0Q0ssZUFBV04sT0FBWCxDQUFtQixxQkFBYTtBQUFBOztBQUM5QixVQUFNdUMsa0JBQWtCakIsVUFBVWtCLFVBQVYsQ0FDckJDLE1BRHFCLENBQ2Q7QUFBQSxlQUFhQyxVQUFVQyxRQUFWLElBQXNCLElBQW5DO0FBQUEsT0FEYyxDQUF4QjtBQUVBLCtCQUFLSCxVQUFMLEVBQWdCaEIsSUFBaEIsNENBQXdCZSxlQUF4QjtBQUNELEtBSkQ7O0FBTUFkLDRCQUF3QnhCLEtBQUt1QyxVQUE3QixFQUF5QztBQUFBLGFBQU9kLElBQUlrQixLQUFKLElBQWFsQixJQUFJa0IsS0FBSixDQUFVaEIsSUFBOUI7QUFBQSxLQUF6Qzs7QUFFQTtBQUNBM0IsU0FBS3VDLFVBQUwsQ0FBZ0JYLElBQWhCLENBQXFCLFVBQUNILEdBQUQsRUFBTW1CLEdBQU4sRUFBYztBQUNqQztBQUNBLFVBQUksOENBQUtDLHNCQUFMLENBQTRCckMsS0FBNUIsQ0FBa0NpQixHQUFsQyxDQUFKLEVBQTRDO0FBQzFDLGVBQU8sQ0FBQyxDQUFSO0FBQ0Q7QUFDRCxVQUFJLDhDQUFLb0Isc0JBQUwsQ0FBNEJyQyxLQUE1QixDQUFrQ29DLEdBQWxDLENBQUosRUFBNEM7QUFDMUMsZUFBTyxDQUFQO0FBQ0Q7QUFDRCxhQUFPLHNFQUNMbkIsSUFBSWtCLEtBQUosQ0FBVWhCLElBREwsRUFFTGlCLElBQUlELEtBQUosQ0FBVWhCLElBRkwsQ0FBUDtBQUlELEtBWkQ7QUFhQSxXQUFPM0IsSUFBUDtBQUNEOztBQUVELFNBQU9BLElBQVA7QUFDRDs7QUFFRCxTQUFTd0IsdUJBQVQsQ0FBeUNzQixJQUF6QyxFQUEwREMsTUFBMUQsRUFBNEU7QUFDMUUsTUFBTTVDLE1BQTRCLEVBQWxDO0FBQ0EsT0FBSyxJQUFJNkMsSUFBSUYsS0FBS1YsTUFBTCxHQUFjLENBQTNCLEVBQThCWSxLQUFLLENBQW5DLEVBQXNDQSxHQUF0QyxFQUEyQztBQUN6QyxRQUFNQyxRQUFRRixPQUFPRCxLQUFLRSxDQUFMLENBQVAsQ0FBZDtBQUNBLFFBQUlDLFNBQVM5QyxJQUFJOEMsS0FBSixDQUFiLEVBQXlCO0FBQ3ZCSCxXQUFLSSxNQUFMLENBQVlGLENBQVosRUFBZSxDQUFmO0FBQ0Q7QUFDRDdDLFFBQUk4QyxLQUFKLElBQWEsSUFBYjtBQUNEO0FBQ0Y7O0FBRURFLE9BQU9DLE9BQVAsR0FBaUJ4RCxjQUFqQiIsImZpbGUiOiJyZXByaW50UmVxdWlyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtOb2RlfSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5pbXBvcnQge2NvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0fSBmcm9tICcuL1N0cmluZ1V0aWxzJztcbmltcG9ydCBqc2NzIGZyb20gJ2pzY29kZXNoaWZ0JztcbmltcG9ydCBvbmVMaW5lT2JqZWN0UGF0dGVybiBmcm9tICcuL29uZUxpbmVPYmplY3RQYXR0ZXJuJztcbmltcG9ydCByZXByaW50Q29tbWVudCBmcm9tICcuL3JlcHJpbnRDb21tZW50JztcblxuY29uc3Qge3N0YXRlbWVudH0gPSBqc2NzLnRlbXBsYXRlO1xuXG4vKipcbiAqIFRoaW4gd3JhcHBlciB0byByZXByaW50IHJlcXVpcmVzLCBpdCdzIHdyYXBwZWQgaW4gYSBuZXcgZnVuY3Rpb24gaW4gb3JkZXIgdG9cbiAqIGVhc2lseSBhdHRhY2ggY29tbWVudHMgdG8gdGhlIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIHJlcHJpbnRSZXF1aXJlKG5vZGVzOiBBcnJheTxOb2RlPik6IE5vZGUge1xuICBsZXQgY29tbWVudHMgPSBudWxsO1xuICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIGNvbW1lbnRzID0gY29tbWVudHMgfHwgbm9kZS5jb21tZW50cztcbiAgfSk7XG4gIGNvbnN0IG5ld05vZGUgPSByZXByaW50UmVxdWlyZUhlbHBlcihub2Rlcyk7XG4gIGlmIChjb21tZW50cykge1xuICAgIG5ld05vZGUuY29tbWVudHMgPSBjb21tZW50cy5tYXAoY29tbWVudCA9PiByZXByaW50Q29tbWVudChjb21tZW50KSk7XG4gIH1cbiAgcmV0dXJuIG5ld05vZGU7XG59XG5cbi8qKlxuICogVGhpcyB0YWtlcyBpbiByZXF1aXJlL2ltcG9ydCBub2RlcyB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmQgcmVwcmludHMgdGhlbVxuICogYXMgYSBzaW5nbGUgcmVxdWlyZS9pbXBvcnQuIFRoaXMgc2hvdWxkIHJlbW92ZSB3aGl0ZXNwYWNlXG4gKiBhbmQgYWxsb3cgdXMgdG8gaGF2ZSBhIGNvbnNpc3RlbnQgZm9ybWF0dGluZyBvZiBhbGwgcmVxdWlyZXMuXG4gKi9cbmZ1bmN0aW9uIHJlcHJpbnRSZXF1aXJlSGVscGVyKG5vZGVzOiBBcnJheTxOb2RlPik6IE5vZGUge1xuICBjb25zdCBub2RlID0gbm9kZXNbMF07XG4gIGNvbnN0IG90aGVyTm9kZXMgPSBub2Rlcy5zbGljZSgxKTtcbiAgaWYgKGpzY3MuRXhwcmVzc2lvblN0YXRlbWVudC5jaGVjayhub2RlKSkge1xuICAgIHJldHVybiBzdGF0ZW1lbnRgJHtub2RlLmV4cHJlc3Npb259YDtcbiAgfVxuXG4gIGlmIChqc2NzLlZhcmlhYmxlRGVjbGFyYXRpb24uY2hlY2sobm9kZSkpIHtcbiAgICBjb25zdCBraW5kID0gbm9kZS5raW5kIHx8ICdjb25zdCc7XG4gICAgY29uc3QgZGVjbGFyYXRpb24gPSBub2RlLmRlY2xhcmF0aW9uc1swXTtcbiAgICBpZiAoanNjcy5JZGVudGlmaWVyLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgICAgcmV0dXJuIGpzY3MudmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAga2luZCxcbiAgICAgICAgW2pzY3MudmFyaWFibGVEZWNsYXJhdG9yKGRlY2xhcmF0aW9uLmlkLCBkZWNsYXJhdGlvbi5pbml0KV0sXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoanNjcy5PYmplY3RQYXR0ZXJuLmNoZWNrKGRlY2xhcmF0aW9uLmlkKSkge1xuICAgICAgb3RoZXJOb2Rlcy5mb3JFYWNoKG90aGVyTm9kZSA9PiB7XG4gICAgICAgIGNvbnN0IG90aGVyRGVjbGFyYXRpb24gPSBvdGhlck5vZGUuZGVjbGFyYXRpb25zWzBdO1xuICAgICAgICBkZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzLnB1c2goLi4ub3RoZXJEZWNsYXJhdGlvbi5pZC5wcm9wZXJ0aWVzKTtcbiAgICAgIH0pO1xuICAgICAgcmVtb3ZlRHVwbGljYXRlc0luUGxhY2UoZGVjbGFyYXRpb24uaWQucHJvcGVydGllcywgb25lID0+IG9uZS52YWx1ZS5uYW1lKTtcbiAgICAgIGRlY2xhcmF0aW9uLmlkLnByb3BlcnRpZXMuc29ydCgocHJvcDEsIHByb3AyKSA9PiB7XG4gICAgICAgIHJldHVybiBjb21wYXJlU3RyaW5nc0NhcGl0YWxzTGFzdChwcm9wMS52YWx1ZS5uYW1lLCBwcm9wMi52YWx1ZS5uYW1lKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGpzY3MudmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAga2luZCxcbiAgICAgICAgW2pzY3MudmFyaWFibGVEZWNsYXJhdG9yKFxuICAgICAgICAgIG9uZUxpbmVPYmplY3RQYXR0ZXJuKGRlY2xhcmF0aW9uLmlkKSxcbiAgICAgICAgICBkZWNsYXJhdGlvbi5pbml0LFxuICAgICAgICApXSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChqc2NzLkFycmF5UGF0dGVybi5jaGVjayhkZWNsYXJhdGlvbi5pZCkpIHtcbiAgICAgIGxldCBiZXN0TGlzdCA9IGRlY2xhcmF0aW9uLmlkO1xuICAgICAgb3RoZXJOb2Rlcy5mb3JFYWNoKG90aGVyTm9kZSA9PiB7XG4gICAgICAgIGNvbnN0IG90aGVyTGlzdCA9IG90aGVyTm9kZS5kZWNsYXJhdGlvbnNbMF0uaWQ7XG4gICAgICAgIGNvbnN0IG90aGVyTGlzdFNpemUgPSBvdGhlckxpc3QuZWxlbWVudHMgJiYgb3RoZXJMaXN0LmVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgLy8gVE9ETzogc3VwcG9ydCBzaW11bHRhbmVvdXMgb2JqZWN0IGFuZCBhcnJheSBkZXN0cnVjdHVyaW5nXG4gICAgICAgIGlmIChvdGhlckxpc3RTaXplID4gYmVzdExpc3QuZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgYmVzdExpc3QgPSBvdGhlckxpc3Q7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGpzY3MudmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAga2luZCxcbiAgICAgICAgW2pzY3MudmFyaWFibGVEZWNsYXJhdG9yKGJlc3RMaXN0LCBkZWNsYXJhdGlvbi5pbml0KV0sXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChqc2NzLkltcG9ydERlY2xhcmF0aW9uLmNoZWNrKG5vZGUpKSB7XG4gICAgb3RoZXJOb2Rlcy5mb3JFYWNoKG90aGVyTm9kZSA9PiB7XG4gICAgICBjb25zdCBvdGhlclNwZWNpZmllcnMgPSBvdGhlck5vZGUuc3BlY2lmaWVyc1xuICAgICAgICAuZmlsdGVyKHNwZWNpZmllciA9PiBzcGVjaWZpZXIuaW1wb3J0ZWQgIT0gbnVsbCk7XG4gICAgICBub2RlLnNwZWNpZmllcnMucHVzaCguLi5vdGhlclNwZWNpZmllcnMpO1xuICAgIH0pO1xuXG4gICAgcmVtb3ZlRHVwbGljYXRlc0luUGxhY2Uobm9kZS5zcGVjaWZpZXJzLCBvbmUgPT4gb25lLmxvY2FsICYmIG9uZS5sb2NhbC5uYW1lKTtcblxuICAgIC8vIFNvcnQgdGhlIHNwZWNpZmllcnMuXG4gICAgbm9kZS5zcGVjaWZpZXJzLnNvcnQoKG9uZSwgdHdvKSA9PiB7XG4gICAgICAvLyBEZWZhdWx0IHNwZWNpZmllciBnb2VzIGZpcnN0XG4gICAgICBpZiAoanNjcy5JbXBvcnREZWZhdWx0U3BlY2lmaWVyLmNoZWNrKG9uZSkpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGpzY3MuSW1wb3J0RGVmYXVsdFNwZWNpZmllci5jaGVjayh0d28pKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbXBhcmVTdHJpbmdzQ2FwaXRhbHNMYXN0KFxuICAgICAgICBvbmUubG9jYWwubmFtZSxcbiAgICAgICAgdHdvLmxvY2FsLm5hbWUsXG4gICAgICApO1xuICAgIH0pO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUR1cGxpY2F0ZXNJblBsYWNlPFQxLCBUMj4obGlzdDogQXJyYXk8VDE+LCBnZXR0ZXI6IFQxID0+IFQyKSB7XG4gIGNvbnN0IG1hcDoge1trZXk6IFQyXTogYm9vbGVhbn0gPSB7fTtcbiAgZm9yIChsZXQgaSA9IGxpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBjb25zdCBsYWJlbCA9IGdldHRlcihsaXN0W2ldKTtcbiAgICBpZiAobGFiZWwgJiYgbWFwW2xhYmVsXSkge1xuICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICAgIG1hcFtsYWJlbF0gPSB0cnVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVwcmludFJlcXVpcmU7XG4iXX0=