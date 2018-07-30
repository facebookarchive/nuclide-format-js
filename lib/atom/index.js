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
    var onSaveSubscription = editor.onDidSave(function () {
      if (settings.runOnSave) {
        process.nextTick(function () {
          return formatCode(options, null, editor);
        });
      }
    });
    var subscription = new _atom.CompositeDisposable(onSaveSubscription, editor.onDidDestroy(function () {
      localSubscriptions.remove(subscription);
      subscription.dispose();
    }));
    localSubscriptions.add(subscription);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2luZGV4LmpzIl0sIm5hbWVzIjpbImFjdGl2YXRlIiwicHJvdmlkZU9yZ2FuaXplUmVxdWlyZXMiLCJkZWFjdGl2YXRlIiwic3Vic2NyaXB0aW9ucyIsIm9wdGlvbnMiLCJzdGF0ZSIsInJlcXVpcmUiLCJmb3JtYXRDb2RlIiwiY2FsY3VsYXRlT3B0aW9ucyIsIm9ic2VydmVTZXR0aW5ncyIsImxvY2FsU3Vic2NyaXB0aW9ucyIsInNldHRpbmdzIiwiYWRkIiwibmV3U2V0dGluZ3MiLCJ1c2VBc1NlcnZpY2UiLCJhdG9tIiwia2V5bWFwcyIsImNvbW1hbmRzIiwicHJvY2VzcyIsIm5leHRUaWNrIiwid29ya3NwYWNlIiwib2JzZXJ2ZVRleHRFZGl0b3JzIiwib25TYXZlU3Vic2NyaXB0aW9uIiwiZWRpdG9yIiwib25EaWRTYXZlIiwicnVuT25TYXZlIiwic3Vic2NyaXB0aW9uIiwib25EaWREZXN0cm95IiwicmVtb3ZlIiwiZGlzcG9zZSIsInBhcmFtZXRlcnMiXSwibWFwcGluZ3MiOiI7Ozs7O1FBb0JnQkEsUSxHQUFBQSxRO1FBcURBQyx1QixHQUFBQSx1QjtRQVFBQyxVLEdBQUFBLFU7O0FBbEVoQjs7QUFFQSxJQUFJQyxnQkFBc0MsSUFBMUMsQyxDQWpCQTs7Ozs7Ozs7OztBQVVBOztBQVFBLElBQUlDLFVBQTBCLElBQTlCLEMsQ0FBMEM7O0FBRW5DLFNBQVNKLFFBQVQsQ0FBa0JLLEtBQWxCLEVBQXdDO0FBQzdDLE1BQUlGLGFBQUosRUFBbUI7QUFDakI7QUFDRDs7QUFFREcsVUFBUSw2QkFBUjtBQUNBLE1BQU1DLGFBQWFELFFBQVEsY0FBUixDQUFuQjs7QUFONkMsaUJBT0RBLFFBQVEsWUFBUixDQVBDO0FBQUEsTUFPdENFLGdCQVBzQyxZQU90Q0EsZ0JBUHNDO0FBQUEsTUFPcEJDLGVBUG9CLFlBT3BCQSxlQVBvQjs7QUFTN0MsTUFBTUMscUJBQXFCLCtCQUEzQjs7QUFFQTtBQUNBLE1BQUlDLFdBQXNCLElBQTFCLENBWjZDLENBWVA7QUFDdENELHFCQUFtQkUsR0FBbkIsQ0FBdUJILGdCQUFnQix1QkFBZTtBQUNwREUsZUFBV0UsV0FBWDtBQUNBVCxjQUFVSSxpQkFBaUJHLFFBQWpCLENBQVY7QUFDRCxHQUhzQixDQUF2Qjs7QUFLQSxNQUFJLENBQUNBLFNBQVNHLFlBQWQsRUFBNEI7QUFDMUJDLFNBQUtDLE9BQUwsQ0FBYUosR0FBYixDQUFpQixtQkFBakIsRUFBc0M7QUFDcEMsMEJBQW9CO0FBQ2xCLHVCQUFlO0FBREc7QUFEZ0IsS0FBdEM7QUFLQUYsdUJBQW1CRSxHQUFuQixDQUF1QkcsS0FBS0UsUUFBTCxDQUFjTCxHQUFkLENBQ3JCLGtCQURxQixFQUVyQixxQ0FGcUI7QUFHckI7QUFDQTtBQUFBLGFBQU1NLFFBQVFDLFFBQVIsQ0FBaUI7QUFBQSxlQUFNWixXQUFXSCxPQUFYLENBQU47QUFBQSxPQUFqQixDQUFOO0FBQUEsS0FKcUIsQ0FBdkI7QUFNRDs7QUFFRDtBQUNBTSxxQkFBbUJFLEdBQW5CLENBQXVCRyxLQUFLSyxTQUFMLENBQWVDLGtCQUFmLENBQWtDLGtCQUFVO0FBQ2pFLFFBQU1DLHFCQUFxQkMsT0FBT0MsU0FBUCxDQUFpQixZQUFNO0FBQ2hELFVBQUliLFNBQVNjLFNBQWIsRUFBd0I7QUFDdEJQLGdCQUFRQyxRQUFSLENBQWlCO0FBQUEsaUJBQU1aLFdBQVdILE9BQVgsRUFBb0IsSUFBcEIsRUFBMEJtQixNQUExQixDQUFOO0FBQUEsU0FBakI7QUFDRDtBQUNGLEtBSjBCLENBQTNCO0FBS0EsUUFBTUcsZUFBZSw4QkFDbkJKLGtCQURtQixFQUVuQkMsT0FBT0ksWUFBUCxDQUFvQixZQUFNO0FBQ3hCakIseUJBQW1Ca0IsTUFBbkIsQ0FBMEJGLFlBQTFCO0FBQ0FBLG1CQUFhRyxPQUFiO0FBQ0QsS0FIRCxDQUZtQixDQUFyQjtBQU9BbkIsdUJBQW1CRSxHQUFuQixDQUF1QmMsWUFBdkI7QUFDRCxHQWRzQixDQUF2Qjs7QUFnQkE7QUFDQXZCLGtCQUFnQk8sa0JBQWhCO0FBQ0Q7O0FBRU0sU0FBU1QsdUJBQVQsR0FDb0U7QUFDekUsTUFBTU0sYUFBYUQsUUFBUSxjQUFSLENBQW5CO0FBQ0EsU0FBTyxzQkFBYztBQUNuQkMsZUFBV0gsT0FBWCxFQUFvQjBCLFVBQXBCO0FBQ0QsR0FGRDtBQUdEOztBQUVNLFNBQVM1QixVQUFULEdBQTRCO0FBQ2pDLE1BQUlDLGFBQUosRUFBbUI7QUFDakJBLGtCQUFjMEIsT0FBZDtBQUNBMUIsb0JBQWdCLElBQWhCO0FBQ0Q7QUFDRiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbi8qIGdsb2JhbHMgYXRvbSAqL1xuXG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vY29tbW9uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7U2V0dGluZ3N9IGZyb20gJy4vc2V0dGluZ3MnO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuXG5sZXQgc3Vic2NyaXB0aW9uczogP0NvbXBvc2l0ZURpc3Bvc2FibGUgPSBudWxsO1xubGV0IG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMgPSAobnVsbDogYW55KTsgLy8gYWx3YXlzIGluaXRpYWxpemVkXG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZShzdGF0ZTogP09iamVjdCk6IHZvaWQge1xuICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJlcXVpcmUoJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZScpO1xuICBjb25zdCBmb3JtYXRDb2RlID0gcmVxdWlyZSgnLi9mb3JtYXRDb2RlJyk7XG4gIGNvbnN0IHtjYWxjdWxhdGVPcHRpb25zLCBvYnNlcnZlU2V0dGluZ3N9ID0gcmVxdWlyZSgnLi9zZXR0aW5ncycpO1xuXG4gIGNvbnN0IGxvY2FsU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgLy8gS2VlcCBzZXR0aW5ncyB1cCB0byBkYXRlIHdpdGggTnVjbGlkZSBjb25maWcgYW5kIHByZWNhbGN1bGF0ZSBvcHRpb25zLlxuICBsZXQgc2V0dGluZ3M6IFNldHRpbmdzID0gKG51bGw6IGFueSk7IC8vIGFsd2F5cyBpbml0aWFsaXplZFxuICBsb2NhbFN1YnNjcmlwdGlvbnMuYWRkKG9ic2VydmVTZXR0aW5ncyhuZXdTZXR0aW5ncyA9PiB7XG4gICAgc2V0dGluZ3MgPSBuZXdTZXR0aW5ncztcbiAgICBvcHRpb25zID0gY2FsY3VsYXRlT3B0aW9ucyhzZXR0aW5ncyk7XG4gIH0pKTtcblxuICBpZiAoIXNldHRpbmdzLnVzZUFzU2VydmljZSkge1xuICAgIGF0b20ua2V5bWFwcy5hZGQoJ251Y2xpZGUtZm9ybWF0LWpzJywge1xuICAgICAgJ2F0b20tdGV4dC1lZGl0b3InOiB7XG4gICAgICAgICdjbWQtc2hpZnQtaSc6ICdudWNsaWRlLWZvcm1hdC1qczpvcmdhbml6ZS1yZXF1aXJlcycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGxvY2FsU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICAnYXRvbS10ZXh0LWVkaXRvcicsXG4gICAgICAnbnVjbGlkZS1mb3JtYXQtanM6b3JnYW5pemUtcmVxdWlyZXMnLFxuICAgICAgLy8gQXRvbSBwcmV2ZW50cyBpbi1jb21tYW5kIG1vZGlmaWNhdGlvbiB0byB0ZXh0IGVkaXRvciBjb250ZW50LlxuICAgICAgKCkgPT4gcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBmb3JtYXRDb2RlKG9wdGlvbnMpKSxcbiAgICApKTtcbiAgfVxuXG4gIC8vIEZvcm1hdCBjb2RlIG9uIHNhdmUgaWYgc2V0dGluZ3Mgc2F5IHNvXG4gIGxvY2FsU3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGVkaXRvciA9PiB7XG4gICAgY29uc3Qgb25TYXZlU3Vic2NyaXB0aW9uID0gZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PiB7XG4gICAgICBpZiAoc2V0dGluZ3MucnVuT25TYXZlKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gZm9ybWF0Q29kZShvcHRpb25zLCBudWxsLCBlZGl0b3IpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAgIG9uU2F2ZVN1YnNjcmlwdGlvbixcbiAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICBsb2NhbFN1YnNjcmlwdGlvbnMucmVtb3ZlKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIGxvY2FsU3Vic2NyaXB0aW9ucy5hZGQoc3Vic2NyaXB0aW9uKTtcbiAgfSkpO1xuXG4gIC8vIFdvcmsgYXJvdW5kIGZsb3cgcmVmaW5lbWVudHMuXG4gIHN1YnNjcmlwdGlvbnMgPSBsb2NhbFN1YnNjcmlwdGlvbnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlT3JnYW5pemVSZXF1aXJlcyhcbik6IChwYXJhbWV0ZXJzOiB7YWRkZWRSZXF1aXJlczogYm9vbGVhbiwgbWlzc2luZ0V4cG9ydHM6IGJvb2xlYW59KSA9PiB2b2lkIHtcbiAgY29uc3QgZm9ybWF0Q29kZSA9IHJlcXVpcmUoJy4vZm9ybWF0Q29kZScpO1xuICByZXR1cm4gcGFyYW1ldGVycyA9PiB7XG4gICAgZm9ybWF0Q29kZShvcHRpb25zLCBwYXJhbWV0ZXJzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gIH1cbn1cbiJdfQ==