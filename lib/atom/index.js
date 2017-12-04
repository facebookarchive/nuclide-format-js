'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                   * Copyright (c) 2015-present, Facebook, Inc.
                                                                                                                                                                                                                                                                   * All rights reserved.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * This source code is licensed under the license found in the LICENSE file in
                                                                                                                                                                                                                                                                   * the root directory of this source tree.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * 
                                                                                                                                                                                                                                                                   */

/* globals atom */

exports.activate = activate;
exports.provideOrganizeRequires = provideOrganizeRequires;
exports.deactivate = deactivate;

var _atom = require('atom');

var subscriptions = null;
var options = null; // always initialized

function activate(state) {
  if (subscriptions) {
    return;
  }

  require('regenerator-runtime/runtime');
  var formatCode = require('./formatCode');

  var _require = require('./settings'),
      calculateOptions = _require.calculateOptions,
      observeSettings = _require.observeSettings;

  var localSubscriptions = new _atom.CompositeDisposable();

  // Keep settings up to date with Nuclide config and precalculate options.
  var settings = null; // always initialized
  localSubscriptions.add(observeSettings(function (newSettings) {
    settings = newSettings;
    options = calculateOptions(settings);
  }));

  if (!settings.useAsService) {
    atom.keymaps.add('nuclide-format-js', {
      'atom-text-editor': {
        'cmd-shift-i': 'nuclide-format-js:organize-requires'
      }
    });
    localSubscriptions.add(atom.commands.add('atom-text-editor', 'nuclide-format-js:organize-requires',
    // Atom prevents in-command modification to text editor content.
    function () {
      return process.nextTick(function () {
        return formatCode(options);
      });
    }));
  }

  // Format code on save if settings say so
  localSubscriptions.add(atom.workspace.observeTextEditors(function (editor) {
    localSubscriptions.add(editor.onDidSave(function () {
      if (settings.runOnSave) {
        process.nextTick(function () {
          return formatCode(options, { editor: editor });
        });
      }
    }));
  }));

  // Work around flow refinements.
  subscriptions = localSubscriptions;
}

function provideOrganizeRequires() {
  var formatCode = require('./formatCode');
  return function (parameters) {
    formatCode(options, _extends({}, parameters));
  };
}

