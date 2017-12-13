'use strict';

var _getNamesFromID;

function _load_getNamesFromID() {
  return _getNamesFromID = _interopRequireDefault(require('./getNamesFromID'));
}

var _isValueImport;

function _load_isValueImport() {
  return _isValueImport = _interopRequireDefault(require('../utils/isValueImport'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('jscodeshift'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These are the ways in which an identifier might be declared, note that these
 * identifiers are safe to use in code. They should not include types that have
 * been declared.
 */
var CONFIG = [
// import ...rest from ...
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ImportDeclaration,
  getNodes: function getNodes(path) {
    return (0, (_isValueImport || _load_isValueImport()).default)(path.node) ? path.node.specifiers.map(function (specifier) {
      return specifier.local;
    }) : [];
  }
},

// function foo(...rest) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.FunctionDeclaration,
  getNodes: function getNodes(path) {
    return [path.node.id, path.node.rest].concat(path.node.params);
  }
},

// foo(...rest) {}, in a class body for example
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.FunctionExpression,
  getNodes: function getNodes(path) {
    return [path.node.rest].concat(path.node.params);
  }
},

// class {foo(...rest) {}}, class method
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ClassMethod,
  getNodes: function getNodes(path) {
    return path.node.params;
  }
},

// x = {foo(...rest) {}}, object method
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ObjectMethod,
  getNodes: function getNodes(path) {
    return path.node.params;
  }
},

// var foo;
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.VariableDeclaration,
  getNodes: function getNodes(path) {
    return path.node.declarations.map(function (declaration) {
      return declaration.id;
    });
  }
},

// class foo {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ClassDeclaration,
  getNodes: function getNodes(path) {
    return [path.node.id];
  }
},

// (foo, ...rest) => {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.ArrowFunctionExpression,
  getNodes: function getNodes(path) {
    return [path.node.rest].concat(path.node.params);
  }
},

// try {} catch (foo) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.CatchClause,
  getNodes: function getNodes(path) {
    return [path.node.param];
  }
},

// function foo(a = b) {}
{
  nodeType: (_jscodeshift || _load_jscodeshift()).default.AssignmentPattern,
  getNodes: function getNodes(path) {
    return [path.node.left];
  }
}];

