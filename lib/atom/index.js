'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;
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
  localSubscriptions.add(atom.commands.add('atom-text-editor', 'nuclide-format-js:organize-requires',
  // Atom prevents in-command modification to text editor content.
  function () {
    return process.nextTick(function () {
      return formatCode(options);
    });
  }));

  // Keep settings up to date with Nuclide config and precalculate options.
  var settings = void 0;
  var options = void 0;
  localSubscriptions.add(observeSettings(function (newSettings) {
    settings = newSettings;
    options = calculateOptions(settings);
  }));

  // Format code on save if settings say so
  localSubscriptions.add(atom.workspace.observeTextEditors(function (editor) {
    localSubscriptions.add(editor.onDidSave(function () {
      if (settings.runOnSave) {
        process.nextTick(function () {
          return formatCode(options, editor);
        });
      }
    }));
  }));

  // Work around flow refinements.
  subscriptions = localSubscriptions;
}

function deactivate() {
  if (subscriptions) {
    subscriptions.dispose();
    subscriptions = null;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2luZGV4LmpzIl0sIm5hbWVzIjpbImFjdGl2YXRlIiwiZGVhY3RpdmF0ZSIsInN1YnNjcmlwdGlvbnMiLCJzdGF0ZSIsInJlcXVpcmUiLCJmb3JtYXRDb2RlIiwiY2FsY3VsYXRlT3B0aW9ucyIsIm9ic2VydmVTZXR0aW5ncyIsImxvY2FsU3Vic2NyaXB0aW9ucyIsImFkZCIsImF0b20iLCJjb21tYW5kcyIsInByb2Nlc3MiLCJuZXh0VGljayIsIm9wdGlvbnMiLCJzZXR0aW5ncyIsIm5ld1NldHRpbmdzIiwid29ya3NwYWNlIiwib2JzZXJ2ZVRleHRFZGl0b3JzIiwiZWRpdG9yIiwib25EaWRTYXZlIiwicnVuT25TYXZlIiwiZGlzcG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFtQmdCQSxRLEdBQUFBLFE7UUFzQ0FDLFUsR0FBQUEsVTs7QUExQ2hCOztBQUVBLElBQUlDLGdCQUFzQyxJQUExQyxDLENBakJBOzs7Ozs7Ozs7O0FBVUE7O0FBU08sU0FBU0YsUUFBVCxDQUFrQkcsS0FBbEIsRUFBd0M7QUFDN0MsTUFBSUQsYUFBSixFQUFtQjtBQUNqQjtBQUNEOztBQUVERSxVQUFRLDZCQUFSO0FBQ0EsTUFBTUMsYUFBYUQsUUFBUSxjQUFSLENBQW5COztBQU42QyxpQkFPREEsUUFBUSxZQUFSLENBUEM7QUFBQSxNQU90Q0UsZ0JBUHNDLFlBT3RDQSxnQkFQc0M7QUFBQSxNQU9wQkMsZUFQb0IsWUFPcEJBLGVBUG9COztBQVM3QyxNQUFNQyxxQkFBcUIsK0JBQTNCO0FBQ0FBLHFCQUFtQkMsR0FBbkIsQ0FBdUJDLEtBQUtDLFFBQUwsQ0FBY0YsR0FBZCxDQUNyQixrQkFEcUIsRUFFckIscUNBRnFCO0FBR3JCO0FBQ0E7QUFBQSxXQUFNRyxRQUFRQyxRQUFSLENBQWlCO0FBQUEsYUFBTVIsV0FBV1MsT0FBWCxDQUFOO0FBQUEsS0FBakIsQ0FBTjtBQUFBLEdBSnFCLENBQXZCOztBQU9BO0FBQ0EsTUFBSUMsaUJBQUo7QUFDQSxNQUFJRCxnQkFBSjtBQUNBTixxQkFBbUJDLEdBQW5CLENBQXVCRixnQkFBZ0IsdUJBQWU7QUFDcERRLGVBQVdDLFdBQVg7QUFDQUYsY0FBVVIsaUJBQWlCUyxRQUFqQixDQUFWO0FBQ0QsR0FIc0IsQ0FBdkI7O0FBS0E7QUFDQVAscUJBQW1CQyxHQUFuQixDQUF1QkMsS0FBS08sU0FBTCxDQUFlQyxrQkFBZixDQUFrQyxrQkFBVTtBQUNqRVYsdUJBQW1CQyxHQUFuQixDQUF1QlUsT0FBT0MsU0FBUCxDQUFpQixZQUFNO0FBQzVDLFVBQUlMLFNBQVNNLFNBQWIsRUFBd0I7QUFDdEJULGdCQUFRQyxRQUFSLENBQWlCO0FBQUEsaUJBQU1SLFdBQVdTLE9BQVgsRUFBb0JLLE1BQXBCLENBQU47QUFBQSxTQUFqQjtBQUNEO0FBQ0YsS0FKc0IsQ0FBdkI7QUFLRCxHQU5zQixDQUF2Qjs7QUFRQTtBQUNBakIsa0JBQWdCTSxrQkFBaEI7QUFDRDs7QUFFTSxTQUFTUCxVQUFULEdBQTRCO0FBQ2pDLE1BQUlDLGFBQUosRUFBbUI7QUFDakJBLGtCQUFjb0IsT0FBZDtBQUNBcEIsb0JBQWdCLElBQWhCO0FBQ0Q7QUFDRiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbi8qIGdsb2JhbHMgYXRvbSAqL1xuXG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vY29tbW9uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5pbXBvcnQgdHlwZSB7U2V0dGluZ3N9IGZyb20gJy4vc2V0dGluZ3MnO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuXG5sZXQgc3Vic2NyaXB0aW9uczogP0NvbXBvc2l0ZURpc3Bvc2FibGUgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoc3RhdGU6ID9PYmplY3QpOiB2b2lkIHtcbiAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXF1aXJlKCdyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnKTtcbiAgY29uc3QgZm9ybWF0Q29kZSA9IHJlcXVpcmUoJy4vZm9ybWF0Q29kZScpO1xuICBjb25zdCB7Y2FsY3VsYXRlT3B0aW9ucywgb2JzZXJ2ZVNldHRpbmdzfSA9IHJlcXVpcmUoJy4vc2V0dGluZ3MnKTtcblxuICBjb25zdCBsb2NhbFN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICBsb2NhbFN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFxuICAgICdhdG9tLXRleHQtZWRpdG9yJyxcbiAgICAnbnVjbGlkZS1mb3JtYXQtanM6b3JnYW5pemUtcmVxdWlyZXMnLFxuICAgIC8vIEF0b20gcHJldmVudHMgaW4tY29tbWFuZCBtb2RpZmljYXRpb24gdG8gdGV4dCBlZGl0b3IgY29udGVudC5cbiAgICAoKSA9PiBwcm9jZXNzLm5leHRUaWNrKCgpID0+IGZvcm1hdENvZGUob3B0aW9ucykpLFxuICApKTtcblxuICAvLyBLZWVwIHNldHRpbmdzIHVwIHRvIGRhdGUgd2l0aCBOdWNsaWRlIGNvbmZpZyBhbmQgcHJlY2FsY3VsYXRlIG9wdGlvbnMuXG4gIGxldCBzZXR0aW5nczogU2V0dGluZ3M7XG4gIGxldCBvcHRpb25zOiBTb3VyY2VPcHRpb25zO1xuICBsb2NhbFN1YnNjcmlwdGlvbnMuYWRkKG9ic2VydmVTZXR0aW5ncyhuZXdTZXR0aW5ncyA9PiB7XG4gICAgc2V0dGluZ3MgPSBuZXdTZXR0aW5ncztcbiAgICBvcHRpb25zID0gY2FsY3VsYXRlT3B0aW9ucyhzZXR0aW5ncyk7XG4gIH0pKTtcblxuICAvLyBGb3JtYXQgY29kZSBvbiBzYXZlIGlmIHNldHRpbmdzIHNheSBzb1xuICBsb2NhbFN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhlZGl0b3IgPT4ge1xuICAgIGxvY2FsU3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PiB7XG4gICAgICBpZiAoc2V0dGluZ3MucnVuT25TYXZlKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gZm9ybWF0Q29kZShvcHRpb25zLCBlZGl0b3IpKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH0pKTtcblxuICAvLyBXb3JrIGFyb3VuZCBmbG93IHJlZmluZW1lbnRzLlxuICBzdWJzY3JpcHRpb25zID0gbG9jYWxTdWJzY3JpcHRpb25zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgaWYgKHN1YnNjcmlwdGlvbnMpIHtcbiAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICBzdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgfVxufVxuIl19