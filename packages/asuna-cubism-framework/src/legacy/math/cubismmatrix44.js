"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
exports.__esModule = true;
exports.Live2DCubismFramework = exports.CubismMatrix44 = void 0;
/**
 * 4x4 matrix
 *
 * Convenient class for 4x4 matrices.
 */
var CubismMatrix44 = /** @class */ (function () {
    /**
     * Constructor
     */
    function CubismMatrix44() {
        this._tr = new Float32Array(16); // 4 * 4 size
        this.loadIdentity();
    }
    /**
     * Multiply the two received matrices.
     *
     * @param a row column a
     * @param b row and column b
     * @return Multiplication result matrix
     */
    CubismMatrix44.multiply = function (a, b, dst) {
        var c = new Float32Array([
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0
        ]);
        var n = 4;
        for (var i = 0; i < n; ++i) {
            for (var j = 0; j < n; ++j) {
                for (var k = 0; k < n; ++k) {
                    c[j + i * 4] += a[k + i * 4] * b[j + k * 4];
                }
            }
        }
        for (var i = 0; i < 16; ++i) {
            dst[i] = c[i];
        }
    };
    /**
     * Initialize to identity matrix
     */
    CubismMatrix44.prototype.loadIdentity = function () {
        var c = new Float32Array([
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0
        ]);
        this.setMatrix(c);
    };
    /**
     * Set matrix
     *
     * @param tr A 4x4 matrix represented by 16 floating point numbers
     */
    CubismMatrix44.prototype.setMatrix = function (tr) {
        for (var i = 0; i < 16; ++i) {
            this._tr[i] = tr[i];
        }
    };
    /**
     * Get a matrix as an array of floating point numbers
     *
     * @return A 4x4 matrix represented by 16 floating point numbers
     */
    CubismMatrix44.prototype.getArray = function () {
        return this._tr;
    };
    /**
     * Get X-axis magnification
     * @return X-axis magnification
     */
    CubismMatrix44.prototype.getScaleX = function () {
        return this._tr[0];
    };
    /**
     * Get the Y-axis magnification
     *
     * @return Y-axis magnification
     */
    CubismMatrix44.prototype.getScaleY = function () {
        return this._tr[5];
    };
    /**
     * Get the movement amount of the X axis
     * @return X-axis movement
     */
    CubismMatrix44.prototype.getTranslateX = function () {
        return this._tr[12];
    };
    /**
     * Get the movement amount of Y axis
     * @return Y-axis movement
     */
    CubismMatrix44.prototype.getTranslateY = function () {
        return this._tr[13];
    };
    /**
     * Calculate X-axis values ​​in the current matrix
     *
     * @param src X-axis value
     * @return X-axis value calculated in the current matrix
     */
    CubismMatrix44.prototype.transformX = function (src) {
        return this._tr[0] * src + this._tr[12];
    };
    /**
     * Calculate Y-axis value with current matrix
     *
     * @param src Y-axis value
     * @return Y-axis value calculated in the current matrix
     */
    CubismMatrix44.prototype.transformY = function (src) {
        return this._tr[5] * src + this._tr[13];
    };
    /**
     * Inverse calculation of X-axis values ​​in the current matrix
     */
    CubismMatrix44.prototype.invertTransformX = function (src) {
        return (src - this._tr[12]) / this._tr[0];
    };
    /**
     * Inversely calculate the Y-axis value in the current matrix
     */
    CubismMatrix44.prototype.invertTransformY = function (src) {
        return (src - this._tr[13]) / this._tr[5];
    };
    /**
     * Move from the current matrix position
     *
     * Move relative to the current matrix position as the starting point.
     *
     * @param x X-axis movement
     * @param y Y-axis movement
     */
    CubismMatrix44.prototype.translateRelative = function (x, y) {
        var tr1 = new Float32Array([
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            x,
            y,
            0.0,
            1.0
        ]);
        CubismMatrix44.multiply(tr1, this._tr, this._tr);
    };
    /**
     * Move the position of the current matrix
     *
     * Move the current matrix position to the specified position
     *
     * @param x X-axis movement
     * @param yy Axis movement amount
     */
    CubismMatrix44.prototype.translate = function (x, y) {
        this._tr[12] = x;
        this._tr[13] = y;
    };
    /**
     * Moves the position of the X-axis of the current matrix to the specified position
     *
     * @param x X-axis movement
     */
    CubismMatrix44.prototype.translateX = function (x) {
        this._tr[12] = x;
    };
    /**
     * Moves the Y-axis position of the current matrix to the specified position
     *
     * @param y Y-axis movement
     */
    CubismMatrix44.prototype.translateY = function (y) {
        this._tr[13] = y;
    };
    /**
     * Set the magnification of the current matrix relatively
     *
     * @param x X-axis magnification
     * @param y Y-axis magnification
     */
    CubismMatrix44.prototype.scaleRelative = function (x, y) {
        var tr1 = new Float32Array([
            x,
            0.0,
            0.0,
            0.0,
            0.0,
            y,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            0.0,
            1.0
        ]);
        CubismMatrix44.multiply(tr1, this._tr, this._tr);
    };
    /**
     * Set the magnification of the current matrix to the specified magnification
     *
     * @param x X-axis magnification
     * @param y Y-axis magnification
     */
    CubismMatrix44.prototype.scale = function (x, y) {
        this._tr[0] = x;
        this._tr[5] = y;
    };
    /**
     * Multiply the current matrix by the matrix
     *
     * @param m row and column
     */
    CubismMatrix44.prototype.multiplyByMatrix = function (m) {
        CubismMatrix44.multiply(m.getArray(), this._tr, this._tr);
    };
    /**
     * Make a copy of the object
     */
    CubismMatrix44.prototype.clone = function () {
        var cloneMatrix = new CubismMatrix44();
        for (var i = 0; i < this._tr.length; i++) {
            cloneMatrix._tr[i] = this._tr[i];
        }
        return cloneMatrix;
    };
    return CubismMatrix44;
}());
exports.CubismMatrix44 = CubismMatrix44;
// Namespace definition for compatibility.
var $ = require("./cubismmatrix44");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMatrix44 = $.CubismMatrix44;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
