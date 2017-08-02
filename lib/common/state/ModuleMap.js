'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2015-present, Facebook, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This source code is licensed under the license found in the LICENSE file in
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _templateObject = _taggedTemplateLiteral(['import type {_} from \'_\';\n'], ['import type {_} from \'_\';\\n']),
    _templateObject2 = _taggedTemplateLiteral(['import type _ from \'_\';\n'], ['import type _ from \'_\';\\n']);

var _ModuleMapUtils = require('../utils/ModuleMapUtils');

var _ModuleMapUtils2 = _interopRequireDefault(_ModuleMapUtils);

var _Options = require('../options/Options');

var _Options2 = _interopRequireDefault(_Options);

var _jscodeshift = require('jscodeshift');

var _jscodeshift2 = _interopRequireDefault(_jscodeshift);

var _oneLineObjectPattern = require('../utils/oneLineObjectPattern');

var _oneLineObjectPattern2 = _interopRequireDefault(_oneLineObjectPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var statement = _jscodeshift2.default.template.statement;

var ModuleMap = function () {
  /**
   * Identifiers that might correspond to the default export of a particular
   * literal.
   */

  /**
   * Identifiers that have an exact alias to use.
   */

  // Note: These fields are ordered by precendence.

  /**
   * Identifiers that should be ignored when not a type.
   */
  function ModuleMap(options) {
    _classCallCheck(this, ModuleMap);

    _Options2.default.validateModuleMapOptions(options);

    // Note: If someone maintains a reference to the structure within options
    // they could mutate the ModuleMap's behavior. We could make shallow copies
    // here but are opting not to for performance.
    this._builtIns = options.builtIns;
    this._builtInTypes = options.builtInTypes;
    this._aliases = options.aliases;
    this._aliasesToRelativize = options.aliasesToRelativize;

    // TODO: Use let for proper scoping.
    var id = void 0;
    var ids = void 0;
    var filePath = void 0;
    var set = void 0;

    this._defaults = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options.paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        filePath = _step.value;

        ids = _ModuleMapUtils2.default.getIdentifiersFromPath(filePath);
        var literal = _ModuleMapUtils2.default.getLiteralFromPath(filePath);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = ids[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            id = _step3.value;

            set = this._defaults.get(id);
            if (!set) {
              set = new Set();
              this._defaults.set(id, set);
            }
            set.add(literal);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
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

    this._defaultsToRelativize = new Map();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = options.pathsToRelativize[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        filePath = _step2.value;

        ids = _ModuleMapUtils2.default.getIdentifiersFromPath(filePath);
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = ids[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            id = _step4.value;

            set = this._defaultsToRelativize.get(id);
            if (!set) {
              set = new Set();
              this._defaultsToRelativize.set(id, set);
            }
            set.add(filePath);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }

  /**
   * Gets a single require, this isn't great for when you want to destructure
   * multiple things in a single statement.
   *
   * TODO: add a getRequires() that consolidates automatically, or add a
   * specific consolidate step as part of the transform.
   */

  /**
   * Identifiers that might correspond to the default export of a particular
   * absolute path.
   */

  /**
   * Identifiers that have an exact path to use.
   */

  /**
   * Identifiers that should be ignored when they are a type.
   */


  _createClass(ModuleMap, [{
    key: 'getRequire',
    value: function getRequire(id, options) {
      _Options2.default.validateRequireOptions(options);

      // Don't import built ins.
      if (!options.typeImport) {
        if (this._builtIns.has(id)) {
          return null;
        }
      } else {
        if (this._builtInTypes.has(id)) {
          return null;
        }
      }

      // TODO: Use let for proper scoping.
      var literal = void 0;
      var tmp = void 0;

      if (this._aliases.has(id)) {
        literal = this._aliases.get(id);
      } else if (options.sourcePath && this._aliasesToRelativize.has(id)) {
        literal = _ModuleMapUtils2.default.relativizeForRequire(options.sourcePath,
        // $FlowFixMe(kad)
        this._aliasesToRelativize.get(id));
      } else if (this._defaults.has(id) &&
      // $FlowFixMe(kad)
      this._defaults.get(id).size === 1) {
        // TODO: What's the best way to get the single thing out of a one element
        // Set?
        // $FlowFixMe(kad)
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this._defaults.get(id)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            tmp = _step5.value;

            literal = tmp;
            break;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      } else if (options.sourcePath && this._defaultsToRelativize.has(id) &&
      // $FlowFixMe(kad)
      this._defaultsToRelativize.get(id).size === 1) {
        var nonNullSourcePath = options.sourcePath;
        // TODO: What's the best way to get the single thing out of a one element
        // Set?
        // $FlowFixMe(kad)
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = this._defaultsToRelativize.get(id)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _filePath = _step6.value;

            literal = _ModuleMapUtils2.default.relativizeForRequire(nonNullSourcePath, _filePath);
            break;
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
              _iterator6.return();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      } else if (options.jsxSuffix) {
        literal = id + '.react';
      } else {
        // TODO: Make this configurable so that it's possible to only add known
        // requires and ignore unknown modules.
        literal = id;
      }

      // Create common nodes for printing.
      var idNode = _jscodeshift2.default.identifier(id);
      var literalNode = _jscodeshift2.default.literal(literal);

      // TODO: Support exports and destructuring.
      var destructure = false;

      if (destructure && options.typeImport) {
        // import type {foo} from 'foo';
        tmp = statement(_templateObject);
        tmp.specifiers[0].imported = idNode;
        tmp.specifiers[0].local = idNode;
        tmp.source = literalNode;
        return tmp;
      } else if (!destructure && options.typeImport) {
        // import type foo from 'foo';
        tmp = statement(_templateObject2);
        tmp.specifiers[0].id = idNode;
        tmp.specifiers[0].local = idNode;
        tmp.source = literalNode;
        return tmp;
      } else if (destructure && !options.typeImport) {
        // var {foo} = require('foo');
        var property = _jscodeshift2.default.property('init', idNode, idNode);
        property.shorthand = true;
        return _jscodeshift2.default.variableDeclaration('const', [_jscodeshift2.default.variableDeclarator((0, _oneLineObjectPattern2.default)(_jscodeshift2.default.objectPattern([property])), _jscodeshift2.default.callExpression(_jscodeshift2.default.identifier('require'), [literalNode]))]);
      } else if (!destructure && !options.typeImport) {
        // var foo = require('foo');
        return _jscodeshift2.default.variableDeclaration('const', [_jscodeshift2.default.variableDeclarator(idNode, _jscodeshift2.default.callExpression(_jscodeshift2.default.identifier('require'), [literalNode]))]);
      }

      // Can't handle this type of require yet.
      return null;
    }
  }, {
    key: 'getBuiltIns',
    value: function getBuiltIns() {
      return this._builtIns;
    }
  }, {
    key: 'getBuiltInTypes',
    value: function getBuiltInTypes() {
      return this._builtInTypes;
    }
  }]);

  return ModuleMap;
}();

module.exports = ModuleMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc3RhdGUvTW9kdWxlTWFwLmpzIl0sIm5hbWVzIjpbInN0YXRlbWVudCIsInRlbXBsYXRlIiwiTW9kdWxlTWFwIiwib3B0aW9ucyIsInZhbGlkYXRlTW9kdWxlTWFwT3B0aW9ucyIsIl9idWlsdElucyIsImJ1aWx0SW5zIiwiX2J1aWx0SW5UeXBlcyIsImJ1aWx0SW5UeXBlcyIsIl9hbGlhc2VzIiwiYWxpYXNlcyIsIl9hbGlhc2VzVG9SZWxhdGl2aXplIiwiYWxpYXNlc1RvUmVsYXRpdml6ZSIsImlkIiwiaWRzIiwiZmlsZVBhdGgiLCJzZXQiLCJfZGVmYXVsdHMiLCJNYXAiLCJwYXRocyIsImdldElkZW50aWZpZXJzRnJvbVBhdGgiLCJsaXRlcmFsIiwiZ2V0TGl0ZXJhbEZyb21QYXRoIiwiZ2V0IiwiU2V0IiwiYWRkIiwiX2RlZmF1bHRzVG9SZWxhdGl2aXplIiwicGF0aHNUb1JlbGF0aXZpemUiLCJ2YWxpZGF0ZVJlcXVpcmVPcHRpb25zIiwidHlwZUltcG9ydCIsImhhcyIsInRtcCIsInNvdXJjZVBhdGgiLCJyZWxhdGl2aXplRm9yUmVxdWlyZSIsInNpemUiLCJub25OdWxsU291cmNlUGF0aCIsImpzeFN1ZmZpeCIsImlkTm9kZSIsImlkZW50aWZpZXIiLCJsaXRlcmFsTm9kZSIsImRlc3RydWN0dXJlIiwic3BlY2lmaWVycyIsImltcG9ydGVkIiwibG9jYWwiLCJzb3VyY2UiLCJwcm9wZXJ0eSIsInNob3J0aGFuZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJvYmplY3RQYXR0ZXJuIiwiY2FsbEV4cHJlc3Npb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztxakJBQUE7Ozs7Ozs7Ozs7Ozs7QUFjQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztJQUVPQSxTLEdBQWEsc0JBQUtDLFEsQ0FBbEJELFM7O0lBRURFLFM7QUFtQko7Ozs7O0FBUkE7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MEJOLE1BQTFCO0FBQ0FOLFlBQUlhLE1BQUosR0FBYUwsV0FBYjtBQUNBLGVBQU9SLEdBQVA7QUFDRCxPQVBNLE1BT0EsSUFBSVMsZUFBZSxDQUFDckMsUUFBUTBCLFVBQTVCLEVBQXdDO0FBQzdDO0FBQ0EsWUFBTWdCLFdBQVcsc0JBQUtBLFFBQUwsQ0FBYyxNQUFkLEVBQXNCUixNQUF0QixFQUE4QkEsTUFBOUIsQ0FBakI7QUFDQVEsaUJBQVNDLFNBQVQsR0FBcUIsSUFBckI7QUFDQSxlQUFPLHNCQUFLQyxtQkFBTCxDQUNMLE9BREssRUFFTCxDQUFDLHNCQUFLQyxrQkFBTCxDQUNDLG9DQUFxQixzQkFBS0MsYUFBTCxDQUFtQixDQUFDSixRQUFELENBQW5CLENBQXJCLENBREQsRUFFQyxzQkFBS0ssY0FBTCxDQUNFLHNCQUFLWixVQUFMLENBQWdCLFNBQWhCLENBREYsRUFFRSxDQUFDQyxXQUFELENBRkYsQ0FGRCxDQUFELENBRkssQ0FBUDtBQVVELE9BZE0sTUFjQSxJQUFJLENBQUNDLFdBQUQsSUFBZ0IsQ0FBQ3JDLFFBQVEwQixVQUE3QixFQUF5QztBQUM5QztBQUNBLGVBQU8sc0JBQUtrQixtQkFBTCxDQUNMLE9BREssRUFFTCxDQUFDLHNCQUFLQyxrQkFBTCxDQUNDWCxNQURELEVBRUMsc0JBQUthLGNBQUwsQ0FDRSxzQkFBS1osVUFBTCxDQUFnQixTQUFoQixDQURGLEVBRUUsQ0FBQ0MsV0FBRCxDQUZGLENBRkQsQ0FBRCxDQUZLLENBQVA7QUFVRDs7QUFFRDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7a0NBRThCO0FBQzdCLGFBQU8sS0FBS2xDLFNBQVo7QUFDRDs7O3NDQUVrQztBQUNqQyxhQUFPLEtBQUtFLGFBQVo7QUFDRDs7Ozs7O0FBR0g0QyxPQUFPQyxPQUFQLEdBQWlCbEQsU0FBakIiLCJmaWxlIjoiTW9kdWxlTWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0Fic29sdXRlUGF0aCwgSWRlbnRpZmllciwgTGl0ZXJhbH0gZnJvbSAnLi4vdHlwZXMvY29tbW9uJztcbmltcG9ydCB0eXBlIHtNb2R1bGVNYXBPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL01vZHVsZU1hcE9wdGlvbnMnO1xuaW1wb3J0IHR5cGUge1JlcXVpcmVPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1JlcXVpcmVPcHRpb25zJztcblxuaW1wb3J0IE1vZHVsZU1hcFV0aWxzIGZyb20gJy4uL3V0aWxzL01vZHVsZU1hcFV0aWxzJztcbmltcG9ydCBPcHRpb25zIGZyb20gJy4uL29wdGlvbnMvT3B0aW9ucyc7XG5pbXBvcnQganNjcyBmcm9tICdqc2NvZGVzaGlmdCc7XG5pbXBvcnQgb25lTGluZU9iamVjdFBhdHRlcm4gZnJvbSAnLi4vdXRpbHMvb25lTGluZU9iamVjdFBhdHRlcm4nO1xuXG5jb25zdCB7c3RhdGVtZW50fSA9IGpzY3MudGVtcGxhdGU7XG5cbmNsYXNzIE1vZHVsZU1hcCB7XG4gIC8vIE5vdGU6IFRoZXNlIGZpZWxkcyBhcmUgb3JkZXJlZCBieSBwcmVjZW5kZW5jZS5cblxuICAvKipcbiAgICogSWRlbnRpZmllcnMgdGhhdCBzaG91bGQgYmUgaWdub3JlZCB3aGVuIG5vdCBhIHR5cGUuXG4gICAqL1xuICBfYnVpbHRJbnM6IFNldDxJZGVudGlmaWVyPjtcbiAgLyoqXG4gICAqIElkZW50aWZpZXJzIHRoYXQgc2hvdWxkIGJlIGlnbm9yZWQgd2hlbiB0aGV5IGFyZSBhIHR5cGUuXG4gICAqL1xuICBfYnVpbHRJblR5cGVzOiBTZXQ8SWRlbnRpZmllcj47XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IGhhdmUgYW4gZXhhY3QgYWxpYXMgdG8gdXNlLlxuICAgKi9cbiAgX2FsaWFzZXM6IE1hcDxJZGVudGlmaWVyLCBMaXRlcmFsPjtcbiAgLyoqXG4gICAqIElkZW50aWZpZXJzIHRoYXQgaGF2ZSBhbiBleGFjdCBwYXRoIHRvIHVzZS5cbiAgICovXG4gIF9hbGlhc2VzVG9SZWxhdGl2aXplOiBNYXA8SWRlbnRpZmllciwgQWJzb2x1dGVQYXRoPjtcbiAgLyoqXG4gICAqIElkZW50aWZpZXJzIHRoYXQgbWlnaHQgY29ycmVzcG9uZCB0byB0aGUgZGVmYXVsdCBleHBvcnQgb2YgYSBwYXJ0aWN1bGFyXG4gICAqIGxpdGVyYWwuXG4gICAqL1xuICBfZGVmYXVsdHM6IE1hcDxJZGVudGlmaWVyLCBTZXQ8TGl0ZXJhbD4+O1xuICAvKipcbiAgICogSWRlbnRpZmllcnMgdGhhdCBtaWdodCBjb3JyZXNwb25kIHRvIHRoZSBkZWZhdWx0IGV4cG9ydCBvZiBhIHBhcnRpY3VsYXJcbiAgICogYWJzb2x1dGUgcGF0aC5cbiAgICovXG4gIF9kZWZhdWx0c1RvUmVsYXRpdml6ZTogTWFwPElkZW50aWZpZXIsIFNldDxBYnNvbHV0ZVBhdGg+PjtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBNb2R1bGVNYXBPcHRpb25zKSB7XG4gICAgT3B0aW9ucy52YWxpZGF0ZU1vZHVsZU1hcE9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICAvLyBOb3RlOiBJZiBzb21lb25lIG1haW50YWlucyBhIHJlZmVyZW5jZSB0byB0aGUgc3RydWN0dXJlIHdpdGhpbiBvcHRpb25zXG4gICAgLy8gdGhleSBjb3VsZCBtdXRhdGUgdGhlIE1vZHVsZU1hcCdzIGJlaGF2aW9yLiBXZSBjb3VsZCBtYWtlIHNoYWxsb3cgY29waWVzXG4gICAgLy8gaGVyZSBidXQgYXJlIG9wdGluZyBub3QgdG8gZm9yIHBlcmZvcm1hbmNlLlxuICAgIHRoaXMuX2J1aWx0SW5zID0gb3B0aW9ucy5idWlsdElucztcbiAgICB0aGlzLl9idWlsdEluVHlwZXMgPSBvcHRpb25zLmJ1aWx0SW5UeXBlcztcbiAgICB0aGlzLl9hbGlhc2VzID0gb3B0aW9ucy5hbGlhc2VzO1xuICAgIHRoaXMuX2FsaWFzZXNUb1JlbGF0aXZpemUgPSBvcHRpb25zLmFsaWFzZXNUb1JlbGF0aXZpemU7XG5cbiAgICAvLyBUT0RPOiBVc2UgbGV0IGZvciBwcm9wZXIgc2NvcGluZy5cbiAgICBsZXQgaWQ7XG4gICAgbGV0IGlkcztcbiAgICBsZXQgZmlsZVBhdGg7XG4gICAgbGV0IHNldDtcblxuICAgIHRoaXMuX2RlZmF1bHRzID0gbmV3IE1hcCgpO1xuICAgIGZvciAoZmlsZVBhdGggb2Ygb3B0aW9ucy5wYXRocykge1xuICAgICAgaWRzID0gTW9kdWxlTWFwVXRpbHMuZ2V0SWRlbnRpZmllcnNGcm9tUGF0aChmaWxlUGF0aCk7XG4gICAgICBjb25zdCBsaXRlcmFsID0gTW9kdWxlTWFwVXRpbHMuZ2V0TGl0ZXJhbEZyb21QYXRoKGZpbGVQYXRoKTtcbiAgICAgIGZvciAoaWQgb2YgaWRzKSB7XG4gICAgICAgIHNldCA9IHRoaXMuX2RlZmF1bHRzLmdldChpZCk7XG4gICAgICAgIGlmICghc2V0KSB7XG4gICAgICAgICAgc2V0ID0gbmV3IFNldCgpO1xuICAgICAgICAgIHRoaXMuX2RlZmF1bHRzLnNldChpZCwgc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXQuYWRkKGxpdGVyYWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplID0gbmV3IE1hcCgpO1xuICAgIGZvciAoZmlsZVBhdGggb2Ygb3B0aW9ucy5wYXRoc1RvUmVsYXRpdml6ZSkge1xuICAgICAgaWRzID0gTW9kdWxlTWFwVXRpbHMuZ2V0SWRlbnRpZmllcnNGcm9tUGF0aChmaWxlUGF0aCk7XG4gICAgICBmb3IgKGlkIG9mIGlkcykge1xuICAgICAgICBzZXQgPSB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZS5nZXQoaWQpO1xuICAgICAgICBpZiAoIXNldCkge1xuICAgICAgICAgIHNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZS5zZXQoaWQsIHNldCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0LmFkZChmaWxlUGF0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzaW5nbGUgcmVxdWlyZSwgdGhpcyBpc24ndCBncmVhdCBmb3Igd2hlbiB5b3Ugd2FudCB0byBkZXN0cnVjdHVyZVxuICAgKiBtdWx0aXBsZSB0aGluZ3MgaW4gYSBzaW5nbGUgc3RhdGVtZW50LlxuICAgKlxuICAgKiBUT0RPOiBhZGQgYSBnZXRSZXF1aXJlcygpIHRoYXQgY29uc29saWRhdGVzIGF1dG9tYXRpY2FsbHksIG9yIGFkZCBhXG4gICAqIHNwZWNpZmljIGNvbnNvbGlkYXRlIHN0ZXAgYXMgcGFydCBvZiB0aGUgdHJhbnNmb3JtLlxuICAgKi9cbiAgZ2V0UmVxdWlyZShpZDogSWRlbnRpZmllciwgb3B0aW9uczogUmVxdWlyZU9wdGlvbnMpOiA/Tm9kZSB7XG4gICAgT3B0aW9ucy52YWxpZGF0ZVJlcXVpcmVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgLy8gRG9uJ3QgaW1wb3J0IGJ1aWx0IGlucy5cbiAgICBpZiAoIW9wdGlvbnMudHlwZUltcG9ydCkge1xuICAgICAgaWYgKHRoaXMuX2J1aWx0SW5zLmhhcyhpZCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl9idWlsdEluVHlwZXMuaGFzKGlkKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgbGV0IGZvciBwcm9wZXIgc2NvcGluZy5cbiAgICBsZXQgbGl0ZXJhbDtcbiAgICBsZXQgdG1wO1xuXG4gICAgaWYgKHRoaXMuX2FsaWFzZXMuaGFzKGlkKSkge1xuICAgICAgbGl0ZXJhbCA9IHRoaXMuX2FsaWFzZXMuZ2V0KGlkKTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuc291cmNlUGF0aCAmJiB0aGlzLl9hbGlhc2VzVG9SZWxhdGl2aXplLmhhcyhpZCkpIHtcbiAgICAgIGxpdGVyYWwgPSBNb2R1bGVNYXBVdGlscy5yZWxhdGl2aXplRm9yUmVxdWlyZShcbiAgICAgICAgb3B0aW9ucy5zb3VyY2VQYXRoLFxuICAgICAgICAvLyAkRmxvd0ZpeE1lKGthZClcbiAgICAgICAgdGhpcy5fYWxpYXNlc1RvUmVsYXRpdml6ZS5nZXQoaWQpLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5fZGVmYXVsdHMuaGFzKGlkKSAmJlxuICAgICAgLy8gJEZsb3dGaXhNZShrYWQpXG4gICAgICB0aGlzLl9kZWZhdWx0cy5nZXQoaWQpLnNpemUgPT09IDFcbiAgICApIHtcbiAgICAgIC8vIFRPRE86IFdoYXQncyB0aGUgYmVzdCB3YXkgdG8gZ2V0IHRoZSBzaW5nbGUgdGhpbmcgb3V0IG9mIGEgb25lIGVsZW1lbnRcbiAgICAgIC8vIFNldD9cbiAgICAgIC8vICRGbG93Rml4TWUoa2FkKVxuICAgICAgZm9yICh0bXAgb2YgdGhpcy5fZGVmYXVsdHMuZ2V0KGlkKSkge1xuICAgICAgICBsaXRlcmFsID0gdG1wO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3B0aW9ucy5zb3VyY2VQYXRoICYmXG4gICAgICB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZS5oYXMoaWQpICYmXG4gICAgICAvLyAkRmxvd0ZpeE1lKGthZClcbiAgICAgIHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplLmdldChpZCkuc2l6ZSA9PT0gMVxuICAgICkge1xuICAgICAgY29uc3Qgbm9uTnVsbFNvdXJjZVBhdGggPSBvcHRpb25zLnNvdXJjZVBhdGg7XG4gICAgICAvLyBUT0RPOiBXaGF0J3MgdGhlIGJlc3Qgd2F5IHRvIGdldCB0aGUgc2luZ2xlIHRoaW5nIG91dCBvZiBhIG9uZSBlbGVtZW50XG4gICAgICAvLyBTZXQ/XG4gICAgICAvLyAkRmxvd0ZpeE1lKGthZClcbiAgICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2YgdGhpcy5fZGVmYXVsdHNUb1JlbGF0aXZpemUuZ2V0KGlkKSkge1xuICAgICAgICBsaXRlcmFsID0gTW9kdWxlTWFwVXRpbHMucmVsYXRpdml6ZUZvclJlcXVpcmUoXG4gICAgICAgICAgbm9uTnVsbFNvdXJjZVBhdGgsXG4gICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5qc3hTdWZmaXgpIHtcbiAgICAgIGxpdGVyYWwgPSBpZCArICcucmVhY3QnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlIHNvIHRoYXQgaXQncyBwb3NzaWJsZSB0byBvbmx5IGFkZCBrbm93blxuICAgICAgLy8gcmVxdWlyZXMgYW5kIGlnbm9yZSB1bmtub3duIG1vZHVsZXMuXG4gICAgICBsaXRlcmFsID0gaWQ7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGNvbW1vbiBub2RlcyBmb3IgcHJpbnRpbmcuXG4gICAgY29uc3QgaWROb2RlID0ganNjcy5pZGVudGlmaWVyKGlkKTtcbiAgICBjb25zdCBsaXRlcmFsTm9kZSA9IGpzY3MubGl0ZXJhbChsaXRlcmFsKTtcblxuICAgIC8vIFRPRE86IFN1cHBvcnQgZXhwb3J0cyBhbmQgZGVzdHJ1Y3R1cmluZy5cbiAgICBjb25zdCBkZXN0cnVjdHVyZSA9IGZhbHNlO1xuXG4gICAgaWYgKGRlc3RydWN0dXJlICYmIG9wdGlvbnMudHlwZUltcG9ydCkge1xuICAgICAgLy8gaW1wb3J0IHR5cGUge2Zvb30gZnJvbSAnZm9vJztcbiAgICAgIHRtcCA9IHN0YXRlbWVudGBpbXBvcnQgdHlwZSB7X30gZnJvbSAnXyc7XFxuYDtcbiAgICAgIHRtcC5zcGVjaWZpZXJzWzBdLmltcG9ydGVkID0gaWROb2RlO1xuICAgICAgdG1wLnNwZWNpZmllcnNbMF0ubG9jYWwgPSBpZE5vZGU7XG4gICAgICB0bXAuc291cmNlID0gbGl0ZXJhbE5vZGU7XG4gICAgICByZXR1cm4gdG1wO1xuICAgIH0gZWxzZSBpZiAoIWRlc3RydWN0dXJlICYmIG9wdGlvbnMudHlwZUltcG9ydCkge1xuICAgICAgLy8gaW1wb3J0IHR5cGUgZm9vIGZyb20gJ2Zvbyc7XG4gICAgICB0bXAgPSBzdGF0ZW1lbnRgaW1wb3J0IHR5cGUgXyBmcm9tICdfJztcXG5gO1xuICAgICAgdG1wLnNwZWNpZmllcnNbMF0uaWQgPSBpZE5vZGU7XG4gICAgICB0bXAuc3BlY2lmaWVyc1swXS5sb2NhbCA9IGlkTm9kZTtcbiAgICAgIHRtcC5zb3VyY2UgPSBsaXRlcmFsTm9kZTtcbiAgICAgIHJldHVybiB0bXA7XG4gICAgfSBlbHNlIGlmIChkZXN0cnVjdHVyZSAmJiAhb3B0aW9ucy50eXBlSW1wb3J0KSB7XG4gICAgICAvLyB2YXIge2Zvb30gPSByZXF1aXJlKCdmb28nKTtcbiAgICAgIGNvbnN0IHByb3BlcnR5ID0ganNjcy5wcm9wZXJ0eSgnaW5pdCcsIGlkTm9kZSwgaWROb2RlKTtcbiAgICAgIHByb3BlcnR5LnNob3J0aGFuZCA9IHRydWU7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICAnY29uc3QnLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoXG4gICAgICAgICAgb25lTGluZU9iamVjdFBhdHRlcm4oanNjcy5vYmplY3RQYXR0ZXJuKFtwcm9wZXJ0eV0pKSxcbiAgICAgICAgICBqc2NzLmNhbGxFeHByZXNzaW9uKFxuICAgICAgICAgICAganNjcy5pZGVudGlmaWVyKCdyZXF1aXJlJyksXG4gICAgICAgICAgICBbbGl0ZXJhbE5vZGVdLFxuICAgICAgICAgICksXG4gICAgICAgICldLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKCFkZXN0cnVjdHVyZSAmJiAhb3B0aW9ucy50eXBlSW1wb3J0KSB7XG4gICAgICAvLyB2YXIgZm9vID0gcmVxdWlyZSgnZm9vJyk7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICAnY29uc3QnLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoXG4gICAgICAgICAgaWROb2RlLFxuICAgICAgICAgIGpzY3MuY2FsbEV4cHJlc3Npb24oXG4gICAgICAgICAgICBqc2NzLmlkZW50aWZpZXIoJ3JlcXVpcmUnKSxcbiAgICAgICAgICAgIFtsaXRlcmFsTm9kZV0sXG4gICAgICAgICAgKSxcbiAgICAgICAgKV0sXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIENhbid0IGhhbmRsZSB0aGlzIHR5cGUgb2YgcmVxdWlyZSB5ZXQuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRCdWlsdElucygpOiBTZXQ8SWRlbnRpZmllcj4ge1xuICAgIHJldHVybiB0aGlzLl9idWlsdElucztcbiAgfVxuXG4gIGdldEJ1aWx0SW5UeXBlcygpOiBTZXQ8SWRlbnRpZmllcj4ge1xuICAgIHJldHVybiB0aGlzLl9idWlsdEluVHlwZXM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2R1bGVNYXA7XG4iXX0=