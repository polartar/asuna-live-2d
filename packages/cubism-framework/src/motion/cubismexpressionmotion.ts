/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { CubismFramework } from '../live2dcubismframework';
import { CubismModel } from '../model/cubismmodel';
import { csmVector } from '../type/csmvector';
import { CubismJson, Value } from '../utils/cubismjson';
import { ACubismMotion } from './acubismmotion';
import { CubismMotionQueueEntry } from './cubismmotionqueueentry';

// Exp3.json key and default
const ExpressionKeyFadeIn = 'FadeInTime';
const ExpressionKeyFadeOut = 'FadeOutTime';
const ExpressionKeyParameters = 'Parameters';
const ExpressionKeyId = 'Id';
const ExpressionKeyValue = 'Value';
const ExpressionKeyBlend = 'Blend';
const BlendValueAdd = 'Add';
const BlendValueMultiply = 'Multiply';
const BlendValueOverwrite = 'Overwrite';
const DefaultFadeTime = 1.0;

/**
 * Facial expression motion
 *
 * Facial expression motion class.
 */
export class CubismExpressionMotion extends ACubismMotion {
  /**
   * Create an instance.
   * @param buffer exp The buffer in which the file is read
   * @param size Buffer size
   * @return Created instance
   */
  public static create(
    buffer: ArrayBuffer,
    size: number
  ): CubismExpressionMotion {
    const expression: CubismExpressionMotion = new CubismExpressionMotion();

    const json: CubismJson = CubismJson.create(buffer, size);
    const root: Value = json.getRoot();

    expression.setFadeInTime(
      root.getValueByString(ExpressionKeyFadeIn).toFloat(DefaultFadeTime)
    ); // Fade-in
    expression.setFadeOutTime(
      root.getValueByString(ExpressionKeyFadeOut).toFloat(DefaultFadeTime)
    ); // Fade out

    // About each parameter
    const parameterCount = root
      .getValueByString(ExpressionKeyParameters)
      .getSize();
    expression._parameters.prepareCapacity(parameterCount);

    for (let i = 0; i < parameterCount; ++i) {
      const param: Value = root
        .getValueByString(ExpressionKeyParameters)
        .getValueByIndex(i);
      const parameterId: CubismIdHandle = CubismFramework.getIdManager().getId(
        param.getValueByString(ExpressionKeyId).getRawString()
      ); // Parameter ID

      const value: number = param
        .getValueByString(ExpressionKeyValue)
        .toFloat(); // Value

      // Calculation method settings
      let blendType: ExpressionBlendType;

      if (
        param.getValueByString(ExpressionKeyBlend).isNull() ||
        param.getValueByString(ExpressionKeyBlend).getString() == BlendValueAdd
      ) {
        blendType = ExpressionBlendType.ExpressionBlendType_Add;
      } else if (
        param.getValueByString(ExpressionKeyBlend).getString() ==
        BlendValueMultiply
      ) {
        blendType = ExpressionBlendType.ExpressionBlendType_Multiply;
      } else if (
        param.getValueByString(ExpressionKeyBlend).getString() ==
        BlendValueOverwrite
      ) {
        blendType = ExpressionBlendType.ExpressionBlendType_Overwrite;
      } else {
        // If you set a value that is not in the other specifications, you can recover by setting it to the addition mode.
        blendType = ExpressionBlendType.ExpressionBlendType_Add;
      }

      // Create a configuration object and add it to the list
      const item: ExpressionParameter = new ExpressionParameter();

      item.parameterId = parameterId;
      item.blendType = blendType;
      item.value = value;

      expression._parameters.pushBack(item);
    }

    CubismJson.delete(json); // Delete JSON data when it is no longer needed
    return expression;
  }

  /**
   * Perform model parameter updates
   * @param model Target model
   * @param userTimeSeconds Cumulative value of delta time [seconds]
   * @param weight Motion weight
   * @param motionQueueEntry Motion managed by CubismMotionQueueManager
   */
  public doUpdateParameters(
    model: CubismModel,
    userTimeSeconds: number,
    weight: number,
    motionQueueEntry: CubismMotionQueueEntry
  ): void {
    for (let i = 0; i < this._parameters.getSize(); ++i) {
      const parameter: ExpressionParameter = this._parameters.at(i);

      switch (parameter.blendType) {
        case ExpressionBlendType.ExpressionBlendType_Add: {
          model.addParameterValueById(
            parameter.parameterId,
            parameter.value,
            weight
          );
          break;
        }
        case ExpressionBlendType.ExpressionBlendType_Multiply: {
          model.multiplyParameterValueById(
            parameter.parameterId,
            parameter.value,
            weight
          );
          break;
        }
        case ExpressionBlendType.ExpressionBlendType_Overwrite: {
          model.setParameterValueById(
            parameter.parameterId,
            parameter.value,
            weight
          );
          break;
        }
        default:
          // If you set a value that is not in the specifications, you are already in addition mode.
          break;
      }
    }
  }

  /**
   * Constructor
   */
  constructor() {
    super();

    this._parameters = new csmVector<ExpressionParameter>();
  }

  _parameters: csmVector<ExpressionParameter>; // Facial expression parameter information list
}

/**
 * Calculation method of facial expression parameter value
 */
export enum ExpressionBlendType {
  ExpressionBlendType_Add = 0, // 加算
  ExpressionBlendType_Multiply = 1, // Multiplication
  ExpressionBlendType_Overwrite = 2 // Overwrite
}

/**
 * Facial expression parameter information
 */
export class ExpressionParameter {
  parameterId: CubismIdHandle; // Parameter ID
  blendType: ExpressionBlendType; // Parameter operation type
  value: number; // 値
}

// Namespace definition for compatibility.
import * as $ from './cubismexpressionmotion';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismExpressionMotion = $.CubismExpressionMotion;
  export type CubismExpressionMotion = $.CubismExpressionMotion;
  export const ExpressionBlendType = $.ExpressionBlendType;
  export type ExpressionBlendType = $.ExpressionBlendType;
  export const ExpressionParameter = $.ExpressionParameter;
  export type ExpressionParameter = $.ExpressionParameter;
}