'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;
exports.provideOrganizeRequires = provideOrganizeRequires;
exports.deactivate = deactivate;

var _atom = require('atom');

var subscriptions = null; /*
                           * Copyright (c) 2015-present, Facebook, Inc.
                           * All rights reserved.
                           *
                           * This source code is licensed under the license found in the LICENSE file in
                           * the root directory of this source tree.
                           *
                           * 
                           */

/* globals atom */

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
          return formatCode(options, null, editor);
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
    formatCode(options, parameters);
  };
}

function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
    subscriptions = null;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2luZGV4LmpzIl0sIm5hbWVzIjpbImFjdGl2YXRlIiwicHJvdmlkZU9yZ2FuaXplUmVxdWlyZXMiLCJkZWFjdGl2YXRlIiwic3Vic2NyaXB0aW9ucyIsIm9wdGlvbnMiLCJzdGF0ZSIsInJlcXVpcmUiLCJmb3JtYXRDb2RlIiwiY2FsY3VsYXRlT3B0aW9ucyIsIm9ic2VydmVTZXR0aW5ncyIsImxvY2FsU3Vic2NyaXB0aW9ucyIsInNldHRpbmdzIiwiYWRkIiwibmV3U2V0dGluZ3MiLCJ1c2VBc1NlcnZpY2UiLCJhdG9tIiwia2V5bWFwcyIsImNvbW1hbmRzIiwicHJvY2VzcyIsIm5leHRUaWNrIiwid29ya3NwYWNlIiwib2JzZXJ2ZVRleHRFZGl0b3JzIiwiZWRpdG9yIiwib25EaWRTYXZlIiwicnVuT25TYXZlIiwicGFyYW1ldGVycyIsImRpc3Bvc2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBb0JnQkEsUSxHQUFBQSxRO1FBNkNBQyx1QixHQUFBQSx1QjtRQVFBQyxVLEdBQUFBLFU7O0FBMURoQjs7QUFFQSxJQUFJQyxnQkFBc0MsSUFBMUMsQyxDQWpCQTs7Ozs7Ozs7OztBQVVBOztBQVFBLElBQUlDLFVBQTBCLElBQTlCLEMsQ0FBMEM7O0FBRW5DLFNBQVNKLFFBQVQsQ0FBa0JLLEtBQWxCLEVBQXdDO0FBQzdDLE1BQUlGLGFBQUosRUFBbUI7QUFDakI7QUFDRDs7QUFFREcsVUFBUSw2QkFBUjtBQUNBLE1BQU1DLGFBQWFELFFBQVEsY0FBUixDQUFuQjs7QUFONkMsaUJBT0RBLFFBQVEsWUFBUixDQVBDO0FBQUEsTUFPdENFLGdCQVBzQyxZQU90Q0EsZ0JBUHNDO0FBQUEsTUFPcEJDLGVBUG9CLFlBT3BCQSxlQVBvQjs7QUFTN0MsTUFBTUMscUJBQXFCLCtCQUEzQjs7QUFFQTtBQUNBLE1BQUlDLFdBQXNCLElBQTFCLENBWjZDLENBWVA7QUFDdENELHFCQUFtQkUsR0FBbkIsQ0FBdUJILGdCQUFnQix1QkFBZTtBQUNwREUsZUFBV0UsV0FBWDtBQUNBVCxjQUFVSSxpQkFBaUJHLFFBQWpCLENBQVY7QUFDRCxHQUhzQixDQUF2Qjs7QUFLQSxNQUFJLENBQUNBLFNBQVNHLFlBQWQsRUFBNEI7QUFDMUJDLFNBQUtDLE9BQUwsQ0FBYUosR0FBYixDQUFpQixtQkFBakIsRUFBc0M7QUFDcEMsMEJBQW9CO0FBQ2xCLHVCQUFlO0FBREc7QUFEZ0IsS0FBdEM7QUFLQUYsdUJBQW1CRSxHQUFuQixDQUF1QkcsS0FBS0UsUUFBTCxDQUFjTCxHQUFkLENBQ3JCLGtCQURxQixFQUVyQixxQ0FGcUI7QUFHckI7QUFDQTtBQUFBLGFBQU1NLFFBQVFDLFFBQVIsQ0FBaUI7QUFBQSxlQUFNWixXQUFXSCxPQUFYLENBQU47QUFBQSxPQUFqQixDQUFOO0FBQUEsS0FKcUIsQ0FBdkI7QUFNRDs7QUFFRDtBQUNBTSxxQkFBbUJFLEdBQW5CLENBQXVCRyxLQUFLSyxTQUFMLENBQWVDLGtCQUFmLENBQWtDLGtCQUFVO0FBQ2pFWCx1QkFBbUJFLEdBQW5CLENBQXVCVSxPQUFPQyxTQUFQLENBQWlCLFlBQU07QUFDNUMsVUFBSVosU0FBU2EsU0FBYixFQUF3QjtBQUN0Qk4sZ0JBQVFDLFFBQVIsQ0FBaUI7QUFBQSxpQkFBTVosV0FBV0gsT0FBWCxFQUFvQixJQUFwQixFQUEwQmtCLE1BQTFCLENBQU47QUFBQSxTQUFqQjtBQUNEO0FBQ0YsS0FKc0IsQ0FBdkI7QUFLRCxHQU5zQixDQUF2Qjs7QUFRQTtBQUNBbkIsa0JBQWdCTyxrQkFBaEI7QUFDRDs7QUFFTSxTQUFTVCx1QkFBVCxHQUNvRTtBQUN6RSxNQUFNTSxhQUFhRCxRQUFRLGNBQVIsQ0FBbkI7QUFDQSxTQUFPLHNCQUFjO0FBQ25CQyxlQUFXSCxPQUFYLEVBQW9CcUIsVUFBcEI7QUFDRCxHQUZEO0FBR0Q7O0FBRU0sU0FBU3ZCLFVBQVQsR0FBNEI7QUFDakMsTUFBSUMsYUFBSixFQUFtQjtBQUNqQkEsa0JBQWN1QixPQUFkO0FBQ0F2QixvQkFBZ0IsSUFBaEI7QUFDRDtBQUNGIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuLyogZ2xvYmFscyBhdG9tICovXG5cbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9jb21tb24vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcbmltcG9ydCB0eXBlIHtTZXR0aW5nc30gZnJvbSAnLi9zZXR0aW5ncyc7XG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5cbmxldCBzdWJzY3JpcHRpb25zOiA/Q29tcG9zaXRlRGlzcG9zYWJsZSA9IG51bGw7XG5sZXQgb3B0aW9uczogU291cmNlT3B0aW9ucyA9IChudWxsOiBhbnkpOyAvLyBhbHdheXMgaW5pdGlhbGl6ZWRcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKHN0YXRlOiA/T2JqZWN0KTogdm9pZCB7XG4gIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmVxdWlyZSgncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJyk7XG4gIGNvbnN0IGZvcm1hdENvZGUgPSByZXF1aXJlKCcuL2Zvcm1hdENvZGUnKTtcbiAgY29uc3Qge2NhbGN1bGF0ZU9wdGlvbnMsIG9ic2VydmVTZXR0aW5nc30gPSByZXF1aXJlKCcuL3NldHRpbmdzJyk7XG5cbiAgY29uc3QgbG9jYWxTdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAvLyBLZWVwIHNldHRpbmdzIHVwIHRvIGRhdGUgd2l0aCBOdWNsaWRlIGNvbmZpZyBhbmQgcHJlY2FsY3VsYXRlIG9wdGlvbnMuXG4gIGxldCBzZXR0aW5nczogU2V0dGluZ3MgPSAobnVsbDogYW55KTsgLy8gYWx3YXlzIGluaXRpYWxpemVkXG4gIGxvY2FsU3Vic2NyaXB0aW9ucy5hZGQob2JzZXJ2ZVNldHRpbmdzKG5ld1NldHRpbmdzID0+IHtcbiAgICBzZXR0aW5ncyA9IG5ld1NldHRpbmdzO1xuICAgIG9wdGlvbnMgPSBjYWxjdWxhdGVPcHRpb25zKHNldHRpbmdzKTtcbiAgfSkpO1xuXG4gIGlmICghc2V0dGluZ3MudXNlQXNTZXJ2aWNlKSB7XG4gICAgYXRvbS5rZXltYXBzLmFkZCgnbnVjbGlkZS1mb3JtYXQtanMnLCB7XG4gICAgICAnYXRvbS10ZXh0LWVkaXRvcic6IHtcbiAgICAgICAgJ2NtZC1zaGlmdC1pJzogJ251Y2xpZGUtZm9ybWF0LWpzOm9yZ2FuaXplLXJlcXVpcmVzJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgbG9jYWxTdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yJyxcbiAgICAgICdudWNsaWRlLWZvcm1hdC1qczpvcmdhbml6ZS1yZXF1aXJlcycsXG4gICAgICAvLyBBdG9tIHByZXZlbnRzIGluLWNvbW1hbmQgbW9kaWZpY2F0aW9uIHRvIHRleHQgZWRpdG9yIGNvbnRlbnQuXG4gICAgICAoKSA9PiBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGZvcm1hdENvZGUob3B0aW9ucykpLFxuICAgICkpO1xuICB9XG5cbiAgLy8gRm9ybWF0IGNvZGUgb24gc2F2ZSBpZiBzZXR0aW5ncyBzYXkgc29cbiAgbG9jYWxTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICBsb2NhbFN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZFNhdmUoKCkgPT4ge1xuICAgICAgaWYgKHNldHRpbmdzLnJ1bk9uU2F2ZSkge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGZvcm1hdENvZGUob3B0aW9ucywgbnVsbCwgZWRpdG9yKSk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9KSk7XG5cbiAgLy8gV29yayBhcm91bmQgZmxvdyByZWZpbmVtZW50cy5cbiAgc3Vic2NyaXB0aW9ucyA9IGxvY2FsU3Vic2NyaXB0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVPcmdhbml6ZVJlcXVpcmVzKFxuKTogKHBhcmFtZXRlcnM6IHthZGRlZFJlcXVpcmVzOiBib29sZWFuLCBtaXNzaW5nRXhwb3J0czogYm9vbGVhbn0pID0+IHZvaWQge1xuICBjb25zdCBmb3JtYXRDb2RlID0gcmVxdWlyZSgnLi9mb3JtYXRDb2RlJyk7XG4gIHJldHVybiBwYXJhbWV0ZXJzID0+IHtcbiAgICBmb3JtYXRDb2RlKG9wdGlvbnMsIHBhcmFtZXRlcnMpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICBzdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgfVxufVxuIl19