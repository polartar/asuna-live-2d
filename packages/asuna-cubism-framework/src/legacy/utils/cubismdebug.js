"use strict";
exports.__esModule = true;
exports.CubismLogError = void 0;
function CubismLogError() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log.apply(console, args);
}
exports.CubismLogError = CubismLogError;
