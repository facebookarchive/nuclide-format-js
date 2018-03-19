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

var _ModuleMapUtils;

function _load_ModuleMapUtils() {
  return _ModuleMapUtils = _interopRequireDefault(require('../utils/ModuleMapUtils'));
}

var _Options;

function _load_Options() {
  return _Options = _interopRequireDefault(require('../options/Options'));
}

var _jscodeshift;

function _load_jscodeshift() {
  return _jscodeshift = _interopRequireDefault(require('../utils/jscodeshift'));
}

var _oneLineObjectPattern;

function _load_oneLineObjectPattern() {
  return _oneLineObjectPattern = _interopRequireDefault(require('../utils/oneLineObjectPattern'));
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

    (_Options || _load_Options()).default.validateModuleMapOptions(options);

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

    this._defaults = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options.paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var filePath = _step.value;

        var ids = (_ModuleMapUtils || _load_ModuleMapUtils()).default.getIdentifiersFromPath(filePath);
        var literal = (_ModuleMapUtils || _load_ModuleMapUtils()).default.getLiteralFromPath(filePath);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = ids[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var id = _step3.value;

            var set = this._defaults.get(id);
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
        var _filePath = _step2.value;

        var ids = (_ModuleMapUtils || _load_ModuleMapUtils()).default.getIdentifiersFromPath(_filePath);
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = ids[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _id = _step4.value;

            var _set = this._defaultsToRelativize.get(_id);
            if (!_set) {
              _set = new Set();
              this._defaultsToRelativize.set(_id, _set);
            }
            _set.add(_filePath);
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
      (_Options || _load_Options()).default.validateRequireOptions(options);

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

      var literal = void 0;
      if (this._aliases.has(id)) {
        literal = this._aliases.get(id);
      } else if (options.sourcePath && this._aliasesToRelativize.has(id)) {
        literal = (_ModuleMapUtils || _load_ModuleMapUtils()).default.relativizeForRequire(options.sourcePath,
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
            var tmp = _step5.value;

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
            var filePath = _step6.value;

            literal = (_ModuleMapUtils || _load_ModuleMapUtils()).default.relativizeForRequire(nonNullSourcePath, filePath);
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
      var idNode = (_jscodeshift || _load_jscodeshift()).default.identifier(id);
      var literalNode = (_jscodeshift || _load_jscodeshift()).default.literal(literal);

      // TODO: Support exports and destructuring.
      var destructure = false;

      var statement = (_jscodeshift || _load_jscodeshift()).default.template.statement;

      if (destructure && options.typeImport) {
        // import type {foo} from 'foo';
        var _tmp = statement(_templateObject);
        _tmp.specifiers[0].imported = idNode;
        _tmp.specifiers[0].local = idNode;
        _tmp.source = literalNode;
        return _tmp;
      } else if (!destructure && options.typeImport) {
        // import type foo from 'foo';
        var _tmp2 = statement(_templateObject2);
        _tmp2.specifiers[0].id = idNode;
        _tmp2.specifiers[0].local = idNode;
        _tmp2.source = literalNode;
        return _tmp2;
      } else if (destructure && !options.typeImport) {
        // var {foo} = require('foo');
        var property = (_jscodeshift || _load_jscodeshift()).default.property('init', idNode, idNode);
        property.shorthand = true;
        return (_jscodeshift || _load_jscodeshift()).default.variableDeclaration('const', [(_jscodeshift || _load_jscodeshift()).default.variableDeclarator((0, (_oneLineObjectPattern || _load_oneLineObjectPattern()).default)((_jscodeshift || _load_jscodeshift()).default.objectPattern([property])), (_jscodeshift || _load_jscodeshift()).default.callExpression((_jscodeshift || _load_jscodeshift()).default.identifier('require'), [literalNode]))]);
      } else if (!destructure && !options.typeImport) {
        // var foo = require('foo');
        return (_jscodeshift || _load_jscodeshift()).default.variableDeclaration('const', [(_jscodeshift || _load_jscodeshift()).default.variableDeclarator(idNode, (_jscodeshift || _load_jscodeshift()).default.callExpression((_jscodeshift || _load_jscodeshift()).default.identifier('require'), [literalNode]))]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc3RhdGUvTW9kdWxlTWFwLmpzIl0sIm5hbWVzIjpbIk1vZHVsZU1hcCIsIm9wdGlvbnMiLCJ2YWxpZGF0ZU1vZHVsZU1hcE9wdGlvbnMiLCJfYnVpbHRJbnMiLCJidWlsdElucyIsIl9idWlsdEluVHlwZXMiLCJidWlsdEluVHlwZXMiLCJfYWxpYXNlcyIsImFsaWFzZXMiLCJfYWxpYXNlc1RvUmVsYXRpdml6ZSIsImFsaWFzZXNUb1JlbGF0aXZpemUiLCJfcmV2ZXJzZWRBbGlhc2VzIiwiTWFwIiwibWFwIiwiaSIsImEiLCJfZGVmYXVsdHMiLCJwYXRocyIsImZpbGVQYXRoIiwiaWRzIiwiZ2V0SWRlbnRpZmllcnNGcm9tUGF0aCIsImxpdGVyYWwiLCJnZXRMaXRlcmFsRnJvbVBhdGgiLCJpZCIsInNldCIsImdldCIsIlNldCIsImFkZCIsIl9kZWZhdWx0c1RvUmVsYXRpdml6ZSIsInBhdGhzVG9SZWxhdGl2aXplIiwidmFsaWRhdGVSZXF1aXJlT3B0aW9ucyIsInR5cGVJbXBvcnQiLCJoYXMiLCJzb3VyY2VQYXRoIiwicmVsYXRpdml6ZUZvclJlcXVpcmUiLCJzaXplIiwidG1wIiwibm9uTnVsbFNvdXJjZVBhdGgiLCJqc3hTdWZmaXgiLCJpZE5vZGUiLCJpZGVudGlmaWVyIiwibGl0ZXJhbE5vZGUiLCJkZXN0cnVjdHVyZSIsInN0YXRlbWVudCIsInRlbXBsYXRlIiwic3BlY2lmaWVycyIsImltcG9ydGVkIiwibG9jYWwiLCJzb3VyY2UiLCJwcm9wZXJ0eSIsInNob3J0aGFuZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJvYmplY3RQYXR0ZXJuIiwiY2FsbEV4cHJlc3Npb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O3FqQkFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBY0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBOzs7O0FB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LENBQVA7QUFVRDs7QUFFRDtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7a0NBRThCO0FBQzdCLGFBQU8sS0FBS3RDLFNBQVo7QUFDRDs7O3NDQUVrQztBQUNqQyxhQUFPLEtBQUtFLGFBQVo7QUFDRDs7OzZCQUVRa0IsRSxFQUFvQjtBQUMzQixhQUFPLEtBQUtaLGdCQUFMLENBQXNCcUIsR0FBdEIsQ0FBMEJULEVBQTFCLElBQ0YsS0FBS1osZ0JBQUwsQ0FBc0JjLEdBQXRCLENBQTBCRixFQUExQixDQURFLEdBRUhBLEVBRko7QUFHRDs7Ozs7O0FBR0hnQyxPQUFPQyxPQUFQLEdBQWlCeEQsU0FBakIiLCJmaWxlIjoiTW9kdWxlTWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuaW1wb3J0IHR5cGUge0Fic29sdXRlUGF0aCwgSWRlbnRpZmllciwgTGl0ZXJhbH0gZnJvbSAnLi4vdHlwZXMvY29tbW9uJztcbmltcG9ydCB0eXBlIHtNb2R1bGVNYXBPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL01vZHVsZU1hcE9wdGlvbnMnO1xuaW1wb3J0IHR5cGUge1JlcXVpcmVPcHRpb25zfSBmcm9tICcuLi9vcHRpb25zL1JlcXVpcmVPcHRpb25zJztcblxuaW1wb3J0IE1vZHVsZU1hcFV0aWxzIGZyb20gJy4uL3V0aWxzL01vZHVsZU1hcFV0aWxzJztcbmltcG9ydCBPcHRpb25zIGZyb20gJy4uL29wdGlvbnMvT3B0aW9ucyc7XG5pbXBvcnQganNjcyBmcm9tICcuLi91dGlscy9qc2NvZGVzaGlmdCc7XG5pbXBvcnQgb25lTGluZU9iamVjdFBhdHRlcm4gZnJvbSAnLi4vdXRpbHMvb25lTGluZU9iamVjdFBhdHRlcm4nO1xuXG5jbGFzcyBNb2R1bGVNYXAge1xuICAvLyBOb3RlOiBUaGVzZSBmaWVsZHMgYXJlIG9yZGVyZWQgYnkgcHJlY2VuZGVuY2UuXG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXJzIHRoYXQgc2hvdWxkIGJlIGlnbm9yZWQgd2hlbiBub3QgYSB0eXBlLlxuICAgKi9cbiAgX2J1aWx0SW5zOiBTZXQ8SWRlbnRpZmllcj47XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IHNob3VsZCBiZSBpZ25vcmVkIHdoZW4gdGhleSBhcmUgYSB0eXBlLlxuICAgKi9cbiAgX2J1aWx0SW5UeXBlczogU2V0PElkZW50aWZpZXI+O1xuICAvKipcbiAgICogSWRlbnRpZmllcnMgdGhhdCBoYXZlIGFuIGV4YWN0IGFsaWFzIHRvIHVzZS5cbiAgICovXG4gIF9hbGlhc2VzOiBNYXA8SWRlbnRpZmllciwgTGl0ZXJhbD47XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IGhhdmUgYW4gZXhhY3QgcGF0aCB0byB1c2UuXG4gICAqL1xuICBfYWxpYXNlc1RvUmVsYXRpdml6ZTogTWFwPElkZW50aWZpZXIsIEFic29sdXRlUGF0aD47XG4gIC8qKlxuICAgKiBBbGlhc2VzIGJhY2sgdG8gdGhlaXIgaWRlbnRpZmllcnMuXG4gICAqL1xuICBfcmV2ZXJzZWRBbGlhc2VzOiBNYXA8TGl0ZXJhbCwgSWRlbnRpZmllcj47XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IG1pZ2h0IGNvcnJlc3BvbmQgdG8gdGhlIGRlZmF1bHQgZXhwb3J0IG9mIGEgcGFydGljdWxhclxuICAgKiBsaXRlcmFsLlxuICAgKi9cbiAgX2RlZmF1bHRzOiBNYXA8SWRlbnRpZmllciwgU2V0PExpdGVyYWw+PjtcbiAgLyoqXG4gICAqIElkZW50aWZpZXJzIHRoYXQgbWlnaHQgY29ycmVzcG9uZCB0byB0aGUgZGVmYXVsdCBleHBvcnQgb2YgYSBwYXJ0aWN1bGFyXG4gICAqIGFic29sdXRlIHBhdGguXG4gICAqL1xuICBfZGVmYXVsdHNUb1JlbGF0aXZpemU6IE1hcDxJZGVudGlmaWVyLCBTZXQ8QWJzb2x1dGVQYXRoPj47XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogTW9kdWxlTWFwT3B0aW9ucykge1xuICAgIE9wdGlvbnMudmFsaWRhdGVNb2R1bGVNYXBPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgLy8gTm90ZTogSWYgc29tZW9uZSBtYWludGFpbnMgYSByZWZlcmVuY2UgdG8gdGhlIHN0cnVjdHVyZSB3aXRoaW4gb3B0aW9uc1xuICAgIC8vIHRoZXkgY291bGQgbXV0YXRlIHRoZSBNb2R1bGVNYXAncyBiZWhhdmlvci4gV2UgY291bGQgbWFrZSBzaGFsbG93IGNvcGllc1xuICAgIC8vIGhlcmUgYnV0IGFyZSBvcHRpbmcgbm90IHRvIGZvciBwZXJmb3JtYW5jZS5cbiAgICB0aGlzLl9idWlsdElucyA9IG9wdGlvbnMuYnVpbHRJbnM7XG4gICAgdGhpcy5fYnVpbHRJblR5cGVzID0gb3B0aW9ucy5idWlsdEluVHlwZXM7XG4gICAgdGhpcy5fYWxpYXNlcyA9IG9wdGlvbnMuYWxpYXNlcztcbiAgICB0aGlzLl9hbGlhc2VzVG9SZWxhdGl2aXplID0gb3B0aW9ucy5hbGlhc2VzVG9SZWxhdGl2aXplO1xuICAgIHRoaXMuX3JldmVyc2VkQWxpYXNlcyA9XG4gICAgICBuZXcgTWFwKFsuLi5vcHRpb25zLmFsaWFzZXNdLm1hcCgoW2ksIGFdKSA9PiBbYSwgaV0pKTtcblxuICAgIHRoaXMuX2RlZmF1bHRzID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2Ygb3B0aW9ucy5wYXRocykge1xuICAgICAgY29uc3QgaWRzID0gTW9kdWxlTWFwVXRpbHMuZ2V0SWRlbnRpZmllcnNGcm9tUGF0aChmaWxlUGF0aCk7XG4gICAgICBjb25zdCBsaXRlcmFsID0gTW9kdWxlTWFwVXRpbHMuZ2V0TGl0ZXJhbEZyb21QYXRoKGZpbGVQYXRoKTtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgICAgIGxldCBzZXQgPSB0aGlzLl9kZWZhdWx0cy5nZXQoaWQpO1xuICAgICAgICBpZiAoIXNldCkge1xuICAgICAgICAgIHNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB0aGlzLl9kZWZhdWx0cy5zZXQoaWQsIHNldCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0LmFkZChsaXRlcmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZSA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIG9mIG9wdGlvbnMucGF0aHNUb1JlbGF0aXZpemUpIHtcbiAgICAgIGNvbnN0IGlkcyA9IE1vZHVsZU1hcFV0aWxzLmdldElkZW50aWZpZXJzRnJvbVBhdGgoZmlsZVBhdGgpO1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgICAgbGV0IHNldCA9IHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplLmdldChpZCk7XG4gICAgICAgIGlmICghc2V0KSB7XG4gICAgICAgICAgc2V0ID0gbmV3IFNldCgpO1xuICAgICAgICAgIHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplLnNldChpZCwgc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXQuYWRkKGZpbGVQYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNpbmdsZSByZXF1aXJlLCB0aGlzIGlzbid0IGdyZWF0IGZvciB3aGVuIHlvdSB3YW50IHRvIGRlc3RydWN0dXJlXG4gICAqIG11bHRpcGxlIHRoaW5ncyBpbiBhIHNpbmdsZSBzdGF0ZW1lbnQuXG4gICAqL1xuICBnZXRSZXF1aXJlKGlkOiBJZGVudGlmaWVyLCBvcHRpb25zOiBSZXF1aXJlT3B0aW9ucyk6ID9Ob2RlIHtcbiAgICBPcHRpb25zLnZhbGlkYXRlUmVxdWlyZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICAvLyBEb24ndCBpbXBvcnQgYnVpbHQgaW5zLlxuICAgIGlmICghb3B0aW9ucy50eXBlSW1wb3J0KSB7XG4gICAgICBpZiAodGhpcy5fYnVpbHRJbnMuaGFzKGlkKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX2J1aWx0SW5UeXBlcy5oYXMoaWQpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBsaXRlcmFsO1xuICAgIGlmICh0aGlzLl9hbGlhc2VzLmhhcyhpZCkpIHtcbiAgICAgIGxpdGVyYWwgPSB0aGlzLl9hbGlhc2VzLmdldChpZCk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnNvdXJjZVBhdGggJiYgdGhpcy5fYWxpYXNlc1RvUmVsYXRpdml6ZS5oYXMoaWQpKSB7XG4gICAgICBsaXRlcmFsID0gTW9kdWxlTWFwVXRpbHMucmVsYXRpdml6ZUZvclJlcXVpcmUoXG4gICAgICAgIG9wdGlvbnMuc291cmNlUGF0aCxcbiAgICAgICAgLy8gJEZsb3dGaXhNZShrYWQpXG4gICAgICAgIHRoaXMuX2FsaWFzZXNUb1JlbGF0aXZpemUuZ2V0KGlkKSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuX2RlZmF1bHRzLmhhcyhpZCkgJiZcbiAgICAgIC8vICRGbG93Rml4TWUoa2FkKVxuICAgICAgdGhpcy5fZGVmYXVsdHMuZ2V0KGlkKS5zaXplID09PSAxXG4gICAgKSB7XG4gICAgICAvLyBUT0RPOiBXaGF0J3MgdGhlIGJlc3Qgd2F5IHRvIGdldCB0aGUgc2luZ2xlIHRoaW5nIG91dCBvZiBhIG9uZSBlbGVtZW50XG4gICAgICAvLyBTZXQ/XG4gICAgICAvLyAkRmxvd0ZpeE1lKGthZClcbiAgICAgIGZvciAoY29uc3QgdG1wIG9mIHRoaXMuX2RlZmF1bHRzLmdldChpZCkpIHtcbiAgICAgICAgbGl0ZXJhbCA9IHRtcDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG9wdGlvbnMuc291cmNlUGF0aCAmJlxuICAgICAgdGhpcy5fZGVmYXVsdHNUb1JlbGF0aXZpemUuaGFzKGlkKSAmJlxuICAgICAgLy8gJEZsb3dGaXhNZShrYWQpXG4gICAgICB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZS5nZXQoaWQpLnNpemUgPT09IDFcbiAgICApIHtcbiAgICAgIGNvbnN0IG5vbk51bGxTb3VyY2VQYXRoID0gb3B0aW9ucy5zb3VyY2VQYXRoO1xuICAgICAgLy8gVE9ETzogV2hhdCdzIHRoZSBiZXN0IHdheSB0byBnZXQgdGhlIHNpbmdsZSB0aGluZyBvdXQgb2YgYSBvbmUgZWxlbWVudFxuICAgICAgLy8gU2V0P1xuICAgICAgLy8gJEZsb3dGaXhNZShrYWQpXG4gICAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIG9mIHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplLmdldChpZCkpIHtcbiAgICAgICAgbGl0ZXJhbCA9IE1vZHVsZU1hcFV0aWxzLnJlbGF0aXZpemVGb3JSZXF1aXJlKFxuICAgICAgICAgIG5vbk51bGxTb3VyY2VQYXRoLFxuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuanN4U3VmZml4KSB7XG4gICAgICBsaXRlcmFsID0gaWQgKyAnLnJlYWN0JztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNvbmZpZ3VyYWJsZSBzbyB0aGF0IGl0J3MgcG9zc2libGUgdG8gb25seSBhZGQga25vd25cbiAgICAgIC8vIHJlcXVpcmVzIGFuZCBpZ25vcmUgdW5rbm93biBtb2R1bGVzLlxuICAgICAgbGl0ZXJhbCA9IGlkO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBjb21tb24gbm9kZXMgZm9yIHByaW50aW5nLlxuICAgIGNvbnN0IGlkTm9kZSA9IGpzY3MuaWRlbnRpZmllcihpZCk7XG4gICAgY29uc3QgbGl0ZXJhbE5vZGUgPSBqc2NzLmxpdGVyYWwobGl0ZXJhbCk7XG5cbiAgICAvLyBUT0RPOiBTdXBwb3J0IGV4cG9ydHMgYW5kIGRlc3RydWN0dXJpbmcuXG4gICAgY29uc3QgZGVzdHJ1Y3R1cmUgPSBmYWxzZTtcblxuICAgIGNvbnN0IHtzdGF0ZW1lbnR9ID0ganNjcy50ZW1wbGF0ZTtcbiAgICBpZiAoZGVzdHJ1Y3R1cmUgJiYgb3B0aW9ucy50eXBlSW1wb3J0KSB7XG4gICAgICAvLyBpbXBvcnQgdHlwZSB7Zm9vfSBmcm9tICdmb28nO1xuICAgICAgY29uc3QgdG1wID0gc3RhdGVtZW50YGltcG9ydCB0eXBlIHtffSBmcm9tICdfJztcXG5gO1xuICAgICAgdG1wLnNwZWNpZmllcnNbMF0uaW1wb3J0ZWQgPSBpZE5vZGU7XG4gICAgICB0bXAuc3BlY2lmaWVyc1swXS5sb2NhbCA9IGlkTm9kZTtcbiAgICAgIHRtcC5zb3VyY2UgPSBsaXRlcmFsTm9kZTtcbiAgICAgIHJldHVybiB0bXA7XG4gICAgfSBlbHNlIGlmICghZGVzdHJ1Y3R1cmUgJiYgb3B0aW9ucy50eXBlSW1wb3J0KSB7XG4gICAgICAvLyBpbXBvcnQgdHlwZSBmb28gZnJvbSAnZm9vJztcbiAgICAgIGNvbnN0IHRtcCA9IHN0YXRlbWVudGBpbXBvcnQgdHlwZSBfIGZyb20gJ18nO1xcbmA7XG4gICAgICB0bXAuc3BlY2lmaWVyc1swXS5pZCA9IGlkTm9kZTtcbiAgICAgIHRtcC5zcGVjaWZpZXJzWzBdLmxvY2FsID0gaWROb2RlO1xuICAgICAgdG1wLnNvdXJjZSA9IGxpdGVyYWxOb2RlO1xuICAgICAgcmV0dXJuIHRtcDtcbiAgICB9IGVsc2UgaWYgKGRlc3RydWN0dXJlICYmICFvcHRpb25zLnR5cGVJbXBvcnQpIHtcbiAgICAgIC8vIHZhciB7Zm9vfSA9IHJlcXVpcmUoJ2ZvbycpO1xuICAgICAgY29uc3QgcHJvcGVydHkgPSBqc2NzLnByb3BlcnR5KCdpbml0JywgaWROb2RlLCBpZE5vZGUpO1xuICAgICAgcHJvcGVydHkuc2hvcnRoYW5kID0gdHJ1ZTtcbiAgICAgIHJldHVybiBqc2NzLnZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgICdjb25zdCcsXG4gICAgICAgIFtqc2NzLnZhcmlhYmxlRGVjbGFyYXRvcihcbiAgICAgICAgICBvbmVMaW5lT2JqZWN0UGF0dGVybihqc2NzLm9iamVjdFBhdHRlcm4oW3Byb3BlcnR5XSkpLFxuICAgICAgICAgIGpzY3MuY2FsbEV4cHJlc3Npb24oXG4gICAgICAgICAgICBqc2NzLmlkZW50aWZpZXIoJ3JlcXVpcmUnKSxcbiAgICAgICAgICAgIFtsaXRlcmFsTm9kZV0sXG4gICAgICAgICAgKSxcbiAgICAgICAgKV0sXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoIWRlc3RydWN0dXJlICYmICFvcHRpb25zLnR5cGVJbXBvcnQpIHtcbiAgICAgIC8vIHZhciBmb28gPSByZXF1aXJlKCdmb28nKTtcbiAgICAgIHJldHVybiBqc2NzLnZhcmlhYmxlRGVjbGFyYXRpb24oXG4gICAgICAgICdjb25zdCcsXG4gICAgICAgIFtqc2NzLnZhcmlhYmxlRGVjbGFyYXRvcihcbiAgICAgICAgICBpZE5vZGUsXG4gICAgICAgICAganNjcy5jYWxsRXhwcmVzc2lvbihcbiAgICAgICAgICAgIGpzY3MuaWRlbnRpZmllcigncmVxdWlyZScpLFxuICAgICAgICAgICAgW2xpdGVyYWxOb2RlXSxcbiAgICAgICAgICApLFxuICAgICAgICApXSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQ2FuJ3QgaGFuZGxlIHRoaXMgdHlwZSBvZiByZXF1aXJlIHlldC5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldEJ1aWx0SW5zKCk6IFNldDxJZGVudGlmaWVyPiB7XG4gICAgcmV0dXJuIHRoaXMuX2J1aWx0SW5zO1xuICB9XG5cbiAgZ2V0QnVpbHRJblR5cGVzKCk6IFNldDxJZGVudGlmaWVyPiB7XG4gICAgcmV0dXJuIHRoaXMuX2J1aWx0SW5UeXBlcztcbiAgfVxuXG4gIGdldEFsaWFzKGlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yZXZlcnNlZEFsaWFzZXMuaGFzKGlkKVxuICAgICAgPyAodGhpcy5fcmV2ZXJzZWRBbGlhc2VzLmdldChpZCk6IGFueSlcbiAgICAgIDogaWQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2R1bGVNYXA7XG4iXX0=