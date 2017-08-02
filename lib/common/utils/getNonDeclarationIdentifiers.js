'use strict';

var _getJSXIdentifierName = require('./getJSXIdentifierName');

var _getJSXIdentifierName2 = _interopRequireDefault(_getJSXIdentifierName);

var _getNamesFromID = require('./getNamesFromID');

var _getNamesFromID2 = _interopRequireDefault(_getNamesFromID);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_NODE = _jscodeshift2.default.identifier('React');

/**
 * These are the ways in which one might access an undeclared identifier. This
 * should only apply to actual code, not accessing undeclared types.
 */
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

var CONFIG = [
// foo;
{
  nodeType: _jscodeshift2.default.ExpressionStatement,
  getNodes: function getNodes(path) {
    return [path.node.expression];
  }
},

// foo(bar);
{
  nodeType: _jscodeshift2.default.CallExpression,
  getNodes: function getNodes(path) {
    return [path.node.callee].concat(path.node.arguments);
  }
},

// foo.declared;
{
  nodeType: _jscodeshift2.default.MemberExpression,
  getNodes: function getNodes(path) {
    return [path.node.object];
  }
},

// foo = bar;
{
  nodeType: _jscodeshift2.default.AssignmentExpression,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// class declared extends foo {}
{
  nodeType: _jscodeshift2.default.ClassDeclaration,
  getNodes: function getNodes(path) {
    return [path.node.superClass];
  }
},

// var declared = foo;
{
  nodeType: _jscodeshift2.default.VariableDeclarator,
  getNodes: function getNodes(path) {
    return [path.node.init];
  }
},

// switch (declared) { case foo: break; }
{
  nodeType: _jscodeshift2.default.SwitchCase,
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// {declared: foo}
{
  nodeType: _jscodeshift2.default.ObjectExpression,
  // Generally props have a value, if it is a spread property it doesn't.
  getNodes: function getNodes(path) {
    return path.node.properties.map(function (prop) {
      return prop.value || prop;
    });
  }
},

// return foo;
{
  nodeType: _jscodeshift2.default.ReturnStatement,
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// if (foo) {}
{
  nodeType: _jscodeshift2.default.IfStatement,
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// switch (foo) {}
{
  nodeType: _jscodeshift2.default.SwitchStatement,
  getNodes: function getNodes(path) {
    return [path.node.discriminant];
  }
},

// !foo;
{
  nodeType: _jscodeshift2.default.UnaryExpression,
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// foo || bar;
{
  nodeType: _jscodeshift2.default.BinaryExpression,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// foo < bar;
{
  nodeType: _jscodeshift2.default.LogicalExpression,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// foo ? bar : baz;
{
  nodeType: _jscodeshift2.default.ConditionalExpression,
  getNodes: function getNodes(path) {
    return [path.node.test, path.node.alternate, path.node.consequent];
  }
},

// new Foo()
{
  nodeType: _jscodeshift2.default.NewExpression,
  getNodes: function getNodes(path) {
    return [path.node.callee].concat(path.node.arguments);
  }
},

// foo++;
{
  nodeType: _jscodeshift2.default.UpdateExpression,
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// <Element attribute={foo} />
{
  nodeType: _jscodeshift2.default.JSXExpressionContainer,
  getNodes: function getNodes(path) {
    return [path.node.expression];
  }
},

// for (foo in bar) {}
{
  nodeType: _jscodeshift2.default.ForInStatement,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// for (foo of bar) {}
{
  nodeType: _jscodeshift2.default.ForOfStatement,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// for (foo; bar; baz) {}
{
  nodeType: _jscodeshift2.default.ForStatement,
  getNodes: function getNodes(path) {
    return [path.node.init, path.node.test, path.node.update];
  }
},

// while (foo) {}
{
  nodeType: _jscodeshift2.default.WhileStatement,
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// do {} while (foo)
{
  nodeType: _jscodeshift2.default.DoWhileStatement,
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// [foo]
{
  nodeType: _jscodeshift2.default.ArrayExpression,
  getNodes: function getNodes(path) {
    return path.node.elements;
  }
},

// Special case. Any JSX elements will get transpiled to use React.
{
  nodeType: _jscodeshift2.default.JSXOpeningElement,
  getNodes: function getNodes(path, options) {
    return (0, _getJSXIdentifierName2.default)(path).concat(shouldRequireReact(path, options) ? [REACT_NODE] : []);
  }
},

// foo`something`
{
  nodeType: _jscodeshift2.default.TaggedTemplateExpression,
  getNodes: function getNodes(path) {
    return [path.node.tag];
  }
},

// `${bar}`
{
  nodeType: _jscodeshift2.default.TemplateLiteral,
  getNodes: function getNodes(path) {
    return path.node.expressions;
  }
},

// function foo(a = b) {}
{
  nodeType: _jscodeshift2.default.AssignmentPattern,
  getNodes: function getNodes(path) {
    return [path.node.right];
  }
}];

/**
 * This will get a list of all identifiers that are not from a declaration.
 *
 * NOTE: this can get identifiers that are declared, if you want access to
 * identifiers that are access but undeclared see getUndeclaredIdentifiers
 */
function getNonDeclarationIdentifiers(root, options) {
  var ids = new Set();
  var visitor = {};

  CONFIG.forEach(function (config) {
    visitor['visit' + config.nodeType] = function (path) {
      var nodes = config.getNodes(path, options);
      nodes.forEach(function (node) {
        var names = (0, _getNamesFromID2.default)(node);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            ids.add(name);
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
      });
      this.traverse(path);
    };
  });

  _jscodeshift2.default.types.visit(root.nodes()[0], visitor);
  return ids;
}

function shouldRequireReact(path, options) {
  var tag = path.node.name;
  if (_jscodeshift2.default.JSXNamespacedName.check(tag)) {
    return !options.jsxNonReactNames.has(tag.namespace.name);
  }
  if (_jscodeshift2.default.JSXIdentifier.check(tag)) {
    return !options.jsxNonReactNames.has(tag.name);
  }
  return true;
}

module.exports = getNonDeclarationIdentifiers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycy5qcyJdLCJuYW1lcyI6WyJSRUFDVF9OT0RFIiwiaWRlbnRpZmllciIsIkNPTkZJRyIsIm5vZGVUeXBlIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsImdldE5vZGVzIiwicGF0aCIsIm5vZGUiLCJleHByZXNzaW9uIiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJjb25jYXQiLCJhcmd1bWVudHMiLCJNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0IiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJsZWZ0IiwicmlnaHQiLCJDbGFzc0RlY2xhcmF0aW9uIiwic3VwZXJDbGFzcyIsIlZhcmlhYmxlRGVjbGFyYXRvciIsImluaXQiLCJTd2l0Y2hDYXNlIiwidGVzdCIsIk9iamVjdEV4cHJlc3Npb24iLCJwcm9wZXJ0aWVzIiwibWFwIiwicHJvcCIsInZhbHVlIiwiUmV0dXJuU3RhdGVtZW50IiwiYXJndW1lbnQiLCJJZlN0YXRlbWVudCIsIlN3aXRjaFN0YXRlbWVudCIsImRpc2NyaW1pbmFudCIsIlVuYXJ5RXhwcmVzc2lvbiIsIkJpbmFyeUV4cHJlc3Npb24iLCJMb2dpY2FsRXhwcmVzc2lvbiIsIkNvbmRpdGlvbmFsRXhwcmVzc2lvbiIsImFsdGVybmF0ZSIsImNvbnNlcXVlbnQiLCJOZXdFeHByZXNzaW9uIiwiVXBkYXRlRXhwcmVzc2lvbiIsIkpTWEV4cHJlc3Npb25Db250YWluZXIiLCJGb3JJblN0YXRlbWVudCIsIkZvck9mU3RhdGVtZW50IiwiRm9yU3RhdGVtZW50IiwidXBkYXRlIiwiV2hpbGVTdGF0ZW1lbnQiLCJEb1doaWxlU3RhdGVtZW50IiwiQXJyYXlFeHByZXNzaW9uIiwiZWxlbWVudHMiLCJKU1hPcGVuaW5nRWxlbWVudCIsIm9wdGlvbnMiLCJzaG91bGRSZXF1aXJlUmVhY3QiLCJUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24iLCJ0YWciLCJUZW1wbGF0ZUxpdGVyYWwiLCJleHByZXNzaW9ucyIsIkFzc2lnbm1lbnRQYXR0ZXJuIiwiZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycyIsInJvb3QiLCJpZHMiLCJTZXQiLCJ2aXNpdG9yIiwiZm9yRWFjaCIsImNvbmZpZyIsIm5vZGVzIiwibmFtZXMiLCJuYW1lIiwiYWRkIiwidHJhdmVyc2UiLCJ0eXBlcyIsInZpc2l0IiwiSlNYTmFtZXNwYWNlZE5hbWUiLCJjaGVjayIsImpzeE5vblJlYWN0TmFtZXMiLCJoYXMiLCJuYW1lc3BhY2UiLCJKU1hJZGVudGlmaWVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFhQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQU9BLElBQU1BLGFBQWEsc0JBQUtDLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBbkI7O0FBRUE7Ozs7QUF4QkE7Ozs7Ozs7Ozs7QUE0QkEsSUFBTUMsU0FBNkI7QUFDakM7QUFDQTtBQUNFQyxZQUFVLHNCQUFLQyxtQkFEakI7QUFFRUMsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVQyxVQUFYLENBQVI7QUFBQTtBQUZaLENBRmlDOztBQU9qQztBQUNBO0FBQ0VMLFlBQVUsc0JBQUtNLGNBRGpCO0FBRUVKLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVUcsTUFBWCxFQUFtQkMsTUFBbkIsQ0FBMEJMLEtBQUtDLElBQUwsQ0FBVUssU0FBcEMsQ0FBUjtBQUFBO0FBRlosQ0FSaUM7O0FBYWpDO0FBQ0E7QUFDRVQsWUFBVSxzQkFBS1UsZ0JBRGpCO0FBRUVSLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVU8sTUFBWCxDQUFSO0FBQUE7QUFGWixDQWRpQzs7QUFtQmpDO0FBQ0E7QUFDRVgsWUFBVSxzQkFBS1ksb0JBRGpCO0FBRUVWLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVVMsSUFBWCxFQUFpQlYsS0FBS0MsSUFBTCxDQUFVVSxLQUEzQixDQUFSO0FBQUE7QUFGWixDQXBCaUM7O0FBeUJqQztBQUNBO0FBQ0VkLFlBQVUsc0JBQUtlLGdCQURqQjtBQUVFYixZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVVZLFVBQVgsQ0FBUjtBQUFBO0FBRlosQ0ExQmlDOztBQStCakM7QUFDQTtBQUNFaEIsWUFBVSxzQkFBS2lCLGtCQURqQjtBQUVFZixZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVVjLElBQVgsQ0FBUjtBQUFBO0FBRlosQ0FoQ2lDOztBQXFDakM7QUFDQTtBQUNFbEIsWUFBVSxzQkFBS21CLFVBRGpCO0FBRUVqQixZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVVnQixJQUFYLENBQVI7QUFBQTtBQUZaLENBdENpQzs7QUEyQ2pDO0FBQ0E7QUFDRXBCLFlBQVUsc0JBQUtxQixnQkFEakI7QUFFRTtBQUNBbkIsWUFBVTtBQUFBLFdBQVFDLEtBQUtDLElBQUwsQ0FBVWtCLFVBQVYsQ0FBcUJDLEdBQXJCLENBQXlCO0FBQUEsYUFBUUMsS0FBS0MsS0FBTCxJQUFjRCxJQUF0QjtBQUFBLEtBQXpCLENBQVI7QUFBQTtBQUhaLENBNUNpQzs7QUFrRGpDO0FBQ0E7QUFDRXhCLFlBQVUsc0JBQUswQixlQURqQjtBQUVFeEIsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVdUIsUUFBWCxDQUFSO0FBQUE7QUFGWixDQW5EaUM7O0FBd0RqQztBQUNBO0FBQ0UzQixZQUFVLHNCQUFLNEIsV0FEakI7QUFFRTFCLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVWdCLElBQVgsQ0FBUjtBQUFBO0FBRlosQ0F6RGlDOztBQThEakM7QUFDQTtBQUNFcEIsWUFBVSxzQkFBSzZCLGVBRGpCO0FBRUUzQixZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVUwQixZQUFYLENBQVI7QUFBQTtBQUZaLENBL0RpQzs7QUFvRWpDO0FBQ0E7QUFDRTlCLFlBQVUsc0JBQUsrQixlQURqQjtBQUVFN0IsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVdUIsUUFBWCxDQUFSO0FBQUE7QUFGWixDQXJFaUM7O0FBMEVqQztBQUNBO0FBQ0UzQixZQUFVLHNCQUFLZ0MsZ0JBRGpCO0FBRUU5QixZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVVTLElBQVgsRUFBaUJWLEtBQUtDLElBQUwsQ0FBVVUsS0FBM0IsQ0FBUjtBQUFBO0FBRlosQ0EzRWlDOztBQWdGakM7QUFDQTtBQUNFZCxZQUFVLHNCQUFLaUMsaUJBRGpCO0FBRUUvQixZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVVTLElBQVgsRUFBaUJWLEtBQUtDLElBQUwsQ0FBVVUsS0FBM0IsQ0FBUjtBQUFBO0FBRlosQ0FqRmlDOztBQXNGakM7QUFDQTtBQUNFZCxZQUFVLHNCQUFLa0MscUJBRGpCO0FBRUVoQyxZQUFVO0FBQUEsV0FBUSxDQUNoQkMsS0FBS0MsSUFBTCxDQUFVZ0IsSUFETSxFQUVoQmpCLEtBQUtDLElBQUwsQ0FBVStCLFNBRk0sRUFHaEJoQyxLQUFLQyxJQUFMLENBQVVnQyxVQUhNLENBQVI7QUFBQTtBQUZaLENBdkZpQzs7QUFnR2pDO0FBQ0E7QUFDRXBDLFlBQVUsc0JBQUtxQyxhQURqQjtBQUVFbkMsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVRyxNQUFYLEVBQW1CQyxNQUFuQixDQUEwQkwsS0FBS0MsSUFBTCxDQUFVSyxTQUFwQyxDQUFSO0FBQUE7QUFGWixDQWpHaUM7O0FBc0dqQztBQUNBO0FBQ0VULFlBQVUsc0JBQUtzQyxnQkFEakI7QUFFRXBDLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVXVCLFFBQVgsQ0FBUjtBQUFBO0FBRlosQ0F2R2lDOztBQTRHakM7QUFDQTtBQUNFM0IsWUFBVSxzQkFBS3VDLHNCQURqQjtBQUVFckMsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVQyxVQUFYLENBQVI7QUFBQTtBQUZaLENBN0dpQzs7QUFrSGpDO0FBQ0E7QUFDRUwsWUFBVSxzQkFBS3dDLGNBRGpCO0FBRUV0QyxZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVVTLElBQVgsRUFBaUJWLEtBQUtDLElBQUwsQ0FBVVUsS0FBM0IsQ0FBUjtBQUFBO0FBRlosQ0FuSGlDOztBQXdIakM7QUFDQTtBQUNFZCxZQUFVLHNCQUFLeUMsY0FEakI7QUFFRXZDLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVVMsSUFBWCxFQUFpQlYsS0FBS0MsSUFBTCxDQUFVVSxLQUEzQixDQUFSO0FBQUE7QUFGWixDQXpIaUM7O0FBOEhqQztBQUNBO0FBQ0VkLFlBQVUsc0JBQUswQyxZQURqQjtBQUVFeEMsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVYyxJQUFYLEVBQWlCZixLQUFLQyxJQUFMLENBQVVnQixJQUEzQixFQUFpQ2pCLEtBQUtDLElBQUwsQ0FBVXVDLE1BQTNDLENBQVI7QUFBQTtBQUZaLENBL0hpQzs7QUFvSWpDO0FBQ0E7QUFDRTNDLFlBQVUsc0JBQUs0QyxjQURqQjtBQUVFMUMsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVZ0IsSUFBWCxDQUFSO0FBQUE7QUFGWixDQXJJaUM7O0FBMElqQztBQUNBO0FBQ0VwQixZQUFVLHNCQUFLNkMsZ0JBRGpCO0FBRUUzQyxZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVVnQixJQUFYLENBQVI7QUFBQTtBQUZaLENBM0lpQzs7QUFnSmpDO0FBQ0E7QUFDRXBCLFlBQVUsc0JBQUs4QyxlQURqQjtBQUVFNUMsWUFBVTtBQUFBLFdBQVFDLEtBQUtDLElBQUwsQ0FBVTJDLFFBQWxCO0FBQUE7QUFGWixDQWpKaUM7O0FBc0pqQztBQUNBO0FBQ0UvQyxZQUFVLHNCQUFLZ0QsaUJBRGpCO0FBRUU5QyxZQUFVLGtCQUFDQyxJQUFELEVBQU84QyxPQUFQO0FBQUEsV0FDUixvQ0FBcUI5QyxJQUFyQixFQUEyQkssTUFBM0IsQ0FDRTBDLG1CQUFtQi9DLElBQW5CLEVBQXlCOEMsT0FBekIsSUFDSSxDQUFDcEQsVUFBRCxDQURKLEdBRUksRUFITixDQURRO0FBQUE7QUFGWixDQXZKaUM7O0FBaUtqQztBQUNBO0FBQ0VHLFlBQVUsc0JBQUttRCx3QkFEakI7QUFFRWpELFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVWdELEdBQVgsQ0FBUjtBQUFBO0FBRlosQ0FsS2lDOztBQXVLakM7QUFDQTtBQUNFcEQsWUFBVSxzQkFBS3FELGVBRGpCO0FBRUVuRCxZQUFVO0FBQUEsV0FBUUMsS0FBS0MsSUFBTCxDQUFVa0QsV0FBbEI7QUFBQTtBQUZaLENBeEtpQzs7QUE2S2pDO0FBQ0E7QUFDRXRELFlBQVUsc0JBQUt1RCxpQkFEakI7QUFFRXJELFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVVUsS0FBWCxDQUFSO0FBQUE7QUFGWixDQTlLaUMsQ0FBbkM7O0FBb0xBOzs7Ozs7QUFNQSxTQUFTMEMsNEJBQVQsQ0FBc0NDLElBQXRDLEVBQXdEUixPQUF4RCxFQUE2RjtBQUMzRixNQUFNUyxNQUFNLElBQUlDLEdBQUosRUFBWjtBQUNBLE1BQU1DLFVBQVUsRUFBaEI7O0FBRUE3RCxTQUFPOEQsT0FBUCxDQUFlLGtCQUFVO0FBQ3ZCRCxzQkFBZ0JFLE9BQU85RCxRQUF2QixJQUFxQyxVQUFTRyxJQUFULEVBQWU7QUFDbEQsVUFBTTRELFFBQVFELE9BQU81RCxRQUFQLENBQWdCQyxJQUFoQixFQUFzQjhDLE9BQXRCLENBQWQ7QUFDQWMsWUFBTUYsT0FBTixDQUFjLGdCQUFRO0FBQ3BCLFlBQU1HLFFBQVEsOEJBQWU1RCxJQUFmLENBQWQ7QUFEb0I7QUFBQTtBQUFBOztBQUFBO0FBRXBCLCtCQUFtQjRELEtBQW5CLDhIQUEwQjtBQUFBLGdCQUFmQyxJQUFlOztBQUN4QlAsZ0JBQUlRLEdBQUosQ0FBUUQsSUFBUjtBQUNEO0FBSm1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLckIsT0FMRDtBQU1BLFdBQUtFLFFBQUwsQ0FBY2hFLElBQWQ7QUFDRCxLQVREO0FBVUQsR0FYRDs7QUFhQSx3QkFBS2lFLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQlosS0FBS00sS0FBTCxHQUFhLENBQWIsQ0FBakIsRUFBa0NILE9BQWxDO0FBQ0EsU0FBT0YsR0FBUDtBQUNEOztBQUVELFNBQVNSLGtCQUFULENBQTRCL0MsSUFBNUIsRUFBNEM4QyxPQUE1QyxFQUE2RTtBQUMzRSxNQUFNRyxNQUFNakQsS0FBS0MsSUFBTCxDQUFVNkQsSUFBdEI7QUFDQSxNQUFJLHNCQUFLSyxpQkFBTCxDQUF1QkMsS0FBdkIsQ0FBNkJuQixHQUE3QixDQUFKLEVBQXVDO0FBQ3JDLFdBQU8sQ0FBQ0gsUUFBUXVCLGdCQUFSLENBQXlCQyxHQUF6QixDQUE2QnJCLElBQUlzQixTQUFKLENBQWNULElBQTNDLENBQVI7QUFDRDtBQUNELE1BQUksc0JBQUtVLGFBQUwsQ0FBbUJKLEtBQW5CLENBQXlCbkIsR0FBekIsQ0FBSixFQUFtQztBQUNqQyxXQUFPLENBQUNILFFBQVF1QixnQkFBUixDQUF5QkMsR0FBekIsQ0FBNkJyQixJQUFJYSxJQUFqQyxDQUFSO0FBQ0Q7QUFDRCxTQUFPLElBQVA7QUFDRDs7QUFFRFcsT0FBT0MsT0FBUCxHQUFpQnJCLDRCQUFqQiIsImZpbGUiOiJnZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGUsIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBnZXRKU1hJZGVudGlmaWVyTmFtZSBmcm9tICcuL2dldEpTWElkZW50aWZpZXJOYW1lJztcbmltcG9ydCBnZXROYW1lc0Zyb21JRCBmcm9tICcuL2dldE5hbWVzRnJvbUlEJztcbmltcG9ydCBqc2NzIGZyb20gJ2pzY29kZXNoaWZ0JztcblxudHlwZSBDb25maWdFbnRyeSA9IHtcbiAgbm9kZVR5cGU6IHN0cmluZyxcbiAgZ2V0Tm9kZXM6IChwYXRoOiBOb2RlUGF0aCwgb3B0aW9uczogU291cmNlT3B0aW9ucykgPT4gQXJyYXk8Tm9kZT4sXG59O1xuXG5jb25zdCBSRUFDVF9OT0RFID0ganNjcy5pZGVudGlmaWVyKCdSZWFjdCcpO1xuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgd2F5cyBpbiB3aGljaCBvbmUgbWlnaHQgYWNjZXNzIGFuIHVuZGVjbGFyZWQgaWRlbnRpZmllci4gVGhpc1xuICogc2hvdWxkIG9ubHkgYXBwbHkgdG8gYWN0dWFsIGNvZGUsIG5vdCBhY2Nlc3NpbmcgdW5kZWNsYXJlZCB0eXBlcy5cbiAqL1xuY29uc3QgQ09ORklHOiBBcnJheTxDb25maWdFbnRyeT4gPSBbXG4gIC8vIGZvbztcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkV4cHJlc3Npb25TdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5leHByZXNzaW9uXSxcbiAgfSxcblxuICAvLyBmb28oYmFyKTtcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkNhbGxFeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuY2FsbGVlXS5jb25jYXQocGF0aC5ub2RlLmFyZ3VtZW50cyksXG4gIH0sXG5cbiAgLy8gZm9vLmRlY2xhcmVkO1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuTWVtYmVyRXhwcmVzc2lvbixcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLm9iamVjdF0sXG4gIH0sXG5cbiAgLy8gZm9vID0gYmFyO1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQXNzaWdubWVudEV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5sZWZ0LCBwYXRoLm5vZGUucmlnaHRdLFxuICB9LFxuXG4gIC8vIGNsYXNzIGRlY2xhcmVkIGV4dGVuZHMgZm9vIHt9XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5DbGFzc0RlY2xhcmF0aW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuc3VwZXJDbGFzc10sXG4gIH0sXG5cbiAgLy8gdmFyIGRlY2xhcmVkID0gZm9vO1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuVmFyaWFibGVEZWNsYXJhdG9yLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuaW5pdF0sXG4gIH0sXG5cbiAgLy8gc3dpdGNoIChkZWNsYXJlZCkgeyBjYXNlIGZvbzogYnJlYWs7IH1cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlN3aXRjaENhc2UsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS50ZXN0XSxcbiAgfSxcblxuICAvLyB7ZGVjbGFyZWQ6IGZvb31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLk9iamVjdEV4cHJlc3Npb24sXG4gICAgLy8gR2VuZXJhbGx5IHByb3BzIGhhdmUgYSB2YWx1ZSwgaWYgaXQgaXMgYSBzcHJlYWQgcHJvcGVydHkgaXQgZG9lc24ndC5cbiAgICBnZXROb2RlczogcGF0aCA9PiBwYXRoLm5vZGUucHJvcGVydGllcy5tYXAocHJvcCA9PiBwcm9wLnZhbHVlIHx8IHByb3ApLFxuICB9LFxuXG4gIC8vIHJldHVybiBmb287XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5SZXR1cm5TdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5hcmd1bWVudF0sXG4gIH0sXG5cbiAgLy8gaWYgKGZvbykge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLklmU3RhdGVtZW50LFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUudGVzdF0sXG4gIH0sXG5cbiAgLy8gc3dpdGNoIChmb28pIHt9XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5Td2l0Y2hTdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5kaXNjcmltaW5hbnRdLFxuICB9LFxuXG4gIC8vICFmb287XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5VbmFyeUV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5hcmd1bWVudF0sXG4gIH0sXG5cbiAgLy8gZm9vIHx8IGJhcjtcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkJpbmFyeUV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5sZWZ0LCBwYXRoLm5vZGUucmlnaHRdLFxuICB9LFxuXG4gIC8vIGZvbyA8IGJhcjtcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkxvZ2ljYWxFeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUubGVmdCwgcGF0aC5ub2RlLnJpZ2h0XSxcbiAgfSxcblxuICAvLyBmb28gPyBiYXIgOiBiYXo7XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5Db25kaXRpb25hbEV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW1xuICAgICAgcGF0aC5ub2RlLnRlc3QsXG4gICAgICBwYXRoLm5vZGUuYWx0ZXJuYXRlLFxuICAgICAgcGF0aC5ub2RlLmNvbnNlcXVlbnQsXG4gICAgXSxcbiAgfSxcblxuICAvLyBuZXcgRm9vKClcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLk5ld0V4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5jYWxsZWVdLmNvbmNhdChwYXRoLm5vZGUuYXJndW1lbnRzKSxcbiAgfSxcblxuICAvLyBmb28rKztcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlVwZGF0ZUV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5hcmd1bWVudF0sXG4gIH0sXG5cbiAgLy8gPEVsZW1lbnQgYXR0cmlidXRlPXtmb299IC8+XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5KU1hFeHByZXNzaW9uQ29udGFpbmVyLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuZXhwcmVzc2lvbl0sXG4gIH0sXG5cbiAgLy8gZm9yIChmb28gaW4gYmFyKSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuRm9ySW5TdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5sZWZ0LCBwYXRoLm5vZGUucmlnaHRdLFxuICB9LFxuXG4gIC8vIGZvciAoZm9vIG9mIGJhcikge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkZvck9mU3RhdGVtZW50LFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUubGVmdCwgcGF0aC5ub2RlLnJpZ2h0XSxcbiAgfSxcblxuICAvLyBmb3IgKGZvbzsgYmFyOyBiYXopIHt9XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5Gb3JTdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5pbml0LCBwYXRoLm5vZGUudGVzdCwgcGF0aC5ub2RlLnVwZGF0ZV0sXG4gIH0sXG5cbiAgLy8gd2hpbGUgKGZvbykge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLldoaWxlU3RhdGVtZW50LFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUudGVzdF0sXG4gIH0sXG5cbiAgLy8gZG8ge30gd2hpbGUgKGZvbylcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkRvV2hpbGVTdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS50ZXN0XSxcbiAgfSxcblxuICAvLyBbZm9vXVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQXJyYXlFeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IHBhdGgubm9kZS5lbGVtZW50cyxcbiAgfSxcblxuICAvLyBTcGVjaWFsIGNhc2UuIEFueSBKU1ggZWxlbWVudHMgd2lsbCBnZXQgdHJhbnNwaWxlZCB0byB1c2UgUmVhY3QuXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5KU1hPcGVuaW5nRWxlbWVudCxcbiAgICBnZXROb2RlczogKHBhdGgsIG9wdGlvbnMpID0+XG4gICAgICBnZXRKU1hJZGVudGlmaWVyTmFtZShwYXRoKS5jb25jYXQoXG4gICAgICAgIHNob3VsZFJlcXVpcmVSZWFjdChwYXRoLCBvcHRpb25zKVxuICAgICAgICAgID8gW1JFQUNUX05PREVdXG4gICAgICAgICAgOiBbXSxcbiAgICAgICksXG4gIH0sXG5cbiAgLy8gZm9vYHNvbWV0aGluZ2BcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbixcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLnRhZ10sXG4gIH0sXG5cbiAgLy8gYCR7YmFyfWBcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlRlbXBsYXRlTGl0ZXJhbCxcbiAgICBnZXROb2RlczogcGF0aCA9PiBwYXRoLm5vZGUuZXhwcmVzc2lvbnMsXG4gIH0sXG5cbiAgLy8gZnVuY3Rpb24gZm9vKGEgPSBiKSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQXNzaWdubWVudFBhdHRlcm4sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5yaWdodF0sXG4gIH0sXG5dO1xuXG4vKipcbiAqIFRoaXMgd2lsbCBnZXQgYSBsaXN0IG9mIGFsbCBpZGVudGlmaWVycyB0aGF0IGFyZSBub3QgZnJvbSBhIGRlY2xhcmF0aW9uLlxuICpcbiAqIE5PVEU6IHRoaXMgY2FuIGdldCBpZGVudGlmaWVycyB0aGF0IGFyZSBkZWNsYXJlZCwgaWYgeW91IHdhbnQgYWNjZXNzIHRvXG4gKiBpZGVudGlmaWVycyB0aGF0IGFyZSBhY2Nlc3MgYnV0IHVuZGVjbGFyZWQgc2VlIGdldFVuZGVjbGFyZWRJZGVudGlmaWVyc1xuICovXG5mdW5jdGlvbiBnZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzKHJvb3Q6IENvbGxlY3Rpb24sIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMpOiBTZXQ8c3RyaW5nPiB7XG4gIGNvbnN0IGlkcyA9IG5ldyBTZXQoKTtcbiAgY29uc3QgdmlzaXRvciA9IHt9O1xuXG4gIENPTkZJRy5mb3JFYWNoKGNvbmZpZyA9PiB7XG4gICAgdmlzaXRvcltgdmlzaXQke2NvbmZpZy5ub2RlVHlwZX1gXSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgIGNvbnN0IG5vZGVzID0gY29uZmlnLmdldE5vZGVzKHBhdGgsIG9wdGlvbnMpO1xuICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgY29uc3QgbmFtZXMgPSBnZXROYW1lc0Zyb21JRChub2RlKTtcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSB7XG4gICAgICAgICAgaWRzLmFkZChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnRyYXZlcnNlKHBhdGgpO1xuICAgIH07XG4gIH0pO1xuXG4gIGpzY3MudHlwZXMudmlzaXQocm9vdC5ub2RlcygpWzBdLCB2aXNpdG9yKTtcbiAgcmV0dXJuIGlkcztcbn1cblxuZnVuY3Rpb24gc2hvdWxkUmVxdWlyZVJlYWN0KHBhdGg6IE5vZGVQYXRoLCBvcHRpb25zOiBTb3VyY2VPcHRpb25zKTogYm9vbGVhbiB7XG4gIGNvbnN0IHRhZyA9IHBhdGgubm9kZS5uYW1lO1xuICBpZiAoanNjcy5KU1hOYW1lc3BhY2VkTmFtZS5jaGVjayh0YWcpKSB7XG4gICAgcmV0dXJuICFvcHRpb25zLmpzeE5vblJlYWN0TmFtZXMuaGFzKHRhZy5uYW1lc3BhY2UubmFtZSk7XG4gIH1cbiAgaWYgKGpzY3MuSlNYSWRlbnRpZmllci5jaGVjayh0YWcpKSB7XG4gICAgcmV0dXJuICFvcHRpb25zLmpzeE5vblJlYWN0TmFtZXMuaGFzKHRhZy5uYW1lKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzO1xuIl19