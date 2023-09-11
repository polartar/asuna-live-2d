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
export var CubismPhysicsTargetType;
(function (CubismPhysicsTargetType) {
    CubismPhysicsTargetType[CubismPhysicsTargetType["CubismPhysicsTargetType_Parameter"] = 0] = "CubismPhysicsTargetType_Parameter"; // Apply to parameter
})(CubismPhysicsTargetType || (CubismPhysicsTargetType = {}));
/**
 * Types of physics input
 */
export var CubismPhysicsSource;
(function (CubismPhysicsSource) {
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_X"] = 0] = "CubismPhysicsSource_X";
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Y"] = 1] = "CubismPhysicsSource_Y";
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Angle"] = 2] = "CubismPhysicsSource_Angle"; // From an angle
})(CubismPhysicsSource || (CubismPhysicsSource = {}));
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
}
/**
 * Physics parameter information
 */
export class CubismPhysicsParameter {
    constructor() {
        this.id = undefined;
        this.targetType = undefined;
    }
}
/**
 * Physics normalization information
 */
export class CubismPhysicsNormalization {
    constructor() {
        this.minimum = undefined;
        this.maximum = undefined;
        this.defalut = undefined;
    }
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
        this.mobility = undefined;
        this.delay = undefined;
        this.acceleration = undefined;
        this.radius = undefined;
    }
}
/**
 * Management of physical points in physics operations
 */
export class CubismPhysicsSubRig {
    constructor() {
        this.normalizationPosition = new CubismPhysicsNormalization();
        this.normalizationAngle = new CubismPhysicsNormalization();
        this.inputCount = undefined;
        this.outputCount = undefined;
        this.particleCount = undefined;
        this.baseInputIndex = undefined;
        this.baseOutputIndex = undefined;
        this.baseParticleIndex = undefined;
    }
}
/**
 * Input information for physics calculation
 */
export class CubismPhysicsInput {
    constructor() {
        this.source = new CubismPhysicsParameter();
        this.sourceParameterIndex = undefined;
        this.weight = undefined;
        this.type = undefined;
        this.reflect = undefined;
        this.getNormalizedParameterValue = undefined;
    }
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
        this.destinationParameterIndex = undefined;
        this.vertexIndex = undefined;
        this.angleScale = undefined;
        this.weight = undefined;
        this.type = undefined;
        this.reflect = undefined;
        this.valueBelowMinimum = undefined;
        this.valueExceededMaximum = undefined;
        this.getValue = undefined;
        this.getScale = undefined;
    }
}
/**
 * @brief Physics data
 *
 * Physics data.
 */
export class CubismPhysicsRig {
    constructor() {
        this.subRigCount = 0;
        this.settings = new csmVector();
        this.inputs = new csmVector();
        this.outputs = new csmVector();
        this.particles = new csmVector();
        this.gravity = new CubismVector2(0, 0);
        this.wind = new CubismVector2(0, 0);
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismphysicsinternal';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismPhysicsInput = $.CubismPhysicsInput;
    Live2DCubismFramework.CubismPhysicsNormalization = $.CubismPhysicsNormalization;
    Live2DCubismFramework.CubismPhysicsOutput = $.CubismPhysicsOutput;
    Live2DCubismFramework.CubismPhysicsParameter = $.CubismPhysicsParameter;
    Live2DCubismFramework.CubismPhysicsParticle = $.CubismPhysicsParticle;
    Live2DCubismFramework.CubismPhysicsRig = $.CubismPhysicsRig;
    Live2DCubismFramework.CubismPhysicsSource = $.CubismPhysicsSource;
    Live2DCubismFramework.CubismPhysicsSubRig = $.CubismPhysicsSubRig;
    Live2DCubismFramework.CubismPhysicsTargetType = $.CubismPhysicsTargetType;
    Live2DCubismFramework.PhysicsJsonEffectiveForces = $.PhysicsJsonEffectiveForces;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismphysicsinternal.js.map