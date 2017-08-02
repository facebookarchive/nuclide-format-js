'use strict';

var _getNamesFromID = require('./getNamesFromID');

var _getNamesFromID2 = _interopRequireDefault(_getNamesFromID);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * These are the ways in which an identifier might be declared, note that these
 * identifiers are safe to use in code. They should not include types that have
 * been declared.
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
// function foo(...rest) {}
{
  nodeType: _jscodeshift2.default.FunctionDeclaration,
  getNodes: function getNodes(path) {
    return [path.node.id, path.node.rest].concat(path.node.params);
  }
},

// foo(...rest) {}, in a class body for example
{
  nodeType: _jscodeshift2.default.FunctionExpression,
  getNodes: function getNodes(path) {
    return [path.node.rest].concat(path.node.params);
  }
},

// class {foo(...rest) {}}, class method
{
  nodeType: _jscodeshift2.default.ClassMethod,
  getNodes: function getNodes(path) {
    return path.node.params;
  }
},

// x = {foo(...rest) {}}, object method
{
  nodeType: _jscodeshift2.default.ObjectMethod,
  getNodes: function getNodes(path) {
    return path.node.params;
  }
},

// var foo;
{
  nodeType: _jscodeshift2.default.VariableDeclaration,
  getNodes: function getNodes(path) {
    return path.node.declarations.map(function (declaration) {
      return declaration.id;
    });
  }
},

// class foo {}
{
  nodeType: _jscodeshift2.default.ClassDeclaration,
  getNodes: function getNodes(path) {
    return [path.node.id];
  }
},

// (foo, ...rest) => {}
{
  nodeType: _jscodeshift2.default.ArrowFunctionExpression,
  getNodes: function getNodes(path) {
    return [path.node.rest].concat(path.node.params);
  }
},

// try {} catch (foo) {}
{
  nodeType: _jscodeshift2.default.CatchClause,
  getNodes: function getNodes(path) {
    return [path.node.param];
  }
},

// function foo(a = b) {}
{
  nodeType: _jscodeshift2.default.AssignmentPattern,
  getNodes: function getNodes(path) {
    return [path.node.left];
  }
}];

