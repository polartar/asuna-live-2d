import { CubismBlendMode } from '../render/cubismrenderer';
export class CubismModel {
    constructor() {
        this._model = null;
    }
    initialize(model) {
        this._model = model;
    }
    getParameterIndex(id) {
        let idx = this._model.parameters.ids.indexOf(id);
        if (idx >= 0) {
            return idx;
        }
        else {
            return this._model.parameters.count;
        }
    }
    getDrawableDrawOrders() {
        const renderOrders = this._model.drawables.drawOrders;
        return renderOrders;
    }
    getDrawableRenderOrders() {
        const renderOrders = this._model.drawables.renderOrders;
        return renderOrders;
    }
    getDrawableTextureIndices(drawableIndex) {
        const textureIndices = this._model.drawables.textureIndices;
        return textureIndices[drawableIndex];
    }
    getDrawableVertexUvs(drawableIndex) {
        const uvsArray = this._model.drawables.vertexUvs;
        return uvsArray[drawableIndex];
    }
    getDrawableVertexIndexCount(drawableIndex) {
        const indexCounts = this._model.drawables.indexCounts;
        return indexCounts[drawableIndex];
    }
    getDrawableVertexIndices(drawableIndex) {
        const indicesArray = this._model.drawables.indices;
        return indicesArray[drawableIndex];
    }
    getDrawableVertexCount(drawableIndex) {
        const vertexCounts = this._model.drawables.vertexCounts;
        return vertexCounts[drawableIndex];
    }
    getDrawableVertices(drawableIndex) {
        const verticesArray = this._model.drawables.vertexPositions;
        return verticesArray[drawableIndex];
    }
    getDrawableCulling(drawableIndex) {
        const constantFlags = this._model.drawables.constantFlags;
        return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(constantFlags[drawableIndex]);
    }
    getDrawableOpacity(drawableIndex) {
        const opacities = this._model.drawables.opacities;
        return opacities[drawableIndex];
    }
    getDrawableCount() {
        const drawableCount = this._model.drawables.count;
        return drawableCount;
    }
    getDrawableMasks() {
        const masks = this._model.drawables.masks;
        return masks;
    }
    getDrawableMaskCounts() {
        const maskCounts = this._model.drawables.maskCounts;
        return maskCounts;
    }
    isUsingMasking() {
        for (let d = 0; d < this._model.drawables.count; ++d) {
            if (this._model.drawables.maskCounts[d] <= 0) {
                continue;
            }
            return true;
        }
        return false;
    }
    getDrawableBlendMode(drawableIndex) {
        const constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasBlendAdditiveBit(constantFlags[drawableIndex])
            ? CubismBlendMode.CubismBlendMode_Additive
            : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(constantFlags[drawableIndex])
                ? CubismBlendMode.CubismBlendMode_Multiplicative
                : CubismBlendMode.CubismBlendMode_Normal;
    }
    getDrawableInvertedMaskBit(drawableIndex) {
        const constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasIsInvertedMaskBit(constantFlags[drawableIndex]);
    }
    getDrawableDynamicFlagVertexPositionsDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(dynamicFlags[drawableIndex]);
    }
    getDrawableDynamicFlagIsVisible(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
    }
}
//# sourceMappingURL=cubismmodel.js.map