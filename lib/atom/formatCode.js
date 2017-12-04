'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

            _transformCodeOrShowE = transformCodeOrShowError(inputSource, options, parameters), outputSource = _transformCodeOrShowE.outputSource, error = _transformCodeOrShowE.error;

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

function transformCodeOrShowError(inputSource, options, parameters) {
  var _require = require('../common'),
      transform = _require.transform;
  // TODO: Add a limit so the transform is not run on files over a certain size.


  var outputSource = void 0;
  try {
    outputSource = transform(inputSource, options);
  } catch (error) {
    showErrorNotification(error, parameters);
    return { outputSource: inputSource, error: error };
  }
  dismissNotification(ERROR_TITLE(parameters));
  dismissNotification(INFO_TITLE(parameters));
  if (outputSource === inputSource &&
  // Do not confirm success if user opted out
  atom.config.get('nuclide-format-js.confirmNoChangeSuccess')) {
    if (parameters.missingExports) {
      showMissingExportsNotification(parameters);
    } else {
      showSuccessNotification(parameters);
    }
  }
  return { outputSource: outputSource };
}

var ERROR_TITLE = function ERROR_TITLE(parameters) {
  return notificationTitle(parameters, 'failed');
};

function showErrorNotification(error, parameters) {
  var title = ERROR_TITLE(parameters);
  dismissNotification(title);
  atom.notifications.addError(title, {
    detail: error.toString(),
    stack: error.stack,
    dismissable: true
  });
}

var SUCCESS_TITLE = function SUCCESS_TITLE(parameters) {
  return notificationTitle(parameters, 'succeeded');
};