/**
 * This will get a list of all identifiers that are declared within root's AST
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
      }
      this.traverse(path);
    };
  });
  _jscodeshift2.default.types.visit(root.nodes()[0], visitor);
  return ids;
}

module.exports = getDeclaredIdentifiers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vdXRpbHMvZ2V0RGVjbGFyZWRJZGVudGlmaWVycy5qcyJdLCJuYW1lcyI6WyJDT05GSUciLCJub2RlVHlwZSIsIkZ1bmN0aW9uRGVjbGFyYXRpb24iLCJnZXROb2RlcyIsInBhdGgiLCJub2RlIiwiaWQiLCJyZXN0IiwiY29uY2F0IiwicGFyYW1zIiwiRnVuY3Rpb25FeHByZXNzaW9uIiwiQ2xhc3NNZXRob2QiLCJPYmplY3RNZXRob2QiLCJWYXJpYWJsZURlY2xhcmF0aW9uIiwiZGVjbGFyYXRpb25zIiwibWFwIiwiZGVjbGFyYXRpb24iLCJDbGFzc0RlY2xhcmF0aW9uIiwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24iLCJDYXRjaENsYXVzZSIsInBhcmFtIiwiQXNzaWdubWVudFBhdHRlcm4iLCJsZWZ0IiwiZ2V0RGVjbGFyZWRJZGVudGlmaWVycyIsInJvb3QiLCJvcHRpb25zIiwiZmlsdGVycyIsIm1vZHVsZU1hcCIsImlkcyIsIlNldCIsImdldEJ1aWx0SW5zIiwidmlzaXRvciIsImZvckVhY2giLCJjb25maWciLCJldmVyeSIsImZpbHRlciIsIm5vZGVzIiwibmFtZXMiLCJuYW1lIiwiYWRkIiwidHJhdmVyc2UiLCJ0eXBlcyIsInZpc2l0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFhQTs7OztBQUNBOzs7Ozs7QUFPQTs7Ozs7QUFyQkE7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsU0FBNkI7QUFDakM7QUFDQTtBQUNFQyxZQUFVLHNCQUFLQyxtQkFEakI7QUFFRUMsWUFBVTtBQUFBLFdBQVEsQ0FBQ0MsS0FBS0MsSUFBTCxDQUFVQyxFQUFYLEVBQWVGLEtBQUtDLElBQUwsQ0FBVUUsSUFBekIsRUFBK0JDLE1BQS9CLENBQXNDSixLQUFLQyxJQUFMLENBQVVJLE1BQWhELENBQVI7QUFBQTtBQUZaLENBRmlDOztBQU9qQztBQUNBO0FBQ0VSLFlBQVUsc0JBQUtTLGtCQURqQjtBQUVFUCxZQUFVO0FB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Y2xhcmVkSWRlbnRpZmllcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7Q29sbGVjdGlvbiwgTm9kZSwgTm9kZVBhdGh9IGZyb20gJy4uL3R5cGVzL2FzdCc7XG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcblxuaW1wb3J0IGdldE5hbWVzRnJvbUlEIGZyb20gJy4vZ2V0TmFtZXNGcm9tSUQnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuXG50eXBlIENvbmZpZ0VudHJ5ID0ge1xuICBub2RlVHlwZTogc3RyaW5nLFxuICBnZXROb2RlczogKHBhdGg6IE5vZGVQYXRoKSA9PiBBcnJheTxOb2RlPixcbn07XG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSB3YXlzIGluIHdoaWNoIGFuIGlkZW50aWZpZXIgbWlnaHQgYmUgZGVjbGFyZWQsIG5vdGUgdGhhdCB0aGVzZVxuICogaWRlbnRpZmllcnMgYXJlIHNhZmUgdG8gdXNlIGluIGNvZGUuIFRoZXkgc2hvdWxkIG5vdCBpbmNsdWRlIHR5cGVzIHRoYXQgaGF2ZVxuICogYmVlbiBkZWNsYXJlZC5cbiAqL1xuY29uc3QgQ09ORklHOiBBcnJheTxDb25maWdFbnRyeT4gPSBbXG4gIC8vIGZ1bmN0aW9uIGZvbyguLi5yZXN0KSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuRnVuY3Rpb25EZWNsYXJhdGlvbixcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmlkLCBwYXRoLm5vZGUucmVzdF0uY29uY2F0KHBhdGgubm9kZS5wYXJhbXMpLFxuICB9LFxuXG4gIC8vIGZvbyguLi5yZXN0KSB7fSwgaW4gYSBjbGFzcyBib2R5IGZvciBleGFtcGxlXG4gIHtcbiAgICBub2RlVHlwZToganNjcy5GdW5jdGlvbkV4cHJlc3Npb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5yZXN0XS5jb25jYXQocGF0aC5ub2RlLnBhcmFtcyksXG4gIH0sXG5cbiAgLy8gY2xhc3Mge2ZvbyguLi5yZXN0KSB7fX0sIGNsYXNzIG1ldGhvZFxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQ2xhc3NNZXRob2QsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gcGF0aC5ub2RlLnBhcmFtcyxcbiAgfSxcblxuICAvLyB4ID0ge2ZvbyguLi5yZXN0KSB7fX0sIG9iamVjdCBtZXRob2RcbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLk9iamVjdE1ldGhvZCxcbiAgICBnZXROb2RlczogcGF0aCA9PiBwYXRoLm5vZGUucGFyYW1zLFxuICB9LFxuXG4gIC8vIHZhciBmb287XG4gIHtcbiAgICBub2RlVHlwZToganNjcy5WYXJpYWJsZURlY2xhcmF0aW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IHBhdGgubm9kZS5kZWNsYXJhdGlvbnMubWFwKGRlY2xhcmF0aW9uID0+IGRlY2xhcmF0aW9uLmlkKSxcbiAgfSxcblxuICAvLyBjbGFzcyBmb28ge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkNsYXNzRGVjbGFyYXRpb24sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5pZF0sXG4gIH0sXG5cbiAgLy8gKGZvbywgLi4ucmVzdCkgPT4ge31cbiAge1xuICAgIG5vZGVUeXBlOiBqc2NzLkFycm93RnVuY3Rpb25FeHByZXNzaW9uLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUucmVzdF0uY29uY2F0KHBhdGgubm9kZS5wYXJhbXMpLFxuICB9LFxuXG4gIC8vIHRyeSB7fSBjYXRjaCAoZm9vKSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQ2F0Y2hDbGF1c2UsXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5wYXJhbV0sXG4gIH0sXG5cbiAgLy8gZnVuY3Rpb24gZm9vKGEgPSBiKSB7fVxuICB7XG4gICAgbm9kZVR5cGU6IGpzY3MuQXNzaWdubWVudFBhdHRlcm4sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5sZWZ0XSxcbiAgfSxcbl07XG5cbi8qKlxuICogVGhpcyB3aWxsIGdldCBhIGxpc3Qgb2YgYWxsIGlkZW50aWZpZXJzIHRoYXQgYXJlIGRlY2xhcmVkIHdpdGhpbiByb290J3MgQVNUXG4gKi9cbmZ1bmN0aW9uIGdldERlY2xhcmVkSWRlbnRpZmllcnMoXG4gIHJvb3Q6IENvbGxlY3Rpb24sXG4gIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4gIGZpbHRlcnM/OiA/QXJyYXk8KHBhdGg6IE5vZGVQYXRoKSA9PiBib29sZWFuPixcbik6IFNldDxzdHJpbmc+IHtcbiAgLy8gU3RhcnQgd2l0aCB0aGUgZ2xvYmFscyBzaW5jZSB0aGV5IGFyZSBhbHdheXMgXCJkZWNsYXJlZFwiIGFuZCBzYWZlIHRvIHVzZS5cbiAgY29uc3Qge21vZHVsZU1hcH0gPSBvcHRpb25zO1xuICBjb25zdCBpZHMgPSBuZXcgU2V0KG1vZHVsZU1hcC5nZXRCdWlsdElucygpKTtcbiAgY29uc3QgdmlzaXRvciA9IHt9O1xuICBDT05GSUcuZm9yRWFjaChjb25maWcgPT4ge1xuICAgIHZpc2l0b3JbYHZpc2l0JHtjb25maWcubm9kZVR5cGV9YF0gPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICBpZiAoIWZpbHRlcnMgfHwgZmlsdGVycy5ldmVyeShmaWx0ZXIgPT4gZmlsdGVyKHBhdGgpKSkge1xuICAgICAgICBjb25zdCBub2RlcyA9IGNvbmZpZy5nZXROb2RlcyhwYXRoKTtcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICBjb25zdCBuYW1lcyA9IGdldE5hbWVzRnJvbUlEKG5vZGUpO1xuICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBuYW1lcykge1xuICAgICAgICAgICAgaWRzLmFkZChuYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy50cmF2ZXJzZShwYXRoKTtcbiAgICB9O1xuICB9KTtcbiAganNjcy50eXBlcy52aXNpdChyb290Lm5vZGVzKClbMF0sIHZpc2l0b3IpO1xuICByZXR1cm4gaWRzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldERlY2xhcmVkSWRlbnRpZmllcnM7XG4iXX0=