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
    blacklist.add('requires.addMissingRequires');
  }
  return _extends({}, sourceOptions, {
    blacklist: blacklist
  });
}

module.exports = formatCode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hdG9tL2Zvcm1hdENvZGUuanMiXSwibmFtZXMiOlsic291cmNlT3B0aW9ucyIsInBhcmFtZXRlcnMiLCJlZGl0b3IiLCJhdG9tIiwid29ya3NwYWNlIiwiZ2V0QWN0aXZlVGV4dEVkaXRvciIsImNvbnNvbGUiLCJsb2ciLCJvcHRpb25zIiwiZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlIiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwiaW5wdXRTb3VyY2UiLCJnZXRUZXh0IiwidHJhbnNmb3JtQ29kZU9yU2hvd0Vycm9yIiwib3V0cHV0U291cmNlIiwiZXJyb3IiLCJjb25maWciLCJnZXQiLCJwb3NpdGlvbiIsInN5bnRheEVycm9yUG9zaXRpb24iLCJzZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiIsInNldFRleHRWaWFEaWZmIiwic2F2ZSIsImZvcm1hdENvZGUiLCJyZXF1aXJlIiwidHJhbnNmb3JtIiwic2hvd0Vycm9yTm90aWZpY2F0aW9uIiwiZGlzbWlzc0V4aXN0aW5nRXJyb3JOb3RpZmljYXRpb24iLCJzaG93U3VjY2Vzc05vdGlmaWNhdGlvbiIsIkVSUk9SX1RJVExFIiwiZGlzbWlzc0V4aXN0aW5nU3VjY2Vzc05vdGlmaWNhdGlvbiIsIm5vdGlmaWNhdGlvbnMiLCJhZGRFcnJvciIsImRldGFpbCIsInRvU3RyaW5nIiwic3RhY2siLCJkaXNtaXNzYWJsZSIsImRpc21pc3NOb3RpZmljYXRpb24iLCJTVUNDRVNTX1RJVExFIiwiZGlzbWlzc1N1Y2Nlc3NOb3RpZmljYXRpb25UaW1lb3V0IiwiYWRkU3VjY2VzcyIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJ0aXRsZSIsImdldE5vdGlmaWNhdGlvbnMiLCJmaWx0ZXIiLCJub3RpZmljYXRpb24iLCJnZXRNZXNzYWdlIiwiZm9yRWFjaCIsImRpc21pc3MiLCJsb2MiLCJsaW5lIiwiY29sdW1uIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiYmxhY2tsaXN0IiwiU2V0IiwiYWRk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cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbi8qIGdsb2JhbHMgYXRvbSAqL1xuXG5pbXBvcnQgdHlwZSB7U291cmNlT3B0aW9uc30gZnJvbSAnLi4vY29tbW9uL29wdGlvbnMvU291cmNlT3B0aW9ucyc7XG5cbnR5cGUgRXJyb3JXaXRoTG9jYXRpb24gPSB7bG9jPzoge2xpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXJ9fTtcblxuYXN5bmMgZnVuY3Rpb24gZm9ybWF0Q29kZShcbiAgc291cmNlT3B0aW9uczogU291cmNlT3B0aW9ucyxcbiAgcGFyYW1ldGVyczoge2FkZGVkUmVxdWlyZXM/OiBib29sZWFuLCBlZGl0b3I/OiBUZXh0RWRpdG9yfSA9IHt9LFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGVkaXRvciA9IHBhcmFtZXRlcnMuZWRpdG9yIHx8IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgaWYgKCFlZGl0b3IpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKCctIGZvcm1hdC1qczogTm8gYWN0aXZlIHRleHQgZWRpdG9yJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgb3B0aW9ucyA9IGRvbnRBZGRSZXF1aXJlc0lmVXNlZEFzU2VydmljZShzb3VyY2VPcHRpb25zLCBwYXJhbWV0ZXJzKTtcblxuICAvLyBTYXZlIHRoaW5nc1xuICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gIGNvbnN0IGlucHV0U291cmNlID0gYnVmZmVyLmdldFRleHQoKTtcblxuICAvLyBBdXRvLXJlcXVpcmUgdHJhbnNmb3JtLlxuICBjb25zdCB7b3V0cHV0U291cmNlLCBlcnJvcn0gPSB0cmFuc2Zvcm1Db2RlT3JTaG93RXJyb3IoaW5wdXRTb3VyY2UsIG9wdGlvbnMpO1xuXG4gIC8vIFVwZGF0ZSBwb3NpdGlvbiBpZiBzb3VyY2UgaGFzIGEgc3ludGF4IGVycm9yXG4gIGlmIChlcnJvciAmJiBhdG9tLmNvbmZpZy5nZXQoJ251Y2xpZGUtZm9ybWF0LWpzLm1vdmVDdXJzb3JUb1N5bnRheEVycm9yJykpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHN5bnRheEVycm9yUG9zaXRpb24oZXJyb3IpO1xuICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvLyBVcGRhdGUgdGhlIHNvdXJjZSBhbmQgcG9zaXRpb24gYWZ0ZXIgYWxsIHRyYW5zZm9ybXMgYXJlIGRvbmUuIERvIG5vdGhpbmdcbiAgLy8gaWYgdGhlIHNvdXJjZSBkaWQgbm90IGNoYW5nZSBhdCBhbGwuXG4gIGlmIChvdXRwdXRTb3VyY2UgPT09IGlucHV0U291cmNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYnVmZmVyLnNldFRleHRWaWFEaWZmKG91dHB1dFNvdXJjZSk7XG5cbiAgLy8gU2F2ZSB0aGUgZmlsZSBpZiB0aGF0IG9wdGlvbiBpcyBzcGVjaWZpZWQuXG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ251Y2xpZGUtZm9ybWF0LWpzLnNhdmVBZnRlclJ1bicpKSB7XG4gICAgZWRpdG9yLnNhdmUoKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHRyYW5zZm9ybUNvZGVPclNob3dFcnJvcihcbiAgaW5wdXRTb3VyY2U6IHN0cmluZyxcbiAgb3B0aW9uczogU291cmNlT3B0aW9ucyxcbik6IHtvdXRwdXRTb3VyY2U6IHN0cmluZywgZXJyb3I/OiBFcnJvcldpdGhMb2NhdGlvbn0ge1xuICBjb25zdCB7dHJhbnNmb3JtfSA9IHJlcXVpcmUoJy4uL2NvbW1vbicpO1xuICAvLyBUT0RPOiBBZGQgYSBsaW1pdCBzbyB0aGUgdHJhbnNmb3JtIGlzIG5vdCBydW4gb24gZmlsZXMgb3ZlciBhIGNlcnRhaW4gc2l6ZS5cbiAgbGV0IG91dHB1dFNvdXJjZTtcbiAgdHJ5IHtcbiAgICBvdXRwdXRTb3VyY2UgPSB0cmFuc2Zvcm0oaW5wdXRTb3VyY2UsIG9wdGlvbnMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHNob3dFcnJvck5vdGlmaWNhdGlvbihlcnJvcik7XG4gICAgcmV0dXJuIHtvdXRwdXRTb3VyY2U6IGlucHV0U291cmNlLCBlcnJvcn07XG4gIH1cbiAgZGlzbWlzc0V4aXN0aW5nRXJyb3JOb3RpZmljYXRpb24oKTtcbiAgaWYgKFxuICAgIG91dHB1dFNvdXJjZSA9PT0gaW5wdXRTb3VyY2UgJiZcbiAgICAvLyBEbyBub3QgY29uZmlybSBzdWNjZXNzIGlmIHVzZXIgb3B0ZWQgb3V0XG4gICAgYXRvbS5jb25maWcuZ2V0KCdudWNsaWRlLWZvcm1hdC1qcy5jb25maXJtTm9DaGFuZ2VTdWNjZXNzJylcbiAgKSB7XG4gICAgc2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24oKTtcbiAgfVxuICByZXR1cm4ge291dHB1dFNvdXJjZX07XG59XG5cbmNvbnN0IEVSUk9SX1RJVExFID0gJ051Y2xpZGUgRm9ybWF0IEpTOiBGaXggUmVxdWlyZXMgZmFpbGVkJztcblxuZnVuY3Rpb24gc2hvd0Vycm9yTm90aWZpY2F0aW9uKGVycm9yOiBFcnJvcik6IHZvaWQge1xuICBkaXNtaXNzRXhpc3RpbmdFcnJvck5vdGlmaWNhdGlvbigpO1xuICBkaXNtaXNzRXhpc3RpbmdTdWNjZXNzTm90aWZpY2F0aW9uKCk7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihFUlJPUl9USVRMRSwge1xuICAgIGRldGFpbDogZXJyb3IudG9TdHJpbmcoKSxcbiAgICBzdGFjazogZXJyb3Iuc3RhY2ssXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaXNtaXNzRXhpc3RpbmdFcnJvck5vdGlmaWNhdGlvbigpOiB2b2lkIHtcbiAgZGlzbWlzc05vdGlmaWNhdGlvbihFUlJPUl9USVRMRSk7XG59XG5cbmNvbnN0IFNVQ0NFU1NfVElUTEUgPSAnTnVjbGlkZSBGb3JtYXQgSlM6IEZpeCBSZXF1aXJlcyBzdWNjZWVkZWQnO1xuXG5sZXQgZGlzbWlzc1N1Y2Nlc3NOb3RpZmljYXRpb25UaW1lb3V0O1xuZnVuY3Rpb24gc2hvd1N1Y2Nlc3NOb3RpZmljYXRpb24oKTogdm9pZCB7XG4gIGRpc21pc3NFeGlzdGluZ1N1Y2Nlc3NOb3RpZmljYXRpb24oKTtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoU1VDQ0VTU19USVRMRSwge1xuICAgIGRldGFpbDogJ05vIGNoYW5nZXMgd2VyZSBuZWVkZWQuJyxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgfSk7XG4gIGRpc21pc3NTdWNjZXNzTm90aWZpY2F0aW9uVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGRpc21pc3NFeGlzdGluZ1N1Y2Nlc3NOb3RpZmljYXRpb24oKTtcbiAgfSwgMjAwMCk7XG59XG5cbmZ1bmN0aW9uIGRpc21pc3NFeGlzdGluZ1N1Y2Nlc3NOb3RpZmljYXRpb24oKTogdm9pZCB7XG4gIGRpc21pc3NOb3RpZmljYXRpb24oU1VDQ0VTU19USVRMRSk7XG4gIGNsZWFyVGltZW91dChkaXNtaXNzU3VjY2Vzc05vdGlmaWNhdGlvblRpbWVvdXQpO1xufVxuXG5mdW5jdGlvbiBkaXNtaXNzTm90aWZpY2F0aW9uKHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKVxuICAgIC5maWx0ZXIobm90aWZpY2F0aW9uID0+IG5vdGlmaWNhdGlvbi5nZXRNZXNzYWdlKCkgPT09IHRpdGxlKVxuICAgIC5mb3JFYWNoKG5vdGlmaWNhdGlvbiA9PiBub3RpZmljYXRpb24uZGlzbWlzcygpKTtcbn1cblxuZnVuY3Rpb24gc3ludGF4RXJyb3JQb3NpdGlvbihlcnJvcjogRXJyb3JXaXRoTG9jYXRpb24pOiA/W251bWJlciwgbnVtYmVyXSB7XG4gIGNvbnN0IHtsaW5lLCBjb2x1bW59ID0gZXJyb3IubG9jIHx8IHt9O1xuICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcihsaW5lKSAmJiBOdW1iZXIuaXNJbnRlZ2VyKGNvbHVtbilcbiAgICA/IFtsaW5lIC0gMSwgY29sdW1uXVxuICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZG9udEFkZFJlcXVpcmVzSWZVc2VkQXNTZXJ2aWNlKFxuICBzb3VyY2VPcHRpb25zOiBTb3VyY2VPcHRpb25zLFxuICBwYXJhbWV0ZXJzOiB7YWRkZWRSZXF1aXJlcz86IGJvb2xlYW59LFxuKTogU291cmNlT3B0aW9ucyB7XG4gIGNvbnN0IGJsYWNrbGlzdCA9IG5ldyBTZXQoc291cmNlT3B0aW9ucy5ibGFja2xpc3QpO1xuICBpZiAocGFyYW1ldGVycy5hZGRlZFJlcXVpcmVzICE9IG51bGwpIHtcbiAgICBibGFja2xpc3QuYWRkKCdyZXF1aXJlcy5hZGRNaXNzaW5nUmVxdWlyZXMnKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIC4uLnNvdXJjZU9wdGlvbnMsXG4gICAgYmxhY2tsaXN0LFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdENvZGU7XG4iXX0=