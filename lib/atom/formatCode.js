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
  var _require = require('../common'),
      transform = _require.transform;
  // TODO: Add a limit so the transform is not run on files over a certain size.


  var outputSource = void 0;
  try {
    outputSource = transform(inputSource, options);
  } catch (error) {
    showErrorNotification(error, serviceParams);
    return { outputSource: inputSource, error: error };
  }
  dismissNotification(ERROR_TITLE(serviceParams));
  dismissNotification(INFO_TITLE(serviceParams));
  if (outputSource === inputSource &&
  // Do not confirm success if user opted out
  atom.config.get('nuclide-format-js.confirmNoChangeSuccess')) {
    if (serviceParams != null && serviceParams.missingExports) {
      showMissingExportsNotification(serviceParams);
    } else {
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
  var blacklist = new Set(sourceOptions.blacklist);
  if (serviceParams != null) {
    blacklist.add('requires.addMissingRequires').add('requires.addMissingTypes');
  }
  return _extends({}, sourceOptions, {
    blacklist: blacklist
  });
}

module.exports = formatCode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2Zvcm1hdENvZGUuanMiXSwibmFtZXMiOlsic291cmNlT3B0aW9ucyIsInNlcnZpY2VQYXJhbXMiLCJ0YXJnZXRFZGl0b3IiLCJlZGl0b3IiLCJhdG9tIiwid29ya3NwYWNlIiwiZ2V0QWN0aXZlVGV4dEVkaXRvciIsImNvbnNvbGUiLCJsb2ciLCJvcHRpb25zIiwiZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlIiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwiaW5wdXRTb3VyY2UiLCJnZXRUZXh0IiwidHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yIiwib3V0cHV0U291cmNlIiwiZXJyb3IiLCJjb25maWciLCJnZXQiLCJwb3NpdGlvbiIsInN5bnRheEVycm9yUG9zaXRpb24iLCJzZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInNldFRleHRWaWFEaWZmIiwic2F2ZSIsImZvcm1hdENvZGUiLCJyZXF1aXJlIiwidHJhbnNmb3JtIiwic2hvd0Vycm9yTm90aWZpY2F0aW9uIiwiZGlzbWlzc05vdGlmaWNhdGlvbiIsIkVSUk9SX1RJVExFIiwiSU5GT19USVRMRSIsIm1pc3NpbmdFeHBvcnRzIiwic2hvd01pc3NpbmdFeHBvcnRzTm90aWZpY2F0aW9uIiwic2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24iLCJub3RpZmljYXRpb25UaXRsZSIsInRpdGxlIiwibm90aWZpY2F0aW9ucyIsImFkZEVycm9yIiwiZGV0YWlsIiwidG9TdHJpbmciLCJzdGFjayIsImRpc21pc3NhYmxlIiwiU1VDQ0VTU19USVRMRSIsIm5vdGlmaWNhdGlvblRpbWVvdXRzIiwiZGlzbWlzc0V4aXN0aW5nTm90aWZpY2F0aW9uIiwiYWRkU3VjY2VzcyIsInRpbWVvdXROb3RpZmljYXRpb24iLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiYWRkSW5mbyIsImdldE5vdGlmaWNhdGlvbnMiLCJmaWx0ZXIiLCJub3RpZmljYXRpb24iLCJnZXRNZXNzYWdlIiwiZm9yRWFjaCIsImRpc21pc3MiLCJtZXNzYWdlIiwibG9jIiwibGluZSIsImNvbHVtbiIsIk51bWJlciIsImlzSW50ZWdlciIsImJsYWNrbGlzdCIsIlNldCIsImFkZCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7O3VEQXFCQSxpQkFDRUEsYUFERixFQUVFQyxhQUZGLEVBR0VDLFlBSEY7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtRQyxrQkFMUixHQUtpQkQsZ0JBQWdCRSxLQUFLQyxTQUFMLENBQWVDLG1CQUFmLEVBTGpDOztBQUFBLGdCQU1PSCxNQU5QO0FBQUE7QUFBQTtBQUFBOztBQU9JO0FBQ0FJLG9CQUFRQyxHQUFSLENBQVksb0NBQVo7QUFSSjs7QUFBQTtBQVlRQyxtQkFaUixHQVlrQkMsK0JBQStCVixhQUEvQixFQUE4Q0MsYUFBOUMsQ0FabEI7O0FBY0U7O0FBQ01VLGtCQWZSLEdBZWlCUixPQUFPUyxTQUFQLEVBZmpCO0FBZ0JRQyx1QkFoQlIsR0FnQnNCRixPQUFPRyxPQUFQLEVBaEJ0Qjs7QUFrQkU7O0FBbEJGLG9DQW1CZ0NDLHlCQUM1QkYsV0FENEIsRUFFNUJKLE9BRjRCLEVBRzVCUixhQUg0QixDQW5CaEMsRUFtQlNlLFlBbkJULHlCQW1CU0EsWUFuQlQsRUFtQnVCQyxLQW5CdkIseUJBbUJ1QkEsS0FuQnZCOztBQXlCRTs7QUFDQSxnQkFBSUEsU0FBU2IsS0FBS2MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLDJDQUFoQixDQUFiLEVBQTJFO0FBQ25FQyxzQkFEbUUsR0FDeERDLG9CQUFvQkosS0FBcEIsQ0FEd0Q7O0FBRXpFLGtCQUFJRyxRQUFKLEVBQWM7QUFDWmpCLHVCQUFPbUIsdUJBQVAsQ0FBK0JGLFFBQS9CO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBOztBQWxDRixrQkFtQ01KLGlCQUFpQkgsV0FuQ3ZCO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBOztBQXVDRUYsbUJBQU9ZLGNBQVAsQ0FBc0JQLFlBQXRCOztBQUVBO0FBQ0EsZ0JBQUlaLEtBQUtjLE1B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UDtBQUdEO0FBQ0Qsc0JBQ0tqRSxhQURMO0FBRUUrRDtBQUZGO0FBSUQ7O0FBRURHLE9BQU9DLE9BQVAsR0FBaUIxQyxVQUFqQiIsImZpbGUiOiJmb3JtYXRDb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBmbG93XG4gKi9cblxuLyogZ2xvYmFscyBhdG9tICovXG5cbmltcG9ydCB0eXBlIHtTb3VyY2VPcHRpb25zfSBmcm9tICcuLi9jb21tb24vb3B0aW9ucy9Tb3VyY2VPcHRpb25zJztcblxudHlwZSBFcnJvcldpdGhMb2NhdGlvbiA9IHtsb2M/OiB7bGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlcn19O1xuXG50eXBlIFNlcnZpY2VQYXJhbXMgPSA/e1xuICBhZGRlZFJlcXVpcmVzOiBib29sZWFuLFxuICBtaXNzaW5nRXhwb3J0czogYm9vbGVhbixcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGZvcm1hdENvZGUoXG4gIHNvdXJjZU9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4gIHNlcnZpY2VQYXJhbXM6IFNlcnZpY2VQYXJhbXMsXG4gIHRhcmdldEVkaXRvcj86IFRleHRFZGl0b3IsXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZWRpdG9yID0gdGFyZ2V0RWRpdG9yIHx8IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgaWYgKCFlZGl0b3IpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKCctIGZvcm1hdC1qczogTm8gYWN0aXZlIHRleHQgZWRpdG9yJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgb3B0aW9ucyA9IGRvbnRBZGRSZXF1aXJlc0lmVXNlZEFzU2VydmljZShzb3VyY2VPcHRpb25zLCBzZXJ2aWNlUGFyYW1zKTtcblxuICAvLyBTYXZlIHRoaW5nc1xuICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gIGNvbnN0IGlucHV0U291cmNlID0gYnVmZmVyLmdldFRleHQoKTtcblxuICAvLyBBdXRvLXJlcXVpcmUgdHJhbnNmb3JtLlxuICBjb25zdCB7b3V0cHV0U291cmNlLCBlcnJvcn0gPSB0cmFuc2Zvcm1Db2RlT3JTaG93RXJyb3IoXG4gICAgaW5wdXRTb3VyY2UsXG4gICAgb3B0aW9ucyxcbiAgICBzZXJ2aWNlUGFyYW1zLFxuICApO1xuXG4gIC8vIFVwZGF0ZSBwb3NpdGlvbiBpZiBzb3VyY2UgaGFzIGEgc3ludGF4IGVycm9yXG4gIGlmIChlcnJvciAmJiBhdG9tLmNvbmZpZy5nZXQoJ251Y2xpZGUtZm9ybWF0LWpzLm1vdmVDdXJzb3JUb1N5bnRheEVycm9yJykpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHN5bnRheEVycm9yUG9zaXRpb24oZXJyb3IpO1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIHNvdXJjZSBhbmQgcG9zaXRpb24gYWZ0ZXIgYWxsIHRyYW5zZm9ybXMgYXJlIGRvbmUuIERvIG5vdGhpbmdcbiAgLy8gaWYgdGhlIHNvdXJjZSBkaWQgbm90IGNoYW5nZSBhdCBhbGwuXG4gIGlmIChvdXRwdXRTb3VyY2UgPT09IGlucHV0U291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYnVmZmVyLnNldFRleHRWaWFEaWZmKG91dHB1dFNvdXJjZSk7XG5cbiAgLy8gU2F2ZSB0aGUgZmlsZSBpZiB0aGF0IG9wdGlvbiBpcyBzcGVjaWZpZWQuXG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ251Y2xpZGUtZm9ybWF0LWpzLnNhdmVBZnRlclJ1bicpKSB7XG4gICAgZWRpdG9yLnNhdmUoKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybUNvZGVPclNob3dFcnJvcihcbiAgaW5wdXRTb3VyY2U6IHN0cmluZyxcbiAgb3B0aW9uczogU291cmNlT3B0aW9ucyxcbiAgc2VydmljZVBhcmFtczogU2VydmljZVBhcmFtcyxcbik6IHtvdXRwdXRTb3VyY2U6IHN0cmluZywgZXJyb3I/OiBFcnJvcldpdGhMb2NhdGlvbn0ge1xuICBjb25zdCB7dHJhbnNmb3JtfSA9IHJlcXVpcmUoJy4uL2NvbW1vbicpO1xuICAvLyBUT0RPOiBBZGQgYSBsaW1pdCBzbyB0aGUgdHJhbnNmb3JtIGlzIG5vdCBydW4gb24gZmlsZXMgb3ZlciBhIGNlcnRhaW4gc2l6ZS5cbiAgbGV0IG91dHB1dFNvdXJjZTtcbiAgdHJ5IHtcbiAgICBvdXRwdXRTb3VyY2UgPSB0cmFuc2Zvcm0oaW5wdXRTb3VyY2UsIG9wdGlvbnMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHNob3dFcnJvck5vdGlmaWNhdGlvbihlcnJvciwgc2VydmljZVBhcmFtcyk7XG4gICAgcmV0dXJuIHtvdXRwdXRTb3VyY2U6IGlucHV0U291cmNlLCBlcnJvcn07XG4gIH1cbiAgZGlzbWlzc05vdGlmaWNhdGlvbihFUlJPUl9USVRMRShzZXJ2aWNlUGFyYW1zKSk7XG4gIGRpc21pc3NOb3RpZmljYXRpb24oSU5GT19USVRMRShzZXJ2aWNlUGFyYW1zKSk7XG4gIGlmIChcbiAgICBvdXRwdXRTb3VyY2UgPT09IGlucHV0U291cmNlICYmXG4gICAgLy8gRG8gbm90IGNvbmZpcm0gc3VjY2VzcyBpZiB1c2VyIG9wdGVkIG91dFxuICAgIGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mb3JtYXQtanMuY29uZmlybU5vQ2hhbmdlU3VjY2VzcycpXG4gICkge1xuICAgIGlmIChzZXJ2aWNlUGFyYW1zICE9IG51bGwgJiYgc2VydmljZVBhcmFtcy5taXNzaW5nRXhwb3J0cykge1xuICAgICAgc2hvd01pc3NpbmdFeHBvcnRzTm90aWZpY2F0aW9uKHNlcnZpY2VQYXJhbXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaG93U3VjY2Vzc05vdGlmaWNhdGlvbihzZXJ2aWNlUGFyYW1zKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtvdXRwdXRTb3VyY2V9O1xufVxuXG5jb25zdCBFUlJPUl9USVRMRSA9IHNlcnZpY2VQYXJhbXMgPT4gbm90aWZpY2F0aW9uVGl0bGUoc2VydmljZVBhcmFtcywgJ2ZhaWxlZCcpO1xuXG5mdW5jdGlvbiBzaG93RXJyb3JOb3RpZmljYXRpb24oZXJyb3I6IEVycm9yLCBzZXJ2aWNlUGFyYW1zOiBTZXJ2aWNlUGFyYW1zKTogdm9pZCB7XG4gIGNvbnN0IHRpdGxlID0gRVJST1JfVElUTEUoc2VydmljZVBhcmFtcyk7XG4gIGRpc21pc3NOb3RpZmljYXRpb24odGl0bGUpO1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IodGl0bGUsIHtcbiAgICBkZXRhaWw6IGVycm9yLnRvU3RyaW5nKCksXG4gICAgc3RhY2s6IGVycm9yLnN0YWNrLFxuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICB9KTtcbn1cblxuY29uc3QgU1VDQ0VTU19USVRMRSA9IHNlcnZpY2VQYXJhbXMgPT4gbm90aWZpY2F0aW9uVGl0bGUoc2VydmljZVBhcmFtcywgJ3N1Y2NlZWRlZCcpO1xuXG5jb25zdCBub3RpZmljYXRpb25UaW1lb3V0cyA9IHt9O1xuZnVuY3Rpb24gc2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24oc2VydmljZVBhcmFtczogU2VydmljZVBhcmFtcyk6IHZvaWQge1xuICBjb25zdCB0aXRsZSA9IFNVQ0NFU1NfVElUTEUoc2VydmljZVBhcmFtcyk7XG4gIGRpc21pc3NFeGlzdGluZ05vdGlmaWNhdGlvbih0aXRsZSk7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKHRpdGxlLCB7XG4gICAgZGV0YWlsOiAnTm8gY2hhbmdlcyB3ZXJlIG5lZWRlZC4nLFxuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICB9KTtcbiAgdGltZW91dE5vdGlmaWNhdGlvbih0aXRsZSk7XG59XG5cbmZ1bmN0aW9uIHRpbWVvdXROb3RpZmljYXRpb24odGl0bGU6IHN0cmluZykge1xuICBub3RpZmljYXRpb25UaW1lb3V0c1t0aXRsZV0gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBkaXNtaXNzRXhpc3RpbmdOb3RpZmljYXRpb24odGl0bGUpO1xuICB9LCAyMDAwKTtcbn1cblxuZnVuY3Rpb24gZGlzbWlzc0V4aXN0aW5nTm90aWZpY2F0aW9uKHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgZGlzbWlzc05vdGlmaWNhdGlvbih0aXRsZSk7XG4gIGNsZWFyVGltZW91dChub3RpZmljYXRpb25UaW1lb3V0c1t0aXRsZV0pO1xufVxuXG5jb25zdCBJTkZPX1RJVExFID0gc2VydmljZVBhcmFtcyA9PlxuICBub3RpZmljYXRpb25UaXRsZShzZXJ2aWNlUGFyYW1zLCAnY291bGRuXFwndCBmaXggYWxsIHByb2JsZW1zJyk7XG5cbmZ1bmN0aW9uIHNob3dNaXNzaW5nRXhwb3J0c05vdGlmaWNhdGlvbihzZXJ2aWNlUGFyYW1zOiBTZXJ2aWNlUGFyYW1zKTogdm9pZCB7XG4gIGNvbnN0IHRpdGxlID0gSU5GT19USVRMRShzZXJ2aWNlUGFyYW1zKTtcbiAgZGlzbWlzc05vdGlmaWNhdGlvbih0aXRsZSk7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKHRpdGxlLCB7XG4gICAgZGV0YWlsOiAnRXhwb3J0cyBmb3IgdGhlc2UgcmVmZXJlbmNlcyBjb3VsZG5cXCd0IGJlIGRldGVybWluZWQuICcgK1xuICAgICAgJ0VpdGhlciB0aGVyZSBhcmUgbXVsdGlwbGUgcG9zc2libGUgZXhwb3J0IGNhbmRpZGF0ZXMsICcgK1xuICAgICAgJ29yIG5vbmUgZXhpc3QsIG9yIHRoZSBMYW5ndWFnZSBTZXJ2ZXIgb3IgRmxvdyBhcmUgc3RpbGwgJyArXG4gICAgICAnaW5pdGlhbGl6aW5nLicsXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaXNtaXNzTm90aWZpY2F0aW9uKHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKVxuICAgIC5maWx0ZXIobm90aWZpY2F0aW9uID0+IG5vdGlmaWNhdGlvbi5nZXRNZXNzYWdlKCkgPT09IHRpdGxlKVxuICAgIC5mb3JFYWNoKG5vdGlmaWNhdGlvbiA9PiBub3RpZmljYXRpb24uZGlzbWlzcygpKTtcbn1cblxuZnVuY3Rpb24gbm90aWZpY2F0aW9uVGl0bGUoc2VydmljZVBhcmFtczogU2VydmljZVBhcmFtcywgbWVzc2FnZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIChcbiAgICAoc2VydmljZVBhcmFtcyAhPSBudWxsXG4gICAgICA/ICdOdWNsaWRlIEpTIEltcG9ydHM6IEF1dG8gUmVxdWlyZSAnXG4gICAgICA6ICdOdWNsaWRlIEZvcm1hdCBKUzogRml4IFJlcXVpcmVzJykgK1xuICAgIG1lc3NhZ2VcbiAgKTtcbn1cblxuZnVuY3Rpb24gc3ludGF4RXJyb3JQb3NpdGlvbihlcnJvcjogRXJyb3JXaXRoTG9jYXRpb24pOiA/W251bWJlciwgbnVtYmVyXSB7XG4gIGNvbnN0IHtsaW5lLCBjb2x1bW59ID0gZXJyb3IubG9jIHx8IHt9O1xuICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihsaW5lKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKGNvbHVtbilcbiAgICA/IFtsaW5lIC0gMSwgY29sdW1uXVxuICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlKFxuICBzb3VyY2VPcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuICBzZXJ2aWNlUGFyYW1zOiBTZXJ2aWNlUGFyYW1zLFxuKTogU291cmNlT3B0aW9ucyB7XG4gIGNvbnN0IGJsYWNrbGlzdCA9IG5ldyBTZXQoc291cmNlT3B0aW9ucy5ibGFja2xpc3QpO1xuICBpZiAoc2VydmljZVBhcmFtcyAhPSBudWxsKSB7XG4gICAgYmxhY2tsaXN0XG4gICAgICAuYWRkKCdyZXF1aXJlcy5hZGRNaXNzaW5nUmVxdWlyZXMnKVxuICAgICAgLmFkZCgncmVxdWlyZXMuYWRkTWlzc2luZ1R5cGVzJyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICAuLi5zb3VyY2VPcHRpb25zLFxuICAgIGJsYWNrbGlzdCxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRDb2RlO1xuIl19