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
      "atom-text-editor": {
        "cmd-shift-i": "nuclide-format-js:organize-requires"
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
  return function (addedRequires) {
    formatCode(options, { addedRequires: addedRequires });
  };
}

function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
    subscriptions = null;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2luZGV4LmpzIl0sIm5hbWVzIjpbImFjdGl2YXRlIiwicHJvdmlkZU9yZ2FuaXplUmVxdWlyZXMiLCJkZWFjdGl2YXRlIiwic3Vic2NyaXB0aW9ucyIsIm9wdGlvbnMiLCJzdGF0ZSIsInJlcXVpcmUiLCJmb3JtYXRDb2RlIiwiY2FsY3VsYXRlT3B0aW9ucyIsIm9ic2VydmVTZXR0aW5ncyIsImxvY2FsU3Vic2NyaXB0aW9ucyIsInNldHRpbmdzIiwiYWRkIiwibmV3U2V0dGluZ3MiLCJ1c2VBc1NlcnZpY2UiLCJhdG9tIiwia2V5bWFwcyIsImNvbW1hbmRzIiwicHJvY2VzcyIsIm5leHRUaWNrIiwid29ya3NwYWNlIiwib2JzZXJ2ZVRleHRFZGl0b3JzIiwiZWRpdG9yIiwib25EaWRTYXZlIiwicnVuT25TYXZlIiwiYWRkZWRSZXF1aXJlcyIsImRpc3Bvc2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBb0JnQkEsUSxHQUFBQSxRO1FBNkNBQyx1QixHQUFBQSx1QjtRQU9BQyxVLEdBQUFBLFU7O0FBekRoQjs7QUFFQSxJQUFJQyxnQkFBc0MsSUFBMUMsQyxDQWpCQTs7Ozs7Ozs7OztBQVVBOztBQVFBLElBQUlDLFVBQTBCLElBQTlCLEMsQ0FBMEM7O0FBRW5DLFNBQVNKLFFBQVQsQ0FBa0JLLEtBQWxCLEVBQXdDO0FBQzdDLE1BQUlGLGFBQUosRUFBbUI7QUFDakI7QUFDRDs7QUFFREcsVUFBUSw2QkFBUjtBQUNBLE1BQU1DLGFBQWFELFFBQVEsY0FBUixDQUFuQjs7QUFONkMsaUJBT0RBLFFBQVEsWUFBUixDQVBDO0FBQUEsTUFPdENFLGdCQVBzQyxZQU90Q0EsZ0JBUHNDO0FBQUEsTUFPcEJDLGVBUG9CLFlBT3BCQSxlQVBvQjs7QUFTN0MsTUFBTUMscUJBQXFCLCtCQUEzQjs7QUFFQTtBQUNBLE1BQUlDLFdBQXNCLElBQTFCLENBWjZDLENBWVA7QUFDdENELHFCQUFtQkUsR0FBbkIsQ0FBdUJILGdCQUFnQix1QkFBZTtBQUNwREUsZUFBV0UsV0FBWDtBQUNBVCxjQUFVSSxpQkFBaUJHLFFBQWpCLENBQVY7QUFDRCxHQUhzQixDQUF2Qjs7QUFLQSxNQUFJLENBQUNBLFNBQVNHLFlBQWQsRUFBNEI7QUFDMUJDLFNBQUtDLE9BQUwsQ0FBYUosR0FBYixDQUFpQixtQkFBakIsRUFBc0M7QUFDcEMsMEJBQW9CO0FBQ2xCLHVCQUFlO0FBREc7QUFEZ0IsS0FBdEM7QUFLQUYsdUJBQW1CRSxHQUFuQixDQUF1QkcsS0FBS0UsUUFBTCxDQUFjTCxHQUFkLENBQ3JCLGtCQURxQixFQUVyQixxQ0FGcUI7QUFHckI7QUFDQTtBQUFBLGFBQU1NLFFBQVFDLFFBQVIsQ0FBaUI7QUFBQSxlQUFNWixXQUFXSCxPQUFYLENBQU47QUFBQSxPQUFqQixDQUFOO0FBQUEsS0FKcUIsQ0FBdkI7QUFNRDs7QUFFRDtBQUNBTSxxQkFBbUJFLEdBQW5CLENBQXVCRyxLQUFLSyxTQUFMLENBQWVDLGtCQUFmLENBQWtDLGtCQUFVO0FBQ2pFWCx1QkFBbUJFLEdBQW5CLENBQXVCVSxPQUFPQyxTQUFQLENBQWlCLFlBQU07QUFDNUMsVUFBSVosU0FBU2EsU0FBYixFQUF3QjtBQUN0Qk4sZ0JBQVFDLFFBQVIsQ0FBaUI7QUFBQSxpQkFBTVosV0FBV0gsT0FBWCxFQUFvQixFQUFDa0IsY0FBRCxFQUFwQixDQUFOO0FBQUEsU0FBakI7QUFDRDtBQUNGLEtBSnNCLENBQXZCO0FBS0QsR0FOc0IsQ0FBdkI7O0FBUUE7QUFDQW5CLGtCQUFnQk8sa0JBQWhCO0FBQ0Q7O0FBRU0sU0FBU1QsdUJBQVQsR0FBb0Q7QUFDekQsTUFBTU0sYUFBYUQsUUFBUSxjQUFSLENBQW5CO0FBQ0EsU0FBTyxVQUFDbUIsYUFBRCxFQUE0QjtBQUNqQ2xCLGVBQVdILE9BQVgsRUFBb0IsRUFBQ3FCLDRCQUFELEVBQXBCO0FBQ0QsR0FGRDtBQUdEOztBQUVNLFNBQVN2QixVQUFULEdBQTRCO0FBQ2pDLE1BQUlDLGFBQUosRUFBbUI7QUFDakJBLGtCQUFjdUIsT0FBZDtBQUNBdkIsb0JBQWdCLElBQWhCO0FBQ0Q7QUFDRiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbi8qIGdsb2JhbHMgYXRvbSAqL1xuXG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vY29tbW9uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7U2V0dGluZ3N9IGZyb20gJy4vc2V0dGluZ3MnO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuXG5sZXQgc3Vic2NyaXB0aW9uczogP0NvbXBvc2l0ZURpc3Bvc2FibGUgPSBudWxsO1xubGV0IG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMgPSAobnVsbDogYW55KTsgLy8gYWx3YXlzIGluaXRpYWxpemVkXG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZShzdGF0ZTogP09iamVjdCk6IHZvaWQge1xuICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJlcXVpcmUoJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZScpO1xuICBjb25zdCBmb3JtYXRDb2RlID0gcmVxdWlyZSgnLi9mb3JtYXRDb2RlJyk7XG4gIGNvbnN0IHtjYWxjdWxhdGVPcHRpb25zLCBvYnNlcnZlU2V0dGluZ3N9ID0gcmVxdWlyZSgnLi9zZXR0aW5ncycpO1xuXG4gIGNvbnN0IGxvY2FsU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgLy8gS2VlcCBzZXR0aW5ncyB1cCB0byBkYXRlIHdpdGggTnVjbGlkZSBjb25maWcgYW5kIHByZWNhbGN1bGF0ZSBvcHRpb25zLlxuICBsZXQgc2V0dGluZ3M6IFNldHRpbmdzID0gKG51bGw6IGFueSk7IC8vIGFsd2F5cyBpbml0aWFsaXplZFxuICBsb2NhbFN1YnNjcmlwdGlvbnMuYWRkKG9ic2VydmVTZXR0aW5ncyhuZXdTZXR0aW5ncyA9PiB7XG4gICAgc2V0dGluZ3MgPSBuZXdTZXR0aW5ncztcbiAgICBvcHRpb25zID0gY2FsY3VsYXRlT3B0aW9ucyhzZXR0aW5ncyk7XG4gIH0pKTtcblxuICBpZiAoIXNldHRpbmdzLnVzZUFzU2VydmljZSkge1xuICAgIGF0b20ua2V5bWFwcy5hZGQoJ251Y2xpZGUtZm9ybWF0LWpzJywge1xuICAgICAgXCJhdG9tLXRleHQtZWRpdG9yXCI6IHtcbiAgICAgICAgXCJjbWQtc2hpZnQtaVwiOiBcIm51Y2xpZGUtZm9ybWF0LWpzOm9yZ2FuaXplLXJlcXVpcmVzXCIsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGxvY2FsU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICAnYXRvbS10ZXh0LWVkaXRvcicsXG4gICAgICAnbnVjbGlkZS1mb3JtYXQtanM6b3JnYW5pemUtcmVxdWlyZXMnLFxuICAgICAgLy8gQXRvbSBwcmV2ZW50cyBpbi1jb21tYW5kIG1vZGlmaWNhdGlvbiB0byB0ZXh0IGVkaXRvciBjb250ZW50LlxuICAgICAgKCkgPT4gcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBmb3JtYXRDb2RlKG9wdGlvbnMpKSxcbiAgICApKTtcbiAgfVxuXG4gIC8vIEZvcm1hdCBjb2RlIG9uIHNhdmUgaWYgc2V0dGluZ3Mgc2F5IHNvXG4gIGxvY2FsU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGVkaXRvciA9PiB7XG4gICAgbG9jYWxTdWJzY3JpcHRpb25zLmFkZChlZGl0b3Iub25EaWRTYXZlKCgpID0+IHtcbiAgICAgIGlmIChzZXR0aW5ncy5ydW5PblNhdmUpIHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBmb3JtYXRDb2RlKG9wdGlvbnMsIHtlZGl0b3J9KSk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9KSk7XG5cbiAgLy8gV29yayBhcm91bmQgZmxvdyByZWZpbmVtZW50cy5cbiAgc3Vic2NyaXB0aW9ucyA9IGxvY2FsU3Vic2NyaXB0aW9ucztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVPcmdhbml6ZVJlcXVpcmVzKCk6IGJvb2xlYW4gPT4gdm9pZCB7XG4gIGNvbnN0IGZvcm1hdENvZGUgPSByZXF1aXJlKCcuL2Zvcm1hdENvZGUnKTtcbiAgcmV0dXJuIChhZGRlZFJlcXVpcmVzOiBib29sZWFuKSA9PiB7XG4gICAgZm9ybWF0Q29kZShvcHRpb25zLCB7YWRkZWRSZXF1aXJlc30pO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICBzdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgfVxufVxuIl19