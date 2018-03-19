'use strict';

var _getJSXIdentifierName;

function _load_getJSXIdentifierName() {
  return _getJSXIdentifierName = _interopRequireDefault(require('./getJSXIdentifierName'));
}

var _getNamesFromID;

function _load_getNamesFromID() {
  return _getNamesFromID = _interopRequireDefault(require('./getNamesFromID'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var REACT_NODE = (_jscodeshift || _load_jscodeshift()).default.identifier('React');

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
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ExpressionStatement,
  getNodes: function getNodes(path) {
    return [path.node.expression];
  }
},

// foo(bar);
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.CallExpression,
  getNodes: function getNodes(path) {
    return [path.node.callee].concat(path.node.arguments);
  }
},

// foo.declared;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.MemberExpression,
  getNodes: function getNodes(path) {
    return [path.node.object];
  }
},

// foo = bar;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.AssignmentExpression,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// class declared extends foo {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ClassDeclaration,
  getNodes: function getNodes(path) {
    return [path.node.superClass];
  }
},

// var declared = foo;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.VariableDeclarator,
  getNodes: function getNodes(path) {
    return [path.node.init];
  }
},

// switch (declared) { case foo: break; }
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.SwitchCase,
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// {declared: foo}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ObjectExpression,
  // Generally props have a value, if it is a spread property it doesn't.
  getNodes: function getNodes(path) {
    return path.node.properties.map(function (prop) {
      return prop.value || prop;
    });
  }
},

// return foo;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ReturnStatement,
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// if (foo) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.IfStatement,
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// switch (foo) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.SwitchStatement,
  getNodes: function getNodes(path) {
    return [path.node.discriminant];
  }
},

// !foo;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.UnaryExpression,
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// foo || bar;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.BinaryExpression,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// foo < bar;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.LogicalExpression,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// foo ? bar : baz;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ConditionalExpression,
  getNodes: function getNodes(path) {
    return [path.node.test, path.node.alternate, path.node.consequent];
  }
},

// new Foo()
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.NewExpression,
  getNodes: function getNodes(path) {
    return [path.node.callee].concat(path.node.arguments);
  }
},

// foo++;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.UpdateExpression,
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// <Element attribute={foo} />
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.JSXExpressionContainer,
  getNodes: function getNodes(path) {
    return [path.node.expression];
  }
},

// for (foo in bar) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ForInStatement,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// for (foo of bar) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ForOfStatement,
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// for (foo; bar; baz) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ForStatement,
  getNodes: function getNodes(path) {
    return [path.node.init, path.node.test, path.node.update];
  }
},

// while (foo) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.WhileStatement,
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// do {} while (foo)
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.DoWhileStatement,
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// [foo]
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ArrayExpression,
  getNodes: function getNodes(path) {
    return path.node.elements;
  }
},

// Special case. Any JSX elements will get transpiled to use React.
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.JSXOpeningElement,
  getNodes: function getNodes(path, options) {
    return (0, (_getJSXIdentifierName || _load_getJSXIdentifierName()).default)(path).concat(shouldRequireReact(path, options) ? [REACT_NODE] : []);
  }
},

// Special case. Any JSX fragment will get transpiled to use React.
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.JSXFragment,
  getNodes: function getNodes(path, options) {
    return [REACT_NODE];
  }
},

// foo`something`
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.TaggedTemplateExpression,
  getNodes: function getNodes(path) {
    return [path.node.tag];
  }
},

// `${bar}`
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.TemplateLiteral,
  getNodes: function getNodes(path) {
    return path.node.expressions;
  }
},

// function foo(a = b) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.AssignmentPattern,
  getNodes: function getNodes(path) {
    return [path.node.right];
  }
},

// (foo: SomeType)
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.TypeCastExpression,
  getNodes: function getNodes(path) {
    return [path.node.expression];
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
        var names = (0, (_getNamesFromID || _load_getNamesFromID()).default)(node);
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

  (_jscodeshift || _load_jscodeshift()).default.types.visit(root.nodes()[0], visitor);
  return ids;
}

function shouldRequireReact(path, options) {
  var tag = path.node.name;
  if ((_jscodeshift || _load_jscodeshift()).default.JSXNamespacedName.check(tag)) {
    return !options.jsxNonReactNames.has(tag.namespace.name);
  }
  if ((_jscodeshift || _load_jscodeshift()).default.JSXIdentifier.check(tag)) {
    return !options.jsxNonReactNames.has(tag.name);
  }
  return true;
}

