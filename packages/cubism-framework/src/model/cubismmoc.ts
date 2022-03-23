/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CSM_ASSERT } from '../utils/cubismdebug';
import { CubismModel } from './cubismmodel';

/**
 * Moc data management
 *
 * Moc A class that manages data.
 */
export class CubismMoc {
  /**
   * Creating Moc data
   */
  public static create(mocBytes: ArrayBuffer): CubismMoc {
    let cubismMoc: CubismMoc = null;
    const moc: Live2DCubismCore.Moc = Live2DCubismCore.Moc.fromArrayBuffer(
      mocBytes
    );

    if (moc) {
      cubismMoc = new CubismMoc(moc);
    }

    return cubismMoc;
  }

  /**
   * Delete Moc data
   *
   * Delete Moc data
   */
  public static delete(moc: CubismMoc): void {
    moc._moc._release();
    moc._moc = null;
    moc = null;
  }

  /**
   * Create a model
   *
   * @return Model created from Moc data
   */
  createModel(): CubismModel {
    let cubismModel: CubismModel = null;

    const model: Live2DCubismCore.Model = Live2DCubismCore.Model.fromMoc(
      this._moc
    );

    if (model) {
      cubismModel = new CubismModel(model);
      cubismModel.initialize();

      ++this._modelCount;
    }

    return cubismModel;
  }

  /**
   * Delete the model
   */
  deleteModel(model: CubismModel): void {
    if (model != null) {
      model.release();
      model = null;
      --this._modelCount;
    }
  }

  /**
   * Constructor
   */
  private constructor(moc: Live2DCubismCore.Moc) {
    this._moc = moc;
    this._modelCount = 0;
  }

  /**
   * Destructor-equivalent processing
   */
  public release(): void {
    CSM_ASSERT(this._modelCount == 0);

    this._moc._release();
    this._moc = null;
  }

  _moc: Live2DCubismCore.Moc; // Moc デ ー タ
  _modelCount: number; // Number of models created from Moc data
}

// Namespace definition for compatibility.
import * as $ from './cubismmoc';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismMoc = $.CubismMoc;
  export type CubismMoc = $.CubismMoc;
}