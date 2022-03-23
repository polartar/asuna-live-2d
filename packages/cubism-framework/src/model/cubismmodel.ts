/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { CubismFramework } from '../live2dcubismframework';
import { CubismBlendMode } from '../rendering/cubismrenderer';
import { csmMap } from '../type/csmmap';
import { csmVector } from '../type/csmvector';
import { CSM_ASSERT } from '../utils/cubismdebug';

/**
 * model
 *
 * A class of models generated from Moc data.
 */
export class CubismModel {
  /**
   * Update model parameters
   */
  public update(): void {
    // Update model
    this._model.update();

    this._model.drawables.resetDynamicFlags();
  }

  /**
   * Get the width of the canvas
   */
  public getCanvasWidth(): number {
    if (this._model == null) {
      return 0.0;
    }

    return (
      this._model.canvasinfo.CanvasWidth / this._model.canvasinfo.PixelsPerUnit
    );
  }

  /**
   * Get the height of the canvas
   */
  public getCanvasHeight(): number {
    if (this._model == null) {
      return 0.0;
    }

    return (
      this._model.canvasinfo.CanvasHeight / this._model.canvasinfo.PixelsPerUnit
    );
  }

  /**
   * Save parameters
   */
  public saveParameters(): void {
    const parameterCount: number = this._model.parameters.count;
    const savedParameterCount: number = this._savedParameters.getSize();

    for (let i = 0; i < parameterCount; ++i) {
      if (i < savedParameterCount) {
        this._savedParameters.set(i, this._parameterValues[i]);
      } else {
        this._savedParameters.pushBack(this._parameterValues[i]);
      }
    }
  }

  /**
   * Get the model
   */
  public getModel(): Live2DCubismCore.Model {
    return this._model;
  }

  /**
   * Get index of parts
   * @param partId Part ID
   * @return Parts index
   */
  public getPartIndex(partId: CubismIdHandle): number {
    let partIndex: number;
    const partCount: number = this._model.parts.count;

    for (partIndex = 0; partIndex < partCount; ++partIndex) {
      if (partId == this._partIds.at(partIndex)) {
        return partIndex;
      }
    }

    // If it does not exist in the model, it searches for it in the non-existent part ID list and returns its index.
    if (this._notExistPartId.isExist(partId)) {
      return this._notExistPartId.getValue(partId);
    }

    // Add a new element if it is not in the non-existent part ID list
    partIndex = partCount + this._notExistPartId.getSize();
    this._notExistPartId.setValue(partId, partIndex);
    this._notExistPartOpacities.appendKey(partIndex);

    return partIndex;
  }

  /**
   * Get the number of parts
   * @return Number of parts
   */
  public getPartCount(): number {
    const partCount: number = this._model.parts.count;
    return partCount;
  }

  /**
   * Part opacity setting (Index)
   * @param partIndex Part index
   * @param opacity opacity
   */
  public setPartOpacityByIndex(partIndex: number, opacity: number): void {
    if (this._notExistPartOpacities.isExist(partIndex)) {
      this._notExistPartOpacities.setValue(partIndex, opacity);
      return;
    }

    // Index range detection
    CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());