module.exports = getNonDeclarationIdentifiers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycy5qcyJdLCJuYW1lcyI6WyJSRUFDVF9OT0RFIiwiaWRlbnRpZmllciIsIkNPTkZJRyIsIm5vZGVUeXBlIiwiRXhwcmVzc2lvblN0YXRlbWVudCIsImdldE5vZGVzIiwicGF0aCIsIm5vZGUiLCJleHByZXNzaW9uIiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJjb25jYXQiLCJhcmd1bWVudHMiLCJNZW1iZXJFeHByZXNzaW9uIiwib2JqZWN0IiwiQXNzaWdubWVudEV4cHJlc3Npb24iLCJsZWZ0IiwicmlnaHQiLCJDbGFzc0RlY2xhcmF0aW9uIiwic3VwZXJDbGFzcyIsIlZhcmlhYmxlRGVjbGFyYXRvciIsImluaXQiLCJTd2l0Y2hDYXNlIiwidGVzdCIsIk9iamVjdEV4cHJlc3Npb24iLCJwcm9wZXJ0aWVzIiwibWFwIiwicHJvcCIsInZhbHVlIiwiUmV0dXJuU3RhdGVtZW50IiwiYXJndW1lbnQiLCJJZlN0YXRlbWVudCIsIlN3aXRjaFN0YXRlbWVudCIsImRpc2NyaW1pbmFudCIsIlVuYXJ5RXhwcmVzc2lvbiIsIkJpbmFyeUV4cHJlc3Npb24iLCJMb2dpY2FsRXhwcmVzc2lvbiIsIkNvbmRpdGlvbmFsRXhwcmVzc2lvbiIsImFsdGVybmF0ZSIsImNvbnNlcXVlbnQiLCJOZXdFeHByZXNzaW9uIiwiVXBkYXRlRXhwcmVzc2lvbiIsIkpTWEV4cHJlc3Npb25Db250YWluZXIiLCJGb3JJblN0YXRlbWVudCIsIkZvck9mU3RhdGVtZW50IiwiRm9yU3RhdGVtZW50IiwidXBkYXRlIiwiV2hpbGVTdGF0ZW1lbnQiLCJEb1doaWxlU3RhdGVtZW50IiwiQXJyYXlFeHByZXNzaW9uIiwiZWxlbWVudHMiLCJKU1hPcGVuaW5nRWxlbWVudCIsIm9wdGlvbnMiLCJzaG91bGRSZXF1aXJlUmVhY3QiLCJKU1hGcmFnbWVudCIsIlRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbiIsInRhZyIsIlRlbXBsYXRlTGl0ZXJhbCIsImV4cHJlc3Npb25zIiwiQXNzaWdubWVudFBhdHRlcm4iLCJUeXBlQ2FzdEV4cHJlc3Npb24iLCJnZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzIiwicm9vdCIsImlkcyIsIlNldCIsInZpc2l0b3IiLCJmb3JFYWNoIiwiY29uZmlnIiwibm9kZXMiLCJuYW1lcyIsIm5hbWUiLCJhZGQiLCJ0cmF2ZXJzZSIsInR5cGVzIiwidmlzaXQiLCJKU1hOYW1lc3BhY2VkTmFtZSIsImNoZWNrIiwianN4Tm9uUmVhY3ROYW1lcyIsImhhcyIsIm5hbWVzcGFjZSIsIkpTWElkZW50aWZpZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBYUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBT0EsSUFBTUEsYUFBYSw4Q0FBS0MsVUFBTCxDQUFnQixPQUFoQixDQUFuQjs7QUFFQTs7OztBQXhCQTs7Ozs7Ozs7OztBQTRCQSxJQUFNQyxTQUE2QjtBQUNqQztBQUNBO0FBQ0VDLFlBQVUsOENBQUtDLG1CQURqQjtBQUVFQyxZQUFVO0FBQUEsV0FBUSxDQUFDQyxLQUFLQyxJQUFMLENBQVVDLFVBQVgsQ0FBUjtBQUFBO0FBRlosQ0FGaUM7O0FBT2pDO0FBQ0E7QUFDRUwsWUFBVSw4Q0FBS00sY0FEakI7QUFFRUosWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVRyxNQUFYLEVBQW1CQyxNQUFuQixDQUEwQkwsS0FBS0MsSUFBTCxDQUFVSyxTQUFwQyxDQUFSO0FBQUE7QUFGWixDQVJpQzs7QUFhakM7QUFDQTtBQUNFVCxZQUFVLDhDQUFLVSxnQkFEakI7QUFFRVIsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVTyxNQUFYLENBQVI7QUFBQTtBQUZaLENBZGlDOztBQW1CakM7QUFDQTtBQUNFWCxZQUFVLDhDQUFLWSxvQkFEakI7QUFFRVYsWUFBVTtBQUFBLFdBQVEsQ0FB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akIiLCJmaWxlIjoiZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtDb2xsZWN0aW9uLCBOb2RlLCBOb2RlUGF0aH0gZnJvbSAnLi4vdHlwZXMvYXN0JztcbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG5pbXBvcnQgZ2V0SlNYSWRlbnRpZmllck5hbWUgZnJvbSAnLi9nZXRKU1hJZGVudGlmaWVyTmFtZSc7XG5pbXBvcnQgZ2V0TmFtZXNGcm9tSUQgZnJvbSAnLi9nZXROYW1lc0Zyb21JRCc7XG5pbXBvcnQganNjcyBmcm9tICcuL2pzY29kZXNoaWZ0JztcblxudHlwZSBDb25maWdFbnRyeSA9IHtcbiAgbm9kZVR5cGU6IHN0cmluZyxcbiAgZ2V0Tm9kZXM6IChwYXRoOiBOb2RlUGF0aCwgb3B0aW9uczogU291cmNlT3B0aW9ucykgPT4gQXJyYXk8Tm9kZT4sXG59O1xuXG5jb25zdCBSRUFDVF9OT0RFID0ganNjcy5pZGVudGlmaWVyKCdSZWFjdCcpO1xuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgd2F5cyBpbiB3aGljaCBvbmUgbWlnaHQgYWNjZXNzIGFuIHVuZGVjbGFyZWQgaWRlbnRpZmllci4gVGhpc1xuICogc2hvdWxkIG9ubHkgYXBwbHkgdG8gYWN0dWFsIGNvZGUsIG5vdCBhY2Nlc3NpbmcgdW5kZWNsYXJlZCB0eXBlcy5cbiAqL1xuY29uc3QgQ09ORklHOiBBcnJheTxDb25maWdFbnRyeT4gPSBbXG4gIC8vIGZvbztcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkV4cHJlc3Npb25TdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5leHByZXNzaW9uXSxcbiAgfSxcblxuICAvLyBmb28oYmFyKTtcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkNhbGxFeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuY2FsbGVlXS5jb25jYXQocGF0aC5ub2RlLmFyZ3VtZW50cyksXG4gIH0sXG5cbiAgLy8gZm9vLmRlY2xhcmVkO1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuTWVtYmVyRXhwcmVzc2lvbixcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLm9iamVjdF0sXG4gIH0sXG5cbiAgLy8gZm9vID0gYmFyO1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQXNzaWdubWVudEV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5sZWZ0LCBwYXRoLm5vZGUucmlnaHRdLFxuICB9LFxuXG4gIC8vIGNsYXNzIGRlY2xhcmVkIGV4dGVuZHMgZm9vIHt9XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5DbGFzc0RlY2xhcmF0aW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuc3VwZXJDbGFzc10sXG4gIH0sXG5cbiAgLy8gdmFyIGRlY2xhcmVkID0gZm9vO1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuVmFyaWFibGVEZWNsYXJhdG9yLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuaW5pdF0sXG4gIH0sXG5cbiAgLy8gc3dpdGNoIChkZWNsYXJlZCkgeyBjYXNlIGZvbzogYnJlYWs7IH1cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlN3aXRjaENhc2UsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS50ZXN0XSxcbiAgfSxcblxuICAvLyB7ZGVjbGFyZWQ6IGZvb31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLk9iamVjdEV4cHJlc3Npb24sXG4gICAgLy8gR2VuZXJhbGx5IHByb3BzIGhhdmUgYSB2YWx1ZSwgaWYgaXQgaXMgYSBzcHJlYWQgcHJvcGVydHkgaXQgZG9lc24ndC5cbiAgICBnZXROb2RlczogcGF0aCA9PiBwYXRoLm5vZGUucHJvcGVydGllcy5tYXAocHJvcCA9PiBwcm9wLnZhbHVlIHx8IHByb3ApLFxuICB9LFxuXG4gIC8vIHJldHVybiBmb287XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5SZXR1cm5TdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5hcmd1bWVudF0sXG4gIH0sXG5cbiAgLy8gaWYgKGZvbykge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLklmU3RhdGVtZW50LFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUudGVzdF0sXG4gIH0sXG5cbiAgLy8gc3dpdGNoIChmb28pIHt9XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5Td2l0Y2hTdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5kaXNjcmltaW5hbnRdLFxuICB9LFxuXG4gIC8vICFmb287XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5VbmFyeUV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5hcmd1bWVudF0sXG4gIH0sXG5cbiAgLy8gZm9vIHx8IGJhcjtcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkJpbmFyeUV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5sZWZ0LCBwYXRoLm5vZGUucmlnaHRdLFxuICB9LFxuXG4gIC8vIGZvbyA8IGJhcjtcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkxvZ2ljYWxFeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUubGVmdCwgcGF0aC5ub2RlLnJpZ2h0XSxcbiAgfSxcblxuICAvLyBmb28gPyBiYXIgOiBiYXo7XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5Db25kaXRpb25hbEV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW1xuICAgICAgcGF0aC5ub2RlLnRlc3QsXG4gICAgICBwYXRoLm5vZGUuYWx0ZXJuYXRlLFxuICAgICAgcGF0aC5ub2RlLmNvbnNlcXVlbnQsXG4gICAgXSxcbiAgfSxcblxuICAvLyBuZXcgRm9vKClcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLk5ld0V4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5jYWxsZWVdLmNvbmNhdChwYXRoLm5vZGUuYXJndW1lbnRzKSxcbiAgfSxcblxuICAvLyBmb28rKztcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlVwZGF0ZUV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5hcmd1bWVudF0sXG4gIH0sXG5cbiAgLy8gPEVsZW1lbnQgYXR0cmlidXRlPXtmb299IC8+XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5KU1hFeHByZXNzaW9uQ29udGFpbmVyLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuZXhwcmVzc2lvbl0sXG4gIH0sXG5cbiAgLy8gZm9yIChmb28gaW4gYmFyKSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuRm9ySW5TdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5sZWZ0LCBwYXRoLm5vZGUucmlnaHRdLFxuICB9LFxuXG4gIC8vIGZvciAoZm9vIG9mIGJhcikge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkZvck9mU3RhdGVtZW50LFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUubGVmdCwgcGF0aC5ub2RlLnJpZ2h0XSxcbiAgfSxcblxuICAvLyBmb3IgKGZvbzsgYmFyOyBiYXopIHt9XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5Gb3JTdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5pbml0LCBwYXRoLm5vZGUudGVzdCwgcGF0aC5ub2RlLnVwZGF0ZV0sXG4gIH0sXG5cbiAgLy8gd2hpbGUgKGZvbykge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLldoaWxlU3RhdGVtZW50LFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUudGVzdF0sXG4gIH0sXG5cbiAgLy8gZG8ge30gd2hpbGUgKGZvbylcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkRvV2hpbGVTdGF0ZW1lbnQsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS50ZXN0XSxcbiAgfSxcblxuICAvLyBbZm9vXVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQXJyYXlFeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IHBhdGgubm9kZS5lbGVtZW50cyxcbiAgfSxcblxuICAvLyBTcGVjaWFsIGNhc2UuIEFueSBKU1ggZWxlbWVudHMgd2lsbCBnZXQgdHJhbnNwaWxlZCB0byB1c2UgUmVhY3QuXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5KU1hPcGVuaW5nRWxlbWVudCxcbiAgICBnZXROb2RlczogKHBhdGgsIG9wdGlvbnMpID0+XG4gICAgICBnZXRKU1hJZGVudGlmaWVyTmFtZShwYXRoKS5jb25jYXQoXG4gICAgICAgIHNob3VsZFJlcXVpcmVSZWFjdChwYXRoLCBvcHRpb25zKVxuICAgICAgICAgID8gW1JFQUNUX05PREVdXG4gICAgICAgICAgOiBbXSxcbiAgICAgICksXG4gIH0sXG5cbiAgLy8gU3BlY2lhbCBjYXNlLiBBbnkgSlNYIGZyYWdtZW50IHdpbGwgZ2V0IHRyYW5zcGlsZWQgdG8gdXNlIFJlYWN0LlxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuSlNYRnJhZ21lbnQsXG4gICAgZ2V0Tm9kZXM6IChwYXRoLCBvcHRpb25zKSA9PiBbUkVBQ1RfTk9ERV0sXG4gIH0sXG5cbiAgLy8gZm9vYHNvbWV0aGluZ2BcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbixcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLnRhZ10sXG4gIH0sXG5cbiAgLy8gYCR7YmFyfWBcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLlRlbXBsYXRlTGl0ZXJhbCxcbiAgICBnZXROb2RlczogcGF0aCA9PiBwYXRoLm5vZGUuZXhwcmVzc2lvbnMsXG4gIH0sXG5cbiAgLy8gZnVuY3Rpb24gZm9vKGEgPSBiKSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQXNzaWdubWVudFBhdHRlcm4sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5yaWdodF0sXG4gIH0sXG5cbiAgLy8gKGZvbzogU29tZVR5cGUpXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5UeXBlQ2FzdEV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5leHByZXNzaW9uXSxcbiAgfSxcbl07XG5cbi8qKlxuICogVGhpcyB3aWxsIGdldCBhIGxpc3Qgb2YgYWxsIGlkZW50aWZpZXJzIHRoYXQgYXJlIG5vdCBmcm9tIGEgZGVjbGFyYXRpb24uXG4gKlxuICogTk9URTogdGhpcyBjYW4gZ2V0IGlkZW50aWZpZXJzIHRoYXQgYXJlIGRlY2xhcmVkLCBpZiB5b3Ugd2FudCBhY2Nlc3MgdG9cbiAqIGlkZW50aWZpZXJzIHRoYXQgYXJlIGFjY2VzcyBidXQgdW5kZWNsYXJlZCBzZWUgZ2V0VW5kZWNsYXJlZElkZW50aWZpZXJzXG4gKi9cbmZ1bmN0aW9uIGdldE5vbkRlY2xhcmF0aW9uSWRlbnRpZmllcnMocm9vdDogQ29sbGVjdGlvbiwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgaWRzID0gbmV3IFNldCgpO1xuICBjb25zdCB2aXNpdG9yID0ge307XG5cbiAgQ09ORklHLmZvckVhY2goY29uZmlnID0+IHtcbiAgICB2aXNpdG9yW2B2aXNpdCR7Y29uZmlnLm5vZGVUeXBlfWBdID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgY29uc3Qgbm9kZXMgPSBjb25maWcuZ2V0Tm9kZXMocGF0aCwgb3B0aW9ucyk7XG5cbiAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWVzID0gZ2V0TmFtZXNGcm9tSUQobm9kZSk7XG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBuYW1lcykge1xuICAgICAgICAgIGlkcy5hZGQobmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy50cmF2ZXJzZShwYXRoKTtcbiAgICB9O1xuICB9KTtcblxuICBqc2NzLnR5cGVzLnZpc2l0KHJvb3Qubm9kZXMoKVswXSwgdmlzaXRvcik7XG4gIHJldHVybiBpZHM7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFJlcXVpcmVSZWFjdChwYXRoOiBOb2RlUGF0aCwgb3B0aW9uczogU291cmNlT3B0aW9ucyk6IGJvb2xlYW4ge1xuICBjb25zdCB0YWcgPSBwYXRoLm5vZGUubmFtZTtcbiAgaWYgKGpzY3MuSlNYTmFtZXNwYWNlZE5hbWUuY2hlY2sodGFnKSkge1xuICAgIHJldHVybiAhb3B0aW9ucy5qc3hOb25SZWFjdE5hbWVzLmhhcyh0YWcubmFtZXNwYWNlLm5hbWUpO1xuICB9XG4gIGlmIChqc2NzLkpTWElkZW50aWZpZXIuY2hlY2sodGFnKSkge1xuICAgIHJldHVybiAhb3B0aW9ucy5qc3hOb25SZWFjdE5hbWVzLmhhcyh0YWcubmFtZSk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycztcbiJdfQ==