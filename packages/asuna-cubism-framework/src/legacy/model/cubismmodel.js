"use strict";
exports.__esModule = true;
exports.CubismModel = void 0;
var cubismrenderer_1 = require("../render/cubismrenderer");
var CubismModel = /** @class */ (function () {
    function CubismModel() {
        this._model = null;
    }
    CubismModel.prototype.initialize = function (model) {
        this._model = model;
    };
    CubismModel.prototype.getParameterIndex = function (id) {
        var idx = this._model.parameters.ids.indexOf(id);
        if (idx >= 0) {
            return idx;
        }
        else {
            return this._model.parameters.count;
        }
    };
    CubismModel.prototype.getDrawableDrawOrders = function () {
        var renderOrders = this._model.drawables.drawOrders;
        return renderOrders;
    };
    CubismModel.prototype.getDrawableRenderOrders = function () {
        var renderOrders = this._model.drawables.renderOrders;
        return renderOrders;
    };
    CubismModel.prototype.getDrawableTextureIndices = function (drawableIndex) {
        var textureIndices = this._model.drawables.textureIndices;
        return textureIndices[drawableIndex];
    };
    CubismModel.prototype.getDrawableVertexUvs = function (drawableIndex) {
        var uvsArray = this._model.drawables.vertexUvs;
        return uvsArray[drawableIndex];
    };
    CubismModel.prototype.getDrawableVertexIndexCount = function (drawableIndex) {
        var indexCounts = this._model.drawables.indexCounts;
        return indexCounts[drawableIndex];
    };
    CubismModel.prototype.getDrawableVertexIndices = function (drawableIndex) {
        var indicesArray = this._model.drawables.indices;
        return indicesArray[drawableIndex];
    };
    CubismModel.prototype.getDrawableVertexCount = function (drawableIndex) {
        var vertexCounts = this._model.drawables.vertexCounts;
        return vertexCounts[drawableIndex];
    };
    CubismModel.prototype.getDrawableVertices = function (drawableIndex) {
        var verticesArray = this._model.drawables.vertexPositions;
        return verticesArray[drawableIndex];
    };
    CubismModel.prototype.getDrawableCulling = function (drawableIndex) {
        var constantFlags = this._model.drawables.constantFlags;
        return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(constantFlags[drawableIndex]);
    };
    CubismModel.prototype.getDrawableOpacity = function (drawableIndex) {
        var opacities = this._model.drawables.opacities;
        return opacities[drawableIndex];
    };
    CubismModel.prototype.getDrawableCount = function () {
        var drawableCount = this._model.drawables.count;
        return drawableCount;
    };
    CubismModel.prototype.getDrawableMasks = function () {
        var masks = this._model.drawables.masks;
        return masks;
    };
    CubismModel.prototype.getDrawableMaskCounts = function () {
        var maskCounts = this._model.drawables.maskCounts;
        return maskCounts;
    };
    CubismModel.prototype.isUsingMasking = function () {
        for (var d = 0; d < this._model.drawables.count; ++d) {
            if (this._model.drawables.maskCounts[d] <= 0) {
                continue;
            }
            return true;
        }
        return false;
    };
    CubismModel.prototype.getDrawableBlendMode = function (drawableIndex) {
        var constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasBlendAdditiveBit(constantFlags[drawableIndex])
            ? cubismrenderer_1.CubismBlendMode.CubismBlendMode_Additive
            : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(constantFlags[drawableIndex])
                ? cubismrenderer_1.CubismBlendMode.CubismBlendMode_Multiplicative
                : cubismrenderer_1.CubismBlendMode.CubismBlendMode_Normal;
    };
    CubismModel.prototype.getDrawableInvertedMaskBit = function (drawableIndex) {
        var constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasIsInvertedMaskBit(constantFlags[drawableIndex]);
    };
    CubismModel.prototype.getDrawableDynamicFlagVertexPositionsDidChange = function (drawableIndex) {
        var dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(dynamicFlags[drawableIndex]);
    };
    CubismModel.prototype.getDrawableDynamicFlagIsVisible = function (drawableIndex) {
        var dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
    };
    return CubismModel;
}());
exports.CubismModel = CubismModel;