/**
 * This will get a list of all identifiers that are declared within root's AST
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

function getDeclaredIdentifiers(root, options, filters) {
  // Start with the globals since they are always "declared" and safe to use.
  var moduleMap = options.moduleMap;

  var ids = new Set(moduleMap.getBuiltIns());
  var visitor = {};
  CONFIG.forEach(function (config) {
    visitor['visit' + config.nodeType] = function (path) {
      if (!filters || filters.every(function (filter) {
        return filter(path);
      })) {
        var nodes = config.getNodes(path);
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
      }
      this.traverse(path);
    };
  });
  (_jscodeshift || _load_jscodeshift()).default.types.visit(root.nodes()[0], visitor);
  return ids;
}

module.exports = getDeclaredIdentifiers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0RGVjbGFyZWRJZGVudGlmaWVycy5qcyJdLCJuYW1lcyI6WyJDT05GSUciLCJub2RlVHlwZSIsIkltcG9ydERlY2xhcmF0aW9uIiwiZ2V0Tm9kZXMiLCJwYXRoIiwibm9kZSIsInNwZWNpZmllcnMiLCJtYXAiLCJzcGVjaWZpZXIiLCJsb2NhbCIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJpZCIsInJlc3QiLCJjb25jYXQiLCJwYXJhbXMiLCJGdW5jdGlvbkV4cHJlc3Npb24iLCJDbGFzc01ldGhvZCIsIk9iamVjdE1ldGhvZCIsIlZhcmlhYmxlRGVjbGFyYXRpb24iLCJkZWNsYXJhdGlvbnMiLCJkZWNsYXJhdGlvbiIsIkNsYXNzRGVjbGFyYXRpb24iLCJBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiIsIkNhdGNoQ2xhdXNlIiwicGFyYW0iLCJBc3NpZ25tZW50UGF0dGVybiIsImxlZnQiLCJnZXREZWNsYXJlZElkZW50aWZpZXJzIiwicm9vdCIsIm9wdGlvbnMiLCJmaWx0ZXJzIiwibW9kdWxlTWFwIiwiaWRzIiwiU2V0IiwiZ2V0QnVpbHRJbnMiLCJ2aXNpdG9yIiwiZm9yRWFjaCIsImNvbmZpZyIsImV2ZXJ5IiwiZmlsdGVyIiwibm9kZXMiLCJuYW1lcyIsIm5hbWUiLCJhZGQiLCJ0cmF2ZXJzZSIsInR5cGVzIiwidmlzaXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBYUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBT0E7Ozs7O0FBS0EsSUFBTUEsU0FBNkI7QUFDakM7QUFDQTtBQUNFQyxZQUFVLDhDQUFLQyxpQkFEakI7QUFFRUMsWUFBVTtBQUFBLFdBQ1AsdURBQWNDLEtBQUtDLElBQW5CLElBQ0dELEtBQUtDLElBQUwsQ0FBVUMsVUFBVixDQUFxQkMsR0FBckIsQ0FBeUI7QUFBQSxhQUFhQyxVQUFVQyxLQUF2QjtBQUFBLEtB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QUFSO0FBQ0Q7QUFKbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtyQixTQUxEO0FBTUQ7QUFDRCxXQUFLRSxRQUFMLENBQWN4QyxJQUFkO0FBQ0QsS0FYRDtBQVlELEdBYkQ7QUFjQSxnREFBS3lDLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQmxCLEtBQUtZLEtBQUwsR0FBYSxDQUFiLENBQWpCLEVBQWtDTCxPQUFsQztBQUNBLFNBQU9ILEdBQVA7QUFDRDs7QUFFRGUsT0FBT0MsT0FBUCxHQUFpQnJCLHNCQUFqQiIsImZpbGUiOiJnZXREZWNsYXJlZElkZW50aWZpZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGUsIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBnZXROYW1lc0Zyb21JRCBmcm9tICcuL2dldE5hbWVzRnJvbUlEJztcbmltcG9ydCBpc1ZhbHVlSW1wb3J0IGZyb20gJy4uL3V0aWxzL2lzVmFsdWVJbXBvcnQnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG50eXBlIENvbmZpZ0VudHJ5ID0ge1xuICBub2RlVHlwZTogc3RyaW5nLFxuICBnZXROb2RlczogKHBhdGg6IE5vZGVQYXRoKSA9PiBBcnJheTxOb2RlPixcbn07XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSB3YXlzIGluIHdoaWNoIGFuIGlkZW50aWZpZXIgbWlnaHQgYmUgZGVjbGFyZWQsIG5vdGUgdGhhdCB0aGVzZVxuICogaWRlbnRpZmllcnMgYXJlIHNhZmUgdG8gdXNlIGluIGNvZGUuIFRoZXkgc2hvdWxkIG5vdCBpbmNsdWRlIHR5cGVzIHRoYXQgaGF2ZVxuICogYmVlbiBkZWNsYXJlZC5cbiAqL1xuY29uc3QgQ09ORklHOiBBcnJheTxDb25maWdFbnRyeT4gPSBbXG4gIC8vIGltcG9ydCAuLi5yZXN0IGZyb20gLi4uXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5JbXBvcnREZWNsYXJhdGlvbixcbiAgICBnZXROb2RlczogcGF0aCA9PlxuICAgICAgKGlzVmFsdWVJbXBvcnQocGF0aC5ub2RlKVxuICAgICAgICA/IHBhdGgubm9kZS5zcGVjaWZpZXJzLm1hcChzcGVjaWZpZXIgPT4gc3BlY2lmaWVyLmxvY2FsKVxuICAgICAgICA6IFtdKSxcbiAgfSxcblxuICAvLyBmdW5jdGlvbiBmb28oLi4ucmVzdCkge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkZ1bmN0aW9uRGVjbGFyYXRpb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5pZCwgcGF0aC5ub2RlLnJlc3RdLmNvbmNhdChwYXRoLm5vZGUucGFyYW1zKSxcbiAgfSxcblxuICAvLyBmb28oLi4ucmVzdCkge30sIGluIGEgY2xhc3MgYm9keSBmb3IgZXhhbXBsZVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuRnVuY3Rpb25FeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUucmVzdF0uY29uY2F0KHBhdGgubm9kZS5wYXJhbXMpLFxuICB9LFxuXG4gIC8vIGNsYXNzIHtmb28oLi4ucmVzdCkge319LCBjbGFzcyBtZXRob2RcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkNsYXNzTWV0aG9kLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IHBhdGgubm9kZS5wYXJhbXMsXG4gIH0sXG5cbiAgLy8geCA9IHtmb28oLi4ucmVzdCkge319LCBvYmplY3QgbWV0aG9kXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5PYmplY3RNZXRob2QsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gcGF0aC5ub2RlLnBhcmFtcyxcbiAgfSxcblxuICAvLyB2YXIgZm9vO1xuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuVmFyaWFibGVEZWNsYXJhdGlvbixcbiAgICBnZXROb2RlczogcGF0aCA9PiBwYXRoLm5vZGUuZGVjbGFyYXRpb25zLm1hcChkZWNsYXJhdGlvbiA9PiBkZWNsYXJhdGlvbi5pZCksXG4gIH0sXG5cbiAgLy8gY2xhc3MgZm9vIHt9XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5DbGFzc0RlY2xhcmF0aW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuaWRdLFxuICB9LFxuXG4gIC8vIChmb28sIC4uLnJlc3QpID0+IHt9XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbixcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLnJlc3RdLmNvbmNhdChwYXRoLm5vZGUucGFyYW1zKSxcbiAgfSxcblxuICAvLyB0cnkge30gY2F0Y2ggKGZvbykge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkNhdGNoQ2xhdXNlLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUucGFyYW1dLFxuICB9LFxuXG4gIC8vIGZ1bmN0aW9uIGZvbyhhID0gYikge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkFzc2lnbm1lbnRQYXR0ZXJuLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUubGVmdF0sXG4gIH0sXG5dO1xuXG4vKipcbiAqIFRoaXMgd2lsbCBnZXQgYSBsaXN0IG9mIGFsbCBpZGVudGlmaWVycyB0aGF0IGFyZSBkZWNsYXJlZCB3aXRoaW4gcm9vdCdzIEFTVFxuICovXG5mdW5jdGlvbiBnZXREZWNsYXJlZElkZW50aWZpZXJzKFxuICByb290OiBDb2xsZWN0aW9uLFxuICBvcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuICBmaWx0ZXJzPzogP0FycmF5PChwYXRoOiBOb2RlUGF0aCkgPT4gYm9vbGVhbj4sXG4pOiBTZXQ8c3RyaW5nPiB7XG4gIC8vIFN0YXJ0IHdpdGggdGhlIGdsb2JhbHMgc2luY2UgdGhleSBhcmUgYWx3YXlzIFwiZGVjbGFyZWRcIiBhbmQgc2FmZSB0byB1c2UuXG4gIGNvbnN0IHttb2R1bGVNYXB9ID0gb3B0aW9ucztcbiAgY29uc3QgaWRzID0gbmV3IFNldChtb2R1bGVNYXAuZ2V0QnVpbHRJbnMoKSk7XG4gIGNvbnN0IHZpc2l0b3IgPSB7fTtcbiAgQ09ORklHLmZvckVhY2goY29uZmlnID0+IHtcbiAgICB2aXNpdG9yW2B2aXNpdCR7Y29uZmlnLm5vZGVUeXBlfWBdID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgaWYgKCFmaWx0ZXJzIHx8IGZpbHRlcnMuZXZlcnkoZmlsdGVyID0+IGZpbHRlcihwYXRoKSkpIHtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSBjb25maWcuZ2V0Tm9kZXMocGF0aCk7XG4gICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZXMgPSBnZXROYW1lc0Zyb21JRChub2RlKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IG5hbWUgb2YgbmFtZXMpIHtcbiAgICAgICAgICAgIGlkcy5hZGQobmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMudHJhdmVyc2UocGF0aCk7XG4gICAgfTtcbiAgfSk7XG4gIGpzY3MudHlwZXMudmlzaXQocm9vdC5ub2RlcygpWzBdLCB2aXNpdG9yKTtcbiAgcmV0dXJuIGlkcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXREZWNsYXJlZElkZW50aWZpZXJzO1xuIl19