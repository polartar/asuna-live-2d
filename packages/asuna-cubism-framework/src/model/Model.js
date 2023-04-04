"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Model = void 0;
var cubismmodel_1 = require("../legacy/model/cubismmodel");
var cubismrenderer_webgl_1 = require("../legacy/render/cubismrenderer_webgl");
var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model(mocData, gl) {
        var _this = _super.call(this) || this;
        var moc = Live2DCubismCore.Moc.fromArrayBuffer(mocData);
        _this._model = Live2DCubismCore.Model.fromMoc(moc);
        _this.initialize(_this._model);
        _this.renderer = new cubismrenderer_webgl_1.CubismRenderer_WebGL();
        _this.renderer.initialize(_this);
        _this.renderer.setIsPremultipliedAlpha(true);
        _this.renderer.startUp(gl);
        return _this;
    }
    Model.prototype.release = function () {
        this._model.release();
        this.renderer.release();
    };
    Model.prototype.setParam = function (param, value) {
        var idx = this._model.parameters.ids.indexOf(param);
        value = Math.max(value, this._model.parameters.minimumValues[idx]);
        value = Math.min(value, this._model.parameters.maximumValues[idx]);
        this._model.parameters.values[idx] = value;
    };
    return Model;
}(cubismmodel_1.CubismModel));
exports.Model = Model;