    this._partOpacities[partIndex] = opacity;
  }

  /**
   * Setting the opacity of the part (Id)
   * @param partId Part ID
   * @param opacity Part opacity
   */
  public setPartOpacityById(partId: CubismIdHandle, opacity: number): void {
    // It is a mechanism that can acquire PartIndex for speeding up, but it is unnecessary when setting from the outside because the call frequency is low
    const index: number = this.getPartIndex(partId);

    if (index < 0) {
      return; // Skip because there are no parts
    }

    this.setPartOpacityByIndex(index, opacity);
  }

  /**
   * Get part opacity (index)
   * @param partIndex Part index
   * @return Part opacity
   */
  public getPartOpacityByIndex(partIndex: number): number {
    if (this._notExistPartOpacities.isExist(partIndex)) {
      // If the part ID does not exist in the model, opacity is returned from the non-existent parts list.
      return this._notExistPartOpacities.getValue(partIndex);
    }

    // Index range detection
    CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());

    return this._partOpacities[partIndex];
  }

  /**
   * Get part opacity (id)
   * @param partId Part Id
   * @return Part opacity
   */
  public getPartOpacityById(partId: CubismIdHandle): number {
    // It is a mechanism that can acquire PartIndex for speeding up, but it is unnecessary when setting from the outside because the call frequency is low
    const index: number = this.getPartIndex(partId);

    if (index < 0) {
      return 0; // Skip because there are no parts
    }

    return this.getPartOpacityByIndex(index);
  }

  /**
   * Get index of parameters
   * @param Parameter ID
   * @return Parameter index
   */
  public getParameterIndex(parameterId: CubismIdHandle): number {
    let parameterIndex: number;
    const idCount: number = this._model.parameters.count;

    for (parameterIndex = 0; parameterIndex < idCount; ++parameterIndex) {
      if (parameterId != this._parameterIds.at(parameterIndex)) {
        continue;
      }

      return parameterIndex;
    }

    // If it does not exist in the model, it searches in the non-existent parameter ID list and returns its index.
    if (this._notExistParameterId.isExist(parameterId)) {
      return this._notExistParameterId.getValue(parameterId);
    }

    // Add a new element if it is not in the non-existent parameter ID list
    parameterIndex =
      this._model.parameters.count + this._notExistParameterId.getSize();

    this._notExistParameterId.setValue(parameterId, parameterIndex);
    this._notExistParameterValues.appendKey(parameterIndex);

    return parameterIndex;
  }

  /**
   * Get the number of parameters
   * Number of @return parameters
   */
  public getParameterCount(): number {
    return this._model.parameters.count;
  }

  /**
   * Get the maximum value of the parameter
   * @param parameterIndex Parameter index
   * Maximum value of @return parameter
   */
  public getParameterMaximumValue(parameterIndex: number): number {
    return this._model.parameters.maximumValues[parameterIndex];
  }

  /**
   * Get the minimum value of the parameter
   * @param parameterIndex Parameter index
   * Minimum value of @return parameter
   */
  public getParameterMinimumValue(parameterIndex: number): number {
    return this._model.parameters.minimumValues[parameterIndex];
  }

  /**
   * Get default values ​​for parameters
   * @param parameterIndex Parameter index
   * Default value for the @return parameter
   */
  public getParameterDefaultValue(parameterIndex: number): number {
    return this._model.parameters.defaultValues[parameterIndex];
  }

  /**
   * Get parameter values
   * @param parameterIndex Parameter index
   * Value of the @return parameter
   */
  public getParameterValueByIndex(parameterIndex: number): number {
    if (this._notExistParameterValues.isExist(parameterIndex)) {
      return this._notExistParameterValues.getValue(parameterIndex);
    }

    // Index range detection
    CSM_ASSERT(
      0 <= parameterIndex && parameterIndex < this.getParameterCount()
    );

    return this._parameterValues[parameterIndex];
  }

  /**
   * Get parameter values
   * @param parameterId Parameter ID
   * Value of the @return parameter
   */
  public getParameterValueById(parameterId: CubismIdHandle): number {
    // It is a mechanism that can acquire parameterIndex for speeding up, but it is unnecessary when setting from the outside because the call frequency is low
    const parameterIndex: number = this.getParameterIndex(parameterId);
    return this.getParameterValueByIndex(parameterIndex);
  }

  /**
   * Setting parameter values
   * @param parameterIndex Parameter index
   * @param value The value of the parameter
   * @param weight weight
   */
  public setParameterValueByIndex(
    parameterIndex: number,
    value: number,
    weight = 1.0
  ): void {
    if (this._notExistParameterValues.isExist(parameterIndex)) {
      this._notExistParameterValues.setValue(
        parameterIndex,
        weight == 1
          ? value
          : this._notExistParameterValues.getValue(parameterIndex) *
          (1 - weight) +
          value * weight
      );

      return;
    }

    // Index range detection
    CSM_ASSERT(
      0 <= parameterIndex && parameterIndex < this.getParameterCount()
    );

    if (this._model.parameters.maximumValues[parameterIndex] < value) {
      value = this._model.parameters.maximumValues[parameterIndex];
    }
    if (this._model.parameters.minimumValues[parameterIndex] > value) {
      value = this._model.parameters.minimumValues[parameterIndex];
    }

    this._parameterValues[parameterIndex] =
      weight == 1
        ? value
        : (this._parameterValues[parameterIndex] =
          this._parameterValues[parameterIndex] * (1 - weight) +
          value * weight);
  }

  /**
   * Setting parameter values
   * @param parameterId Parameter ID
   * @param value The value of the parameter
   * @param weight weight
   */
  public setParameterValueById(
    parameterId: CubismIdHandle,
    value: number,
    weight = 1.0
  ): void {
    const index: number = this.getParameterIndex(parameterId);
    this.setParameterValueByIndex(index, value, weight);
  }

  /**
   * Addition of parameter values ​​(index)
   * @param parameterIndex Parameter index
   * @param value Value to add
   * @param weight weight
   */
  public addParameterValueByIndex(
    parameterIndex: number,
    value: number,
    weight = 1.0
  ): void {
    this.setParameterValueByIndex(
      parameterIndex,
      this.getParameterValueByIndex(parameterIndex) + value * weight
    );
  }

  /**
   * Addition of parameter values ​​(id)
   * @param parameterId Parameter ID
   * @param value Value to add
   * @param weight weight
   */
  public addParameterValueById(
    parameterId: any,
    value: number,
    weight = 1.0
  ): void {
    const index: number = this.getParameterIndex(parameterId);
    this.addParameterValueByIndex(index, value, weight);
  }

  /**
   * Multiply parameter values
   * @param parameterId Parameter ID
   * @param value Value to multiply
   * @param weight weight
   */
  public multiplyParameterValueById(
    parameterId: CubismIdHandle,
    value: number,
    weight = 1.0
  ): void {
    const index: number = this.getParameterIndex(parameterId);
    this.multiplyParameterValueByIndex(index, value, weight);
  }

  /**
   * Multiply parameter values
   * @param parameterIndex Parameter index
   * @param value Value to multiply
   * @param weight weight
   */
  public multiplyParameterValueByIndex(
    parameterIndex: number,
    value: number,
    weight = 1.0
  ): void {
    this.setParameterValueByIndex(
      parameterIndex,
      this.getParameterValueByIndex(parameterIndex) *
      (1.0 + (value - 1.0) * weight)
    );
  }

  /**
   * Get Drawable index
   * @param drawableId DrawableのID
   * @return Drawable index
   */
  public getDrawableIndex(drawableId: CubismIdHandle): number {
    const drawableCount = this._model.drawables.count;

    for (
      let drawableIndex = 0;
      drawableIndex < drawableCount;
      ++drawableIndex
    ) {
      if (this._drawableIds.at(drawableIndex) == drawableId) {
        return drawableIndex;
      }
    }

    return -1;
  }

  /**
   * Get the number of Drawables
   * Number of @return drawables
   */
  public getDrawableCount(): number {
    const drawableCount = this._model.drawables.count;
    return drawableCount;
  }

  /**
   * Get the Drawable ID
   * @param drawableIndex Drawable index
   * @return drawableのID
   */
  public getDrawableId(drawableIndex: number): CubismIdHandle {
    const parameterIds: string[] = this._model.drawables.ids;
    return CubismFramework.getIdManager().getId(parameterIds[drawableIndex]);
  }

  /**
   * Get the drawing order list of Drawable
   * @return Drawable drawing order list
   */
  public getDrawableRenderOrders(): Int32Array {
    const renderOrders: Int32Array = this._model.drawables.renderOrders;
    return renderOrders;
  }

  /**
   * Get the texture index list of Drawable
   * @param drawableIndex Drawable index
   * @return drawable texture index list
   */
  public getDrawableTextureIndices(drawableIndex: number): number {
    const textureIndices: Int32Array = this._model.drawables.textureIndices;
    return textureIndices[drawableIndex];
  }

  /**
   * Acquisition of change information of Vertex Positions of Drawable
   *
   * Get whether the vertex information of Drawable has changed with the latest CubismModel.update function.
   *
   * @param drawableIndex Drawable index
   * @retval true Drawable vertex information changed in the latest CubismModel.update function
   * @retval false Drawable vertex information has not changed in the latest CubismModel.update function
   */
  public getDrawableDynamicFlagVertexPositionsDidChange(
    drawableIndex: number
  ): boolean {
    const dynamicFlags: Uint8Array = this._model.drawables.dynamicFlags;
    return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(
      dynamicFlags[drawableIndex]
    );
  }

  /**
   * Get the number of Drawable vertex indexes
   * @param drawableIndex Drawable index
   * Number of vertex indexes of @return drawable
   */
  public getDrawableVertexIndexCount(drawableIndex: number): number {
    const indexCounts: Int32Array = this._model.drawables.indexCounts;
    return indexCounts[drawableIndex];
  }

  /**
   * Get the number of Drawable vertices
   * @param drawableIndex Drawable index
   * Number of vertices of @return drawable
   */
  public getDrawableVertexCount(drawableIndex: number): number {
    const vertexCounts = this._model.drawables.vertexCounts;
    return vertexCounts[drawableIndex];
  }

  /**
   * Get the list of Drawable vertices
   * @param drawableIndex index of drawable
   * @return drawable vertex list
   */
  public getDrawableVertices(drawableIndex: number): Float32Array {
    return this.getDrawableVertexPositions(drawableIndex);
  }

  /**
   * Get Drawable vertex index list
   * @param drarableIndex Drawable index
   * @return drawable vertex index list
   */
  public getDrawableVertexIndices(drawableIndex: number): Uint16Array {
    const indicesArray: Uint16Array[] = this._model.drawables.indices;
    return indicesArray[drawableIndex];
  }

  /**
   * Get the list of Drawable vertices
   * @param drawableIndex Drawable index
   * @return drawable vertex list
   */
  public getDrawableVertexPositions(drawableIndex: number): Float32Array {
    const verticesArray: Float32Array[] = this._model.drawables.vertexPositions;
    return verticesArray[drawableIndex];
  }

  /**
   * Get UV list of Drawable vertices
   * @param drawableIndex Drawable index
   * @return drawable vertex UV list
   */
  public getDrawableVertexUvs(drawableIndex: number): Float32Array {
    const uvsArray: Float32Array[] = this._model.drawables.vertexUvs;
    return uvsArray[drawableIndex];
  }

  /**
   * Get Drawable opacity
   * @param drawableIndex Drawable index
   * @return drawable opacity
   */
  public getDrawableOpacity(drawableIndex: number): number {
    const opacities: Float32Array = this._model.drawables.opacities;
    return opacities[drawableIndex];
  }

  /**
   * Get Drawable culling information
   * @param drawableIndex Drawable index
   * @return drawable culling information
   */
  public getDrawableCulling(drawableIndex: number): boolean {
    const constantFlags = this._model.drawables.constantFlags;

    return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(
      constantFlags[drawableIndex]
    );
  }

  /**
   * Get Drawable blend mode
   * @param drawableIndex Drawable index
   * @return drawable blend mode
   */
  public getDrawableBlendMode(drawableIndex: number): CubismBlendMode {
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

  /**
   * Get Drawable's mask inversion use
   *
   * Get the inversion setting when using Drawable mask.
   * Ignored if no mask is used.
   *
   * @param drawableIndex Drawable index
   * @return Drawable inversion setting
   */
  public getDrawableInvertedMaskBit(drawableIndex: number): boolean {
    const constantFlags: Uint8Array = this._model.drawables.constantFlags;

    return Live2DCubismCore.Utils.hasIsInvertedMaskBit(
      constantFlags[drawableIndex]
    );
  }

  /**
   * Get Drawable clipping mask list
   * @return Drawable clipping mask list
   */
  public getDrawableMasks(): Int32Array[] {
    const masks: Int32Array[] = this._model.drawables.masks;
    return masks;
  }

  /**
   * Get a list of the number of clipping masks in Drawable
   * List of number of clipping masks for @return Drawable
   */
  public getDrawableMaskCounts(): Int32Array {
    const maskCounts: Int32Array = this._model.drawables.maskCounts;
    return maskCounts;
  }

  /**
   * Usage of clipping mask
   *
   * @return true You are using a clipping mask
   * @return false No clipping mask used
   */
  public isUsingMasking(): boolean {
    for (let d = 0; d < this._model.drawables.count; ++d) {
      if (this._model.drawables.maskCounts[d] <= 0) {
        continue;
      }
      return true;
    }
    return false;
  }

  /**
   * Get the display information of Drawable
   *
   * @param drawableIndex Drawable index
   * @return true Drawable is displayed
   * @return false Drawable is hidden
   */
  public getDrawableDynamicFlagIsVisible(drawableIndex: number): boolean {
    const dynamicFlags: Uint8Array = this._model.drawables.dynamicFlags;
    return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
  }

  /**
   * Get change information of Drawable DrawOrder
   *
   * Get if the drawOrder of drawable has changed with the latest CubismModel.update function.
   * drawOrder is 0 to 1000 information specified on artMesh
   * @param drawableIndex index of drawable
   * @return true The opacity of drawable changed in the latest CubismModel.update function
   * @return false The opacity of drawable has changed in the latest CubismModel.update function
   */
  public getDrawableDynamicFlagVisibilityDidChange(
    drawableIndex: number
  ): boolean {
    const dynamicFlags: Uint8Array = this._model.drawables.dynamicFlags;
    return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(
      dynamicFlags[drawableIndex]
    );
  }

  /**
   * Get Drawable opacity change information
   *
   * Get if the opacity of drawable has changed with the latest CubismModel.update function.
   *
   * @param drawableIndex index of drawable
   * @return true Drawable opacity changed in the latest CubismModel.update function
   * @return false Drawable opacity has not changed in the latest CubismModel.update function
   */
  public getDrawableDynamicFlagOpacityDidChange(
    drawableIndex: number
  ): boolean {
    const dynamicFlags: Uint8Array = this._model.drawables.dynamicFlags;
    return Live2DCubismCore.Utils.hasOpacityDidChangeBit(
      dynamicFlags[drawableIndex]
    );
  }

  /**
   * Acquisition of change information of drawing order of Drawable
   *
   * Get if the drawing order of Drawable has changed with the latest CubismModel.update function.
   *
   * @param drawableIndex Drawable index
   * @return true The drawing order of Drawable has changed in the latest CubismModel.update function.
   * @return false The drawing order of Drawable has not changed in the latest CubismModel.update function.
   */
  public getDrawableDynamicFlagRenderOrderDidChange(
    drawableIndex: number
  ): boolean {
    const dynamicFlags: Uint8Array = this._model.drawables.dynamicFlags;
    return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(
      dynamicFlags[drawableIndex]
    );
  }

  /**
   * Loading saved parameters
   */
  public loadParameters(): void {
    let parameterCount: number = this._model.parameters.count;
    const savedParameterCount: number = this._savedParameters.getSize();

    if (parameterCount > savedParameterCount) {
      parameterCount = savedParameterCount;
    }

    for (let i = 0; i < parameterCount; ++i) {
      this._parameterValues[i] = this._savedParameters.at(i);
    }
  }

  /**
   * initialize
   */
  public initialize(): void {
    CSM_ASSERT(this._model);

    this._parameterValues = this._model.parameters.values;
    this._partOpacities = this._model.parts.opacities;
    this._parameterMaximumValues = this._model.parameters.maximumValues;
    this._parameterMinimumValues = this._model.parameters.minimumValues;

    {
      const parameterIds: string[] = this._model.parameters.ids;
      const parameterCount: number = this._model.parameters.count;

      this._parameterIds.prepareCapacity(parameterCount);
      for (let i = 0; i < parameterCount; ++i) {
        this._parameterIds.pushBack(
          CubismFramework.getIdManager().getId(parameterIds[i])
        );
      }
    }

    {
      const partIds: string[] = this._model.parts.ids;
      const partCount: number = this._model.parts.count;

      this._partIds.prepareCapacity(partCount);
      for (let i = 0; i < partCount; ++i) {
        this._partIds.pushBack(
          CubismFramework.getIdManager().getId(partIds[i])
        );
      }
    }

    {
      const drawableIds: string[] = this._model.drawables.ids;
      const drawableCount: number = this._model.drawables.count;

      this._drawableIds.prepareCapacity(drawableCount);
      for (let i = 0; i < drawableCount; ++i) {
        this._drawableIds.pushBack(
          CubismFramework.getIdManager().getId(drawableIds[i])
        );
      }
    }
  }

  /**
   * Constructor
   * @param model model
   */
  public constructor(model: Live2DCubismCore.Model) {
    this._model = model;
    this._parameterValues = null;
    this._parameterMaximumValues = null;
    this._parameterMinimumValues = null;
    this._partOpacities = null;
    this._savedParameters = new csmVector<number>();
    this._parameterIds = new csmVector<CubismIdHandle>();
    this._drawableIds = new csmVector<CubismIdHandle>();
    this._partIds = new csmVector<CubismIdHandle>();

    this._notExistPartId = new csmMap<CubismIdHandle, number>();
    this._notExistParameterId = new csmMap<CubismIdHandle, number>();
    this._notExistParameterValues = new csmMap<number, number>();
    this._notExistPartOpacities = new csmMap<number, number>();
  }

  /**
   * Destructor-equivalent processing
   */
  public release(): void {
    this._model.release();
    this._model = null;
  }

  private _notExistPartOpacities: csmMap<number, number>; // List of opacity of non-existent parts
  private _notExistPartId: csmMap<CubismIdHandle, number>; // List of non-existent part IDs

  private _notExistParameterValues: csmMap<number, number>; // List of non-existent parameter values
  private _notExistParameterId: csmMap<CubismIdHandle, number>; // List of non-existent parameter IDs

  private _savedParameters: csmVector<number>; // Saved parameters

  private _model: Live2DCubismCore.Model; // Model

  private _parameterValues: Float32Array; // List of parameter values
  private _parameterMaximumValues: Float32Array; // List of maximum parameter values
  private _parameterMinimumValues: Float32Array; // List of minimum parameter values

  private _partOpacities: Float32Array; // List of part opacity

  private _parameterIds: csmVector<CubismIdHandle>;
  private _partIds: csmVector<CubismIdHandle>;
  private _drawableIds: csmVector<CubismIdHandle>;
}

// Namespace definition for compatibility.
import * as $ from './cubismmodel';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismModel = $.CubismModel;
  export type CubismModel = $.CubismModel;
}