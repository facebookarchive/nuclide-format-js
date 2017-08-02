'use strict';

var _ModuleMap = require('./ModuleMap');

var _ModuleMap2 = _interopRequireDefault(_ModuleMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultModuleMap = new _ModuleMap2.default({
  paths: [],
  pathsToRelativize: [],
  aliases: require('../constants/commonAliases'),
  aliasesToRelativize: new Map(),
  builtIns: require('../constants/builtIns'),
  builtInTypes: require('../constants/builtInTypes')
}); /*
     * Copyright (c) 2015-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the license found in the LICENSE file in
     * the root directory of this source tree.
     *
     * 
     */

module.exports = DefaultModuleMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vc3RhdGUvRGVmYXVsdE1vZHVsZU1hcC5qcyJdLCJuYW1lcyI6WyJEZWZhdWx0TW9kdWxlTWFwIiwicGF0aHMiLCJwYXRoc1RvUmVsYXRpdml6ZSIsImFsaWFzZXMiLCJyZXF1aXJlIiwiYWxpYXNlc1RvUmVsYXRpdml6ZSIsIk1hcCIsImJ1aWx0SW5zIiwiYnVpbHRJblR5cGVzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFVQTs7Ozs7O0FBRUEsSUFBTUEsbUJBQW1CLHdCQUFjO0FBQ3JDQyxTQUFPLEVBRDhCO0FBRXJDQyxxQkFBbUIsRUFGa0I7QUFHckNDLFdBQVNDLFFBQVEsNEJBQVIsQ0FINEI7QUFJckNDLHVCQUFxQixJQUFJQyxHQUFKLEVBSmdCO0FBS3JDQyxZQUFVSCxRQUFRLHVCQUFSLENBTDJCO0FBTXJDSSxnQkFBY0osUUFBUSwyQkFBUjtBQU51QixDQUFkLENBQXpCLEMsQ0FaQTs7Ozs7Ozs7OztBQXFCQUssT0FBT0MsT0FBUCxHQUFpQlYsZ0JBQWpCIiwiZmlsZSI6IkRlZmF1bHRNb2R1bGVNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgTW9kdWxlTWFwIGZyb20gJy4vTW9kdWxlTWFwJztcblxuY29uc3QgRGVmYXVsdE1vZHVsZU1hcCA9IG5ldyBNb2R1bGVNYXAoe1xuICBwYXRoczogW10sXG4gIHBhdGhzVG9SZWxhdGl2aXplOiBbXSxcbiAgYWxpYXNlczogcmVxdWlyZSgnLi4vY29uc3RhbnRzL2NvbW1vbkFsaWFzZXMnKSxcbiAgYWxpYXNlc1RvUmVsYXRpdml6ZTogbmV3IE1hcCgpLFxuICBidWlsdEluczogcmVxdWlyZSgnLi4vY29uc3RhbnRzL2J1aWx0SW5zJyksXG4gIGJ1aWx0SW5UeXBlczogcmVxdWlyZSgnLi4vY29uc3RhbnRzL2J1aWx0SW5UeXBlcycpLFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGVmYXVsdE1vZHVsZU1hcDtcbiJdfQ==