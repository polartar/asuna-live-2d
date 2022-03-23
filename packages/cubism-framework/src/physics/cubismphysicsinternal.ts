/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { CubismVector2 } from '../math/cubismvector2';
import { csmVector } from '../type/csmvector';

/**
 * Type of application of physics calculation
 */
export enum CubismPhysicsTargetType {
  CubismPhysicsTargetType_Parameter // Apply to parameter
}

/**
 * Types of physics input
 */
export enum CubismPhysicsSource {
  CubismPhysicsSource_X, // From the position of the X axis
  CubismPhysicsSource_Y, // From the position of the Y axis
  CubismPhysicsSource_Angle // From an angle
}

/**
 * @brief External forces used in physics
 *
 * External force used in physics.
 */
export class PhysicsJsonEffectiveForces {
  constructor() {
    this.gravity = new CubismVector2(0, 0);
    this.wind = new CubismVector2(0, 0);
  }
  gravity: CubismVector2; // gravity
  wind: CubismVector2; // wind
}

/**
 * Physics parameter information
 */
export class CubismPhysicsParameter {
  id: CubismIdHandle; // Parameters
  targetType: CubismPhysicsTargetType; // Type of application
}

/**
 * Physics normalization information
 */
export class CubismPhysicsNormalization {
  minimum: number; // maximum value
  maximum: number; // minimum value
  defalut: number; // default value
}

/**
 * Physics Commission Information on the physical points used
 */
export class CubismPhysicsParticle {
  constructor() {
    this.initialPosition = new CubismVector2(0, 0);
    this.position = new CubismVector2(0, 0);
    this.lastPosition = new CubismVector2(0, 0);
    this.lastGravity = new CubismVector2(0, 0);
    this.force = new CubismVector2(0, 0);
    this.velocity = new CubismVector2(0, 0);
  }

  initialPosition: CubismVector2; // initial position
  mobility: number; // Ease of movement
  delay: number; // Delay
  acceleration: number; // acceleration
  radius: number; // distance
  position: CubismVector2; // current position
  lastPosition: CubismVector2; // Last position
  lastGravity: CubismVector2; // Last gravity
  force: CubismVector2; // The force currently applied
  velocity: CubismVector2; // Current velocity
}

/**
 * Management of physical points in physics operations
 */
export class CubismPhysicsSubRig {
  constructor() {
    this.normalizationPosition = new CubismPhysicsNormalization();
    this.normalizationAngle = new CubismPhysicsNormalization();
  }
  inputCount: number; // Number of inputs
  outputCount: number; // Number of outputs
  particleCount: number; // Number of physical points
  baseInputIndex: number; // First index of input
  baseOutputIndex: number; // First index of output
  baseParticleIndex: number; // First index of physical point
  normalizationPosition: CubismPhysicsNormalization; // Normalized position
  normalizationAngle: CubismPhysicsNormalization; // Normalized angle
}

/**
 * Declaration of function to get normalized parameters
 * @param targetTranslation // Movement value of operation result
 * @param targetAngle // Angle of operation result
 * @param value // Parameter value
 * @param parameterMinimunValue // Minimum parameter value
 * @param parameterMaximumValue // Maximum parameter value
 * @param parameterDefaultValue // Default value of the parameter
 * @param normalizationPosition // Normalized position
 * @param normalizationAngle // Normalized angle
 * @param isInverted // Is the value inverted?
 * @param weight // Weight
 */
export interface normalizedPhysicsParameterValueGetter {
  (
    targetTranslation: CubismVector2,
    targetAngle: { angle: number },
    value: number,
    parameterMinimunValue: number,
    parameterMaximumValue: number,
    parameterDefaultValue: number,
    normalizationPosition: CubismPhysicsNormalization,
    normalizationAngle: CubismPhysicsNormalization,
    isInverted: boolean,
    weight: number
  ): void;
}

/**
 * Declaration of function to get physics value
 * @param translation Move value
 * @param particles List of physical points
 * @param isInverted Does the value reflect?
 * @param parentGravity Gravity
 * @return value
 */
export interface physicsValueGetter {
  (
    translation: CubismVector2,
    particles: CubismPhysicsParticle[],
    particleIndex: number,
    isInverted: boolean,
    parentGravity: CubismVector2
  ): number;
}

/**
 * Declaration of physics scale acquisition function
 * @param translationScale Scale of movement value
 * @param angleScale Angle scale
 * @return Scale value
 */
