/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismVector2 } from '../math/cubismvector2';
import { csmVector } from '../type/csmvector';
/**
 * Type of application of physics calculation
 */
export declare enum CubismPhysicsTargetType {
    CubismPhysicsTargetType_Parameter = 0
}
/**
 * Types of physics input
 */
export declare enum CubismPhysicsSource {
    CubismPhysicsSource_X = 0,
    CubismPhysicsSource_Y = 1,
    CubismPhysicsSource_Angle = 2
}
/**
 * @brief External forces used in physics
 *
 * External force used in physics.
 */
export declare class PhysicsJsonEffectiveForces {
    constructor();
    gravity: CubismVector2;
    wind: CubismVector2;
}
/**
 * Physics parameter information
 */
export declare class CubismPhysicsParameter {
    constructor();
    id: string;
    targetType: CubismPhysicsTargetType;
}
/**
 * Physics normalization information
 */
export declare class CubismPhysicsNormalization {
    constructor();
    minimum: number;
    maximum: number;
    defalut: number;
}
/**
 * Physics Commission Information on the physical points used
 */
export declare class CubismPhysicsParticle {
    constructor();
    initialPosition: CubismVector2;
    mobility: number;
    delay: number;
    acceleration: number;
    radius: number;
    position: CubismVector2;
    lastPosition: CubismVector2;
    lastGravity: CubismVector2;
    force: CubismVector2;
    velocity: CubismVector2;
}
/**
 * Management of physical points in physics operations
 */
export declare class CubismPhysicsSubRig {
    constructor();
    inputCount: number;
    outputCount: number;
    particleCount: number;
    baseInputIndex: number;
    baseOutputIndex: number;
    baseParticleIndex: number;
    normalizationPosition: CubismPhysicsNormalization;
    normalizationAngle: CubismPhysicsNormalization;
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
    (targetTranslation: CubismVector2, targetAngle: {
        angle: number;
    }, value: number, parameterMinimunValue: number, parameterMaximumValue: number, parameterDefaultValue: number, normalizationPosition: CubismPhysicsNormalization, normalizationAngle: CubismPhysicsNormalization, isInverted: boolean, weight: number): void;
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
    (translation: CubismVector2, particles: CubismPhysicsParticle[], particleIndex: number, isInverted: boolean, parentGravity: CubismVector2): number;
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
export declare class CubismPhysicsInput {
    constructor();
    source: CubismPhysicsParameter;
    sourceParameterIndex: number;
    weight: number;
    type: number;
    reflect: boolean;
    getNormalizedParameterValue: normalizedPhysicsParameterValueGetter;
}
/**
 * @brief Output information of physics calculation
 *
 * Output information of physics calculation.
 */
export declare class CubismPhysicsOutput {
    constructor();
    destination: CubismPhysicsParameter;
    destinationParameterIndex: number;
    vertexIndex: number;
    translationScale: CubismVector2;
    angleScale: number;
    weight: number;
    type: CubismPhysicsSource;
    reflect: boolean;
    valueBelowMinimum: number;
    valueExceededMaximum: number;
    getValue: physicsValueGetter;
    getScale: physicsScaleGetter;
}
/**
 * @brief Physics data
 *
 * Physics data.
 */
export declare class CubismPhysicsRig {
    constructor();
    subRigCount: number;
    settings: csmVector<CubismPhysicsSubRig>;
    inputs: csmVector<CubismPhysicsInput>;
    outputs: csmVector<CubismPhysicsOutput>;
    particles: csmVector<CubismPhysicsParticle>;
    gravity: CubismVector2;
    wind: CubismVector2;
}
import * as $ from './cubismphysicsinternal';
export declare namespace Live2DCubismFramework {
    const CubismPhysicsInput: typeof $.CubismPhysicsInput;
    type CubismPhysicsInput = $.CubismPhysicsInput;
    const CubismPhysicsNormalization: typeof $.CubismPhysicsNormalization;
    type CubismPhysicsNormalization = $.CubismPhysicsNormalization;
    const CubismPhysicsOutput: typeof $.CubismPhysicsOutput;
    type CubismPhysicsOutput = $.CubismPhysicsOutput;
    const CubismPhysicsParameter: typeof $.CubismPhysicsParameter;
    type CubismPhysicsParameter = $.CubismPhysicsParameter;
    const CubismPhysicsParticle: typeof $.CubismPhysicsParticle;
    type CubismPhysicsParticle = $.CubismPhysicsParticle;
    const CubismPhysicsRig: typeof $.CubismPhysicsRig;
    type CubismPhysicsRig = $.CubismPhysicsRig;
    const CubismPhysicsSource: typeof $.CubismPhysicsSource;
    type CubismPhysicsSource = $.CubismPhysicsSource;
    const CubismPhysicsSubRig: typeof $.CubismPhysicsSubRig;
    type CubismPhysicsSubRig = $.CubismPhysicsSubRig;
    const CubismPhysicsTargetType: typeof $.CubismPhysicsTargetType;
    type CubismPhysicsTargetType = $.CubismPhysicsTargetType;
    const PhysicsJsonEffectiveForces: typeof $.PhysicsJsonEffectiveForces;
    type PhysicsJsonEffectiveForces = $.PhysicsJsonEffectiveForces;
    type normalizedPhysicsParameterValueGetter = $.normalizedPhysicsParameterValueGetter;
    type physicsScaleGetter = $.physicsScaleGetter;
    type physicsValueGetter = $.physicsValueGetter;
}
//# sourceMappingURL=cubismphysicsinternal.d.ts.map