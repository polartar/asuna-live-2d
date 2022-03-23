/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { ICubismModelSetting } from '../icubismmodelsetting';
import { CubismIdHandle } from '../id/cubismid';
import { CubismModel } from '../model/cubismmodel';
import { csmVector } from '../type/csmvector';

/**
 * Automatic blink function
 *
 * Provides an automatic blink function.
 */
export class CubismEyeBlink {
  /**
   * Create an instance
   * @param modelSetting Model setting information
   * @return Created instance
   * If the @note argument is NULL, create an empty instance with no parameter ID set.
   */
  public static create(
    modelSetting: ICubismModelSetting = null
  ): CubismEyeBlink {
    return new CubismEyeBlink(modelSetting);
  }

  /**
   * Destroy the instance
   * @param eyeBlink Target CubismEyeBlink
   */
  public static delete(eyeBlink: CubismEyeBlink): void {
    if (eyeBlink != null) {
      eyeBlink = null;
    }
  }

  /**
   * Blink interval setting
   * @param blinkingInterval Time of blink interval [seconds]
   */
  public setBlinkingInterval(blinkingInterval: number): void {
    this._blinkingIntervalSeconds = blinkingInterval;
  }

  /**
   * Detailed settings for blinking motion
   * @param closing Time required for closing the eyelids [seconds]
   * @param closed Time required for closing the eyelids [seconds]
   * @param opening Time required to open the eyelids [seconds]
   */
  public setBlinkingSetting(
    closing: number,
    closed: number,
    opening: number
  ): void {
    this._closingSeconds = closing;
    this._closedSeconds = closed;
    this._openingSeconds = opening;
  }

  /**
   * Setting a list of parameter IDs to blink
   * @param parameterIds List of parameter IDs
   */
  public setParameterIds(parameterIds: csmVector<CubismIdHandle>): void {
    this._parameterIds = parameterIds;
  }

  /**
   * Get a list of parameter IDs to blink
   * @return List of parameter IDs
   */
  public getParameterIds(): csmVector<CubismIdHandle> {
    return this._parameterIds;
  }

  /**
   * Update model parameters
   * @param model Target model
   * @param deltaTimeSeconds Delta time [seconds]
   */
  public updateParameters(model: CubismModel, deltaTimeSeconds: number): void {
    this._userTimeSeconds += deltaTimeSeconds;
    let parameterValue: number;
    let t = 0.0;

    switch (this._blinkingState) {
      case EyeState.EyeState_Closing:
        t =
          (this._userTimeSeconds - this._stateStartTimeSeconds) /
          this._closingSeconds;

        if (t >= 1.0) {
          t = 1.0;
          this._blinkingState = EyeState.EyeState_Closed;
          this._stateStartTimeSeconds = this._userTimeSeconds;
        }

        parameterValue = 1.0 - t;

        break;
      case EyeState.EyeState_Closed:
        t =
          (this._userTimeSeconds - this._stateStartTimeSeconds) /
          this._closedSeconds;

        if (t >= 1.0) {
          this._blinkingState = EyeState.EyeState_Opening;
          this._stateStartTimeSeconds = this._userTimeSeconds;
        }

        parameterValue = 0.0;

        break;
      case EyeState.EyeState_Opening:
        t =
          (this._userTimeSeconds - this._stateStartTimeSeconds) /
          this._openingSeconds;

        if (t >= 1.0) {
          t = 1.0;
          this._blinkingState = EyeState.EyeState_Interval;
          this._nextBlinkingTime = this.determinNextBlinkingTiming();
        }

        parameterValue = t;

        break;
      case EyeState.EyeState_Interval:
        if (this._nextBlinkingTime < this._userTimeSeconds) {
          this._blinkingState = EyeState.EyeState_Closing;
          this._stateStartTimeSeconds = this._userTimeSeconds;
        }

        parameterValue = 1.0;

        break;
      case EyeState.EyeState_First:
      default:
        this._blinkingState = EyeState.EyeState_Interval;
        this._nextBlinkingTime = this.determinNextBlinkingTiming();

        parameterValue = 1.0;
        break;
    }

    if (!CubismEyeBlink.CloseIfZero) {
      parameterValue = -parameterValue;
    }

    for (let i = 0; i < this._parameterIds.getSize(); ++i) {
      model.setParameterValueById(this._parameterIds.at(i), parameterValue);
    }
  }

  /**
   * Constructor
   * @param modelSetting Model setting information
   */
  public constructor(modelSetting: ICubismModelSetting) {
    this._blinkingState = EyeState.EyeState_First;
    this._nextBlinkingTime = 0.0;
    this._stateStartTimeSeconds = 0.0;
    this._blinkingIntervalSeconds = 4.0;
    this._closingSeconds = 0.1;
    this._closedSeconds = 0.05;
    this._openingSeconds = 0.15;
    this._userTimeSeconds = 0.0;
    this._parameterIds = new csmVector<CubismIdHandle>();

    if (modelSetting == null) {
      return;
    }

    for (let i = 0; i < modelSetting.getEyeBlinkParameterCount(); ++i) {
      this._parameterIds.pushBack(modelSetting.getEyeBlinkParameterId(i));
    }
  }

  /**
   * Determining the timing of the next blink
   *
   * @return Time to blink next [seconds]
   */
  public determinNextBlinkingTiming(): number {
    const r: number = Math.random();
    return (
      this._userTimeSeconds + r * (2.0 * this._blinkingIntervalSeconds - 1.0)
    );
  }

  _blinkingState: number; // Current state
  _parameterIds: csmVector<CubismIdHandle>; // List of IDs of parameters to be operated
  _nextBlinkingTime: number; // Next blink time [seconds]
  _stateStartTimeSeconds: number; // Time when the current state started [seconds]
  _blinkingIntervalSeconds: number; // Blinking interval [seconds]
  _closingSeconds: number; // Time required for closing the eyelids [seconds]
  _closedSeconds: number; // Time required for closing the eyelids [seconds]
  _openingSeconds: number; // Time required to open the eyelids [seconds]
  _userTimeSeconds: number; // Integrated value of delta time [seconds]

  /**
   * True if the eye parameter specified by ID closes when it is 0, false if it closes when it is 1.
   */
  static readonly CloseIfZero: boolean = true;
}

/**
 * Blinking condition
 *
 * Enumeration type that represents the state of blinking
 */
export enum EyeState {
  EyeState_First = 0, // Initial state
  EyeState_Interval, // Not blinking
  EyeState_Closing, // State while the eyelids are closing
  EyeState_Closed, // Eyelids closed
  EyeState_Opening // State while the eyelids are opening
}

// Namespace definition for compatibility.
import * as $ from './cubismeyeblink';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismEyeBlink = $.CubismEyeBlink;
  export type CubismEyeBlink = $.CubismEyeBlink;
  export const EyeState = $.EyeState;
  export type EyeState = $.EyeState;
}