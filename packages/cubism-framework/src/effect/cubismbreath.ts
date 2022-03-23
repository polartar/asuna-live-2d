/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { CubismModel } from '../model/cubismmodel';
import { csmVector } from '../type/csmvector';

/**
 * Respiratory function
 *
 * Provides respiratory function.
 */
export class CubismBreath {
  /**
   * Create an instance
   */
  public static create(): CubismBreath {
    return new CubismBreath();
  }

  /**
   * Destroy the instance
   * @param instance Target CubismBreath
   */
  public static delete(instance: CubismBreath): void {
    if (instance != null) {
      instance = null;
    }
  }

  /**
   * Respiratory parameter association
   * @param breathParameters List of parameters you want to associate with breathing
   */
  public setParameters(breathParameters: csmVector<BreathParameterData>): void {
    this._breathParameters = breathParameters;
  }

  /**
   * Acquisition of parameters associated with breathing
   * @return List of parameters associated with breathing
   */
  public getParameters(): csmVector<BreathParameterData> {
    return this._breathParameters;
  }

  /**
   * Update model parameters
   * @param model Target model
   * @param deltaTimeSeconds Delta time [seconds]
   */
  public updateParameters(model: CubismModel, deltaTimeSeconds: number): void {
    this._currentTime += deltaTimeSeconds;

    const t: number = this._currentTime * 2.0 * 3.14159;

    for (let i = 0; i < this._breathParameters.getSize(); ++i) {
      const data: BreathParameterData = this._breathParameters.at(i);

      model.addParameterValueById(
        data.parameterId,
        data.offset + data.peak * Math.sin(t / data.cycle),
        data.weight
      );
    }
  }

  /**
   * Constructor
   */
  public constructor() {
    this._currentTime = 0.0;
  }

  _breathParameters: csmVector<BreathParameterData>; // List of parameters associated with breathing
  _currentTime: number; // Accumulated time [seconds]
}

/**
 * Respiratory parameter information
 */
export class BreathParameterData {
  /**
   * Constructor
   * @param parameterId Parameter ID that links breathing
   * @param offset Wave offset when breathing is a sine wave
   * @param peak Wave height when breathing is a sine wave
   * @param cycle Wave cycle when breathing is a sine wave
   * @param weight Weight to parameter
   */
  constructor(
    parameterId?: CubismIdHandle,
    offset?: number,
    peak?: number,
    cycle?: number,
    weight?: number
  ) {
    this.parameterId = parameterId == undefined ? null : parameterId;
    this.offset = offset == undefined ? 0.0 : offset;
    this.peak = peak == undefined ? 0.0 : peak;
    this.cycle = cycle == undefined ? 0.0 : cycle;
    this.weight = weight == undefined ? 0.0 : weight;
  }

  parameterId: CubismIdHandle; // Parameter ID that links breathing \
  offset: number; // Wave offset when breathing is a sine wave
  peak: number; // Wave height when breathing is a sine wave
  cycle: number; // Wave cycle when breathing is a sine wave
  weight: number; // Weight to parameter
}

// Namespace definition for compatibility.
import * as $ from './cubismbreath';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const BreathParameterData = $.BreathParameterData;
  export type BreathParameterData = $.BreathParameterData;
  export const CubismBreath = $.CubismBreath;
  export type CubismBreath = $.CubismBreath;
}