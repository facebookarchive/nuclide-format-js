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
  if (outputSource === inputSource &&
  // Do not confirm success if user opted out
  atom.config.get('nuclide-format-js.confirmNoChangeSuccess')) {
    if (serviceParams != null && serviceParams.missingExports && (parsingInfo.missingTypes || parsingInfo.missingRequires)) {
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
  return _extends({}, sourceOptions, {
    dontAddMissing: serviceParams != null
  });
}

module.exports = formatCode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2Zvcm1hdENvZGUuanMiXSwibmFtZXMiOlsic291cmNlT3B0aW9ucyIsInNlcnZpY2VQYXJhbXMiLCJ0YXJnZXRFZGl0b3IiLCJlZGl0b3IiLCJhdG9tIiwid29ya3NwYWNlIiwiZ2V0QWN0aXZlVGV4dEVkaXRvciIsImNvbnNvbGUiLCJsb2ciLCJvcHRpb25zIiwiZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlIiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwiaW5wdXRTb3VyY2UiLCJnZXRUZXh0IiwidHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yIiwib3V0cHV0U291cmNlIiwiZXJyb3IiLCJjb25maWciLCJnZXQiLCJwb3NpdGlvbiIsInN5bnRheEVycm9yUG9zaXRpb24iLCJzZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInNldFRleHRWaWFEaWZmIiwic2F2ZSIsImZvcm1hdENvZGUiLCJ0cmFuc2Zvcm0iLCJyZXF1aXJlIiwicGFyc2luZ0luZm8iLCJyZXN1bHQiLCJvdXRwdXQiLCJpbmZvIiwic2hvd0Vycm9yTm90aWZpY2F0aW9uIiwiZGlzbWlzc05vdGlmaWNhdGlvbiIsIkVSUk9SX1RJVExFIiwiSU5GT19USVRMRSIsIm1pc3NpbmdFeHBvcnRzIiwibWlzc2luZ1R5cGVzIiwibWlzc2luZ1JlcXVpcmVzIiwic2hvd01pc3NpbmdFeHBvcnRzTm90aWZpY2F0aW9uIiwic2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24iLCJub3RpZmljYXRpb25UaXRsZSIsInRpdGxlIiwibm90aWZpY2F0aW9ucyIsImFkZEVycm9yIiwiZGV0YWlsIiwidG9TdHJpbmciLCJzdGFjayIsImRpc21pc3NhYmxlIiwiU1VDQ0VTU19USVRMRSIsIm5vdGlmaWNhdGlvblRpbWVvdXRzIiwiZGlzbWlzc0V4aXN0aW5nTm90aWZpY2F0aW9uIiwiYWRkU3VjY2VzcyIsInRpbWVvdXROb3RpZmljYXRpb24iLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiYWRkSW5mbyIsImdldE5vdGlmaWNhdGlvbnMiLCJmaWx0ZXIiLCJub3RpZmljYXRpb24iLCJnZXRNZXNzYWdlIiwiZm9yRWFjaCIsImRpc21pc3MiLCJtZXNzYWdlIiwibG9jIiwibGluZSIsImNvbHVtbiIsIk51bWJlciIsImlzSW50ZWdlciIsImRvbnRBZGRNaXNzaW5nIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7dURBcUJBLGlCQUNFQSxhQURGLEVBRUVDLGFBRkYsRUFHRUMsWUFIRjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS1FDLGtCQUxSLEdBS2lCRCxnQkFBZ0JFLEtBQUtDLFNBQUwsQ0FBZUMsbUJBQWYsRUFMakM7O0FBQUEsZ0JBTU9ILE1BTlA7QUFBQTtBQUFBO0FBQUE7O0FBT0k7QUFDQUksb0JBQVFDLEdBQVIsQ0FBWSxvQ0FBWjtBQVJKOztBQUFBO0FBWVFDLG1CQVpSLEdBWWtCQywrQkFBK0JWLGFBQS9CLEVBQThDQyxhQUE5QyxDQVpsQjs7QUFjRTs7QUFDTVUsa0JBZlIsR0FlaUJSLE9BQU9TLFNBQVAsRUFmakI7QUFnQlFDLHVCQWhCUixHQWdCc0JGLE9BQU9HLE9BQVAsRUFoQnRCOztBQWtCRTs7QUFsQkYsb0NBbUJnQ0MseUJBQzVCRixXQUQ0QixFQUU1QkosT0FGNEIsRUFHNUJSLGFBSDRCLENBbkJoQyxFQW1CU2UsWUFuQlQseUJBbUJTQSxZQW5CVCxFQW1CdUJDLEtBbkJ2Qix5QkFtQnVCQSxLQW5CdkI7O0FBeUJFOztBQUNBLGdCQUFJQSxTQUFTYixLQUFLYyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsMkNBQWhCLENBQWIsRUFBMkU7QUFDbkVDLHNCQURtRSxHQUN4REMsb0JBQW9CSixLQUFwQixDQUR3RDs7QUFFekUsa0JBQUlHLFFBQUosRUFBYztBQUNaakIsdUJBQU9tQix1QkFBUCxDQUErQkYsUUFBL0I7QUFDRDtBQUNGOztBQUVEO0FBQ0E7O0FBbENGLGtCQW1DTUosaUJBQWlCSCxXQW5DdkI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7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LGFBRkYsRUFHaUI7QUFDZixzQkFDS0QsYUFETDtBQUVFcUUsb0JBQWdCcEUsaUJBQWlCO0FBRm5DO0FBSUQ7O0FBRURxRSxPQUFPQyxPQUFQLEdBQWlCOUMsVUFBakIiLCJmaWxlIjoiZm9ybWF0Q29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbi8qIGdsb2JhbHMgYXRvbSAqL1xuXG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vY29tbW9uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbnR5cGUgRXJyb3JXaXRoTG9jYXRpb24gPSB7bG9jPzoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9fTtcblxudHlwZSBTZXJ2aWNlUGFyYW1zID0gP3tcbiAgYWRkZWRSZXF1aXJlczogYm9vbGVhbixcbiAgbWlzc2luZ0V4cG9ydHM6IGJvb2xlYW4sXG59O1xuXG5hc3luYyBmdW5jdGlvbiBmb3JtYXRDb2RlKFxuICBzb3VyY2VPcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuICBzZXJ2aWNlUGFyYW1zOiBTZXJ2aWNlUGFyYW1zLFxuICB0YXJnZXRFZGl0b3I/OiBUZXh0RWRpdG9yLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGVkaXRvciA9IHRhcmdldEVkaXRvciB8fCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gIGlmICghZWRpdG9yKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZygnLSBmb3JtYXQtanM6IE5vIGFjdGl2ZSB0ZXh0IGVkaXRvcicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG9wdGlvbnMgPSBkb250QWRkUmVxdWlyZXNJZlVzZWRBc1NlcnZpY2Uoc291cmNlT3B0aW9ucywgc2VydmljZVBhcmFtcyk7XG5cbiAgLy8gU2F2ZSB0aGluZ3NcbiAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICBjb25zdCBpbnB1dFNvdXJjZSA9IGJ1ZmZlci5nZXRUZXh0KCk7XG5cbiAgLy8gQXV0by1yZXF1aXJlIHRyYW5zZm9ybS5cbiAgY29uc3Qge291dHB1dFNvdXJjZSwgZXJyb3J9ID0gdHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yKFxuICAgIGlucHV0U291cmNlLFxuICAgIG9wdGlvbnMsXG4gICAgc2VydmljZVBhcmFtcyxcbiAgKTtcblxuICAvLyBVcGRhdGUgcG9zaXRpb24gaWYgc291cmNlIGhhcyBhIHN5bnRheCBlcnJvclxuICBpZiAoZXJyb3IgJiYgYXRvbS5jb25maWcuZ2V0KCdudWNsaWRlLWZvcm1hdC1qcy5tb3ZlQ3Vyc29yVG9TeW50YXhFcnJvcicpKSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSBzeW50YXhFcnJvclBvc2l0aW9uKGVycm9yKTtcbiAgICBpZiAocG9zaXRpb24pIHtcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLy8gVXBkYXRlIHRoZSBzb3VyY2UgYW5kIHBvc2l0aW9uIGFmdGVyIGFsbCB0cmFuc2Zvcm1zIGFyZSBkb25lLiBEbyBub3RoaW5nXG4gIC8vIGlmIHRoZSBzb3VyY2UgZGlkIG5vdCBjaGFuZ2UgYXQgYWxsLlxuICBpZiAob3V0cHV0U291cmNlID09PSBpbnB1dFNvdXJjZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGJ1ZmZlci5zZXRUZXh0VmlhRGlmZihvdXRwdXRTb3VyY2UpO1xuXG4gIC8vIFNhdmUgdGhlIGZpbGUgaWYgdGhhdCBvcHRpb24gaXMgc3BlY2lmaWVkLlxuICBpZiAoYXRvbS5jb25maWcuZ2V0KCdudWNsaWRlLWZvcm1hdC1qcy5zYXZlQWZ0ZXJSdW4nKSkge1xuICAgIGVkaXRvci5zYXZlKCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Db2RlT3JTaG93RXJyb3IoXG4gIGlucHV0U291cmNlOiBzdHJpbmcsXG4gIG9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4gIHNlcnZpY2VQYXJhbXM6IFNlcnZpY2VQYXJhbXMsXG4pOiB7b3V0cHV0U291cmNlOiBzdHJpbmcsIGVycm9yPzogRXJyb3JXaXRoTG9jYXRpb259IHtcbiAgY29uc3QgdHJhbnNmb3JtID0gcmVxdWlyZSgnLi4vY29tbW9uL3RyYW5zZm9ybScpO1xuICAvLyBUT0RPOiBBZGQgYSBsaW1pdCBzbyB0aGUgdHJhbnNmb3JtIGlzIG5vdCBydW4gb24gZmlsZXMgb3ZlciBhIGNlcnRhaW4gc2l6ZS5cbiAgbGV0IG91dHB1dFNvdXJjZTtcbiAgbGV0IHBhcnNpbmdJbmZvO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybShpbnB1dFNvdXJjZSwgb3B0aW9ucyk7XG4gICAgb3V0cHV0U291cmNlID0gcmVzdWx0Lm91dHB1dDtcbiAgICBwYXJzaW5nSW5mbyA9IHJlc3VsdC5pbmZvO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHNob3dFcnJvck5vdGlmaWNhdGlvbihlcnJvciwgc2VydmljZVBhcmFtcyk7XG4gICAgcmV0dXJuIHtvdXRwdXRTb3VyY2U6IGlucHV0U291cmNlLCBlcnJvcn07XG4gIH1cbiAgZGlzbWlzc05vdGlmaWNhdGlvbihFUlJPUl9USVRMRShzZXJ2aWNlUGFyYW1zKSk7XG4gIGRpc21pc3NOb3RpZmljYXRpb24oSU5GT19USVRMRShzZXJ2aWNlUGFyYW1zKSk7XG4gIGlmIChcbiAgICBvdXRwdXRTb3VyY2UgPT09IGlucHV0U291cmNlICYmXG4gICAgLy8gRG8gbm90IGNvbmZpcm0gc3VjY2VzcyBpZiB1c2VyIG9wdGVkIG91dFxuICAgIGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mb3JtYXQtanMuY29uZmlybU5vQ2hhbmdlU3VjY2VzcycpXG4gICkge1xuICAgIGlmIChcbiAgICAgIHNlcnZpY2VQYXJhbXMgIT0gbnVsbCAmJlxuICAgICAgc2VydmljZVBhcmFtcy5taXNzaW5nRXhwb3J0cyAmJlxuICAgICAgKHBhcnNpbmdJbmZvLm1pc3NpbmdUeXBlcyB8fCBwYXJzaW5nSW5mby5taXNzaW5nUmVxdWlyZXMpXG4gICAgKSB7XG4gICAgICBzaG93TWlzc2luZ0V4cG9ydHNOb3RpZmljYXRpb24oc2VydmljZVBhcmFtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dTdWNjZXNzTm90aWZpY2F0aW9uKHNlcnZpY2VQYXJhbXMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge291dHB1dFNvdXJjZX07XG59XG5cbmNvbnN0IEVSUk9SX1RJVExFID0gc2VydmljZVBhcmFtcyA9PiBub3RpZmljYXRpb25UaXRsZShzZXJ2aWNlUGFyYW1zLCAnZmFpbGVkJyk7XG5cbmZ1bmN0aW9uIHNob3dFcnJvck5vdGlmaWNhdGlvbihlcnJvcjogRXJyb3IsIHNlcnZpY2VQYXJhbXM6IFNlcnZpY2VQYXJhbXMpOiB2b2lkIHtcbiAgY29uc3QgdGl0bGUgPSBFUlJPUl9USVRMRShzZXJ2aWNlUGFyYW1zKTtcbiAgZGlzbWlzc05vdGlmaWNhdGlvbih0aXRsZSk7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcih0aXRsZSwge1xuICAgIGRldGFpbDogZXJyb3IudG9TdHJpbmcoKSxcbiAgICBzdGFjazogZXJyb3Iuc3RhY2ssXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gIH0pO1xufVxuXG5jb25zdCBTVUNDRVNTX1RJVExFID0gc2VydmljZVBhcmFtcyA9PiBub3RpZmljYXRpb25UaXRsZShzZXJ2aWNlUGFyYW1zLCAnc3VjY2VlZGVkJyk7XG5cbmNvbnN0IG5vdGlmaWNhdGlvblRpbWVvdXRzID0ge307XG5mdW5jdGlvbiBzaG93U3VjY2Vzc05vdGlmaWNhdGlvbihzZXJ2aWNlUGFyYW1zOiBTZXJ2aWNlUGFyYW1zKTogdm9pZCB7XG4gIGNvbnN0IHRpdGxlID0gU1VDQ0VTU19USVRMRShzZXJ2aWNlUGFyYW1zKTtcbiAgZGlzbWlzc0V4aXN0aW5nTm90aWZpY2F0aW9uKHRpdGxlKTtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3ModGl0bGUsIHtcbiAgICBkZXRhaWw6ICdObyBjaGFuZ2VzIHdlcmUgbmVlZGVkLicsXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gIH0pO1xuICB0aW1lb3V0Tm90aWZpY2F0aW9uKHRpdGxlKTtcbn1cblxuZnVuY3Rpb24gdGltZW91dE5vdGlmaWNhdGlvbih0aXRsZTogc3RyaW5nKSB7XG4gIG5vdGlmaWNhdGlvblRpbWVvdXRzW3RpdGxlXSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGRpc21pc3NFeGlzdGluZ05vdGlmaWNhdGlvbih0aXRsZSk7XG4gIH0sIDIwMDApO1xufVxuXG5mdW5jdGlvbiBkaXNtaXNzRXhpc3RpbmdOb3RpZmljYXRpb24odGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICBkaXNtaXNzTm90aWZpY2F0aW9uKHRpdGxlKTtcbiAgY2xlYXJUaW1lb3V0KG5vdGlmaWNhdGlvblRpbWVvdXRzW3RpdGxlXSk7XG59XG5cbmNvbnN0IElORk9fVElUTEUgPSBzZXJ2aWNlUGFyYW1zID0+XG4gIG5vdGlmaWNhdGlvblRpdGxlKHNlcnZpY2VQYXJhbXMsICdjb3VsZG5cXCd0IGZpeCBhbGwgcHJvYmxlbXMnKTtcblxuZnVuY3Rpb24gc2hvd01pc3NpbmdFeHBvcnRzTm90aWZpY2F0aW9uKHNlcnZpY2VQYXJhbXM6IFNlcnZpY2VQYXJhbXMpOiB2b2lkIHtcbiAgY29uc3QgdGl0bGUgPSBJTkZPX1RJVExFKHNlcnZpY2VQYXJhbXMpO1xuICBkaXNtaXNzTm90aWZpY2F0aW9uKHRpdGxlKTtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8odGl0bGUsIHtcbiAgICBkZXRhaWw6ICdFeHBvcnRzIGZvciB0aGVzZSByZWZlcmVuY2VzIGNvdWxkblxcJ3QgYmUgZGV0ZXJtaW5lZC4gJyArXG4gICAgICAnRWl0aGVyIHRoZXJlIGFyZSBtdWx0aXBsZSBwb3NzaWJsZSBleHBvcnQgY2FuZGlkYXRlcywgJyArXG4gICAgICAnb3Igbm9uZSBleGlzdCwgb3IgdGhlIExhbmd1YWdlIFNlcnZlciBvciBGbG93IGFyZSBzdGlsbCAnICtcbiAgICAgICdpbml0aWFsaXppbmcuJyxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc21pc3NOb3RpZmljYXRpb24odGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuZ2V0Tm90aWZpY2F0aW9ucygpXG4gICAgLmZpbHRlcihub3RpZmljYXRpb24gPT4gbm90aWZpY2F0aW9uLmdldE1lc3NhZ2UoKSA9PT0gdGl0bGUpXG4gICAgLmZvckVhY2gobm90aWZpY2F0aW9uID0+IG5vdGlmaWNhdGlvbi5kaXNtaXNzKCkpO1xufVxuXG5mdW5jdGlvbiBub3RpZmljYXRpb25UaXRsZShzZXJ2aWNlUGFyYW1zOiBTZXJ2aWNlUGFyYW1zLCBtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gKFxuICAgIChzZXJ2aWNlUGFyYW1zICE9IG51bGxcbiAgICAgID8gJ051Y2xpZGUgSlMgSW1wb3J0czogQXV0byBSZXF1aXJlICdcbiAgICAgIDogJ051Y2xpZGUgRm9ybWF0IEpTOiBGaXggUmVxdWlyZXMnKSArXG4gICAgbWVzc2FnZVxuICApO1xufVxuXG5mdW5jdGlvbiBzeW50YXhFcnJvclBvc2l0aW9uKGVycm9yOiBFcnJvcldpdGhMb2NhdGlvbik6ID9bbnVtYmVyLCBudW1iZXJdIHtcbiAgY29uc3Qge2xpbmUsIGNvbHVtbn0gPSBlcnJvci5sb2MgfHwge307XG4gIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKGxpbmUpICYmIE51bWJlci5pc0ludGVnZXIoY29sdW1uKVxuICAgID8gW2xpbmUgLSAxLCBjb2x1bW5dXG4gICAgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBkb250QWRkUmVxdWlyZXNJZlVzZWRBc1NlcnZpY2UoXG4gIHNvdXJjZU9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4gIHNlcnZpY2VQYXJhbXM6IFNlcnZpY2VQYXJhbXMsXG4pOiBTb3VyY2VPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5zb3VyY2VPcHRpb25zLFxuICAgIGRvbnRBZGRNaXNzaW5nOiBzZXJ2aWNlUGFyYW1zICE9IG51bGwsXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybWF0Q29kZTtcbiJdfQ==