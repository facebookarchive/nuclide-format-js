'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

/* globals atom */

var formatCode = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sourceOptions) {
    var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var editor, options, buffer, inputSource, _transformCodeOrShowE, outputSource, error, position;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            editor = parameters.editor || atom.workspace.getActiveTextEditor();

            if (editor) {
              _context.next = 4;
              break;
            }

            // eslint-disable-next-line no-console
            console.log('- format-js: No active text editor');
            return _context.abrupt('return');

          case 4:
            options = dontAddRequiresIfUsedAsService(sourceOptions, parameters);

            // Save things

            buffer = editor.getBuffer();
            inputSource = buffer.getText();

            // Auto-require transform.

            _transformCodeOrShowE = transformCodeOrShowError(inputSource, options), outputSource = _transformCodeOrShowE.outputSource, error = _transformCodeOrShowE.error;

            // Update position if source has a syntax error

            if (error && atom.config.get('nuclide-format-js.moveCursorToSyntaxError')) {
              position = syntaxErrorPosition(error);

              if (position) {
                editor.setCursorBufferPosition(position);
              }
            }

            // Update the source and position after all transforms are done. Do nothing
            // if the source did not change at all.

            if (!(outputSource === inputSource)) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return');

          case 11:

            buffer.setTextViaDiff(outputSource);

            // Save the file if that option is specified.
            if (atom.config.get('nuclide-format-js.saveAfterRun')) {
              editor.save();
            }

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function formatCode(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function transformCodeOrShowError(inputSource, options) {
  var _require = require('../common'),
      transform = _require.transform;
  // TODO: Add a limit so the transform is not run on files over a certain size.


  var outputSource = void 0;
  try {
    outputSource = transform(inputSource, options);
  } catch (error) {
    showErrorNotification(error);
    return { outputSource: inputSource, error: error };
  }
  dismissExistingErrorNotification();
  if (outputSource === inputSource &&
  // Do not confirm success if user opted out
  atom.config.get('nuclide-format-js.confirmNoChangeSuccess')) {
    showSuccessNotification();
  }
  return { outputSource: outputSource };
}

var ERROR_TITLE = 'Nuclide Format JS: Fix Requires failed';

function showErrorNotification(error) {
  dismissExistingErrorNotification();
  dismissExistingSuccessNotification();
  atom.notifications.addError(ERROR_TITLE, {
    detail: error.toString(),
    stack: error.stack,
    dismissable: true
  });
}

function dismissExistingErrorNotification() {
  dismissNotification(ERROR_TITLE);
}

var SUCCESS_TITLE = 'Nuclide Format JS: Fix Requires succeeded';

var dismissSuccessNotificationTimeout = void 0;
function showSuccessNotification() {
  dismissExistingSuccessNotification();
  atom.notifications.addSuccess(SUCCESS_TITLE, {
    detail: 'No changes were needed.',
    dismissable: true
  });
  dismissSuccessNotificationTimeout = setTimeout(function () {
    dismissExistingSuccessNotification();
  }, 2000);
}

function dismissExistingSuccessNotification() {
  dismissNotification(SUCCESS_TITLE);
  clearTimeout(dismissSuccessNotificationTimeout);
}

function dismissNotification(title) {
  atom.notifications.getNotifications().filter(function (notification) {
    return notification.getMessage() === title;
  }).forEach(function (notification) {
    return notification.dismiss();
  });
}

function syntaxErrorPosition(error) {
  var _ref2 = error.loc || {},
      line = _ref2.line,
      column = _ref2.column;

  return Number.isInteger(line) && Number.isInteger(column) ? [line - 1, column] : null;
}

function dontAddRequiresIfUsedAsService(sourceOptions, parameters) {
  var blacklist = new Set(sourceOptions.blacklist);
  if (parameters.addedRequires != null) {
    blacklist.add('requires.addMissingRequires').add('requires.addMissingTypes');
  }
  return _extends({}, sourceOptions, {
    blacklist: blacklist
  });
}

module.exports = formatCode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2Zvcm1hdENvZGUuanMiXSwibmFtZXMiOlsic291cmNlT3B0aW9ucyIsInBhcmFtZXRlcnMiLCJlZGl0b3IiLCJhdG9tIiwid29ya3NwYWNlIiwiZ2V0QWN0aXZlVGV4dEVkaXRvciIsImNvbnNvbGUiLCJsb2ciLCJvcHRpb25zIiwiZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlIiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwiaW5wdXRTb3VyY2UiLCJnZXRUZXh0IiwidHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yIiwib3V0cHV0U291cmNlIiwiZXJyb3IiLCJjb25maWciLCJnZXQiLCJwb3NpdGlvbiIsInN5bnRheEVycm9yUG9zaXRpb24iLCJzZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInNldFRleHRWaWFEaWZmIiwic2F2ZSIsImZvcm1hdENvZGUiLCJyZXF1aXJlIiwidHJhbnNmb3JtIiwic2hvd0Vycm9yTm90aWZpY2F0aW9uIiwiZGlzbWlzc0V4aXN0aW5nRXJyb3JOb3RpZmljYXRpb24iLCJzaG93U3VjY2Vzc05vdGlmaWNhdGlvbiIsIkVSUk9SX1RJVExFIiwiZGlzbWlzc0V4aXN0aW5nU3VjY2Vzc05vdGlmaWNhdGlvbiIsIm5vdGlmaWNhdGlvbnMiLCJhZGRFcnJvciIsImRldGFpbCIsInRvU3RyaW5nIiwic3RhY2siLCJkaXNtaXNzYWJsZSIsImRpc21pc3NOb3RpZmljYXRpb24iLCJTVUNDRVNTX1RJVExFIiwiZGlzbWlzc1N1Y2Nlc3NOb3RpZmljYXRpb25UaW1lb3V0IiwiYWRkU3VjY2VzcyIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJ0aXRsZSIsImdldE5vdGlmaWNhdGlvbnMiLCJmaWx0ZXIiLCJub3RpZmljYXRpb24iLCJnZXRNZXNzYWdlIiwiZm9yRWFjaCIsImRpc21pc3MiLCJsb2MiLCJsaW5lIiwiY29sdW1uIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiYmxhY2tsaXN0IiwiU2V0IiwiYWRk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Q29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG4vKiBnbG9iYWxzIGF0b20gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL2NvbW1vbi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG50eXBlIEVycm9yV2l0aExvY2F0aW9uID0ge2xvYz86IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfX07XG5cbmFzeW5jIGZ1bmN0aW9uIGZvcm1hdENvZGUoXG4gIHNvdXJjZU9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4gIHBhcmFtZXRlcnM6IHthZGRlZFJlcXVpcmVzPzogYm9vbGVhbiwgZWRpdG9yPzogVGV4dEVkaXRvcn0gPSB7fSxcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBlZGl0b3IgPSBwYXJhbWV0ZXJzLmVkaXRvciB8fCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gIGlmICghZWRpdG9yKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZygnLSBmb3JtYXQtanM6IE5vIGFjdGl2ZSB0ZXh0IGVkaXRvcicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG9wdGlvbnMgPSBkb250QWRkUmVxdWlyZXNJZlVzZWRBc1NlcnZpY2Uoc291cmNlT3B0aW9ucywgcGFyYW1ldGVycyk7XG5cbiAgLy8gU2F2ZSB0aGluZ3NcbiAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICBjb25zdCBpbnB1dFNvdXJjZSA9IGJ1ZmZlci5nZXRUZXh0KCk7XG5cbiAgLy8gQXV0by1yZXF1aXJlIHRyYW5zZm9ybS5cbiAgY29uc3Qge291dHB1dFNvdXJjZSwgZXJyb3J9ID0gdHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yKGlucHV0U291cmNlLCBvcHRpb25zKTtcblxuICAvLyBVcGRhdGUgcG9zaXRpb24gaWYgc291cmNlIGhhcyBhIHN5bnRheCBlcnJvclxuICBpZiAoZXJyb3IgJiYgYXRvbS5jb25maWcuZ2V0KCdudWNsaWRlLWZvcm1hdC1qcy5tb3ZlQ3Vyc29yVG9TeW50YXhFcnJvcicpKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSBzeW50YXhFcnJvclBvc2l0aW9uKGVycm9yKTtcbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLy8gVXBkYXRlIHRoZSBzb3VyY2UgYW5kIHBvc2l0aW9uIGFmdGVyIGFsbCB0cmFuc2Zvcm1zIGFyZSBkb25lLiBEbyBub3RoaW5nXG4gIC8vIGlmIHRoZSBzb3VyY2UgZGlkIG5vdCBjaGFuZ2UgYXQgYWxsLlxuICBpZiAob3V0cHV0U291cmNlID09PSBpbnB1dFNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGJ1ZmZlci5zZXRUZXh0VmlhRGlmZihvdXRwdXRTb3VyY2UpO1xuXG4gIC8vIFNhdmUgdGhlIGZpbGUgaWYgdGhhdCBvcHRpb24gaXMgc3BlY2lmaWVkLlxuICBpZiAoYXRvbS5jb25maWcuZ2V0KCdudWNsaWRlLWZvcm1hdC1qcy5zYXZlQWZ0ZXJSdW4nKSkge1xuICAgIGVkaXRvci5zYXZlKCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Db2RlT3JTaG93RXJyb3IoXG4gIGlucHV0U291cmNlOiBzdHJpbmcsXG4gIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4pOiB7b3V0cHV0U291cmNlOiBzdHJpbmcsIGVycm9yPzogRXJyb3JXaXRoTG9jYXRpb259IHtcbiAgY29uc3Qge3RyYW5zZm9ybX0gPSByZXF1aXJlKCcuLi9jb21tb24nKTtcbiAgLy8gVE9ETzogQWRkIGEgbGltaXQgc28gdGhlIHRyYW5zZm9ybSBpcyBub3QgcnVuIG9uIGZpbGVzIG92ZXIgYSBjZXJ0YWluIHNpemUuXG4gIGxldCBvdXRwdXRTb3VyY2U7XG4gIHRyeSB7XG4gICAgb3V0cHV0U291cmNlID0gdHJhbnNmb3JtKGlucHV0U291cmNlLCBvcHRpb25zKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBzaG93RXJyb3JOb3RpZmljYXRpb24oZXJyb3IpO1xuICAgIHJldHVybiB7b3V0cHV0U291cmNlOiBpbnB1dFNvdXJjZSwgZXJyb3J9O1xuICB9XG4gIGRpc21pc3NFeGlzdGluZ0Vycm9yTm90aWZpY2F0aW9uKCk7XG4gIGlmIChcbiAgICBvdXRwdXRTb3VyY2UgPT09IGlucHV0U291cmNlICYmXG4gICAgLy8gRG8gbm90IGNvbmZpcm0gc3VjY2VzcyBpZiB1c2VyIG9wdGVkIG91dFxuICAgIGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mb3JtYXQtanMuY29uZmlybU5vQ2hhbmdlU3VjY2VzcycpXG4gICkge1xuICAgIHNob3dTdWNjZXNzTm90aWZpY2F0aW9uKCk7XG4gIH1cbiAgcmV0dXJuIHtvdXRwdXRTb3VyY2V9O1xufVxuXG5jb25zdCBFUlJPUl9USVRMRSA9ICdOdWNsaWRlIEZvcm1hdCBKUzogRml4IFJlcXVpcmVzIGZhaWxlZCc7XG5cbmZ1bmN0aW9uIHNob3dFcnJvck5vdGlmaWNhdGlvbihlcnJvcjogRXJyb3IpOiB2b2lkIHtcbiAgZGlzbWlzc0V4aXN0aW5nRXJyb3JOb3RpZmljYXRpb24oKTtcbiAgZGlzbWlzc0V4aXN0aW5nU3VjY2Vzc05vdGlmaWNhdGlvbigpO1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoRVJST1JfVElUTEUsIHtcbiAgICBkZXRhaWw6IGVycm9yLnRvU3RyaW5nKCksXG4gICAgc3RhY2s6IGVycm9yLnN0YWNrLFxuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzbWlzc0V4aXN0aW5nRXJyb3JOb3RpZmljYXRpb24oKTogdm9pZCB7XG4gIGRpc21pc3NOb3RpZmljYXRpb24oRVJST1JfVElUTEUpO1xufVxuXG5jb25zdCBTVUNDRVNTX1RJVExFID0gJ051Y2xpZGUgRm9ybWF0IEpTOiBGaXggUmVxdWlyZXMgc3VjY2VlZGVkJztcblxubGV0IGRpc21pc3NTdWNjZXNzTm90aWZpY2F0aW9uVGltZW91dDtcbmZ1bmN0aW9uIHNob3dTdWNjZXNzTm90aWZpY2F0aW9uKCk6IHZvaWQge1xuICBkaXNtaXNzRXhpc3RpbmdTdWNjZXNzTm90aWZpY2F0aW9uKCk7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFNVQ0NFU1NfVElUTEUsIHtcbiAgICBkZXRhaWw6ICdObyBjaGFuZ2VzIHdlcmUgbmVlZGVkLicsXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gIH0pO1xuICBkaXNtaXNzU3VjY2Vzc05vdGlmaWNhdGlvblRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBkaXNtaXNzRXhpc3RpbmdTdWNjZXNzTm90aWZpY2F0aW9uKCk7XG4gIH0sIDIwMDApO1xufVxuXG5mdW5jdGlvbiBkaXNtaXNzRXhpc3RpbmdTdWNjZXNzTm90aWZpY2F0aW9uKCk6IHZvaWQge1xuICBkaXNtaXNzTm90aWZpY2F0aW9uKFNVQ0NFU1NfVElUTEUpO1xuICBjbGVhclRpbWVvdXQoZGlzbWlzc1N1Y2Nlc3NOb3RpZmljYXRpb25UaW1lb3V0KTtcbn1cblxuZnVuY3Rpb24gZGlzbWlzc05vdGlmaWNhdGlvbih0aXRsZTogc3RyaW5nKTogdm9pZCB7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKClcbiAgICAuZmlsdGVyKG5vdGlmaWNhdGlvbiA9PiBub3RpZmljYXRpb24uZ2V0TWVzc2FnZSgpID09PSB0aXRsZSlcbiAgICAuZm9yRWFjaChub3RpZmljYXRpb24gPT4gbm90aWZpY2F0aW9uLmRpc21pc3MoKSk7XG59XG5cbmZ1bmN0aW9uIHN5bnRheEVycm9yUG9zaXRpb24oZXJyb3I6IEVycm9yV2l0aExvY2F0aW9uKTogP1tudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCB7bGluZSwgY29sdW1ufSA9IGVycm9yLmxvYyB8fCB7fTtcbiAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobGluZSkgJiYgTnVtYmVyLmlzSW50ZWdlcihjb2x1bW4pXG4gICAgPyBbbGluZSAtIDEsIGNvbHVtbl1cbiAgICA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGRvbnRBZGRSZXF1aXJlc0lmVXNlZEFzU2VydmljZShcbiAgc291cmNlT3B0aW9uczogU291cmNlT3B0aW9ucyxcbiAgcGFyYW1ldGVyczoge2FkZGVkUmVxdWlyZXM/OiBib29sZWFufSxcbik6IFNvdXJjZU9wdGlvbnMge1xuICBjb25zdCBibGFja2xpc3QgPSBuZXcgU2V0KHNvdXJjZU9wdGlvbnMuYmxhY2tsaXN0KTtcbiAgaWYgKHBhcmFtZXRlcnMuYWRkZWRSZXF1aXJlcyAhPSBudWxsKSB7XG4gICAgYmxhY2tsaXN0XG4gICAgICAuYWRkKCdyZXF1aXJlcy5hZGRNaXNzaW5nUmVxdWlyZXMnKVxuICAgICAgLmFkZCgncmVxdWlyZXMuYWRkTWlzc2luZ1R5cGVzJyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICAuLi5zb3VyY2VPcHRpb25zLFxuICAgIGJsYWNrbGlzdCxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRDb2RlO1xuIl19