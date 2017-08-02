'use strict';

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
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(options, editor_) {
    var editor, buffer, inputSource, _transformCodeOrShowE, outputSource, error, position;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            editor = editor_ || atom.workspace.getActiveTextEditor();

            if (editor) {
              _context.next = 4;
              break;
            }

            // eslint-disable-next-line no-console
            console.log('- format-js: No active text editor');
            return _context.abrupt('return');

          case 4:

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
              _context.next = 10;
              break;
            }

            return _context.abrupt('return');

          case 10:

            buffer.setTextViaDiff(outputSource);

            // Save the file if that option is specified.
            if (atom.config.get('nuclide-format-js.saveAfterRun')) {
              editor.save();
            }

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function formatCode(_x, _x2) {
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

module.exports = formatCode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2Zvcm1hdENvZGUuanMiXSwibmFtZXMiOlsib3B0aW9ucyIsImVkaXRvcl8iLCJlZGl0b3IiLCJhdG9tIiwid29ya3NwYWNlIiwiZ2V0QWN0aXZlVGV4dEVkaXRvciIsImNvbnNvbGUiLCJsb2ciLCJidWZmZXIiLCJnZXRCdWZmZXIiLCJpbnB1dFNvdXJjZSIsImdldFRleHQiLCJ0cmFuc2Zvcm1Db2RlT3JTaG93RXJyb3IiLCJvdXRwdXRTb3VyY2UiLCJlcnJvciIsImNvbmZpZyIsImdldCIsInBvc2l0aW9uIiwic3ludGF4RXJyb3JQb3NpdGlvbiIsInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIiwic2V0VGV4dFZpYURpZmYiLCJzYXZlIiwiZm9ybWF0Q29kZSIsInJlcXVpcmUiLCJ0cmFuc2Zvcm0iLCJzaG93RXJyb3JOb3RpZmljYXRpb24iLCJkaXNtaXNzRXhpc3RpbmdFcnJvck5vdGlmaWNhdGlvbiIsInNob3dTdWNjZXNzTm90aWZpY2F0aW9uIiwiRVJST1JfVElUTEUiLCJkaXNtaXNzRXhpc3RpbmdTdWNjZXNzTm90aWZpY2F0aW9uIiwibm90aWZpY2F0aW9ucyIsImFkZEVycm9yIiwiZGV0YWlsIiwidG9TdHJpbmciLCJzdGFjayIsImRpc21pc3NhYmxlIiwiZGlzbWlzc05vdGlmaWNhdGlvbiIsIlNVQ0NFU1NfVElUTEUiLCJkaXNtaXNzU3VjY2Vzc05vdGlmaWNhdGlvblRpbWVvdXQiLCJhZGRTdWNjZXNzIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInRpdGxlIiwiZ2V0Tm90aWZpY2F0aW9ucyIsImZpbHRlciIsIm5vdGlmaWNhdGlvbiIsImdldE1lc3NhZ2UiLCJmb3JFYWNoIiwiZGlzbWlzcyIsImxvYyIsImxpbmUiLCJjb2x1bW4iLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozt1REFNQSxpQkFBMEJBLE9BQTFC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RHZDLE9BQUsyQixhQUFMLENBQW1CYSxnQkFBbkIsR0FDR0MsTUFESCxDQUNVO0FBQUEsV0FBZ0JDLGFBQWFDLFVBQWIsT0FBOEJKLEtBQTlDO0FBQUEsR0FEVixFQUVHSyxPQUZILENBRVc7QUFBQSxXQUFnQkYsYUFBYUcsT0FBYixFQUFoQjtBQUFBLEdBRlg7QUFHRDs7QUFFRCxTQUFTOUIsbUJBQVQsQ0FBNkJKLEtBQTdCLEVBQTBFO0FBQUEsY0FDakRBLE1BQU1tQyxHQUFOLElBQWEsRUFEb0M7QUFBQSxNQUNqRUMsSUFEaUUsU0FDakVBLElBRGlFO0FBQUEsTUFDM0RDLE1BRDJELFNBQzNEQSxNQUQyRDs7QUFFeEUsU0FBT0MsT0FBT0MsU0FBUCxDQUFpQkgsSUFBakIsS0FBMEJFLE9BQU9DLFNBQVAsQ0FBaUJGLE1BQWpCLENBQTFCLEdBQ0gsQ0FBQ0QsT0FBTyxDQUFSLEVBQVdDLE1BQVgsQ0FERyxHQUVILElBRko7QUFHRDs7QUFFREcsT0FBT0MsT0FBUCxHQUFpQmpDLFVBQWpCIiwiZmlsZSI6ImZvcm1hdENvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG4vKiBnbG9iYWxzIGF0b20gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL2NvbW1vbi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG50eXBlIEVycm9yV2l0aExvY2F0aW9uID0ge2xvYz86IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfX07XG5cbmFzeW5jIGZ1bmN0aW9uIGZvcm1hdENvZGUob3B0aW9uczogU291cmNlT3B0aW9ucywgZWRpdG9yXzogP1RleHRFZGl0b3IpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZWRpdG9yID0gZWRpdG9yXyB8fCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gIGlmICghZWRpdG9yKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZygnLSBmb3JtYXQtanM6IE5vIGFjdGl2ZSB0ZXh0IGVkaXRvcicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFNhdmUgdGhpbmdzXG4gIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcbiAgY29uc3QgaW5wdXRTb3VyY2UgPSBidWZmZXIuZ2V0VGV4dCgpO1xuXG4gIC8vIEF1dG8tcmVxdWlyZSB0cmFuc2Zvcm0uXG4gIGNvbnN0IHtvdXRwdXRTb3VyY2UsIGVycm9yfSA9IHRyYW5zZm9ybUNvZGVPclNob3dFcnJvcihpbnB1dFNvdXJjZSwgb3B0aW9ucyk7XG5cbiAgLy8gVXBkYXRlIHBvc2l0aW9uIGlmIHNvdXJjZSBoYXMgYSBzeW50YXggZXJyb3JcbiAgaWYgKGVycm9yICYmIGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mb3JtYXQtanMubW92ZUN1cnNvclRvU3ludGF4RXJyb3InKSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gc3ludGF4RXJyb3JQb3NpdGlvbihlcnJvcik7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVwZGF0ZSB0aGUgc291cmNlIGFuZCBwb3NpdGlvbiBhZnRlciBhbGwgdHJhbnNmb3JtcyBhcmUgZG9uZS4gRG8gbm90aGluZ1xuICAvLyBpZiB0aGUgc291cmNlIGRpZCBub3QgY2hhbmdlIGF0IGFsbC5cbiAgaWYgKG91dHB1dFNvdXJjZSA9PT0gaW5wdXRTb3VyY2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBidWZmZXIuc2V0VGV4dFZpYURpZmYob3V0cHV0U291cmNlKTtcblxuICAvLyBTYXZlIHRoZSBmaWxlIGlmIHRoYXQgb3B0aW9uIGlzIHNwZWNpZmllZC5cbiAgaWYgKGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mb3JtYXQtanMuc2F2ZUFmdGVyUnVuJykpIHtcbiAgICBlZGl0b3Iuc2F2ZSgpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gdHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yKFxuICBpbnB1dFNvdXJjZTogc3RyaW5nLFxuICBvcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuKToge291dHB1dFNvdXJjZTogc3RyaW5nLCBlcnJvcj86IEVycm9yV2l0aExvY2F0aW9ufSB7XG4gIGNvbnN0IHt0cmFuc2Zvcm19ID0gcmVxdWlyZSgnLi4vY29tbW9uJyk7XG4gIC8vIFRPRE86IEFkZCBhIGxpbWl0IHNvIHRoZSB0cmFuc2Zvcm0gaXMgbm90IHJ1biBvbiBmaWxlcyBvdmVyIGEgY2VydGFpbiBzaXplLlxuICBsZXQgb3V0cHV0U291cmNlO1xuICB0cnkge1xuICAgIG91dHB1dFNvdXJjZSA9IHRyYW5zZm9ybShpbnB1dFNvdXJjZSwgb3B0aW9ucyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgc2hvd0Vycm9yTm90aWZpY2F0aW9uKGVycm9yKTtcbiAgICByZXR1cm4ge291dHB1dFNvdXJjZTogaW5wdXRTb3VyY2UsIGVycm9yfTtcbiAgfVxuICBkaXNtaXNzRXhpc3RpbmdFcnJvck5vdGlmaWNhdGlvbigpO1xuICBpZiAoXG4gICAgb3V0cHV0U291cmNlID09PSBpbnB1dFNvdXJjZSAmJlxuICAgIC8vIERvIG5vdCBjb25maXJtIHN1Y2Nlc3MgaWYgdXNlciBvcHRlZCBvdXRcbiAgICBhdG9tLmNvbmZpZy5nZXQoJ251Y2xpZGUtZm9ybWF0LWpzLmNvbmZpcm1Ob0NoYW5nZVN1Y2Nlc3MnKVxuICApIHtcbiAgICBzaG93U3VjY2Vzc05vdGlmaWNhdGlvbigpO1xuICB9XG4gIHJldHVybiB7b3V0cHV0U291cmNlfTtcbn1cblxuY29uc3QgRVJST1JfVElUTEUgPSAnTnVjbGlkZSBGb3JtYXQgSlM6IEZpeCBSZXF1aXJlcyBmYWlsZWQnO1xuXG5mdW5jdGlvbiBzaG93RXJyb3JOb3RpZmljYXRpb24oZXJyb3I6IEVycm9yKTogdm9pZCB7XG4gIGRpc21pc3NFeGlzdGluZ0Vycm9yTm90aWZpY2F0aW9uKCk7XG4gIGRpc21pc3NFeGlzdGluZ1N1Y2Nlc3NOb3RpZmljYXRpb24oKTtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKEVSUk9SX1RJVExFLCB7XG4gICAgZGV0YWlsOiBlcnJvci50b1N0cmluZygpLFxuICAgIHN0YWNrOiBlcnJvci5zdGFjayxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc21pc3NFeGlzdGluZ0Vycm9yTm90aWZpY2F0aW9uKCk6IHZvaWQge1xuICBkaXNtaXNzTm90aWZpY2F0aW9uKEVSUk9SX1RJVExFKTtcbn1cblxuY29uc3QgU1VDQ0VTU19USVRMRSA9ICdOdWNsaWRlIEZvcm1hdCBKUzogRml4IFJlcXVpcmVzIHN1Y2NlZWRlZCc7XG5cbmxldCBkaXNtaXNzU3VjY2Vzc05vdGlmaWNhdGlvblRpbWVvdXQ7XG5mdW5jdGlvbiBzaG93U3VjY2Vzc05vdGlmaWNhdGlvbigpOiB2b2lkIHtcbiAgZGlzbWlzc0V4aXN0aW5nU3VjY2Vzc05vdGlmaWNhdGlvbigpO1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhTVUNDRVNTX1RJVExFLCB7XG4gICAgZGV0YWlsOiAnTm8gY2hhbmdlcyB3ZXJlIG5lZWRlZC4nLFxuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICB9KTtcbiAgZGlzbWlzc1N1Y2Nlc3NOb3RpZmljYXRpb25UaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZGlzbWlzc0V4aXN0aW5nU3VjY2Vzc05vdGlmaWNhdGlvbigpO1xuICB9LCAyMDAwKTtcbn1cblxuZnVuY3Rpb24gZGlzbWlzc0V4aXN0aW5nU3VjY2Vzc05vdGlmaWNhdGlvbigpOiB2b2lkIHtcbiAgZGlzbWlzc05vdGlmaWNhdGlvbihTVUNDRVNTX1RJVExFKTtcbiAgY2xlYXJUaW1lb3V0KGRpc21pc3NTdWNjZXNzTm90aWZpY2F0aW9uVGltZW91dCk7XG59XG5cbmZ1bmN0aW9uIGRpc21pc3NOb3RpZmljYXRpb24odGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuZ2V0Tm90aWZpY2F0aW9ucygpXG4gICAgLmZpbHRlcihub3RpZmljYXRpb24gPT4gbm90aWZpY2F0aW9uLmdldE1lc3NhZ2UoKSA9PT0gdGl0bGUpXG4gICAgLmZvckVhY2gobm90aWZpY2F0aW9uID0+IG5vdGlmaWNhdGlvbi5kaXNtaXNzKCkpO1xufVxuXG5mdW5jdGlvbiBzeW50YXhFcnJvclBvc2l0aW9uKGVycm9yOiBFcnJvcldpdGhMb2NhdGlvbik6ID9bbnVtYmVyLCBudW1iZXJdIHtcbiAgY29uc3Qge2xpbmUsIGNvbHVtbn0gPSBlcnJvci5sb2MgfHwge307XG4gIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKGxpbmUpICYmIE51bWJlci5pc0ludGVnZXIoY29sdW1uKVxuICAgID8gW2xpbmUgLSAxLCBjb2x1bW5dXG4gICAgOiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdENvZGU7XG4iXX0=