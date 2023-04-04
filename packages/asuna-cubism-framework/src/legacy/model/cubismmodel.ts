import { CubismBlendMode } from '../render/cubismrenderer';

export class CubismModel {

  _model: Live2DCubismCore.Model

  constructor() {
    this._model = null as any
  }

  initialize(model: Live2DCubismCore.Model) {
    this._model = model
  }

  getParameterIndex(id: string): number {
    let idx = this._model.parameters.ids.indexOf(id)

    if (idx >= 0) {
      return idx
    } else {
      return this._model.parameters.count
    }
  }

  getDrawableDrawOrders(): Int32Array {
    const renderOrders: Int32Array = this._model.drawables.drawOrders;
    return renderOrders;
  }

  getDrawableRenderOrders(): Int32Array {
    const renderOrders: Int32Array = this._model.drawables.renderOrders;
    return renderOrders;
  }

  getDrawableTextureIndices(drawableIndex: number): number {
    const textureIndices: Int32Array = this._model.drawables.textureIndices;
    return textureIndices[drawableIndex];
  }

  getDrawableVertexUvs(drawableIndex: number): Float32Array {
    const uvsArray: Float32Array[] = this._model.drawables.vertexUvs;
    return uvsArray[drawableIndex];
  }

  getDrawableVertexIndexCount(drawableIndex: number): number {
    const indexCounts: Int32Array = this._model.drawables.indexCounts;
    return indexCounts[drawableIndex];
  }

  getDrawableVertexIndices(drawableIndex: number): Uint16Array {
    const indicesArray: Uint16Array[] = this._model.drawables.indices;
    return indicesArray[drawableIndex];
  }

  getDrawableVertexCount(drawableIndex: number): number {
    const vertexCounts = this._model.drawables.vertexCounts;
    return vertexCounts[drawableIndex];
  }

  getDrawableVertices(drawableIndex: number): Float32Array {
    const verticesArray: Float32Array[] = this._model.drawables.vertexPositions;
    return verticesArray[drawableIndex];
  }

  getDrawableCulling(drawableIndex: number): boolean {
    const constantFlags = this._model.drawables.constantFlags;

    return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(
      constantFlags[drawableIndex]
    );
  }

  getDrawableOpacity(drawableIndex: number): number {
    const opacities: Float32Array = this._model.drawables.opacities;
    return opacities[drawableIndex];
  }

  getDrawableCount(): number {
    const drawableCount = this._model.drawables.count;
    return drawableCount;
  }

  getDrawableMasks(): Int32Array[] {
    const masks: Int32Array[] = this._model.drawables.masks;
    return masks;
  }

  getDrawableMaskCounts(): Int32Array {
    const maskCounts: Int32Array = this._model.drawables.maskCounts;
    return maskCounts;
  }

  isUsingMasking(): boolean {
    for (let d = 0; d < this._model.drawables.count; ++d) {
      if (this._model.drawables.maskCounts[d] <= 0) {
        continue;
      }
      return true;
    }
    return false;
  }

  getDrawableBlendMode(drawableIndex: number): CubismBlendMode {
    const constantFlags = this._model.drawables.constantFlags;

    return Live2DCubismCore.Utils.hasBlendAdditiveBit(
      constantFlags[drawableIndex]
    )
      ? CubismBlendMode.CubismBlendMode_Additive
      : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(
        constantFlags[drawableIndex]
      )
        ? CubismBlendMode.CubismBlendMode_Multiplicative
        : CubismBlendMode.CubismBlendMode_Normal;
  }

  getDrawableInvertedMaskBit(drawableIndex: number): boolean {
    const constantFlags: Uint8Array = this._model.drawables.constantFlags;

    return Live2DCubismCore.Utils.hasIsInvertedMaskBit(
      constantFlags[drawableIndex]
    );
  }

  getDrawableDynamicFlagVertexPositionsDidChange(
    drawableIndex: number
  ): boolean {
    const dynamicFlags: Uint8Array = this._model.drawables.dynamicFlags;
    return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(
      dynamicFlags[drawableIndex]
    );
  }

  getDrawableDynamicFlagIsVisible(drawableIndex: number): boolean {
    const dynamicFlags: Uint8Array = this._model.drawables.dynamicFlags;
    return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
  }
}