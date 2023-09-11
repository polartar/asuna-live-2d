/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * String class.
 */
export class csmString {
    /**
     * Add a string to the back
     *
     * @param c Character string to add
     * @return Updated string
     */
    append(c, length) {
        this.s += length !== undefined ? c.substr(0, length) : c;
        return this;
    }
    /**
     * Expand the font size to fill the font
     * @param length Number of characters to expand
     * @param v Character to fill
     * @return Updated string
     */
    expansion(length, v) {
        for (let i = 0; i < length; i++) {
            this.append(v);
        }
        return this;
    }
    /**
     * Get the length of the string in bytes
     */
    getBytes() {
        return encodeURIComponent(this.s).replace(/%../g, 'x').length;
    }
    /**
     * Returns the length of the string
     */
    getLength() {
        return this.s.length;
    }
    /**
     * String comparison <
     * @param s String to compare
     * @return true: less than the string to compare
     * @return false: Greater than the string to compare
     */
    isLess(s) {
        return this.s < s.s;
    }
    /**
     * Text column comparison>
     * @param s String to compare
     * @return true: Greater than the string to compare
     * @return false: less than the string to compare
     */
    isGreat(s) {
        return this.s > s.s;
    }
    /**
     * String comparison ==
     * @param s String to compare
     * @return true: equal to the string to compare
     * @return false: Different from the string to compare
     */
    isEqual(s) {
        return this.s == s;
    }
    /**
     * Whether the string is empty
     * @return true: empty string
     * @return false: Value is set
     */
    isEmpty() {
        return this.s.length == 0;
    }
    /**
     * Constructor with arguments
     */
    constructor(s) {
        this.s = s;
    }
}
// Namespace definition for compatibility.
import * as $ from './csmstring';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmString = $.csmString;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=csmstring.js.map