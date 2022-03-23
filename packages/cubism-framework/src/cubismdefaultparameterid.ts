/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

/**
 * @brief A constant that holds the default value of the parameter ID <br>
 * Default value specifications are based on the following manual <br>
 *         https://docs.live2d.com/cubism-editor-manual/standard-parametor-list/
 */
export const CubismDefaultParameterId = Object.freeze<Record<string, string>>({
  // Part ID
  HitAreaPrefix: 'HitArea',
  HitAreaHead: 'Head',
  HitAreaBody: 'Body',
  PartsIdCore: 'Parts01Core',
  PartsArmPrefix: 'Parts01Arm_',
  PartsArmLPrefix: 'Parts01ArmL_',
  PartsArmRPrefix: 'Parts01ArmR_',
  // Parameter ID
  ParamAngleX: 'PARAM_ANGLE_X',
  ParamAngleY: 'PARAM_ANGLE_Y',
  ParamAngleZ: 'PARAM_ANGLE_Z',
  ParamEyeLOpen: 'ParamEyeLOpen',
  ParamEyeLSmile: 'ParamEyeLSmile',
  ParamEyeROpen: 'ParamEyeROpen',
  ParamEyeRSmile: 'ParamEyeRSmile',
  ParamEyeBallX: 'PARAM_EYE_BALL_X',
  ParamEyeBallY: 'PARAM_EYE_BALL_Y',
  ParamEyeBallForm: 'ParamEyeBallForm',
  ParamBrowLY: 'ParamBrowLY',
  ParamBrowRY: 'ParamBrowRY',
  ParamBrowLX: 'ParamBrowLX',
  ParamBrowRX: 'ParamBrowRX',
  ParamBrowLAngle: 'ParamBrowLAngle',
  ParamBrowRAngle: 'ParamBrowRAngle',
  ParamBrowLForm: 'ParamBrowLForm',
  ParamBrowRForm: 'ParamBrowRForm',
  ParamMouthForm: 'ParamMouthForm',
  ParamMouthOpenY: 'ParamMouthOpenY',
  ParamCheek: 'ParamCheek',
  ParamBodyAngleX: 'PARAM_BODY_ANGLE_X',
  ParamBodyAngleY: 'PARAM_BODY_ANGLE_Y',
  ParamBodyAngleZ: 'PARAM_BODY_ANGLE_Z',
  ParamBreath: 'ParamBreath',
  ParamArmLA: 'ParamArmLA',
  ParamArmRA: 'ParamArmRA',
  ParamArmLB: 'ParamArmLB',
  ParamArmRB: 'ParamArmRB',
  ParamHandL: 'ParamHandL',
  ParamHandR: 'ParamHandR',
  ParamHairFront: 'ParamHairFront',
  ParamHairSide: 'ParamHairSide',
  ParamHairBack: 'ParamHairBack',
  ParamHairFluffy: 'ParamHairFluffy',
  ParamShoulderY: 'ParamShoulderY',
  ParamBustX: 'ParamBustX',
  ParamBustY: 'ParamBustY',
  ParamBaseX: 'ParamBaseX',
  ParamBaseY: 'ParamBaseY',
  ParamNONE: 'NONE:'
});

// Namespace definition for compatibility.
import * as $ from './cubismdefaultparameterid';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const HitAreaBody = $.CubismDefaultParameterId.HitAreaBody;
  export const HitAreaHead = $.CubismDefaultParameterId.HitAreaHead;
  export const HitAreaPrefix = $.CubismDefaultParameterId.HitAreaPrefix;
  export const ParamAngleX = $.CubismDefaultParameterId.ParamAngleX;
  export const ParamAngleY = $.CubismDefaultParameterId.ParamAngleY;
  export const ParamAngleZ = $.CubismDefaultParameterId.ParamAngleZ;
  export const ParamArmLA = $.CubismDefaultParameterId.ParamArmLA;
  export const ParamArmLB = $.CubismDefaultParameterId.ParamArmLB;
  export const ParamArmRA = $.CubismDefaultParameterId.ParamArmRA;
  export const ParamArmRB = $.CubismDefaultParameterId.ParamArmRB;
  export const ParamBaseX = $.CubismDefaultParameterId.ParamBaseX;
  export const ParamBaseY = $.CubismDefaultParameterId.ParamBaseY;
  export const ParamBodyAngleX = $.CubismDefaultParameterId.ParamBodyAngleX;
  export const ParamBodyAngleY = $.CubismDefaultParameterId.ParamBodyAngleY;
  export const ParamBodyAngleZ = $.CubismDefaultParameterId.ParamBodyAngleZ;
  export const ParamBreath = $.CubismDefaultParameterId.ParamBreath;
  export const ParamBrowLAngle = $.CubismDefaultParameterId.ParamBrowLAngle;
  export const ParamBrowLForm = $.CubismDefaultParameterId.ParamBrowLForm;
  export const ParamBrowLX = $.CubismDefaultParameterId.ParamBrowLX;
  export const ParamBrowLY = $.CubismDefaultParameterId.ParamBrowLY;
  export const ParamBrowRAngle = $.CubismDefaultParameterId.ParamBrowRAngle;
  export const ParamBrowRForm = $.CubismDefaultParameterId.ParamBrowRForm;
  export const ParamBrowRX = $.CubismDefaultParameterId.ParamBrowRX;
  export const ParamBrowRY = $.CubismDefaultParameterId.ParamBrowRY;
  export const ParamBustX = $.CubismDefaultParameterId.ParamBustX;
  export const ParamBustY = $.CubismDefaultParameterId.ParamBustY;
  export const ParamCheek = $.CubismDefaultParameterId.ParamCheek;
  export const ParamEyeBallForm = $.CubismDefaultParameterId.ParamEyeBallForm;
  export const ParamEyeBallX = $.CubismDefaultParameterId.ParamEyeBallX;
  export const ParamEyeBallY = $.CubismDefaultParameterId.ParamEyeBallY;
  export const ParamEyeLOpen = $.CubismDefaultParameterId.ParamEyeLOpen;
  export const ParamEyeLSmile = $.CubismDefaultParameterId.ParamEyeLSmile;
  export const ParamEyeROpen = $.CubismDefaultParameterId.ParamEyeROpen;
  export const ParamEyeRSmile = $.CubismDefaultParameterId.ParamEyeRSmile;
  export const ParamHairBack = $.CubismDefaultParameterId.ParamHairBack;
  export const ParamHairFluffy = $.CubismDefaultParameterId.ParamHairFluffy;
  export const ParamHairFront = $.CubismDefaultParameterId.ParamHairFront;
  export const ParamHairSide = $.CubismDefaultParameterId.ParamHairSide;
  export const ParamHandL = $.CubismDefaultParameterId.ParamHandL;
  export const ParamHandR = $.CubismDefaultParameterId.ParamHandR;
  export const ParamMouthForm = $.CubismDefaultParameterId.ParamMouthForm;
  export const ParamMouthOpenY = $.CubismDefaultParameterId.ParamMouthOpenY;
  export const ParamNONE = $.CubismDefaultParameterId.ParamNONE;
  export const ParamShoulderY = $.CubismDefaultParameterId.ParamShoulderY;
  export const PartsArmLPrefix = $.CubismDefaultParameterId.PartsArmLPrefix;
  export const PartsArmPrefix = $.CubismDefaultParameterId.PartsArmPrefix;
  export const PartsArmRPrefix = $.CubismDefaultParameterId.PartsArmRPrefix;
  export const PartsIdCore = $.CubismDefaultParameterId.PartsIdCore;
}
