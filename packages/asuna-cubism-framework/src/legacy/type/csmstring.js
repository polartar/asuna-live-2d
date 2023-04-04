"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
exports.__esModule = true;
exports.Live2DCubismFramework = exports.csmString = void 0;
/**
 * String class.
 */
var csmString = /** @class */ (function () {
    /**
     * Constructor with arguments
     */
    function csmString(s) {
        this.s = s;
    }
    /**
     * Add a string to the back
     *
     * @param c Character string to add
     * @return Updated string
     */
    csmString.prototype.append = function (c, length) {
        this.s += length !== undefined ? c.substr(0, length) : c;
        return this;
    };
    /**
     * Expand the font size to fill the font
     * @param length Number of characters to expand
     * @param v Character to fill
     * @return Updated string
     */
    csmString.prototype.expansion = function (length, v) {
        for (var i = 0; i < length; i++) {
            this.append(v);
        }
        return this;
    };
    /**
     * Get the length of the string in bytes
     */
    csmString.prototype.getBytes = function () {
        return encodeURIComponent(this.s).replace(/%../g, 'x').length;
    };
    /**
     * Returns the length of the string
     */
    csmString.prototype.getLength = function () {
        return this.s.length;
    };
    /**
     * String comparison <
     * @param s String to compare
     * @return true: less than the string to compare
     * @return false: Greater than the string to compare
     */
    csmString.prototype.isLess = function (s) {
        return this.s < s.s;
    };
    /**
     * Text column comparison>
     * @param s String to compare
     * @return true: Greater than the string to compare
     * @return false: less than the string to compare
     */
    csmString.prototype.isGreat = function (s) {
        return this.s > s.s;
    };
    /**
     * String comparison ==
     * @param s String to compare
     * @return true: equal to the string to compare
     * @return false: Different from the string to compare
     */
    csmString.prototype.isEqual = function (s) {
        return this.s == s;
    };
    /**
     * Whether the string is empty
     * @return true: empty string
     * @return false: Value is set
     */
    csmString.prototype.isEmpty = function () {
        return this.s.length == 0;
    };
    return csmString;
}());
exports.csmString = csmString;
// Namespace definition for compatibility.
var $ = require("./csmstring");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmString = $.csmString;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
