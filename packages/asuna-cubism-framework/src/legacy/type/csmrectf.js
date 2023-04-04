"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
exports.__esModule = true;
exports.Live2DCubismFramework = exports.csmRect = void 0;
/**
 * A class that defines a rectangular shape (coordinates and length are float values)
 */
var csmRect = /** @class */ (function () {
    /**
     * Constructor
     * @param x left X coordinate
     * @param y upper Y coordinate
     * @param w width
     * @param h height
     */
    function csmRect(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 0;
        this.height = h || 0;
    }
    /**
     * Get the X coordinate of the center of the rectangle
     */
    csmRect.prototype.getCenterX = function () {
        return this.x + 0.5 * this.width;
    };
    /**
     * Get the Y coordinate of the center of the rectangle
     */
    csmRect.prototype.getCenterY = function () {
        return this.y + 0.5 * this.height;
    };
    /**
     * Get the right X coordinate
     */
    csmRect.prototype.getRight = function () {
        return this.x + this.width;
    };
    /**
     * Get the Y coordinate of the bottom edge
     */
    csmRect.prototype.getBottom = function () {
        return this.y + this.height;
    };
    /**
     * Set the value to the rectangle
     * @param r Rectangle instance
     */
    csmRect.prototype.setRect = function (r) {
        this.x = r.x;
        this.y = r.y;
        this.width = r.width;
        this.height = r.height;
    };
    /**
     * Scales vertically and horizontally around the center of the rectangle
     * @param w Amount to scale in the width direction
     * @param h Amount of scaling in the height direction
     */
    csmRect.prototype.expand = function (w, h) {
        this.x -= w;
        this.y -= h;
        this.width += w * 2.0;
        this.height += h * 2.0;
    };
    return csmRect;
}());
exports.csmRect = csmRect;
// Namespace definition for compatibility.
var $ = require("./csmrectf");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmRect = $.csmRect;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