var notificationTimeouts = {};
function showSuccessNotification(parameters) {
  var title = SUCCESS_TITLE(parameters);
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

var INFO_TITLE = function INFO_TITLE(parameters) {
  return notificationTitle(parameters, 'couldn\'t fix all problems');
};

function showMissingExportsNotification(parameters) {
  var title = INFO_TITLE(parameters);
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

function notificationTitle(parameters, message) {
  return (parameters.addedRequires != null ? 'Nuclide JS Imports: Auto Require ' : 'Nuclide Format JS: Fix Requires') + message;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2Zvcm1hdENvZGUuanMiXSwibmFtZXMiOlsic291cmNlT3B0aW9ucyIsInBhcmFtZXRlcnMiLCJlZGl0b3IiLCJhdG9tIiwid29ya3NwYWNlIiwiZ2V0QWN0aXZlVGV4dEVkaXRvciIsImNvbnNvbGUiLCJsb2ciLCJvcHRpb25zIiwiZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlIiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwiaW5wdXRTb3VyY2UiLCJnZXRUZXh0IiwidHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yIiwib3V0cHV0U291cmNlIiwiZXJyb3IiLCJjb25maWciLCJnZXQiLCJwb3NpdGlvbiIsInN5bnRheEVycm9yUG9zaXRpb24iLCJzZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInNldFRleHRWaWFEaWZmIiwic2F2ZSIsImZvcm1hdENvZGUiLCJyZXF1aXJlIiwidHJhbnNmb3JtIiwic2hvd0Vycm9yTm90aWZpY2F0aW9uIiwiZGlzbWlzc05vdGlmaWNhdGlvbiIsIkVSUk9SX1RJVExFIiwiSU5GT19USVRMRSIsIm1pc3NpbmdFeHBvcnRzIiwic2hvd01pc3NpbmdFeHBvcnRzTm90aWZpY2F0aW9uIiwic2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24iLCJub3RpZmljYXRpb25UaXRsZSIsInRpdGxlIiwibm90aWZpY2F0aW9ucyIsImFkZEVycm9yIiwiZGV0YWlsIiwidG9TdHJpbmciLCJzdGFjayIsImRpc21pc3NhYmxlIiwiU1VDQ0VTU19USVRMRSIsIm5vdGlmaWNhdGlvblRpbWVvdXRzIiwiZGlzbWlzc0V4aXN0aW5nTm90aWZpY2F0aW9uIiwiYWRkU3VjY2VzcyIsInRpbWVvdXROb3RpZmljYXRpb24iLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiYWRkSW5mbyIsImdldE5vdGlmaWNhdGlvbnMiLCJmaWx0ZXIiLCJub3RpZmljYXRpb24iLCJnZXRNZXNzYWdlIiwiZm9yRWFjaCIsImRpc21pc3MiLCJtZXNzYWdlIiwiYWRkZWRSZXF1aXJlcyIsImxvYyIsImxpbmUiLCJjb2x1bW4iLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJibGFja2xpc3QiLCJTZXQiLCJhZGQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozt1REFxQkEsaUJBQ0VBLGFBREY7QUFBQSxRQUVFQyxVQUZGLHVFQU1NLEVBTk47O0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRUUMsa0JBUlIsR0FRaUJELFdBQVdDLE1BQVgsSUFBcUJDLEtBQUtDLFNBQUwsQ0FBZUMsbUJBQWYsRUFSdEM7O0FBQUEsZ0JBU09ILE1BVFA7QUFBQTtBQUFBO0FBQUE7O0FBVUk7QUFDQUksb0JBQVFDLEdBQVIsQ0FBWSxvQ0FBWjtBQVhKOztBQUFBO0FBZVFDLG1CQWZSLEdBZWtCQywrQkFBK0JULGFBQS9CLEVBQThDQyxVQUE5QyxDQWZsQjs7QUFpQkU7O0FBQ01TLGtCQWxCUixHQWtCaUJSLE9BQU9TLFNBQVAsRUFsQmpCO0FBbUJRQyx1QkFuQlIsR0FtQnNCRixPQUFPRyxPQUFQLEVBbkJ0Qjs7QUFxQkU7O0FBckJGLG9DQXNCZ0NDLHlCQUM1QkYsV0FENEIsRUFFNUJKLE9BRjRCLEVBRzVCUCxVQUg0QixDQXRCaEMsRUFzQlNjLFlBdEJULHlCQXNCU0EsWUF0QlQsRUFzQnVCQyxLQXRCdkIseUJBc0J1QkEsS0F0QnZCOztBQTRCRTs7QUFDQSxnQkFBSUEsU0FBU2IsS0FBS2MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLDJDQUFoQixDQUFiLEVBQTJFO0FBQ25FQyxzQkFEbUUsR0FDeERDLG9CQUFvQkosS0FBcEIsQ0FEd0Q7O0FBRXpFLGtCQUFJRyxRQUFKLEVBQWM7QUFDWmpCLHVCQUFPbUIsdUJBQVAsQ0FBK0JGLFFBQS9CO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBOztBQXJDRixrQkFzQ01KLGlCQUFpQkgsV0F0Q3ZCO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBOztBQTBDRUYsbUJBQU9ZLGNBQVAsQ0FBc0JQLFlBQXRCOztBQUVBO0FB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SCxDQUVPLDBCQUZQO0FBR0Q7QUFDRCxzQkFDS2pFLGFBREw7QUFFRStEO0FBRkY7QUFJRDs7QUFFREcsT0FBT0MsT0FBUCxHQUFpQjNDLFVBQWpCIiwiZmlsZSI6ImZvcm1hdENvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGZsb3dcbiAqL1xuXG4vKiBnbG9iYWxzIGF0b20gKi9cblxuaW1wb3J0IHR5cGUge1NvdXJjZU9wdGlvbnN9IGZyb20gJy4uL2NvbW1vbi9vcHRpb25zL1NvdXJjZU9wdGlvbnMnO1xuXG50eXBlIEVycm9yV2l0aExvY2F0aW9uID0ge2xvYz86IHtsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyfX07XG5cbnR5cGUgU2VydmljZVBhcmFtcyA9IHtcbiAgYWRkZWRSZXF1aXJlcz86IGJvb2xlYW4sXG4gIG1pc3NpbmdFeHBvcnRzPzogYm9vbGVhbixcbn07XG5cbmFzeW5jIGZ1bmN0aW9uIGZvcm1hdENvZGUoXG4gIHNvdXJjZU9wdGlvbnM6IFNvdXJjZU9wdGlvbnMsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBhZGRlZFJlcXVpcmVzPzogYm9vbGVhbixcbiAgICBtaXNzaW5nRXhwb3J0cz86IGJvb2xlYW4sXG4gICAgZWRpdG9yPzogVGV4dEVkaXRvcixcbiAgfSA9IHt9LFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGVkaXRvciA9IHBhcmFtZXRlcnMuZWRpdG9yIHx8IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgaWYgKCFlZGl0b3IpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKCctIGZvcm1hdC1qczogTm8gYWN0aXZlIHRleHQgZWRpdG9yJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgb3B0aW9ucyA9IGRvbnRBZGRSZXF1aXJlc0lmVXNlZEFzU2VydmljZShzb3VyY2VPcHRpb25zLCBwYXJhbWV0ZXJzKTtcblxuICAvLyBTYXZlIHRoaW5nc1xuICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gIGNvbnN0IGlucHV0U291cmNlID0gYnVmZmVyLmdldFRleHQoKTtcblxuICAvLyBBdXRvLXJlcXVpcmUgdHJhbnNmb3JtLlxuICBjb25zdCB7b3V0cHV0U291cmNlLCBlcnJvcn0gPSB0cmFuc2Zvcm1Db2RlT3JTaG93RXJyb3IoXG4gICAgaW5wdXRTb3VyY2UsXG4gICAgb3B0aW9ucyxcbiAgICBwYXJhbWV0ZXJzLFxuICApO1xuXG4gIC8vIFVwZGF0ZSBwb3NpdGlvbiBpZiBzb3VyY2UgaGFzIGEgc3ludGF4IGVycm9yXG4gIGlmIChlcnJvciAmJiBhdG9tLmNvbmZpZy5nZXQoJ251Y2xpZGUtZm9ybWF0LWpzLm1vdmVDdXJzb3JUb1N5bnRheEVycm9yJykpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHN5bnRheEVycm9yUG9zaXRpb24oZXJyb3IpO1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIHNvdXJjZSBhbmQgcG9zaXRpb24gYWZ0ZXIgYWxsIHRyYW5zZm9ybXMgYXJlIGRvbmUuIERvIG5vdGhpbmdcbiAgLy8gaWYgdGhlIHNvdXJjZSBkaWQgbm90IGNoYW5nZSBhdCBhbGwuXG4gIGlmIChvdXRwdXRTb3VyY2UgPT09IGlucHV0U291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYnVmZmVyLnNldFRleHRWaWFEaWZmKG91dHB1dFNvdXJjZSk7XG5cbiAgLy8gU2F2ZSB0aGUgZmlsZSBpZiB0aGF0IG9wdGlvbiBpcyBzcGVjaWZpZWQuXG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ251Y2xpZGUtZm9ybWF0LWpzLnNhdmVBZnRlclJ1bicpKSB7XG4gICAgZWRpdG9yLnNhdmUoKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybUNvZGVPclNob3dFcnJvcihcbiAgaW5wdXRTb3VyY2U6IHN0cmluZyxcbiAgb3B0aW9uczogU291cmNlT3B0aW9ucyxcbiAgcGFyYW1ldGVyczogU2VydmljZVBhcmFtcyxcbik6IHtvdXRwdXRTb3VyY2U6IHN0cmluZywgZXJyb3I/OiBFcnJvcldpdGhMb2NhdGlvbn0ge1xuICBjb25zdCB7dHJhbnNmb3JtfSA9IHJlcXVpcmUoJy4uL2NvbW1vbicpO1xuICAvLyBUT0RPOiBBZGQgYSBsaW1pdCBzbyB0aGUgdHJhbnNmb3JtIGlzIG5vdCBydW4gb24gZmlsZXMgb3ZlciBhIGNlcnRhaW4gc2l6ZS5cbiAgbGV0IG91dHB1dFNvdXJjZTtcbiAgdHJ5IHtcbiAgICBvdXRwdXRTb3VyY2UgPSB0cmFuc2Zvcm0oaW5wdXRTb3VyY2UsIG9wdGlvbnMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHNob3dFcnJvck5vdGlmaWNhdGlvbihlcnJvciwgcGFyYW1ldGVycyk7XG4gICAgcmV0dXJuIHtvdXRwdXRTb3VyY2U6IGlucHV0U291cmNlLCBlcnJvcn07XG4gIH1cbiAgZGlzbWlzc05vdGlmaWNhdGlvbihFUlJPUl9USVRMRShwYXJhbWV0ZXJzKSk7XG4gIGRpc21pc3NOb3RpZmljYXRpb24oSU5GT19USVRMRShwYXJhbWV0ZXJzKSk7XG4gIGlmIChcbiAgICBvdXRwdXRTb3VyY2UgPT09IGlucHV0U291cmNlICYmXG4gICAgLy8gRG8gbm90IGNvbmZpcm0gc3VjY2VzcyBpZiB1c2VyIG9wdGVkIG91dFxuICAgIGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mb3JtYXQtanMuY29uZmlybU5vQ2hhbmdlU3VjY2VzcycpXG4gICkge1xuICAgIGlmIChwYXJhbWV0ZXJzLm1pc3NpbmdFeHBvcnRzKSB7XG4gICAgICBzaG93TWlzc2luZ0V4cG9ydHNOb3RpZmljYXRpb24ocGFyYW1ldGVycyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3dTdWNjZXNzTm90aWZpY2F0aW9uKHBhcmFtZXRlcnMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge291dHB1dFNvdXJjZX07XG59XG5cbmNvbnN0IEVSUk9SX1RJVExFID0gcGFyYW1ldGVycyA9PiBub3RpZmljYXRpb25UaXRsZShwYXJhbWV0ZXJzLCAnZmFpbGVkJyk7XG5cbmZ1bmN0aW9uIHNob3dFcnJvck5vdGlmaWNhdGlvbihlcnJvcjogRXJyb3IsIHBhcmFtZXRlcnM6IFNlcnZpY2VQYXJhbXMpOiB2b2lkIHtcbiAgY29uc3QgdGl0bGUgPSBFUlJPUl9USVRMRShwYXJhbWV0ZXJzKTtcbiAgZGlzbWlzc05vdGlmaWNhdGlvbih0aXRsZSk7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcih0aXRsZSwge1xuICAgIGRldGFpbDogZXJyb3IudG9TdHJpbmcoKSxcbiAgICBzdGFjazogZXJyb3Iuc3RhY2ssXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gIH0pO1xufVxuXG5jb25zdCBTVUNDRVNTX1RJVExFID0gcGFyYW1ldGVycyA9PiBub3RpZmljYXRpb25UaXRsZShwYXJhbWV0ZXJzLCAnc3VjY2VlZGVkJyk7XG5cbmNvbnN0IG5vdGlmaWNhdGlvblRpbWVvdXRzID0ge307XG5mdW5jdGlvbiBzaG93U3VjY2Vzc05vdGlmaWNhdGlvbihwYXJhbWV0ZXJzOiBTZXJ2aWNlUGFyYW1zKTogdm9pZCB7XG4gIGNvbnN0IHRpdGxlID0gU1VDQ0VTU19USVRMRShwYXJhbWV0ZXJzKTtcbiAgZGlzbWlzc0V4aXN0aW5nTm90aWZpY2F0aW9uKHRpdGxlKTtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3ModGl0bGUsIHtcbiAgICBkZXRhaWw6ICdObyBjaGFuZ2VzIHdlcmUgbmVlZGVkLicsXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gIH0pO1xuICB0aW1lb3V0Tm90aWZpY2F0aW9uKHRpdGxlKTtcbn1cblxuZnVuY3Rpb24gdGltZW91dE5vdGlmaWNhdGlvbih0aXRsZTogc3RyaW5nKSB7XG4gIG5vdGlmaWNhdGlvblRpbWVvdXRzW3RpdGxlXSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGRpc21pc3NFeGlzdGluZ05vdGlmaWNhdGlvbih0aXRsZSk7XG4gIH0sIDIwMDApO1xufVxuXG5mdW5jdGlvbiBkaXNtaXNzRXhpc3RpbmdOb3RpZmljYXRpb24odGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICBkaXNtaXNzTm90aWZpY2F0aW9uKHRpdGxlKTtcbiAgY2xlYXJUaW1lb3V0KG5vdGlmaWNhdGlvblRpbWVvdXRzW3RpdGxlXSk7XG59XG5cbmNvbnN0IElORk9fVElUTEUgPSBwYXJhbWV0ZXJzID0+XG4gIG5vdGlmaWNhdGlvblRpdGxlKHBhcmFtZXRlcnMsICdjb3VsZG5cXCd0IGZpeCBhbGwgcHJvYmxlbXMnKTtcblxuZnVuY3Rpb24gc2hvd01pc3NpbmdFeHBvcnRzTm90aWZpY2F0aW9uKHBhcmFtZXRlcnM6IFNlcnZpY2VQYXJhbXMpOiB2b2lkIHtcbiAgY29uc3QgdGl0bGUgPSBJTkZPX1RJVExFKHBhcmFtZXRlcnMpO1xuICBkaXNtaXNzTm90aWZpY2F0aW9uKHRpdGxlKTtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8odGl0bGUsIHtcbiAgICBkZXRhaWw6ICdFeHBvcnRzIGZvciB0aGVzZSByZWZlcmVuY2VzIGNvdWxkblxcJ3QgYmUgZGV0ZXJtaW5lZC4gJyArXG4gICAgICAnRWl0aGVyIHRoZXJlIGFyZSBtdWx0aXBsZSBwb3NzaWJsZSBleHBvcnQgY2FuZGlkYXRlcywgJyArXG4gICAgICAnb3Igbm9uZSBleGlzdCwgb3IgdGhlIExhbmd1YWdlIFNlcnZlciBvciBGbG93IGFyZSBzdGlsbCAnICtcbiAgICAgICdpbml0aWFsaXppbmcuJyxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc21pc3NOb3RpZmljYXRpb24odGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuZ2V0Tm90aWZpY2F0aW9ucygpXG4gICAgLmZpbHRlcihub3RpZmljYXRpb24gPT4gbm90aWZpY2F0aW9uLmdldE1lc3NhZ2UoKSA9PT0gdGl0bGUpXG4gICAgLmZvckVhY2gobm90aWZpY2F0aW9uID0+IG5vdGlmaWNhdGlvbi5kaXNtaXNzKCkpO1xufVxuXG5mdW5jdGlvbiBub3RpZmljYXRpb25UaXRsZShwYXJhbWV0ZXJzOiBTZXJ2aWNlUGFyYW1zLCBtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gKFxuICAgIChwYXJhbWV0ZXJzLmFkZGVkUmVxdWlyZXMgIT0gbnVsbFxuICAgICAgPyAnTnVjbGlkZSBKUyBJbXBvcnRzOiBBdXRvIFJlcXVpcmUgJ1xuICAgICAgOiAnTnVjbGlkZSBGb3JtYXQgSlM6IEZpeCBSZXF1aXJlcycpICtcbiAgICBtZXNzYWdlXG4gICk7XG59XG5cbmZ1bmN0aW9uIHN5bnRheEVycm9yUG9zaXRpb24oZXJyb3I6IEVycm9yV2l0aExvY2F0aW9uKTogP1tudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCB7bGluZSwgY29sdW1ufSA9IGVycm9yLmxvYyB8fCB7fTtcbiAgcmV0dXJuIE51bWJlci5pc0ludGVnZXIobGluZSkgJiYgTnVtYmVyLmlzSW50ZWdlcihjb2x1bW4pXG4gICAgPyBbbGluZSAtIDEsIGNvbHVtbl1cbiAgICA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGRvbnRBZGRSZXF1aXJlc0lmVXNlZEFzU2VydmljZShcbiAgc291cmNlT3B0aW9uczogU291cmNlT3B0aW9ucyxcbiAgcGFyYW1ldGVyczoge2FkZGVkUmVxdWlyZXM/OiBib29sZWFufSxcbik6IFNvdXJjZU9wdGlvbnMge1xuICBjb25zdCBibGFja2xpc3QgPSBuZXcgU2V0KHNvdXJjZU9wdGlvbnMuYmxhY2tsaXN0KTtcbiAgaWYgKHBhcmFtZXRlcnMuYWRkZWRSZXF1aXJlcyAhPSBudWxsKSB7XG4gICAgYmxhY2tsaXN0XG4gICAgICAuYWRkKCdyZXF1aXJlcy5hZGRNaXNzaW5nUmVxdWlyZXMnKVxuICAgICAgLmFkZCgncmVxdWlyZXMuYWRkTWlzc2luZ1R5cGVzJyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICAuLi5zb3VyY2VPcHRpb25zLFxuICAgIGJsYWNrbGlzdCxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXRDb2RlO1xuIl19