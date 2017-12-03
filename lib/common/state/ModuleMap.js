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

    this._defaults = new Map();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options.paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var filePath = _step.value;

        var ids = _ModuleMapUtils2.default.getIdentifiersFromPath(filePath);
        var literal = _ModuleMapUtils2.default.getLiteralFromPath(filePath);
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

        var ids = _ModuleMapUtils2.default.getIdentifiersFromPath(_filePath);
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

      var literal = void 0;
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

            literal = _ModuleMapUtils2.default.relativizeForRequire(nonNullSourcePath, filePath);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc3RhdGUvTW9kdWxlTWFwLmpzIl0sIm5hbWVzIjpbInN0YXRlbWVudCIsInRlbXBsYXRlIiwiTW9kdWxlTWFwIiwib3B0aW9ucyIsInZhbGlkYXRlTW9kdWxlTWFwT3B0aW9ucyIsIl9idWlsdElucyIsImJ1aWx0SW5zIiwiX2J1aWx0SW5UeXBlcyIsImJ1aWx0SW5UeXBlcyIsIl9hbGlhc2VzIiwiYWxpYXNlcyIsIl9hbGlhc2VzVG9SZWxhdGl2aXplIiwiYWxpYXNlc1RvUmVsYXRpdml6ZSIsIl9yZXZlcnNlZEFsaWFzZXMiLCJNYXAiLCJtYXAiLCJpIiwiYSIsIl9kZWZhdWx0cyIsInBhdGhzIiwiZmlsZVBhdGgiLCJpZHMiLCJnZXRJZGVudGlmaWVyc0Zyb21QYXRoIiwibGl0ZXJhbCIsImdldExpdGVyYWxGcm9tUGF0aCIsImlkIiwic2V0IiwiZ2V0IiwiU2V0IiwiYWRkIiwiX2RlZmF1bHRzVG9SZWxhdGl2aXplIiwicGF0aHNUb1JlbGF0aXZpemUiLCJ2YWxpZGF0ZVJlcXVpcmVPcHRpb25zIiwidHlwZUltcG9ydCIsImhhcyIsInNvdXJjZVBhdGgiLCJyZWxhdGl2aXplRm9yUmVxdWlyZSIsInNpemUiLCJ0bXAiLCJub25OdWxsU291cmNlUGF0aCIsImpzeFN1ZmZpeCIsImlkTm9kZSIsImlkZW50aWZpZXIiLCJsaXRlcmFsTm9kZSIsImRlc3RydWN0dXJlIiwic3BlY2lmaWVycyIsImltcG9ydGVkIiwibG9jYWwiLCJzb3VyY2UiLCJwcm9wZXJ0eSIsInNob3J0aGFuZCIsInZhcmlhYmxlRGVjbGFyYXRpb24iLCJ2YXJpYWJsZURlY2xhcmF0b3IiLCJvYmplY3RQYXR0ZXJuIiwiY2FsbEV4cHJlc3Npb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O3FqQkFBQTs7Ozs7Ozs7Ozs7OztBQWNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFT0EsUyxHQUFhLHNCQUFL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QUFaO0FBQ0Q7OztzQ0FFa0M7QUFDakMsYUFBTyxLQUFLRSxhQUFaO0FBQ0Q7Ozs2QkFFUWtCLEUsRUFBb0I7QUFDM0IsYUFBTyxLQUFLWixnQkFBTCxDQUFzQnFCLEdBQXRCLENBQTBCVCxFQUExQixJQUNGLEtBQUtaLGdCQUFMLENBQXNCYyxHQUF0QixDQUEwQkYsRUFBMUIsQ0FERSxHQUVIQSxFQUZKO0FBR0Q7Ozs7OztBQUdIOEIsT0FBT0MsT0FBUCxHQUFpQnRELFNBQWpCIiwiZmlsZSI6Ik1vZHVsZU1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtBYnNvbHV0ZVBhdGgsIElkZW50aWZpZXIsIExpdGVyYWx9IGZyb20gJy4uL3R5cGVzL2NvbW1vbic7XG5pbXBvcnQgdHlwZSB7TW9kdWxlTWFwT3B0aW9uc30gZnJvbSAnLi4vb3B0aW9ucy9Nb2R1bGVNYXBPcHRpb25zJztcbmltcG9ydCB0eXBlIHtSZXF1aXJlT3B0aW9uc30gZnJvbSAnLi4vb3B0aW9ucy9SZXF1aXJlT3B0aW9ucyc7XG5cbmltcG9ydCBNb2R1bGVNYXBVdGlscyBmcm9tICcuLi91dGlscy9Nb2R1bGVNYXBVdGlscyc7XG5pbXBvcnQgT3B0aW9ucyBmcm9tICcuLi9vcHRpb25zL09wdGlvbnMnO1xuaW1wb3J0IGpzY3MgZnJvbSAnanNjb2Rlc2hpZnQnO1xuaW1wb3J0IG9uZUxpbmVPYmplY3RQYXR0ZXJuIGZyb20gJy4uL3V0aWxzL29uZUxpbmVPYmplY3RQYXR0ZXJuJztcblxuY29uc3Qge3N0YXRlbWVudH0gPSBqc2NzLnRlbXBsYXRlO1xuXG5jbGFzcyBNb2R1bGVNYXAge1xuICAvLyBOb3RlOiBUaGVzZSBmaWVsZHMgYXJlIG9yZGVyZWQgYnkgcHJlY2VuZGVuY2UuXG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXJzIHRoYXQgc2hvdWxkIGJlIGlnbm9yZWQgd2hlbiBub3QgYSB0eXBlLlxuICAgKi9cbiAgX2J1aWx0SW5zOiBTZXQ8SWRlbnRpZmllcj47XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IHNob3VsZCBiZSBpZ25vcmVkIHdoZW4gdGhleSBhcmUgYSB0eXBlLlxuICAgKi9cbiAgX2J1aWx0SW5UeXBlczogU2V0PElkZW50aWZpZXI+O1xuICAvKipcbiAgICogSWRlbnRpZmllcnMgdGhhdCBoYXZlIGFuIGV4YWN0IGFsaWFzIHRvIHVzZS5cbiAgICovXG4gIF9hbGlhc2VzOiBNYXA8SWRlbnRpZmllciwgTGl0ZXJhbD47XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IGhhdmUgYW4gZXhhY3QgcGF0aCB0byB1c2UuXG4gICAqL1xuICBfYWxpYXNlc1RvUmVsYXRpdml6ZTogTWFwPElkZW50aWZpZXIsIEFic29sdXRlUGF0aD47XG4gIC8qKlxuICAgKiBBbGlhc2VzIGJhY2sgdG8gdGhlaXIgaWRlbnRpZmllcnMuXG4gICAqL1xuICBfcmV2ZXJzZWRBbGlhc2VzOiBNYXA8TGl0ZXJhbCwgSWRlbnRpZmllcj47XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyB0aGF0IG1pZ2h0IGNvcnJlc3BvbmQgdG8gdGhlIGRlZmF1bHQgZXhwb3J0IG9mIGEgcGFydGljdWxhclxuICAgKiBsaXRlcmFsLlxuICAgKi9cbiAgX2RlZmF1bHRzOiBNYXA8SWRlbnRpZmllciwgU2V0PExpdGVyYWw+PjtcbiAgLyoqXG4gICAqIElkZW50aWZpZXJzIHRoYXQgbWlnaHQgY29ycmVzcG9uZCB0byB0aGUgZGVmYXVsdCBleHBvcnQgb2YgYSBwYXJ0aWN1bGFyXG4gICAqIGFic29sdXRlIHBhdGguXG4gICAqL1xuICBfZGVmYXVsdHNUb1JlbGF0aXZpemU6IE1hcDxJZGVudGlmaWVyLCBTZXQ8QWJzb2x1dGVQYXRoPj47XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogTW9kdWxlTWFwT3B0aW9ucykge1xuICAgIE9wdGlvbnMudmFsaWRhdGVNb2R1bGVNYXBPcHRpb25zKG9wdGlvbnMpO1xuXG4gICAgLy8gTm90ZTogSWYgc29tZW9uZSBtYWludGFpbnMgYSByZWZlcmVuY2UgdG8gdGhlIHN0cnVjdHVyZSB3aXRoaW4gb3B0aW9uc1xuICAgIC8vIHRoZXkgY291bGQgbXV0YXRlIHRoZSBNb2R1bGVNYXAncyBiZWhhdmlvci4gV2UgY291bGQgbWFrZSBzaGFsbG93IGNvcGllc1xuICAgIC8vIGhlcmUgYnV0IGFyZSBvcHRpbmcgbm90IHRvIGZvciBwZXJmb3JtYW5jZS5cbiAgICB0aGlzLl9idWlsdElucyA9IG9wdGlvbnMuYnVpbHRJbnM7XG4gICAgdGhpcy5fYnVpbHRJblR5cGVzID0gb3B0aW9ucy5idWlsdEluVHlwZXM7XG4gICAgdGhpcy5fYWxpYXNlcyA9IG9wdGlvbnMuYWxpYXNlcztcbiAgICB0aGlzLl9hbGlhc2VzVG9SZWxhdGl2aXplID0gb3B0aW9ucy5hbGlhc2VzVG9SZWxhdGl2aXplO1xuICAgIHRoaXMuX3JldmVyc2VkQWxpYXNlcyA9XG4gICAgICBuZXcgTWFwKFsuLi5vcHRpb25zLmFsaWFzZXNdLm1hcCgoW2ksIGFdKSA9PiBbYSwgaV0pKTtcblxuICAgIHRoaXMuX2RlZmF1bHRzID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2Ygb3B0aW9ucy5wYXRocykge1xuICAgICAgY29uc3QgaWRzID0gTW9kdWxlTWFwVXRpbHMuZ2V0SWRlbnRpZmllcnNGcm9tUGF0aChmaWxlUGF0aCk7XG4gICAgICBjb25zdCBsaXRlcmFsID0gTW9kdWxlTWFwVXRpbHMuZ2V0TGl0ZXJhbEZyb21QYXRoKGZpbGVQYXRoKTtcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgICAgIGxldCBzZXQgPSB0aGlzLl9kZWZhdWx0cy5nZXQoaWQpO1xuICAgICAgICBpZiAoIXNldCkge1xuICAgICAgICAgIHNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB0aGlzLl9kZWZhdWx0cy5zZXQoaWQsIHNldCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0LmFkZChsaXRlcmFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZSA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIG9mIG9wdGlvbnMucGF0aHNUb1JlbGF0aXZpemUpIHtcbiAgICAgIGNvbnN0IGlkcyA9IE1vZHVsZU1hcFV0aWxzLmdldElkZW50aWZpZXJzRnJvbVBhdGgoZmlsZVBhdGgpO1xuICAgICAgZm9yIChjb25zdCBpZCBvZiBpZHMpIHtcbiAgICAgICAgbGV0IHNldCA9IHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplLmdldChpZCk7XG4gICAgICAgIGlmICghc2V0KSB7XG4gICAgICAgICAgc2V0ID0gbmV3IFNldCgpO1xuICAgICAgICAgIHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplLnNldChpZCwgc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBzZXQuYWRkKGZpbGVQYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNpbmdsZSByZXF1aXJlLCB0aGlzIGlzbid0IGdyZWF0IGZvciB3aGVuIHlvdSB3YW50IHRvIGRlc3RydWN0dXJlXG4gICAqIG11bHRpcGxlIHRoaW5ncyBpbiBhIHNpbmdsZSBzdGF0ZW1lbnQuXG4gICAqL1xuICBnZXRSZXF1aXJlKGlkOiBJZGVudGlmaWVyLCBvcHRpb25zOiBSZXF1aXJlT3B0aW9ucyk6ID9Ob2RlIHtcbiAgICBPcHRpb25zLnZhbGlkYXRlUmVxdWlyZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICAvLyBEb24ndCBpbXBvcnQgYnVpbHQgaW5zLlxuICAgIGlmICghb3B0aW9ucy50eXBlSW1wb3J0KSB7XG4gICAgICBpZiAodGhpcy5fYnVpbHRJbnMuaGFzKGlkKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX2J1aWx0SW5UeXBlcy5oYXMoaWQpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBsaXRlcmFsO1xuICAgIGlmICh0aGlzLl9hbGlhc2VzLmhhcyhpZCkpIHtcbiAgICAgIGxpdGVyYWwgPSB0aGlzLl9hbGlhc2VzLmdldChpZCk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnNvdXJjZVBhdGggJiYgdGhpcy5fYWxpYXNlc1RvUmVsYXRpdml6ZS5oYXMoaWQpKSB7XG4gICAgICBsaXRlcmFsID0gTW9kdWxlTWFwVXRpbHMucmVsYXRpdml6ZUZvclJlcXVpcmUoXG4gICAgICAgIG9wdGlvbnMuc291cmNlUGF0aCxcbiAgICAgICAgLy8gJEZsb3dGaXhNZShrYWQpXG4gICAgICAgIHRoaXMuX2FsaWFzZXNUb1JlbGF0aXZpemUuZ2V0KGlkKSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuX2RlZmF1bHRzLmhhcyhpZCkgJiZcbiAgICAgIC8vICRGbG93Rml4TWUoa2FkKVxuICAgICAgdGhpcy5fZGVmYXVsdHMuZ2V0KGlkKS5zaXplID09PSAxXG4gICAgKSB7XG4gICAgICAvLyBUT0RPOiBXaGF0J3MgdGhlIGJlc3Qgd2F5IHRvIGdldCB0aGUgc2luZ2xlIHRoaW5nIG91dCBvZiBhIG9uZSBlbGVtZW50XG4gICAgICAvLyBTZXQ/XG4gICAgICAvLyAkRmxvd0ZpeE1lKGthZClcbiAgICAgIGZvciAoY29uc3QgdG1wIG9mIHRoaXMuX2RlZmF1bHRzLmdldChpZCkpIHtcbiAgICAgICAgbGl0ZXJhbCA9IHRtcDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG9wdGlvbnMuc291cmNlUGF0aCAmJlxuICAgICAgdGhpcy5fZGVmYXVsdHNUb1JlbGF0aXZpemUuaGFzKGlkKSAmJlxuICAgICAgLy8gJEZsb3dGaXhNZShrYWQpXG4gICAgICB0aGlzLl9kZWZhdWx0c1RvUmVsYXRpdml6ZS5nZXQoaWQpLnNpemUgPT09IDFcbiAgICApIHtcbiAgICAgIGNvbnN0IG5vbk51bGxTb3VyY2VQYXRoID0gb3B0aW9ucy5zb3VyY2VQYXRoO1xuICAgICAgLy8gVE9ETzogV2hhdCdzIHRoZSBiZXN0IHdheSB0byBnZXQgdGhlIHNpbmdsZSB0aGluZyBvdXQgb2YgYSBvbmUgZWxlbWVudFxuICAgICAgLy8gU2V0P1xuICAgICAgLy8gJEZsb3dGaXhNZShrYWQpXG4gICAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIG9mIHRoaXMuX2RlZmF1bHRzVG9SZWxhdGl2aXplLmdldChpZCkpIHtcbiAgICAgICAgbGl0ZXJhbCA9IE1vZHVsZU1hcFV0aWxzLnJlbGF0aXZpemVGb3JSZXF1aXJlKFxuICAgICAgICAgIG5vbk51bGxTb3VyY2VQYXRoLFxuICAgICAgICAgIGZpbGVQYXRoLFxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuanN4U3VmZml4KSB7XG4gICAgICBsaXRlcmFsID0gaWQgKyAnLnJlYWN0JztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNvbmZpZ3VyYWJsZSBzbyB0aGF0IGl0J3MgcG9zc2libGUgdG8gb25seSBhZGQga25vd25cbiAgICAgIC8vIHJlcXVpcmVzIGFuZCBpZ25vcmUgdW5rbm93biBtb2R1bGVzLlxuICAgICAgbGl0ZXJhbCA9IGlkO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBjb21tb24gbm9kZXMgZm9yIHByaW50aW5nLlxuICAgIGNvbnN0IGlkTm9kZSA9IGpzY3MuaWRlbnRpZmllcihpZCk7XG4gICAgY29uc3QgbGl0ZXJhbE5vZGUgPSBqc2NzLmxpdGVyYWwobGl0ZXJhbCk7XG5cbiAgICAvLyBUT0RPOiBTdXBwb3J0IGV4cG9ydHMgYW5kIGRlc3RydWN0dXJpbmcuXG4gICAgY29uc3QgZGVzdHJ1Y3R1cmUgPSBmYWxzZTtcblxuICAgIGlmIChkZXN0cnVjdHVyZSAmJiBvcHRpb25zLnR5cGVJbXBvcnQpIHtcbiAgICAgIC8vIGltcG9ydCB0eXBlIHtmb299IGZyb20gJ2Zvbyc7XG4gICAgICBjb25zdCB0bXAgPSBzdGF0ZW1lbnRgaW1wb3J0IHR5cGUge199IGZyb20gJ18nO1xcbmA7XG4gICAgICB0bXAuc3BlY2lmaWVyc1swXS5pbXBvcnRlZCA9IGlkTm9kZTtcbiAgICAgIHRtcC5zcGVjaWZpZXJzWzBdLmxvY2FsID0gaWROb2RlO1xuICAgICAgdG1wLnNvdXJjZSA9IGxpdGVyYWxOb2RlO1xuICAgICAgcmV0dXJuIHRtcDtcbiAgICB9IGVsc2UgaWYgKCFkZXN0cnVjdHVyZSAmJiBvcHRpb25zLnR5cGVJbXBvcnQpIHtcbiAgICAgIC8vIGltcG9ydCB0eXBlIGZvbyBmcm9tICdmb28nO1xuICAgICAgY29uc3QgdG1wID0gc3RhdGVtZW50YGltcG9ydCB0eXBlIF8gZnJvbSAnXyc7XFxuYDtcbiAgICAgIHRtcC5zcGVjaWZpZXJzWzBdLmlkID0gaWROb2RlO1xuICAgICAgdG1wLnNwZWNpZmllcnNbMF0ubG9jYWwgPSBpZE5vZGU7XG4gICAgICB0bXAuc291cmNlID0gbGl0ZXJhbE5vZGU7XG4gICAgICByZXR1cm4gdG1wO1xuICAgIH0gZWxzZSBpZiAoZGVzdHJ1Y3R1cmUgJiYgIW9wdGlvbnMudHlwZUltcG9ydCkge1xuICAgICAgLy8gdmFyIHtmb299ID0gcmVxdWlyZSgnZm9vJyk7XG4gICAgICBjb25zdCBwcm9wZXJ0eSA9IGpzY3MucHJvcGVydHkoJ2luaXQnLCBpZE5vZGUsIGlkTm9kZSk7XG4gICAgICBwcm9wZXJ0eS5zaG9ydGhhbmQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGpzY3MudmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAgJ2NvbnN0JyxcbiAgICAgICAgW2pzY3MudmFyaWFibGVEZWNsYXJhdG9yKFxuICAgICAgICAgIG9uZUxpbmVPYmplY3RQYXR0ZXJuKGpzY3Mub2JqZWN0UGF0dGVybihbcHJvcGVydHldKSksXG4gICAgICAgICAganNjcy5jYWxsRXhwcmVzc2lvbihcbiAgICAgICAgICAgIGpzY3MuaWRlbnRpZmllcigncmVxdWlyZScpLFxuICAgICAgICAgICAgW2xpdGVyYWxOb2RlXSxcbiAgICAgICAgICApLFxuICAgICAgICApXSxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICghZGVzdHJ1Y3R1cmUgJiYgIW9wdGlvbnMudHlwZUltcG9ydCkge1xuICAgICAgLy8gdmFyIGZvbyA9IHJlcXVpcmUoJ2ZvbycpO1xuICAgICAgcmV0dXJuIGpzY3MudmFyaWFibGVEZWNsYXJhdGlvbihcbiAgICAgICAgJ2NvbnN0JyxcbiAgICAgICAgW2pzY3MudmFyaWFibGVEZWNsYXJhdG9yKFxuICAgICAgICAgIGlkTm9kZSxcbiAgICAgICAgICBqc2NzLmNhbGxFeHByZXNzaW9uKFxuICAgICAgICAgICAganNjcy5pZGVudGlmaWVyKCdyZXF1aXJlJyksXG4gICAgICAgICAgICBbbGl0ZXJhbE5vZGVdLFxuICAgICAgICAgICksXG4gICAgICAgICldLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBDYW4ndCBoYW5kbGUgdGhpcyB0eXBlIG9mIHJlcXVpcmUgeWV0LlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0QnVpbHRJbnMoKTogU2V0PElkZW50aWZpZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fYnVpbHRJbnM7XG4gIH1cblxuICBnZXRCdWlsdEluVHlwZXMoKTogU2V0PElkZW50aWZpZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fYnVpbHRJblR5cGVzO1xuICB9XG5cbiAgZ2V0QWxpYXMoaWQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3JldmVyc2VkQWxpYXNlcy5oYXMoaWQpXG4gICAgICA/ICh0aGlzLl9yZXZlcnNlZEFsaWFzZXMuZ2V0KGlkKTogYW55KVxuICAgICAgOiBpZDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZHVsZU1hcDtcbiJdfQ==