function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
    subscriptions = null;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2luZGV4LmpzIl0sIm5hbWVzIjpbImFjdGl2YXRlIiwicHJvdmlkZU9yZ2FuaXplUmVxdWlyZXMiLCJkZWFjdGl2YXRlIiwic3Vic2NyaXB0aW9ucyIsIm9wdGlvbnMiLCJzdGF0ZSIsInJlcXVpcmUiLCJmb3JtYXRDb2RlIiwiY2FsY3VsYXRlT3B0aW9ucyIsIm9ic2VydmVTZXR0aW5ncyIsImxvY2FsU3Vic2NyaXB0aW9ucyIsInNldHRpbmdzIiwiYWRkIiwibmV3U2V0dGluZ3MiLCJ1c2VBc1NlcnZpY2UiLCJhdG9tIiwia2V5bWFwcyIsImNvbW1hbmRzIiwicHJvY2VzcyIsIm5leHRUaWNrIiwid29ya3NwYWNlIiwib2JzZXJ2ZVRleHRFZGl0b3JzIiwiZWRpdG9yIiwib25EaWRTYXZlIiwicnVuT25TYXZlIiwicGFyYW1ldGVycyIsImRpc3Bvc2UiXSwibWFwcGluZ3MiOiI7Ozs7OztrUUFBQTs7Ozs7Ozs7OztBQVVBOztRQVVnQkEsUSxHQUFBQSxRO1FBNkNBQyx1QixHQUFBQSx1QjtRQVFBQyxVLEdBQUFBLFU7O0FBMURoQjs7QUFFQSxJQUFJQyxnQkFBc0MsSUFBMUM7QUFDQSxJQUFJQyxVQUEwQixJQUE5QixDLENBQTBDOztBQUVuQyxTQUFTSixRQUFULENBQWtCSyxLQUFsQixFQUF3QztBQUM3QyxNQUFJRixhQUFKLEVBQW1CO0FBQ2pCO0FBQ0Q7O0FBRURHLFVBQVEsNkJBQVI7QUFDQSxNQUFNQyxhQUFhRCxRQUFRLGNBQVIsQ0FBbkI7O0FBTjZDLGlCQU9EQSxRQUFRLFlBQVIsQ0FQQztBQUFBLE1BT3RDRSxnQkFQc0MsWUFPdENBLGdCQVBzQztBQUFBLE1BT3BCQyxlQVBvQixZQU9wQkEsZUFQb0I7O0FBUzdDLE1BQU1DLHFCQUFxQiwrQkFBM0I7O0FBRUE7QUFDQSxNQUFJQyxXQUFzQixJQUExQixDQVo2QyxDQVlQO0FBQ3RDRCxxQkFBbUJFLEdBQW5CLENBQXVCSCxnQkFBZ0IsdUJBQWU7QUFDcERFLGVBQVdFLFdBQVg7QUFDQVQsY0FBVUksaUJBQWlCRyxRQUFqQixDQUFWO0FBQ0QsR0FIc0IsQ0FBdkI7O0FBS0EsTUFBSSxDQUFDQSxTQUFTRyxZQUFkLEVBQTRCO0FBQzFCQyxTQUFLQyxPQUFMLENBQWFKLEdBQWIsQ0FBaUIsbUJBQWpCLEVBQXNDO0FBQ3BDLDBCQUFvQjtBQUNsQix1QkFBZTtBQURHO0FBRGdCLEtBQXRDO0FBS0FGLHVCQUFtQkUsR0FBbkIsQ0FBdUJHLEtBQUtFLFFBQUwsQ0FBY0wsR0FBZCxDQUNyQixrQkFEcUIsRUFFckIscUNBRnFCO0FBR3JCO0FBQ0E7QUFBQSxhQUFNTSxRQUFRQyxRQUFSLENBQWlCO0FBQUEsZUFBTVosV0FBV0gsT0FBWCxDQUFOO0FBQUEsT0FBakIsQ0FBTjtBQUFBLEtBSnFCLENBQXZCO0FBTUQ7O0FBRUQ7QUFDQU0scUJBQW1CRSxHQUFuQixDQUF1QkcsS0FBS0ssU0FBTCxDQUFlQyxrQkFBZixDQUFrQyxrQkFBVTtBQUNqRVgsdUJBQW1CRSxHQUFuQixDQUF1QlUsT0FBT0MsU0FBUCxDQUFpQixZQUFNO0FBQzVDLFVBQUlaLFNBQVNhLFNBQWIsRUFBd0I7QUFDdEJOLGdCQUFRQyxRQUFSLENBQWlCO0FBQUEsaUJBQU1aLFdBQVdILE9BQVgsRUFBb0IsRUFBQ2tCLGNBQUQsRUFBcEIsQ0FBTjtBQUFBLFNBQWpCO0FBQ0Q7QUFDRixLQUpzQixDQUF2QjtBQUtELEdBTnNCLENBQXZCOztBQVFBO0FBQ0FuQixrQkFBZ0JPLGtCQUFoQjtBQUNEOztBQUVNLFNBQVNULHVCQUFULEdBQ29FO0FBQ3pFLE1BQU1NLGFBQWFELFFBQVEsY0FBUixDQUFuQjtBQUNBLFNBQU8sc0JBQWM7QUFDbkJDLGVBQVdILE9BQVgsZUFBd0JxQixVQUF4QjtBQUNELEdBRkQ7QUFHRDs7QUFFTSxTQUFTdkIsVUFBVCxHQUE0QjtBQUNqQyxNQUFJQyxhQUFKLEVBQW1CO0FBQ2pCQSxrQkFBY3VCLE9BQWQ7QUFDQXZCLG9CQUFnQixJQUFoQjtBQUNEO0FBQ0YiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG4vKiBnbG9iYWxzIGF0b20gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL2NvbW1vbi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuaW1wb3J0IHR5cGUge1NldHRpbmdzfSBmcm9tICcuL3NldHRpbmdzJztcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcblxubGV0IHN1YnNjcmlwdGlvbnM6ID9Db21wb3NpdGVEaXNwb3NhYmxlID0gbnVsbDtcbmxldCBvcHRpb25zOiBTb3VyY2VPcHRpb25zID0gKG51bGw6IGFueSk7IC8vIGFsd2F5cyBpbml0aWFsaXplZFxuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoc3RhdGU6ID9PYmplY3QpOiB2b2lkIHtcbiAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXF1aXJlKCdyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnKTtcbiAgY29uc3QgZm9ybWF0Q29kZSA9IHJlcXVpcmUoJy4vZm9ybWF0Q29kZScpO1xuICBjb25zdCB7Y2FsY3VsYXRlT3B0aW9ucywgb2JzZXJ2ZVNldHRpbmdzfSA9IHJlcXVpcmUoJy4vc2V0dGluZ3MnKTtcblxuICBjb25zdCBsb2NhbFN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gIC8vIEtlZXAgc2V0dGluZ3MgdXAgdG8gZGF0ZSB3aXRoIE51Y2xpZGUgY29uZmlnIGFuZCBwcmVjYWxjdWxhdGUgb3B0aW9ucy5cbiAgbGV0IHNldHRpbmdzOiBTZXR0aW5ncyA9IChudWxsOiBhbnkpOyAvLyBhbHdheXMgaW5pdGlhbGl6ZWRcbiAgbG9jYWxTdWJzY3JpcHRpb25zLmFkZChvYnNlcnZlU2V0dGluZ3MobmV3U2V0dGluZ3MgPT4ge1xuICAgIHNldHRpbmdzID0gbmV3U2V0dGluZ3M7XG4gICAgb3B0aW9ucyA9IGNhbGN1bGF0ZU9wdGlvbnMoc2V0dGluZ3MpO1xuICB9KSk7XG5cbiAgaWYgKCFzZXR0aW5ncy51c2VBc1NlcnZpY2UpIHtcbiAgICBhdG9tLmtleW1hcHMuYWRkKCdudWNsaWRlLWZvcm1hdC1qcycsIHtcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yJzoge1xuICAgICAgICAnY21kLXNoaWZ0LWknOiAnbnVjbGlkZS1mb3JtYXQtanM6b3JnYW5pemUtcmVxdWlyZXMnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBsb2NhbFN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgJ2F0b20tdGV4dC1lZGl0b3InLFxuICAgICAgJ251Y2xpZGUtZm9ybWF0LWpzOm9yZ2FuaXplLXJlcXVpcmVzJyxcbiAgICAgIC8vIEF0b20gcHJldmVudHMgaW4tY29tbWFuZCBtb2RpZmljYXRpb24gdG8gdGV4dCBlZGl0b3IgY29udGVudC5cbiAgICAgICgpID0+IHByb2Nlc3MubmV4dFRpY2soKCkgPT4gZm9ybWF0Q29kZShvcHRpb25zKSksXG4gICAgKSk7XG4gIH1cblxuICAvLyBGb3JtYXQgY29kZSBvbiBzYXZlIGlmIHNldHRpbmdzIHNheSBzb1xuICBsb2NhbFN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhlZGl0b3IgPT4ge1xuICAgIGxvY2FsU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PiB7XG4gICAgICBpZiAoc2V0dGluZ3MucnVuT25TYXZlKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gZm9ybWF0Q29kZShvcHRpb25zLCB7ZWRpdG9yfSkpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfSkpO1xuXG4gIC8vIFdvcmsgYXJvdW5kIGZsb3cgcmVmaW5lbWVudHMuXG4gIHN1YnNjcmlwdGlvbnMgPSBsb2NhbFN1YnNjcmlwdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlT3JnYW5pemVSZXF1aXJlcyhcbik6IChwYXJhbWV0ZXJzOiB7YWRkZWRSZXF1aXJlczogYm9vbGVhbiwgbWlzc2luZ0V4cG9ydHM6IGJvb2xlYW59KSA9PiB2b2lkIHtcbiAgY29uc3QgZm9ybWF0Q29kZSA9IHJlcXVpcmUoJy4vZm9ybWF0Q29kZScpO1xuICByZXR1cm4gcGFyYW1ldGVycyA9PiB7XG4gICAgZm9ybWF0Q29kZShvcHRpb25zLCB7Li4ucGFyYW1ldGVyc30pO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICBzdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgfVxufVxuIl19