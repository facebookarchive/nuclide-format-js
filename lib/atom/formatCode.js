'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var formatCode = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sourceOptions, serviceParams, targetEditor) {
    var editor, options, buffer, inputSource, _transformCodeOrShowE, outputSource, error, position;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            editor = targetEditor || atom.workspace.getActiveTextEditor();

            if (editor) {
              _context.next = 4;
              break;
            }

            // eslint-disable-next-line no-console
            console.log('- format-js: No active text editor');
            return _context.abrupt('return');

          case 4:
            options = dontAddRequiresIfUsedAsService(sourceOptions, serviceParams);

            // Save things

            buffer = editor.getBuffer();
            inputSource = buffer.getText();

            // Auto-require transform.

            _transformCodeOrShowE = transformCodeOrShowError(inputSource, options, serviceParams), outputSource = _transformCodeOrShowE.outputSource, error = _transformCodeOrShowE.error;

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

  return function formatCode(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}(); /*
      * Copyright (c) 2015-present, Facebook, Inc.
      * All rights reserved.
      *
      * This source code is licensed under the license found in the LICENSE file in
      * the root directory of this source tree.
      *
      * 
      */

/* globals atom */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function transformCodeOrShowError(inputSource, options, serviceParams) {
  var transform = require('../common/transform');
  // TODO: Add a limit so the transform is not run on files over a certain size.
  var outputSource = void 0;
  var parsingInfo = void 0;
  try {
    var result = transform(inputSource, options);
    outputSource = result.output;
    parsingInfo = result.info;
  } catch (error) {
    showErrorNotification(error, serviceParams);
    return { outputSource: inputSource, error: error };
  }
  dismissNotification(ERROR_TITLE(serviceParams));
  dismissNotification(INFO_TITLE(serviceParams));
  if (outputSource === inputSource && (
  // Maybe the source was changed by nuclide-js-imports
  serviceParams == null || !serviceParams.addedRequires)) {
    if (serviceParams != null && serviceParams.missingExports && (parsingInfo.missingTypes || parsingInfo.missingRequires)) {
      showMissingExportsNotification(serviceParams);
    } else if (
    // Do not confirm success if user opted out
    atom.config.get('nuclide-format-js.confirmNoChangeSuccess')) {
      showSuccessNotification(serviceParams);
    }
  }
  return { outputSource: outputSource };
}

var ERROR_TITLE = function ERROR_TITLE(serviceParams) {
  return notificationTitle(serviceParams, 'failed');
};

function showErrorNotification(error, serviceParams) {
  var title = ERROR_TITLE(serviceParams);
  dismissNotification(title);
  atom.notifications.addError(title, {
    detail: error.toString(),
    stack: error.stack,
    dismissable: true
  });
}

var SUCCESS_TITLE = function SUCCESS_TITLE(serviceParams) {
  return notificationTitle(serviceParams, 'succeeded');
};

var notificationTimeouts = {};
function showSuccessNotification(serviceParams) {
  var title = SUCCESS_TITLE(serviceParams);
  dismissExistingNotification(title);
  atom.notifications.addSuccess(title, {
    detail: 'No changes were needed.',
    dismissable: true
  });
  timeoutNotification(title);
}

function timeoutNotification(title) {
  notificationTimeouts[title] = setTimeout(function () {
    dismissExistingNotification(title);
  }, 2000);
}

function dismissExistingNotification(title) {
  dismissNotification(title);
  clearTimeout(notificationTimeouts[title]);
}

var INFO_TITLE = function INFO_TITLE(serviceParams) {
  return notificationTitle(serviceParams, 'couldn\'t fix all problems');
};

function showMissingExportsNotification(serviceParams) {
  var title = INFO_TITLE(serviceParams);
  dismissNotification(title);
  atom.notifications.addInfo(title, {
    detail: 'Exports for these references couldn\'t be determined. ' + 'Either there are multiple possible export candidates, ' + 'or none exist, or the Language Server or Flow are still ' + 'initializing.',
    dismissable: true
  });
}

function dismissNotification(title) {
  atom.notifications.getNotifications().filter(function (notification) {
    return notification.getMessage() === title;
  }).forEach(function (notification) {
    return notification.dismiss();
  });
}

function notificationTitle(serviceParams, message) {
  return (serviceParams != null ? 'Nuclide JS Imports: Auto Require ' : 'Nuclide Format JS: Fix Requires') + message;
}

function syntaxErrorPosition(error) {
  var _ref2 = error.loc || {},
      line = _ref2.line,
      column = _ref2.column;

  return Number.isInteger(line) && Number.isInteger(column) ? [line - 1, column] : null;
}

function dontAddRequiresIfUsedAsService(sourceOptions, serviceParams) {
  return _extends({}, sourceOptions, {
    dontAddMissing: serviceParams != null
  });
}

module.exports = formatCode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2Zvcm1hdENvZGUuanMiXSwibmFtZXMiOlsic291cmNlT3B0aW9ucyIsInNlcnZpY2VQYXJhbXMiLCJ0YXJnZXRFZGl0b3IiLCJlZGl0b3IiLCJhdG9tIiwid29ya3NwYWNlIiwiZ2V0QWN0aXZlVGV4dEVkaXRvciIsImNvbnNvbGUiLCJsb2ciLCJvcHRpb25zIiwiZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlIiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwiaW5wdXRTb3VyY2UiLCJnZXRUZXh0IiwidHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yIiwib3V0cHV0U291cmNlIiwiZXJyb3IiLCJjb25maWciLCJnZXQiLCJwb3NpdGlvbiIsInN5bnRheEVycm9yUG9zaXRpb24iLCJzZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInNldFRleHRWaWFEaWZmIiwic2F2ZSIsImZvcm1hdENvZGUiLCJ0cmFuc2Zvcm0iLCJyZXF1aXJlIiwicGFyc2luZ0luZm8iLCJyZXN1bHQiLCJvdXRwdXQiLCJpbmZvIiwic2hvd0Vycm9yTm90aWZpY2F0aW9uIiwiZGlzbWlzc05vdGlmaWNhdGlvbiIsIkVSUk9SX1RJVExFIiwiSU5GT19USVRMRSIsImFkZGVkUmVxdWlyZXMiLCJtaXNzaW5nRXhwb3J0cyIsIm1pc3NpbmdUeXBlcyIsIm1pc3NpbmdSZXF1aXJlcyIsInNob3dNaXNzaW5nRXhwb3J0c05vdGlmaWNhdGlvbiIsInNob3dTdWNjZXNzTm90aWZpY2F0aW9uIiwibm90aWZpY2F0aW9uVGl0bGUiLCJ0aXRsZSIsIm5vdGlmaWNhdGlvbnMiLCJhZGRFcnJvciIsImRldGFpbCIsInRvU3RyaW5nIiwic3RhY2siLCJkaXNtaXNzYWJsZSIsIlNVQ0NFU1NfVElUTEUiLCJub3RpZmljYXRpb25UaW1lb3V0cyIsImRpc21pc3NFeGlzdGluZ05vdGlmaWNhdGlvbiIsImFkZFN1Y2Nlc3MiLCJ0aW1lb3V0Tm90aWZpY2F0aW9uIiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsImFkZEluZm8iLCJnZXROb3RpZmljYXRpb25zIiwiZmlsdGVyIiwibm90aWZpY2F0aW9uIiwiZ2V0TWVzc2FnZSIsImZvckVhY2giLCJkaXNtaXNzIiwibWVzc2FnZSIsImxvYyIsImxpbmUiLCJjb2x1bW4iLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJkb250QWRkTWlzc2luZyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7O3VEQXFCQSxpQkFDRUEsYUFERixFQUVFQyxhQUZGLEVBR0VDLFlBSEY7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtRQyxrQkFMUixHQUtpQkQsZ0JBQWdCRSxLQUFLQyxTQUFMLENBQWVDLG1CQUFmLEVBTGpDOztBQUFBLGdCQU1PSCxNQU5QO0FBQUE7QUFBQTtBQUFBOztBQU9JO0FBQ0FJLG9CQUFRQyxHQUFSLENBQVksb0NBQVo7QUFSSjs7QUFBQTtBQVlRQyxtQkFaUixHQVlrQkMsK0JBQStCVixhQUEvQixFQUE4Q0MsYUFBOUMsQ0FabEI7O0FBY0U7O0FBQ01VLGtCQWZSLEdBZWlCUixPQUFPUyxTQUFQLEVBZmpCO0FBZ0JRQyx1QkFoQlIsR0FnQnNCRixPQUFPRyxPQUFQLEVBaEJ0Qjs7QUFrQkU7O0FBbEJGLG9DQW1CZ0NDLHlCQUM1QkYsV0FENEIsRUFFNUJKLE9BRjRCLEVBRzVCUixhQUg0QixDQW5CaEMsRUFtQlNlLFlBbkJULHlCQW1CU0EsWUFuQlQsRUFtQnVCQyxLQW5CdkIseUJBbUJ1QkEsS0FuQnZCOztBQXlCRTs7QUFDQSxnQkFBSUEsU0FBU2IsS0FBS2MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLDJDQUFoQixDQUFiLEVBQTJFO0FBQ25FQyxzQkFEbUUsR0FDeERDLG9CQUFvQkosS0FBcEIsQ0FEd0Q7O0FBRXpFLGtCQUFJRyxRQUFKLEVBQWM7QUFDWmpCLHVCQUFPbUIsdUJBQVAsQ0FBK0JGLFFBQS9CO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBOztBQWxDRixrQkFtQ01KLGlCQUFpQkgsV0FuQ3ZCO0FBQUE7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T0FBTyxDQUFSLEVBQVdDLE1BQVgsQ0FERyxHQUVILElBRko7QUFHRDs7QUFFRCxTQUFTekQsOEJBQVQsQ0FDRVYsYUFERixFQUVFQyxhQUZGLEVBR2lCO0FBQ2Ysc0JBQ0tELGFBREw7QUFFRXNFLG9CQUFnQnJFLGlCQUFpQjtBQUZuQztBQUlEOztBQUVEc0UsT0FBT0MsT0FBUCxHQUFpQi9DLFVBQWpCIiwiZmlsZSI6ImZvcm1hdENvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG4vKiBnbG9iYWxzIGF0b20gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL2NvbW1vbi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG50eXBlIEVycm9yV2l0aExvY2F0aW9uID0ge2xvYz86IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfX07XG5cbnR5cGUgU2VydmljZVBhcmFtcyA9ID97XG4gIGFkZGVkUmVxdWlyZXM6IGJvb2xlYW4sXG4gIG1pc3NpbmdFeHBvcnRzOiBib29sZWFuLFxufTtcblxuYXN5bmMgZnVuY3Rpb24gZm9ybWF0Q29kZShcbiAgc291cmNlT3B0aW9uczogU291cmNlT3B0aW9ucyxcbiAgc2VydmljZVBhcmFtczogU2VydmljZVBhcmFtcyxcbiAgdGFyZ2V0RWRpdG9yPzogVGV4dEVkaXRvcixcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBlZGl0b3IgPSB0YXJnZXRFZGl0b3IgfHwgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICBpZiAoIWVkaXRvcikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2coJy0gZm9ybWF0LWpzOiBObyBhY3RpdmUgdGV4dCBlZGl0b3InKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBvcHRpb25zID0gZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlKHNvdXJjZU9wdGlvbnMsIHNlcnZpY2VQYXJhbXMpO1xuXG4gIC8vIFNhdmUgdGhpbmdzXG4gIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcbiAgY29uc3QgaW5wdXRTb3VyY2UgPSBidWZmZXIuZ2V0VGV4dCgpO1xuXG4gIC8vIEF1dG8tcmVxdWlyZSB0cmFuc2Zvcm0uXG4gIGNvbnN0IHtvdXRwdXRTb3VyY2UsIGVycm9yfSA9IHRyYW5zZm9ybUNvZGVPclNob3dFcnJvcihcbiAgICBpbnB1dFNvdXJjZSxcbiAgICBvcHRpb25zLFxuICAgIHNlcnZpY2VQYXJhbXMsXG4gICk7XG5cbiAgLy8gVXBkYXRlIHBvc2l0aW9uIGlmIHNvdXJjZSBoYXMgYSBzeW50YXggZXJyb3JcbiAgaWYgKGVycm9yICYmIGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mb3JtYXQtanMubW92ZUN1cnNvclRvU3ludGF4RXJyb3InKSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gc3ludGF4RXJyb3JQb3NpdGlvbihlcnJvcik7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVwZGF0ZSB0aGUgc291cmNlIGFuZCBwb3NpdGlvbiBhZnRlciBhbGwgdHJhbnNmb3JtcyBhcmUgZG9uZS4gRG8gbm90aGluZ1xuICAvLyBpZiB0aGUgc291cmNlIGRpZCBub3QgY2hhbmdlIGF0IGFsbC5cbiAgaWYgKG91dHB1dFNvdXJjZSA9PT0gaW5wdXRTb3VyY2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBidWZmZXIuc2V0VGV4dFZpYURpZmYob3V0cHV0U291cmNlKTtcblxuICAvLyBTYXZlIHRoZSBmaWxlIGlmIHRoYXQgb3B0aW9uIGlzIHNwZWNpZmllZC5cbiAgaWYgKGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mb3JtYXQtanMuc2F2ZUFmdGVyUnVuJykpIHtcbiAgICBlZGl0b3Iuc2F2ZSgpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gdHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yKFxuICBpbnB1dFNvdXJjZTogc3RyaW5nLFxuICBvcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuICBzZXJ2aWNlUGFyYW1zOiBTZXJ2aWNlUGFyYW1zLFxuKToge291dHB1dFNvdXJjZTogc3RyaW5nLCBlcnJvcj86IEVycm9yV2l0aExvY2F0aW9ufSB7XG4gIGNvbnN0IHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uL2NvbW1vbi90cmFuc2Zvcm0nKTtcbiAgLy8gVE9ETzogQWRkIGEgbGltaXQgc28gdGhlIHRyYW5zZm9ybSBpcyBub3QgcnVuIG9uIGZpbGVzIG92ZXIgYSBjZXJ0YWluIHNpemUuXG4gIGxldCBvdXRwdXRTb3VyY2U7XG4gIGxldCBwYXJzaW5nSW5mbztcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm0oaW5wdXRTb3VyY2UsIG9wdGlvbnMpO1xuICAgIG91dHB1dFNvdXJjZSA9IHJlc3VsdC5vdXRwdXQ7XG4gICAgcGFyc2luZ0luZm8gPSByZXN1bHQuaW5mbztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBzaG93RXJyb3JOb3RpZmljYXRpb24oZXJyb3IsIHNlcnZpY2VQYXJhbXMpO1xuICAgIHJldHVybiB7b3V0cHV0U291cmNlOiBpbnB1dFNvdXJjZSwgZXJyb3J9O1xuICB9XG4gIGRpc21pc3NOb3RpZmljYXRpb24oRVJST1JfVElUTEUoc2VydmljZVBhcmFtcykpO1xuICBkaXNtaXNzTm90aWZpY2F0aW9uKElORk9fVElUTEUoc2VydmljZVBhcmFtcykpO1xuICBpZiAoXG4gICAgb3V0cHV0U291cmNlID09PSBpbnB1dFNvdXJjZSAmJlxuICAgIC8vIE1heWJlIHRoZSBzb3VyY2Ugd2FzIGNoYW5nZWQgYnkgbnVjbGlkZS1qcy1pbXBvcnRzXG4gICAgKHNlcnZpY2VQYXJhbXMgPT0gbnVsbCB8fCAhc2VydmljZVBhcmFtcy5hZGRlZFJlcXVpcmVzKVxuICApIHtcbiAgICBpZiAoXG4gICAgICBzZXJ2aWNlUGFyYW1zICE9IG51bGwgJiZcbiAgICAgIHNlcnZpY2VQYXJhbXMubWlzc2luZ0V4cG9ydHMgJiZcbiAgICAgIChwYXJzaW5nSW5mby5taXNzaW5nVHlwZXMgfHwgcGFyc2luZ0luZm8ubWlzc2luZ1JlcXVpcmVzKVxuICAgICkge1xuICAgICAgc2hvd01pc3NpbmdFeHBvcnRzTm90aWZpY2F0aW9uKHNlcnZpY2VQYXJhbXMpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAvLyBEbyBub3QgY29uZmlybSBzdWNjZXNzIGlmIHVzZXIgb3B0ZWQgb3V0XG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ251Y2xpZGUtZm9ybWF0LWpzLmNvbmZpcm1Ob0NoYW5nZVN1Y2Nlc3MnKVxuICAgICkge1xuICAgICAgc2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24oc2VydmljZVBhcmFtcyk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7b3V0cHV0U291cmNlfTtcbn1cblxuY29uc3QgRVJST1JfVElUTEUgPSBzZXJ2aWNlUGFyYW1zID0+IG5vdGlmaWNhdGlvblRpdGxlKHNlcnZpY2VQYXJhbXMsICdmYWlsZWQnKTtcblxuZnVuY3Rpb24gc2hvd0Vycm9yTm90aWZpY2F0aW9uKGVycm9yOiBFcnJvciwgc2VydmljZVBhcmFtczogU2VydmljZVBhcmFtcyk6IHZvaWQge1xuICBjb25zdCB0aXRsZSA9IEVSUk9SX1RJVExFKHNlcnZpY2VQYXJhbXMpO1xuICBkaXNtaXNzTm90aWZpY2F0aW9uKHRpdGxlKTtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRpdGxlLCB7XG4gICAgZGV0YWlsOiBlcnJvci50b1N0cmluZygpLFxuICAgIHN0YWNrOiBlcnJvci5zdGFjayxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgfSk7XG59XG5cbmNvbnN0IFNVQ0NFU1NfVElUTEUgPSBzZXJ2aWNlUGFyYW1zID0+IG5vdGlmaWNhdGlvblRpdGxlKHNlcnZpY2VQYXJhbXMsICdzdWNjZWVkZWQnKTtcblxuY29uc3Qgbm90aWZpY2F0aW9uVGltZW91dHMgPSB7fTtcbmZ1bmN0aW9uIHNob3dTdWNjZXNzTm90aWZpY2F0aW9uKHNlcnZpY2VQYXJhbXM6IFNlcnZpY2VQYXJhbXMpOiB2b2lkIHtcbiAgY29uc3QgdGl0bGUgPSBTVUNDRVNTX1RJVExFKHNlcnZpY2VQYXJhbXMpO1xuICBkaXNtaXNzRXhpc3RpbmdOb3RpZmljYXRpb24odGl0bGUpO1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2Vzcyh0aXRsZSwge1xuICAgIGRldGFpbDogJ05vIGNoYW5nZXMgd2VyZSBuZWVkZWQuJyxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgfSk7XG4gIHRpbWVvdXROb3RpZmljYXRpb24odGl0bGUpO1xufVxuXG5mdW5jdGlvbiB0aW1lb3V0Tm90aWZpY2F0aW9uKHRpdGxlOiBzdHJpbmcpIHtcbiAgbm90aWZpY2F0aW9uVGltZW91dHNbdGl0bGVdID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZGlzbWlzc0V4aXN0aW5nTm90aWZpY2F0aW9uKHRpdGxlKTtcbiAgfSwgMjAwMCk7XG59XG5cbmZ1bmN0aW9uIGRpc21pc3NFeGlzdGluZ05vdGlmaWNhdGlvbih0aXRsZTogc3RyaW5nKTogdm9pZCB7XG4gIGRpc21pc3NOb3RpZmljYXRpb24odGl0bGUpO1xuICBjbGVhclRpbWVvdXQobm90aWZpY2F0aW9uVGltZW91dHNbdGl0bGVdKTtcbn1cblxuY29uc3QgSU5GT19USVRMRSA9IHNlcnZpY2VQYXJhbXMgPT5cbiAgbm90aWZpY2F0aW9uVGl0bGUoc2VydmljZVBhcmFtcywgJ2NvdWxkblxcJ3QgZml4IGFsbCBwcm9ibGVtcycpO1xuXG5mdW5jdGlvbiBzaG93TWlzc2luZ0V4cG9ydHNOb3RpZmljYXRpb24oc2VydmljZVBhcmFtczogU2VydmljZVBhcmFtcyk6IHZvaWQge1xuICBjb25zdCB0aXRsZSA9IElORk9fVElUTEUoc2VydmljZVBhcmFtcyk7XG4gIGRpc21pc3NOb3RpZmljYXRpb24odGl0bGUpO1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyh0aXRsZSwge1xuICAgIGRldGFpbDogJ0V4cG9ydHMgZm9yIHRoZXNlIHJlZmVyZW5jZXMgY291bGRuXFwndCBiZSBkZXRlcm1pbmVkLiAnICtcbiAgICAgICdFaXRoZXIgdGhlcmUgYXJlIG11bHRpcGxlIHBvc3NpYmxlIGV4cG9ydCBjYW5kaWRhdGVzLCAnICtcbiAgICAgICdvciBub25lIGV4aXN0LCBvciB0aGUgTGFuZ3VhZ2UgU2VydmVyIG9yIEZsb3cgYXJlIHN0aWxsICcgK1xuICAgICAgJ2luaXRpYWxpemluZy4nLFxuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzbWlzc05vdGlmaWNhdGlvbih0aXRsZTogc3RyaW5nKTogdm9pZCB7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKClcbiAgICAuZmlsdGVyKG5vdGlmaWNhdGlvbiA9PiBub3RpZmljYXRpb24uZ2V0TWVzc2FnZSgpID09PSB0aXRsZSlcbiAgICAuZm9yRWFjaChub3RpZmljYXRpb24gPT4gbm90aWZpY2F0aW9uLmRpc21pc3MoKSk7XG59XG5cbmZ1bmN0aW9uIG5vdGlmaWNhdGlvblRpdGxlKHNlcnZpY2VQYXJhbXM6IFNlcnZpY2VQYXJhbXMsIG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiAoXG4gICAgKHNlcnZpY2VQYXJhbXMgIT0gbnVsbFxuICAgICAgPyAnTnVjbGlkZSBKUyBJbXBvcnRzOiBBdXRvIFJlcXVpcmUgJ1xuICAgICAgOiAnTnVjbGlkZSBGb3JtYXQgSlM6IEZpeCBSZXF1aXJlcycpICtcbiAgICBtZXNzYWdlXG4gICk7XG59XG5cbmZ1bmN0aW9uIHN5bnRheEVycm9yUG9zaXRpb24oZXJyb3I6IEVycm9yV2l0aExvY2F0aW9uKTogP1tudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCB7bGluZSwgY29sdW1ufSA9IGVycm9yLmxvYyB8fCB7fTtcbiAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobGluZSkgJiYgTnVtYmVyLmlzSW50ZWdlcihjb2x1bW4pXG4gICAgPyBbbGluZSAtIDEsIGNvbHVtbl1cbiAgICA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGRvbnRBZGRSZXF1aXJlc0lmVXNlZEFzU2VydmljZShcbiAgc291cmNlT3B0aW9uczogU291cmNlT3B0aW9ucyxcbiAgc2VydmljZVBhcmFtczogU2VydmljZVBhcmFtcyxcbik6IFNvdXJjZU9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIC4uLnNvdXJjZU9wdGlvbnMsXG4gICAgZG9udEFkZE1pc3Npbmc6IHNlcnZpY2VQYXJhbXMgIT0gbnVsbCxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRDb2RlO1xuIl19