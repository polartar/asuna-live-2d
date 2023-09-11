/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * 2D vector type
 *
 * Provides 2D vector type functions.
 */
export declare class CubismVector2 {
    x: number;
    y: number;
    /**
     * Constructor
     */
    constructor(x?: number, y?: number);
    /**
     * Vector addition
     *
     * @param vector2 Vector value to add
     * @return Addition result vector value
     */
    add(vector2: CubismVector2): CubismVector2;
    /**
     * Vector subtraction
     *
     * @ param vector2 Vector value to subtract
     * @return Subtraction result vector value
     */
    substract(vector2: CubismVector2): CubismVector2;
    /**
     * Vector multiplication
     *
     * @param vector2 Vector value to multiply
     * @return Multiplication result vector value
     */
    multiply(vector2: CubismVector2): CubismVector2;
    /**
     * Vector multiplication (scalar)
     *
     * @param scalar Scalar value to multiply
     * @return Multiplication result vector value
     */
    multiplyByScaler(scalar: number): CubismVector2;
    /**
     * Vector division
     *
     * @param vector2 Vector value to divide
     * @return Division result vector value
     */
    division(vector2: CubismVector2): CubismVector2;
    /**
     * Vector division (scalar)
     *
     * @param scalar Scalar value to divide
     * @return Division result vector value
     */
    divisionByScalar(scalar: number): CubismVector2;
    /**
     * Get the length of the vector
     *
     * @return Vector length
     */
    getLength(): number;
    /**
     * Get vector distance
     *
     * @param a point
     * @return vector distance
     */
    getDistanceWith(a: CubismVector2): number;
    /**
     * Dot product calculation
     *
     * @param a 値
     * @return result
     */
    dot(a: CubismVector2): number;
    /**
     * Apply normalization
     */
    normalize(): void;
    /**
     * Confirmation of equality (is it equal?)
     *
     * Are the values ​​equal?
     *
     * @param rhs Value to check
     * @return true Values ​​are equal
     * @return false Values ​​are not equal
     */
    isEqual(rhs: CubismVector2): boolean;
    /**
     * Confirmation of equality (is it not equal?)
     *
     * Are the values ​​not equal?
     *
     * @param rhs Value to check
     * @return true Values ​​are not equal
     * @return false Values ​​are equal
     */
    isNotEqual(rhs: CubismVector2): boolean;
}
import * as $ from './cubismvector2';
export declare namespace Live2DCubismFramework {
    const CubismVector2: typeof $.CubismVector2;
    type CubismVector2 = $.CubismVector2;
}
//# sourceMappingURL=cubismvector2.d.ts.map