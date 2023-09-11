/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * A class that defines a rectangular shape (coordinates and length are float values)
 */
export declare class csmRect {
    /**
     * Constructor
     * @param x left X coordinate
     * @param y upper Y coordinate
     * @param w width
     * @param h height
     */
    constructor(x?: number, y?: number, w?: number, h?: number);
    /**
     * Get the X coordinate of the center of the rectangle
     */
    getCenterX(): number;
    /**
     * Get the Y coordinate of the center of the rectangle
     */
    getCenterY(): number;
    /**
     * Get the right X coordinate
     */
    getRight(): number;
    /**
     * Get the Y coordinate of the bottom edge
     */
    getBottom(): number;
    /**
     * Set the value to the rectangle
     * @param r Rectangle instance
     */
    setRect(r: csmRect): void;
    /**
     * Scales vertically and horizontally around the center of the rectangle
     * @param w Amount to scale in the width direction
     * @param h Amount of scaling in the height direction
     */
    expand(w: number, h: number): void;
    x: number;
    y: number;
    width: number;
    height: number;
}
import * as $ from './csmrectf';
export declare namespace Live2DCubismFramework {
    const csmRect: typeof $.csmRect;
    type csmRect = $.csmRect;
}
//# sourceMappingURL=csmrectf.d.ts.map