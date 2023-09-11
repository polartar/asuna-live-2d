/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * 4x4 matrix
 *
 * Convenient class for 4x4 matrices.
 */
export declare class CubismMatrix44 {
    /**
     * Constructor
     */
    constructor();
    /**
     * Multiply the two received matrices.
     *
     * @param a row column a
     * @param b row and column b
     * @return Multiplication result matrix
     */
    static multiply(a: Float32Array, b: Float32Array, dst: Float32Array): void;
    /**
     * Initialize to identity matrix
     */
    loadIdentity(): void;
    /**
     * Set matrix
     *
     * @param tr A 4x4 matrix represented by 16 floating point numbers
     */
    setMatrix(tr: Float32Array): void;
    /**
     * Get a matrix as an array of floating point numbers
     *
     * @return A 4x4 matrix represented by 16 floating point numbers
     */
    getArray(): Float32Array;
    /**
     * Get X-axis magnification
     * @return X-axis magnification
     */
    getScaleX(): number;
    /**
     * Get the Y-axis magnification
     *
     * @return Y-axis magnification
     */
    getScaleY(): number;
    /**
     * Get the movement amount of the X axis
     * @return X-axis movement
     */
    getTranslateX(): number;
    /**
     * Get the movement amount of Y axis
     * @return Y-axis movement
     */
    getTranslateY(): number;
    /**
     * Calculate X-axis values ​​in the current matrix
     *
     * @param src X-axis value
     * @return X-axis value calculated in the current matrix
     */
    transformX(src: number): number;
    /**
     * Calculate Y-axis value with current matrix
     *
     * @param src Y-axis value
     * @return Y-axis value calculated in the current matrix
     */
    transformY(src: number): number;
    /**
     * Inverse calculation of X-axis values ​​in the current matrix
     */
    invertTransformX(src: number): number;
    /**
     * Inversely calculate the Y-axis value in the current matrix
     */
    invertTransformY(src: number): number;
    /**
     * Move from the current matrix position
     *
     * Move relative to the current matrix position as the starting point.
     *
     * @param x X-axis movement
     * @param y Y-axis movement
     */
    translateRelative(x: number, y: number): void;
    /**
     * Move the position of the current matrix
     *
     * Move the current matrix position to the specified position
     *
     * @param x X-axis movement
     * @param yy Axis movement amount
     */
    translate(x: number, y: number): void;
    /**
     * Moves the position of the X-axis of the current matrix to the specified position
     *
     * @param x X-axis movement
     */
    translateX(x: number): void;
    /**
     * Moves the Y-axis position of the current matrix to the specified position
     *
     * @param y Y-axis movement
     */
    translateY(y: number): void;
    /**
     * Set the magnification of the current matrix relatively
     *
     * @param x X-axis magnification
     * @param y Y-axis magnification
     */
    scaleRelative(x: number, y: number): void;
    /**
     * Set the magnification of the current matrix to the specified magnification
     *
     * @param x X-axis magnification
     * @param y Y-axis magnification
     */
    scale(x: number, y: number): void;
    /**
     * Multiply the current matrix by the matrix
     *
     * @param m row and column
     */
    multiplyByMatrix(m: CubismMatrix44): void;
    /**
     * Make a copy of the object
     */
    clone(): CubismMatrix44;
    protected _tr: Float32Array;
}
import * as $ from './cubismmatrix44';
export declare namespace Live2DCubismFramework {
    const CubismMatrix44: typeof $.CubismMatrix44;
    type CubismMatrix44 = $.CubismMatrix44;
}
//# sourceMappingURL=cubismmatrix44.d.ts.map