"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
exports.__esModule = true;
exports.Live2DCubismFramework = exports.CubismPhysicsRig = exports.CubismPhysicsOutput = exports.CubismPhysicsInput = exports.CubismPhysicsSubRig = exports.CubismPhysicsParticle = exports.CubismPhysicsNormalization = exports.CubismPhysicsParameter = exports.PhysicsJsonEffectiveForces = exports.CubismPhysicsSource = exports.CubismPhysicsTargetType = void 0;
var cubismvector2_1 = require("../math/cubismvector2");
var csmvector_1 = require("../type/csmvector");
/**
 * Type of application of physics calculation
 */
var CubismPhysicsTargetType;
(function (CubismPhysicsTargetType) {
    CubismPhysicsTargetType[CubismPhysicsTargetType["CubismPhysicsTargetType_Parameter"] = 0] = "CubismPhysicsTargetType_Parameter"; // Apply to parameter
})(CubismPhysicsTargetType = exports.CubismPhysicsTargetType || (exports.CubismPhysicsTargetType = {}));
/**
 * Types of physics input
 */
var CubismPhysicsSource;
(function (CubismPhysicsSource) {
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_X"] = 0] = "CubismPhysicsSource_X";
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Y"] = 1] = "CubismPhysicsSource_Y";
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Angle"] = 2] = "CubismPhysicsSource_Angle"; // From an angle
})(CubismPhysicsSource = exports.CubismPhysicsSource || (exports.CubismPhysicsSource = {}));
/**
 * @brief External forces used in physics
 *
 * External force used in physics.
 */
var PhysicsJsonEffectiveForces = /** @class */ (function () {
    function PhysicsJsonEffectiveForces() {
        this.gravity = new cubismvector2_1.CubismVector2(0, 0);
        this.wind = new cubismvector2_1.CubismVector2(0, 0);
    }
    return PhysicsJsonEffectiveForces;
}());
exports.PhysicsJsonEffectiveForces = PhysicsJsonEffectiveForces;
/**
 * Physics parameter information
 */
var CubismPhysicsParameter = /** @class */ (function () {
    function CubismPhysicsParameter() {
        this.id = undefined;
        this.targetType = undefined;
    }
    return CubismPhysicsParameter;
}());
exports.CubismPhysicsParameter = CubismPhysicsParameter;
/**
 * Physics normalization information
 */
var CubismPhysicsNormalization = /** @class */ (function () {
    function CubismPhysicsNormalization() {
        this.minimum = undefined;
        this.maximum = undefined;
        this.defalut = undefined;
    }
    return CubismPhysicsNormalization;
}());
exports.CubismPhysicsNormalization = CubismPhysicsNormalization;
/**
 * Physics Commission Information on the physical points used
 */
var CubismPhysicsParticle = /** @class */ (function () {
    function CubismPhysicsParticle() {
        this.initialPosition = new cubismvector2_1.CubismVector2(0, 0);
        this.position = new cubismvector2_1.CubismVector2(0, 0);
        this.lastPosition = new cubismvector2_1.CubismVector2(0, 0);
        this.lastGravity = new cubismvector2_1.CubismVector2(0, 0);
        this.force = new cubismvector2_1.CubismVector2(0, 0);
        this.velocity = new cubismvector2_1.CubismVector2(0, 0);
        this.mobility = undefined;
        this.delay = undefined;
        this.acceleration = undefined;
        this.radius = undefined;
    }
    return CubismPhysicsParticle;
}());
exports.CubismPhysicsParticle = CubismPhysicsParticle;
/**
 * Management of physical points in physics operations
 */
var CubismPhysicsSubRig = /** @class */ (function () {
    function CubismPhysicsSubRig() {
        this.normalizationPosition = new CubismPhysicsNormalization();
        this.normalizationAngle = new CubismPhysicsNormalization();
        this.inputCount = undefined;
        this.outputCount = undefined;
        this.particleCount = undefined;
        this.baseInputIndex = undefined;
        this.baseOutputIndex = undefined;
        this.baseParticleIndex = undefined;
    }
    return CubismPhysicsSubRig;
}());
exports.CubismPhysicsSubRig = CubismPhysicsSubRig;
/**
 * Input information for physics calculation
 */
var CubismPhysicsInput = /** @class */ (function () {
    function CubismPhysicsInput() {
        this.source = new CubismPhysicsParameter();
        this.sourceParameterIndex = undefined;
        this.weight = undefined;
        this.type = undefined;
        this.reflect = undefined;
        this.getNormalizedParameterValue = undefined;
    }
    return CubismPhysicsInput;
}());
exports.CubismPhysicsInput = CubismPhysicsInput;
/**
 * @brief Output information of physics calculation
 *
 * Output information of physics calculation.
 */
var CubismPhysicsOutput = /** @class */ (function () {
    function CubismPhysicsOutput() {
        this.destination = new CubismPhysicsParameter();
        this.translationScale = new cubismvector2_1.CubismVector2(0, 0);
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
    return CubismPhysicsOutput;
}());
exports.CubismPhysicsOutput = CubismPhysicsOutput;
/**
 * @brief Physics data
 *
 * Physics data.
 */
var CubismPhysicsRig = /** @class */ (function () {
    function CubismPhysicsRig() {
        this.subRigCount = 0;
        this.settings = new csmvector_1.csmVector();
        this.inputs = new csmvector_1.csmVector();
        this.outputs = new csmvector_1.csmVector();
        this.particles = new csmvector_1.csmVector();
        this.gravity = new cubismvector2_1.CubismVector2(0, 0);
        this.wind = new cubismvector2_1.CubismVector2(0, 0);
    }
    return CubismPhysicsRig;
}());
exports.CubismPhysicsRig = CubismPhysicsRig;
// Namespace definition for compatibility.
var $ = require("./cubismphysicsinternal");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
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
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
