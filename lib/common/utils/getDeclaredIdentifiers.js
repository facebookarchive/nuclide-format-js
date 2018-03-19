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
  return _jscodeshift = _interopRequireDefault(require('./jscodeshift'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0RGVjbGFyZWRJZGVudGlmaWVycy5qcyJdLCJuYW1lcyI6WyJDT05GSUciLCJub2RlVHlwZSIsIkltcG9ydERlY2xhcmF0aW9uIiwiZ2V0Tm9kZXMiLCJwYXRoIiwibm9kZSIsInNwZWNpZmllcnMiLCJtYXAiLCJzcGVjaWZpZXIiLCJsb2NhbCIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJpZCIsInJlc3QiLCJjb25jYXQiLCJwYXJhbXMiLCJGdW5jdGlvbkV4cHJlc3Npb24iLCJDbGFzc01ldGhvZCIsIk9iamVjdE1ldGhvZCIsIlZhcmlhYmxlRGVjbGFyYXRpb24iLCJkZWNsYXJhdGlvbnMiLCJkZWNsYXJhdGlvbiIsIkNsYXNzRGVjbGFyYXRpb24iLCJBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiIsIkNhdGNoQ2xhdXNlIiwicGFyYW0iLCJBc3NpZ25tZW50UGF0dGVybiIsImxlZnQiLCJnZXREZWNsYXJlZElkZW50aWZpZXJzIiwicm9vdCIsIm9wdGlvbnMiLCJmaWx0ZXJzIiwibW9kdWxlTWFwIiwiaWRzIiwiU2V0IiwiZ2V0QnVpbHRJbnMiLCJ2aXNpdG9yIiwiZm9yRWFjaCIsImNvbmZpZyIsImV2ZXJ5IiwiZmlsdGVyIiwibm9kZXMiLCJuYW1lcyIsIm5hbWUiLCJhZGQiLCJ0cmF2ZXJzZSIsInR5cGVzIiwidmlzaXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBYUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBT0E7Ozs7O0FBS0EsSUFBTUEsU0FBNkI7QUFDakM7QUFDQTtBQUNFQyxZQUFVLDhDQUFLQyxpQkFEakI7QUFFRUMsWUFBVTtBQUFBLFdBQ1AsdURBQWNDLEtBQUtDLElBQW5CLElBQ0dELEtBQUtDLElBQUwsQ0FBVUMsVUFBVixDQUFxQkMsR0FBckIsQ0FBeUI7QUFBQSxhQUFhQyxVQUFVQyxLQUF2QjtBQUFBLEtBQXpCLENBREgsR0FFRyxFQUhJO0FBQUE7QUFGWixDQUZpQzs7QUFVakM7QUFDQTtBQUNFUixZQUFVLDhDQUFLUyxtQkFEakI7QUFFRVAsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVTSxFQUFYLEVBQWVQLEtBQUtDLElBQUwsQ0FBVU8sSUFBekIsRUFBK0JDLE1BQS9CLENBQXNDVCxLQUFLQyxJQUFMLENBQVVTLE1BQWhELENBQVI7QUFBQTtBQUZaLENBWGlDOztBQWdCakM7QUFDQTtBQUNFYixZQUFVLDhDQUFLYyxrQkFEakI7QUFFRVosWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVTyxJQUFYLEVBQWlCQyxNQUFqQixDQUF3QlQsS0FBS0MsSUFBTCxDQUFVUyxNQUFsQyxDQUFSO0FBQUE7QUFGWixDQWpCaUM7O0FBc0JqQztBQUNBO0FBQ0ViLFlBQVUsOENBQUtlLFdBRGpCO0FBRUViLFlBQVU7QUFBQSxXQUFRQyxLQUFLQyxJQUFMLENBQVVTLE1BQWxCO0FBQUE7QUFGWixDQXZCaUM7O0FBNEJqQztBQUNBO0FBQ0ViLFlBQVUsOENBQUtnQixZQURqQjtBQUVFZCxZQUFVO0FBQUEsV0FBUUMsS0FBS0MsSUFBTCxDQUFVUyxNQUFsQjtBQUFBO0FBRlosQ0E3QmlDOztBQWtDakM7QUFDQTtBQUNFYixZQUFVLDhDQUFLaUIsbUJBRGpCO0FBRUVmLFlBQVU7QUFBQSxXQUFRQyxLQUFLQyxJQUFMLENBQVVjLFlBQVYsQ0FBdUJaLEdBQXZCLENBQTJCO0FBQUEsYUFBZWEsWUFBWVQsRUFBM0I7QUFBQSxLQUEzQixDQUFSO0FBQUE7QUFGWixDQW5DaUM7O0FBd0NqQztBQUNBO0FBQ0VWLFlBQVUsOENBQUtvQixnQkFEakI7QUFFRWxCLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVU0sRUFBWCxDQUFSO0FBQUE7QUFGWixDQXpDaUM7O0FBOENqQztBQUNBO0FBQ0VWLFlBQVUsOENBQUtxQix1QkFEakI7QUFFRW5CLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVU8sSUFBWCxFQUFpQkMsTUFBakIsQ0FBd0JULEtBQUtDLElBQUwsQ0FBVVMsTUFBbEMsQ0FBUjtBQUFBO0FBRlosQ0EvQ2lDOztBQW9EakM7QUFDQTtBQUNFYixZQUFVLDhDQUFLc0IsV0FEakI7QUFFRXBCLFlBQVU7QUFBQSxXQUFRLENBQUNDLEtBQUtDLElBQUwsQ0FBVW1CLEtBQVgsQ0FBUjtBQUFBO0FBRlosQ0FyRGlDOztBQTBEakM7QUFDQTtBQUNFdkIsWUFBVSw4Q0FBS3dCLGlCQURqQjtBQUVFdEIsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVcUIsSUFBWCxDQUFSO0FBQUE7QUFGWixDQTNEaUMsQ0FBbkM7O0FBaUVBOzs7QUE1RkE7Ozs7Ozs7Ozs7QUErRkEsU0FBU0Msc0JBQVQsQ0FDRUMsSUFERixFQUVFQyxPQUZGLEVBR0VDLE9BSEYsRUFJZTtBQUNiO0FBRGEsTUFFTkMsU0FGTSxHQUVPRixPQUZQLENBRU5FLFNBRk07O0FBR2IsTUFBTUMsTUFBTSxJQUFJQyxHQUFKLENBQVFGLFVBQVVHLFdBQVYsRUFBUixDQUFaO0FBQ0EsTUFBTUMsVUFBVSxFQUFoQjtBQUNBbkMsU0FBT29DLE9BQVAsQ0FBZSxrQkFBVTtBQUN2QkQsc0JBQWdCRSxPQUFPcEMsUUFBdkIsSUFBcUMsVUFBU0csSUFBVCxFQUFlO0FBQ2xELFVBQUksQ0FBQzBCLE9BQUQsSUFBWUEsUUFBUVEsS0FBUixDQUFjO0FBQUEsZUFBVUMsT0FBT25DLElBQVAsQ0FBVjtBQUFBLE9BQWQsQ0FBaEIsRUFBdUQ7QUFDckQsWUFBTW9DLFFBQVFILE9BQU9sQyxRQUFQLENBQWdCQyxJQUFoQixDQUFkO0FBQ0FvQyxjQUFNSixPQUFOLENBQWMsZ0JBQVE7QUFDcEIsY0FBTUssUUFBUSx5REFBZXBDLElBQWYsQ0FBZDtBQURvQjtBQUFBO0FBQUE7O0FBQUE7QUFFcEIsaUNBQW1Cb0MsS0FBbkIsOEhBQTBCO0FBQUEsa0JBQWZDLElBQWU7O0FBQ3hCVixrQkFBSVcsR0FBSixDQUFRRCxJQUFSO0FBQ0Q7QUFKbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtyQixTQUxEO0FBTUQ7QUFDRCxXQUFLRSxRQUFMLENBQWN4QyxJQUFkO0FBQ0QsS0FYRDtBQVlELEdBYkQ7QUFjQSxnREFBS3lDLEtBQUwsQ0FBV0MsS0FBWCxDQUFpQmxCLEtBQUtZLEtBQUwsR0FBYSxDQUFiLENBQWpCLEVBQWtDTCxPQUFsQztBQUNBLFNBQU9ILEdBQVA7QUFDRDs7QUFFRGUsT0FBT0MsT0FBUCxHQUFpQnJCLHNCQUFqQiIsImZpbGUiOiJnZXREZWNsYXJlZElkZW50aWZpZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGUsIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbmltcG9ydCBnZXROYW1lc0Zyb21JRCBmcm9tICcuL2dldE5hbWVzRnJvbUlEJztcbmltcG9ydCBpc1ZhbHVlSW1wb3J0IGZyb20gJy4uL3V0aWxzL2lzVmFsdWVJbXBvcnQnO1xuaW1wb3J0IGpzY3MgZnJvbSAnLi9qc2NvZGVzaGlmdCc7XG5cbnR5cGUgQ29uZmlnRW50cnkgPSB7XG4gIG5vZGVUeXBlOiBzdHJpbmcsXG4gIGdldE5vZGVzOiAocGF0aDogTm9kZVBhdGgpID0+IEFycmF5PE5vZGU+LFxufTtcblxuLyoqXG4gKiBUaGVzZSBhcmUgdGhlIHdheXMgaW4gd2hpY2ggYW4gaWRlbnRpZmllciBtaWdodCBiZSBkZWNsYXJlZCwgbm90ZSB0aGF0IHRoZXNlXG4gKiBpZGVudGlmaWVycyBhcmUgc2FmZSB0byB1c2UgaW4gY29kZS4gVGhleSBzaG91bGQgbm90IGluY2x1ZGUgdHlwZXMgdGhhdCBoYXZlXG4gKiBiZWVuIGRlY2xhcmVkLlxuICovXG5jb25zdCBDT05GSUc6IEFycmF5PENvbmZpZ0VudHJ5PiA9IFtcbiAgLy8gaW1wb3J0IC4uLnJlc3QgZnJvbSAuLi5cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkltcG9ydERlY2xhcmF0aW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+XG4gICAgICAoaXNWYWx1ZUltcG9ydChwYXRoLm5vZGUpXG4gICAgICAgID8gcGF0aC5ub2RlLnNwZWNpZmllcnMubWFwKHNwZWNpZmllciA9PiBzcGVjaWZpZXIubG9jYWwpXG4gICAgICAgIDogW10pLFxuICB9LFxuXG4gIC8vIGZ1bmN0aW9uIGZvbyguLi5yZXN0KSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuRnVuY3Rpb25EZWNsYXJhdGlvbixcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmlkLCBwYXRoLm5vZGUucmVzdF0uY29uY2F0KHBhdGgubm9kZS5wYXJhbXMpLFxuICB9LFxuXG4gIC8vIGZvbyguLi5yZXN0KSB7fSwgaW4gYSBjbGFzcyBib2R5IGZvciBleGFtcGxlXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5GdW5jdGlvbkV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5yZXN0XS5jb25jYXQocGF0aC5ub2RlLnBhcmFtcyksXG4gIH0sXG5cbiAgLy8gY2xhc3Mge2ZvbyguLi5yZXN0KSB7fX0sIGNsYXNzIG1ldGhvZFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQ2xhc3NNZXRob2QsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gcGF0aC5ub2RlLnBhcmFtcyxcbiAgfSxcblxuICAvLyB4ID0ge2ZvbyguLi5yZXN0KSB7fX0sIG9iamVjdCBtZXRob2RcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLk9iamVjdE1ldGhvZCxcbiAgICBnZXROb2RlczogcGF0aCA9PiBwYXRoLm5vZGUucGFyYW1zLFxuICB9LFxuXG4gIC8vIHZhciBmb287XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5WYXJpYWJsZURlY2xhcmF0aW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IHBhdGgubm9kZS5kZWNsYXJhdGlvbnMubWFwKGRlY2xhcmF0aW9uID0+IGRlY2xhcmF0aW9uLmlkKSxcbiAgfSxcblxuICAvLyBjbGFzcyBmb28ge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkNsYXNzRGVjbGFyYXRpb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5pZF0sXG4gIH0sXG5cbiAgLy8gKGZvbywgLi4ucmVzdCkgPT4ge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkFycm93RnVuY3Rpb25FeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUucmVzdF0uY29uY2F0KHBhdGgubm9kZS5wYXJhbXMpLFxuICB9LFxuXG4gIC8vIHRyeSB7fSBjYXRjaCAoZm9vKSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQ2F0Y2hDbGF1c2UsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5wYXJhbV0sXG4gIH0sXG5cbiAgLy8gZnVuY3Rpb24gZm9vKGEgPSBiKSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQXNzaWdubWVudFBhdHRlcm4sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5sZWZ0XSxcbiAgfSxcbl07XG5cbi8qKlxuICogVGhpcyB3aWxsIGdldCBhIGxpc3Qgb2YgYWxsIGlkZW50aWZpZXJzIHRoYXQgYXJlIGRlY2xhcmVkIHdpdGhpbiByb290J3MgQVNUXG4gKi9cbmZ1bmN0aW9uIGdldERlY2xhcmVkSWRlbnRpZmllcnMoXG4gIHJvb3Q6IENvbGxlY3Rpb24sXG4gIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4gIGZpbHRlcnM/OiA/QXJyYXk8KHBhdGg6IE5vZGVQYXRoKSA9PiBib29sZWFuPixcbik6IFNldDxzdHJpbmc+IHtcbiAgLy8gU3RhcnQgd2l0aCB0aGUgZ2xvYmFscyBzaW5jZSB0aGV5IGFyZSBhbHdheXMgXCJkZWNsYXJlZFwiIGFuZCBzYWZlIHRvIHVzZS5cbiAgY29uc3Qge21vZHVsZU1hcH0gPSBvcHRpb25zO1xuICBjb25zdCBpZHMgPSBuZXcgU2V0KG1vZHVsZU1hcC5nZXRCdWlsdElucygpKTtcbiAgY29uc3QgdmlzaXRvciA9IHt9O1xuICBDT05GSUcuZm9yRWFjaChjb25maWcgPT4ge1xuICAgIHZpc2l0b3JbYHZpc2l0JHtjb25maWcubm9kZVR5cGV9YF0gPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBpZiAoIWZpbHRlcnMgfHwgZmlsdGVycy5ldmVyeShmaWx0ZXIgPT4gZmlsdGVyKHBhdGgpKSkge1xuICAgICAgICBjb25zdCBub2RlcyA9IGNvbmZpZy5nZXROb2RlcyhwYXRoKTtcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lcyA9IGdldE5hbWVzRnJvbUlEKG5vZGUpO1xuICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBuYW1lcykge1xuICAgICAgICAgICAgaWRzLmFkZChuYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy50cmF2ZXJzZShwYXRoKTtcbiAgICB9O1xuICB9KTtcbiAganNjcy50eXBlcy52aXNpdChyb290Lm5vZGVzKClbMF0sIHZpc2l0b3IpO1xuICByZXR1cm4gaWRzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldERlY2xhcmVkSWRlbnRpZmllcnM7XG4iXX0=