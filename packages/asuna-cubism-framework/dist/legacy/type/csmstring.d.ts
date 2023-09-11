/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * String class.
 */
export declare class csmString {
    /**
     * Add a string to the back
     *
     * @param c Character string to add
     * @return Updated string
     */
    append(c: string, length?: number): csmString;
    /**
     * Expand the font size to fill the font
     * @param length Number of characters to expand
     * @param v Character to fill
     * @return Updated string
     */
    expansion(length: number, v: string): csmString;
    /**
     * Get the length of the string in bytes
     */
    getBytes(): number;
    /**
     * Returns the length of the string
     */
    getLength(): number;
    /**
     * String comparison <
     * @param s String to compare
     * @return true: less than the string to compare
     * @return false: Greater than the string to compare
     */
    isLess(s: csmString): boolean;
    /**
     * Text column comparison>
     * @param s String to compare
     * @return true: Greater than the string to compare
     * @return false: less than the string to compare
     */
    isGreat(s: csmString): boolean;
    /**
     * String comparison ==
     * @param s String to compare
     * @return true: equal to the string to compare
     * @return false: Different from the string to compare
     */
    isEqual(s: string): boolean;
    /**
     * Whether the string is empty
     * @return true: empty string
     * @return false: Value is set
     */
    isEmpty(): boolean;
    /**
     * Constructor with arguments
     */
    constructor(s: string);
    s: string;
}
import * as $ from './csmstring';
export declare namespace Live2DCubismFramework {
    const csmString: typeof $.csmString;
    type csmString = $.csmString;
}
//# sourceMappingURL=csmstring.d.ts.map