export interface physicsScaleGetter {
  (translationScale: CubismVector2, angleScale: number): number;
}

/**
 * Input information for physics calculation
 */
export class CubismPhysicsInput {
  constructor() {
    this.source = new CubismPhysicsParameter();
  }
  source: CubismPhysicsParameter; // Input source parameter
  sourceParameterIndex: number; // Index of the input source parameter
  weight: number; // Weight
  type: number; // Input type
  reflect: boolean; // Whether the value is inverted
  getNormalizedParameterValue: normalizedPhysicsParameterValueGetter; // Function to get normalized parameter value
}

/**
 * @brief Output information of physics calculation
 *
 * Output information of physics calculation.
 */
export class CubismPhysicsOutput {
  constructor() {
    this.destination = new CubismPhysicsParameter();
    this.translationScale = new CubismVector2(0, 0);
  }

  destination: CubismPhysicsParameter; // Output destination parameter
  destinationParameterIndex: number; // Index of output destination parameters
  vertexIndex: number; // Pendulum index
  translationScale: CubismVector2; // Scale of movement value
  angleScale: number; // Angle scale: number; //
  weight: number; // Weight
  type: CubismPhysicsSource; // Output type
  reflect: boolean; // Whether the value is inverted
  valueBelowMinimum: number; // Value below the minimum value
  valueExceededMaximum: number; // Value when the maximum value is exceeded
  getValue: physicsValueGetter; // Function to get the value of physics
  getScale: physicsScaleGetter; // Function to get the scale value of physics
}

/**
 * @brief Physics data
 *
 * Physics data.
 */
export class CubismPhysicsRig {
  constructor() {
    this.settings = new csmVector<CubismPhysicsSubRig>();
    this.inputs = new csmVector<CubismPhysicsInput>();
    this.outputs = new csmVector<CubismPhysicsOutput>();
    this.particles = new csmVector<CubismPhysicsParticle>();
    this.gravity = new CubismVector2(0, 0);
    this.wind = new CubismVector2(0, 0);
  }

  subRigCount: number; // Number of physics points in physics
  settings: csmVector<CubismPhysicsSubRig>; // List of physics point management
  inputs: csmVector<CubismPhysicsInput>; // List of physics inputs
  outputs: csmVector<CubismPhysicsOutput>; // List of physics output
  particles: csmVector<CubismPhysicsParticle>; // List of physics points for physics
  gravity: CubismVector2; // gravity
  wind: CubismVector2; // wind
}

// Namespace definition for compatibility.
import * as $ from './cubismphysicsinternal';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismPhysicsInput = $.CubismPhysicsInput;
  export type CubismPhysicsInput = $.CubismPhysicsInput;
  export const CubismPhysicsNormalization = $.CubismPhysicsNormalization;
  export type CubismPhysicsNormalization = $.CubismPhysicsNormalization;
  export const CubismPhysicsOutput = $.CubismPhysicsOutput;
  export type CubismPhysicsOutput = $.CubismPhysicsOutput;
  export const CubismPhysicsParameter = $.CubismPhysicsParameter;
  export type CubismPhysicsParameter = $.CubismPhysicsParameter;
  export const CubismPhysicsParticle = $.CubismPhysicsParticle;
  export type CubismPhysicsParticle = $.CubismPhysicsParticle;
  export const CubismPhysicsRig = $.CubismPhysicsRig;
  export type CubismPhysicsRig = $.CubismPhysicsRig;
  export const CubismPhysicsSource = $.CubismPhysicsSource;
  export type CubismPhysicsSource = $.CubismPhysicsSource;
  export const CubismPhysicsSubRig = $.CubismPhysicsSubRig;
  export type CubismPhysicsSubRig = $.CubismPhysicsSubRig;
  export const CubismPhysicsTargetType = $.CubismPhysicsTargetType;
  export type CubismPhysicsTargetType = $.CubismPhysicsTargetType;
  export const PhysicsJsonEffectiveForces = $.PhysicsJsonEffectiveForces;
  export type PhysicsJsonEffectiveForces = $.PhysicsJsonEffectiveForces;
  export type normalizedPhysicsParameterValueGetter = $.normalizedPhysicsParameterValueGetter;
  export type physicsScaleGetter = $.physicsScaleGetter;
  export type physicsValueGetter = $.physicsValueGetter;
}