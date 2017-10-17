'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var statement = _jscodeshift2.default.template.statement;

var ModuleMap = function () {
  /**
   * Identifiers that might correspond to the default export of a particular
   * literal.
   */

  /**
   * Identifiers that have an exact path to use.
   */

  /**
   * Identifiers that should be ignored when they are a type.
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
    this._reversedAliases = new Map([].concat(_toConsumableArray(options.aliases)).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          i = _ref2[0],
          a = _ref2[1];

      return [a, i];
    }));

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
   * Aliases back to their identifiers.
   */

  /**
   * Identifiers that have an exact alias to use.
   */

  // Note: These fields are ordered by precendence.

  /**
   * Identifiers that should be ignored when not a type.
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
  }, {
    key: 'getAlias',
    value: function getAlias(id) {
      return this._reversedAliases.has(id) ? this._reversedAliases.get(id) : id;
    }
  }]);

  return ModuleMap;
}();

module.exports = ModuleMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc3RhdGUvTW9kdWxlTWFwLmpzIl0sIm5hbWVzIjpbInN0YXRlbWVudCIsInRlbXBsYXRlIiwiTW9kdWxlTWFwIiwib3B0aW9ucyIsInZhbGlkYXRlTW9kdWxlTWFwT3B0aW9ucyIsIl9idWlsdElucyIsImJ1aWx0SW5zIiwiX2J1aWx0SW5UeXBlcyIsImJ1aWx0SW5UeXBlcyIsIl9hbGlhc2VzIiwiYWxpYXNlcyIsIl9hbGlhc2VzVG9SZWxhdGl2aXplIiwiYWxpYXNlc1RvUmVsYXRpdml6ZSIsIl9yZXZlcnNlZEFsaWFzZXMiLCJNYXAiLCJtYXAiLCJpIiwiYSIsImlkIiwiaWRzIiwiZmlsZVBhdGgiLCJzZXQiLCJfZGVmYXVsdHMiLCJwYXRocyIsImdldElkZW50aWZpZXJzRnJvbVBhdGgiLCJsaXRlcmFsIiwiZ2V0TGl0ZXJhbEZyb21QYXRoIiwiZ2V0IiwiU2V0IiwiYWRkIiwiX2RlZmF1bHRzVG9SZWxhdGl2aXplIiwicGF0aHNUb1JlbGF0aXZpemUiLCJ2YWxpZGF0ZVJlcXVpcmVPcHRpb25zIiwidHlwZUltcG9ydCIsImhhcyIsInRtcCIsInNvdXJjZVBhdGgiLCJyZWxhdGl2aXplRm9yUmVxdWlyZSIsInNpemUiLCJub25OdWxsU291cmNlUGF0aCIsImpzeFN1ZmZpeCIsImlkTm9kZSIsImlkZW50aWZpZXIiLCJsaXRlcmFsTm9kZSIsImRlc3RydWN0dXJlIiwic3BlY2lmaWVycyIsImltcG9ydGVkIiwibG9jYWwiLCJzb3VyY2UiLCJwcm9wZXJ0eSIsInNob3J0aGFuZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJvYmplY3RQYXR0ZXJuIiwiY2FsbEV4cHJlc3Npb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O3FqQkFBQTs7Ozs7Ozs7Ozs7OztBQWNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFT0EsUyxHQUFhLHNCQUFL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OztrQ0FFOEI7QUFDN0IsYUFBTyxLQUFLdEMsU0FBWjtBQUNEOzs7c0NBRWtDO0FBQ2pDLGFBQU8sS0FBS0UsYUFBWjtBQUNEOzs7NkJBRVFXLEUsRUFBb0I7QUFDM0IsYUFBTyxLQUFLTCxnQkFBTCxDQUFzQnFCLEdBQXRCLENBQTBCaEIsRUFBMUIsSUFDRixLQUFLTCxnQkFBTCxDQUFzQmMsR0FBdEIsQ0FBMEJULEVBQTFCLENBREUsR0FFSEEsRUFGSjtBQUdEOzs7Ozs7QUFHSHFDLE9BQU9DLE9BQVAsR0FBaUJ0RCxTQUFqQiIsImZpbGUiOiJNb2R1bGVNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHlwZSB7QWJzb2x1dGVQYXRoLCBJZGVudGlmaWVyLCBMaXRlcmFsfSBmcm9tICcuLi90eXBlcy9jb21tb24nO1xuaW1wb3J0IHR5cGUge01vZHVsZU1hcE9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvTW9kdWxlTWFwT3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7UmVxdWlyZU9wdGlvbnN9IGZyb20gJy4uL29wdGlvbnMvUmVxdWlyZU9wdGlvbnMnO1xuXG5pbXBvcnQgTW9kdWxlTWFwVXRpbHMgZnJvbSAnLi4vdXRpbHMvTW9kdWxlTWFwVXRpbHMnO1xuaW1wb3J0IE9wdGlvbnMgZnJvbSAnLi4vb3B0aW9ucy9PcHRpb25zJztcbmltcG9ydCBqc2NzIGZyb20gJ2pzY29kZXNoaWZ0JztcbmltcG9ydCBvbmVMaW5lT2JqZWN0UGF0dGVybiBmcm9tICcuLi91dGlscy9vbmVMaW5lT2JqZWN0UGF0dGVybic7XG5cbmNvbnN0IHtzdGF0ZW1lbnR9ID0ganNjcy50ZW1wbGF0ZTtcblxuY2xhc3MgTW9kdWxlTWFwIHtcbiAgLy8gTm90ZTogVGhlc2UgZmllbGRzIGFyZSBvcmRlcmVkIGJ5IHByZWNlbmRlbmNlLlxuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IHNob3VsZCBiZSBpZ25vcmVkIHdoZW4gbm90IGEgdHlwZS5cbiAgICovXG4gIF9idWlsdEluczogU2V0PElkZW50aWZpZXI+O1xuICAvKipcbiAgICogSWRlbnRpZmllcnMgdGhhdCBzaG91bGQgYmUgaWdub3JlZCB3aGVuIHRoZXkgYXJlIGEgdHlwZS5cbiAgICovXG4gIF9idWlsdEluVHlwZXM6IFNldDxJZGVudGlmaWVyPjtcbiAgLyoqXG4gICAqIElkZW50aWZpZXJzIHRoYXQgaGF2ZSBhbiBleGFjdCBhbGlhcyB0byB1c2UuXG4gICAqL1xuICBfYWxpYXNlczogTWFwPElkZW50aWZpZXIsIExpdGVyYWw+O1xuICAvKipcbiAgICogSWRlbnRpZmllcnMgdGhhdCBoYXZlIGFuIGV4YWN0IHBhdGggdG8gdXNlLlxuICAgKi9cbiAgX2FsaWFzZXNUb1JlbGF0aXZpemU6IE1hcDxJZGVudGlmaWVyLCBBYnNvbHV0ZVBhdGg+O1xuICAvKipcbiAgICogQWxpYXNlcyBiYWNrIHRvIHRoZWlyIGlkZW50aWZpZXJzLlxuICAgKi9cbiAgX3JldmVyc2VkQWxpYXNlczogTWFwPExpdGVyYWwsIElkZW50aWZpZXI+O1xuICAvKipcbiAgICogSWRlbnRpZmllcnMgdGhhdCBtaWdodCBjb3JyZXNwb25kIHRvIHRoZSBkZWZhdWx0IGV4cG9ydCBvZiBhIHBhcnRpY3VsYXJcbiAgICogbGl0ZXJhbC5cbiAgICovXG4gIF9kZWZhdWx0czogTWFwPElkZW50aWZpZXIsIFNldDxMaXRlcmFsPj47XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IG1pZ2h0IGNvcnJlc3BvbmQgdG8gdGhlIGRlZmF1bHQgZXhwb3J0IG9mIGEgcGFydGljdWxhclxuICAgKiBhYnNvbHV0ZSBwYXRoLlxuICAgKi9cbiAgX2RlZmF1bHRzVG9SZWxhdGl2aXplOiBNYXA8SWRlbnRpZmllciwgU2V0PEFic29sdXRlUGF0aD4+O1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE1vZHVsZU1hcE9wdGlvbnMpIHtcbiAgICBPcHRpb25zLnZhbGlkYXRlTW9kdWxlTWFwT3B0aW9ucyhvcHRpb25zKTtcblxuICAgIC8vIE5vdGU6IElmIHNvbWVvbmUgbWFpbnRhaW5zIGEgcmVmZXJlbmNlIHRvIHRoZSBzdHJ1Y3R1cmUgd2l0aGluIG9wdGlvbnNcbiAgICAvLyB0aGV5IGNvdWxkIG11dGF0ZSB0aGUgTW9kdWxlTWFwJ3MgYmVoYXZpb3IuIFdlIGNvdWxkIG1ha2Ugc2hhbGxvdyBjb3BpZXNcbiAgICAvLyBoZXJlIGJ1dCBhcmUgb3B0aW5nIG5vdCB0byBmb3IgcGVyZm9ybWFuY2UuXG4gICAgdGhpcy5fYnVpbHRJbnMgPSBvcHRpb25zLmJ1aWx0SW5zO1xuICAgIHRoaXMuX2J1aWx0SW5UeXBlcyA9IG9wdGlvbnMuYnVpbHRJblR5cGVzO1xuICAgIHRoaXMuX2FsaWFzZXMgPSBvcHRpb25zLmFsaWFzZXM7XG4gICAgdGhpcy5fYWxpYXNlc1RvUmVsYXRpdml6ZSA9IG9wdGlvbnMuYWxpYXNlc1RvUmVsYXRpdml6ZTtcbiAgICB0aGlzLl9yZXZlcnNlZEFsaWFzZXMgPVxuICAgICAgbmV3IE1hcChbLi4ub3B0aW9ucy5hbGlhc2VzXS5tYXAoKFtpLCBhXSkgPT4gW2EsIGldKSk7XG5cbiAgICAvLyBUT0RPOiBVc2UgbGV0IGZvciBwcm9wZXIgc2NvcGluZy5cbiAgICBsZXQgaWQ7XG4gICAgbGV0IGlkcztcbiAgICBsZXQgZmlsZVBhdGg7XG4gICAgbGV0IHNldDtcblxuICAgIHRoaXMuX2RlZmF1bHRzID0gbmV3IE1hcCgpO1xuICAgIGZvciAoZmlsZVBhdGggb2Ygb3B0aW9ucy5wYXRocykge1xuICAgICAgaWRzID0gTW9kdWxlTWFwVXRpbHMuZ2V0SWRlbnRpZmllcnNGcm9tUGF0aChmaWxlUGF0aCk7XG4gICAgICBjb25zdCBsaXRlcmFsID0gTW9kdWxlTWFwVXRpbHMuZ2V0TGl0ZXJhbEZyb21QYXRoKGZpbGVQYXRoKTtcbiAgICAgIGZvciAoaWQgb2YgaWRzKSB7XG4gICAgICAgIHNldCA9IHRoaXMuX2RlZmF1bHRzLmdldChpZCk7XG4gICAgICAgIGlmICghc2V0KSB7XG4gICAgICAgICAgc2V0ID0gbmV3IFNldCgpO1xuICAgICAgICAgIHRoaXMuX2RlZmF1bHRzLnNldChpZCwgc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXQuYWRkKGxpdGVyYWwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplID0gbmV3IE1hcCgpO1xuICAgIGZvciAoZmlsZVBhdGggb2Ygb3B0aW9ucy5wYXRoc1RvUmVsYXRpdml6ZSkge1xuICAgICAgaWRzID0gTW9kdWxlTWFwVXRpbHMuZ2V0SWRlbnRpZmllcnNGcm9tUGF0aChmaWxlUGF0aCk7XG4gICAgICBmb3IgKGlkIG9mIGlkcykge1xuICAgICAgICBzZXQgPSB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZS5nZXQoaWQpO1xuICAgICAgICBpZiAoIXNldCkge1xuICAgICAgICAgIHNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZS5zZXQoaWQsIHNldCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0LmFkZChmaWxlUGF0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzaW5nbGUgcmVxdWlyZSwgdGhpcyBpc24ndCBncmVhdCBmb3Igd2hlbiB5b3Ugd2FudCB0byBkZXN0cnVjdHVyZVxuICAgKiBtdWx0aXBsZSB0aGluZ3MgaW4gYSBzaW5nbGUgc3RhdGVtZW50LlxuICAgKlxuICAgKiBUT0RPOiBhZGQgYSBnZXRSZXF1aXJlcygpIHRoYXQgY29uc29saWRhdGVzIGF1dG9tYXRpY2FsbHksIG9yIGFkZCBhXG4gICAqIHNwZWNpZmljIGNvbnNvbGlkYXRlIHN0ZXAgYXMgcGFydCBvZiB0aGUgdHJhbnNmb3JtLlxuICAgKi9cbiAgZ2V0UmVxdWlyZShpZDogSWRlbnRpZmllciwgb3B0aW9uczogUmVxdWlyZU9wdGlvbnMpOiA/Tm9kZSB7XG4gICAgT3B0aW9ucy52YWxpZGF0ZVJlcXVpcmVPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgLy8gRG9uJ3QgaW1wb3J0IGJ1aWx0IGlucy5cbiAgICBpZiAoIW9wdGlvbnMudHlwZUltcG9ydCkge1xuICAgICAgaWYgKHRoaXMuX2J1aWx0SW5zLmhhcyhpZCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl9idWlsdEluVHlwZXMuaGFzKGlkKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgbGV0IGZvciBwcm9wZXIgc2NvcGluZy5cbiAgICBsZXQgbGl0ZXJhbDtcbiAgICBsZXQgdG1wO1xuXG4gICAgaWYgKHRoaXMuX2FsaWFzZXMuaGFzKGlkKSkge1xuICAgICAgbGl0ZXJhbCA9IHRoaXMuX2FsaWFzZXMuZ2V0KGlkKTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuc291cmNlUGF0aCAmJiB0aGlzLl9hbGlhc2VzVG9SZWxhdGl2aXplLmhhcyhpZCkpIHtcbiAgICAgIGxpdGVyYWwgPSBNb2R1bGVNYXBVdGlscy5yZWxhdGl2aXplRm9yUmVxdWlyZShcbiAgICAgICAgb3B0aW9ucy5zb3VyY2VQYXRoLFxuICAgICAgICAvLyAkRmxvd0ZpeE1lKGthZClcbiAgICAgICAgdGhpcy5fYWxpYXNlc1RvUmVsYXRpdml6ZS5nZXQoaWQpLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5fZGVmYXVsdHMuaGFzKGlkKSAmJlxuICAgICAgLy8gJEZsb3dGaXhNZShrYWQpXG4gICAgICB0aGlzLl9kZWZhdWx0cy5nZXQoaWQpLnNpemUgPT09IDFcbiAgICApIHtcbiAgICAgIC8vIFRPRE86IFdoYXQncyB0aGUgYmVzdCB3YXkgdG8gZ2V0IHRoZSBzaW5nbGUgdGhpbmcgb3V0IG9mIGEgb25lIGVsZW1lbnRcbiAgICAgIC8vIFNldD9cbiAgICAgIC8vICRGbG93Rml4TWUoa2FkKVxuICAgICAgZm9yICh0bXAgb2YgdGhpcy5fZGVmYXVsdHMuZ2V0KGlkKSkge1xuICAgICAgICBsaXRlcmFsID0gdG1wO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3B0aW9ucy5zb3VyY2VQYXRoICYmXG4gICAgICB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZS5oYXMoaWQpICYmXG4gICAgICAvLyAkRmxvd0ZpeE1lKGthZClcbiAgICAgIHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplLmdldChpZCkuc2l6ZSA9PT0gMVxuICAgICkge1xuICAgICAgY29uc3Qgbm9uTnVsbFNvdXJjZVBhdGggPSBvcHRpb25zLnNvdXJjZVBhdGg7XG4gICAgICAvLyBUT0RPOiBXaGF0J3MgdGhlIGJlc3Qgd2F5IHRvIGdldCB0aGUgc2luZ2xlIHRoaW5nIG91dCBvZiBhIG9uZSBlbGVtZW50XG4gICAgICAvLyBTZXQ/XG4gICAgICAvLyAkRmxvd0ZpeE1lKGthZClcbiAgICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2YgdGhpcy5fZGVmYXVsdHNUb1JlbGF0aXZpemUuZ2V0KGlkKSkge1xuICAgICAgICBsaXRlcmFsID0gTW9kdWxlTWFwVXRpbHMucmVsYXRpdml6ZUZvclJlcXVpcmUoXG4gICAgICAgICAgbm9uTnVsbFNvdXJjZVBhdGgsXG4gICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5qc3hTdWZmaXgpIHtcbiAgICAgIGxpdGVyYWwgPSBpZCArICcucmVhY3QnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlIHNvIHRoYXQgaXQncyBwb3NzaWJsZSB0byBvbmx5IGFkZCBrbm93blxuICAgICAgLy8gcmVxdWlyZXMgYW5kIGlnbm9yZSB1bmtub3duIG1vZHVsZXMuXG4gICAgICBsaXRlcmFsID0gaWQ7XG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIGNvbW1vbiBub2RlcyBmb3IgcHJpbnRpbmcuXG4gICAgY29uc3QgaWROb2RlID0ganNjcy5pZGVudGlmaWVyKGlkKTtcbiAgICBjb25zdCBsaXRlcmFsTm9kZSA9IGpzY3MubGl0ZXJhbChsaXRlcmFsKTtcblxuICAgIC8vIFRPRE86IFN1cHBvcnQgZXhwb3J0cyBhbmQgZGVzdHJ1Y3R1cmluZy5cbiAgICBjb25zdCBkZXN0cnVjdHVyZSA9IGZhbHNlO1xuXG4gICAgaWYgKGRlc3RydWN0dXJlICYmIG9wdGlvbnMudHlwZUltcG9ydCkge1xuICAgICAgLy8gaW1wb3J0IHR5cGUge2Zvb30gZnJvbSAnZm9vJztcbiAgICAgIHRtcCA9IHN0YXRlbWVudGBpbXBvcnQgdHlwZSB7X30gZnJvbSAnXyc7XFxuYDtcbiAgICAgIHRtcC5zcGVjaWZpZXJzWzBdLmltcG9ydGVkID0gaWROb2RlO1xuICAgICAgdG1wLnNwZWNpZmllcnNbMF0ubG9jYWwgPSBpZE5vZGU7XG4gICAgICB0bXAuc291cmNlID0gbGl0ZXJhbE5vZGU7XG4gICAgICByZXR1cm4gdG1wO1xuICAgIH0gZWxzZSBpZiAoIWRlc3RydWN0dXJlICYmIG9wdGlvbnMudHlwZUltcG9ydCkge1xuICAgICAgLy8gaW1wb3J0IHR5cGUgZm9vIGZyb20gJ2Zvbyc7XG4gICAgICB0bXAgPSBzdGF0ZW1lbnRgaW1wb3J0IHR5cGUgXyBmcm9tICdfJztcXG5gO1xuICAgICAgdG1wLnNwZWNpZmllcnNbMF0uaWQgPSBpZE5vZGU7XG4gICAgICB0bXAuc3BlY2lmaWVyc1swXS5sb2NhbCA9IGlkTm9kZTtcbiAgICAgIHRtcC5zb3VyY2UgPSBsaXRlcmFsTm9kZTtcbiAgICAgIHJldHVybiB0bXA7XG4gICAgfSBlbHNlIGlmIChkZXN0cnVjdHVyZSAmJiAhb3B0aW9ucy50eXBlSW1wb3J0KSB7XG4gICAgICAvLyB2YXIge2Zvb30gPSByZXF1aXJlKCdmb28nKTtcbiAgICAgIGNvbnN0IHByb3BlcnR5ID0ganNjcy5wcm9wZXJ0eSgnaW5pdCcsIGlkTm9kZSwgaWROb2RlKTtcbiAgICAgIHByb3BlcnR5LnNob3J0aGFuZCA9IHRydWU7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICAnY29uc3QnLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoXG4gICAgICAgICAgb25lTGluZU9iamVjdFBhdHRlcm4oanNjcy5vYmplY3RQYXR0ZXJuKFtwcm9wZXJ0eV0pKSxcbiAgICAgICAgICBqc2NzLmNhbGxFeHByZXNzaW9uKFxuICAgICAgICAgICAganNjcy5pZGVudGlmaWVyKCdyZXF1aXJlJyksXG4gICAgICAgICAgICBbbGl0ZXJhbE5vZGVdLFxuICAgICAgICAgICksXG4gICAgICAgICldLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKCFkZXN0cnVjdHVyZSAmJiAhb3B0aW9ucy50eXBlSW1wb3J0KSB7XG4gICAgICAvLyB2YXIgZm9vID0gcmVxdWlyZSgnZm9vJyk7XG4gICAgICByZXR1cm4ganNjcy52YXJpYWJsZURlY2xhcmF0aW9uKFxuICAgICAgICAnY29uc3QnLFxuICAgICAgICBbanNjcy52YXJpYWJsZURlY2xhcmF0b3IoXG4gICAgICAgICAgaWROb2RlLFxuICAgICAgICAgIGpzY3MuY2FsbEV4cHJlc3Npb24oXG4gICAgICAgICAgICBqc2NzLmlkZW50aWZpZXIoJ3JlcXVpcmUnKSxcbiAgICAgICAgICAgIFtsaXRlcmFsTm9kZV0sXG4gICAgICAgICAgKSxcbiAgICAgICAgKV0sXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIENhbid0IGhhbmRsZSB0aGlzIHR5cGUgb2YgcmVxdWlyZSB5ZXQuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRCdWlsdElucygpOiBTZXQ8SWRlbnRpZmllcj4ge1xuICAgIHJldHVybiB0aGlzLl9idWlsdElucztcbiAgfVxuXG4gIGdldEJ1aWx0SW5UeXBlcygpOiBTZXQ8SWRlbnRpZmllcj4ge1xuICAgIHJldHVybiB0aGlzLl9idWlsdEluVHlwZXM7XG4gIH1cblxuICBnZXRBbGlhcyhpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcmV2ZXJzZWRBbGlhc2VzLmhhcyhpZClcbiAgICAgID8gKHRoaXMuX3JldmVyc2VkQWxpYXNlcy5nZXQoaWQpOiBhbnkpXG4gICAgICA6IGlkO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kdWxlTWFwO1xuIl19