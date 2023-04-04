"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
exports.__esModule = true;
exports.Live2DCubismFramework = exports.CubismVector2 = void 0;
/**
 * 2D vector type
 *
 * Provides 2D vector type functions.
 */
var CubismVector2 = /** @class */ (function () {
    /**
     * Constructor
     */
    function CubismVector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    /**
     * Vector addition
     *
     * @param vector2 Vector value to add
     * @return Addition result vector value
     */
    CubismVector2.prototype.add = function (vector2) {
        var ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x + vector2.x;
        ret.y = this.y + vector2.y;
        return ret;
    };
    /**
     * Vector subtraction
     *
     * @ param vector2 Vector value to subtract
     * @return Subtraction result vector value
     */
    CubismVector2.prototype.substract = function (vector2) {
        var ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x - vector2.x;
        ret.y = this.y - vector2.y;
        return ret;
    };
    /**
     * Vector multiplication
     *
     * @param vector2 Vector value to multiply
     * @return Multiplication result vector value
     */
    CubismVector2.prototype.multiply = function (vector2) {
        var ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x * vector2.x;
        ret.y = this.y * vector2.y;
        return ret;
    };
    /**
     * Vector multiplication (scalar)
     *
     * @param scalar Scalar value to multiply
     * @return Multiplication result vector value
     */
    CubismVector2.prototype.multiplyByScaler = function (scalar) {
        return this.multiply(new CubismVector2(scalar, scalar));
    };
    /**
     * Vector division
     *
     * @param vector2 Vector value to divide
     * @return Division result vector value
     */
    CubismVector2.prototype.division = function (vector2) {
        var ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x / vector2.x;
        ret.y = this.y / vector2.y;
        return ret;
    };
    /**
     * Vector division (scalar)
     *
     * @param scalar Scalar value to divide
     * @return Division result vector value
     */
    CubismVector2.prototype.divisionByScalar = function (scalar) {
        return this.division(new CubismVector2(scalar, scalar));
    };
    /**
     * Get the length of the vector
     *
     * @return Vector length
     */
    CubismVector2.prototype.getLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    /**
     * Get vector distance
     *
     * @param a point
     * @return vector distance
     */
    CubismVector2.prototype.getDistanceWith = function (a) {
        return Math.sqrt((this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y));
    };
    /**
     * Dot product calculation
     *
     * @param a 値
     * @return result
     */
    CubismVector2.prototype.dot = function (a) {
        return this.x * a.x + this.y * a.y;
    };
    /**
     * Apply normalization
     */
    CubismVector2.prototype.normalize = function () {
        var length = Math.pow(this.x * this.x + this.y * this.y, 0.5);
        this.x = this.x / length;
        this.y = this.y / length;
    };
    /**
     * Confirmation of equality (is it equal?)
     *
     * Are the values ​​equal?
     *
     * @param rhs Value to check
     * @return true Values ​​are equal
     * @return false Values ​​are not equal
     */
    CubismVector2.prototype.isEqual = function (rhs) {
        return this.x == rhs.x && this.y == rhs.y;
    };
    /**
     * Confirmation of equality (is it not equal?)
     *
     * Are the values ​​not equal?
     *
     * @param rhs Value to check
     * @return true Values ​​are not equal
     * @return false Values ​​are equal
     */
    CubismVector2.prototype.isNotEqual = function (rhs) {
        return !this.isEqual(rhs);
    };
    return CubismVector2;
}());
exports.CubismVector2 = CubismVector2;
// Namespace definition for compatibility.
var $ = require("./cubismvector2");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismVector2 = $.CubismVector2;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
