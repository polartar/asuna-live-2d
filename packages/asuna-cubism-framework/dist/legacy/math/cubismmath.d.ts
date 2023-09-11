/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismVector2 } from './cubismvector2';
/**
 * Utility class used for numerical calculation etc.
 */
export declare class CubismMath {
    static readonly Epsilon: number;
    /**
     * Returns a value that contains the value of the first argument within the range of the minimum and maximum values.
     *
     * @param value Value to be stored
     * @param min Minimum value in range
     * @param max Maximum value in range
     * @return Value within the range of minimum and maximum values
     */
    static range(value: number, min: number, max: number): number;
    /**
     * Find the value of the sine function
     *
     * @param x angle value (radians)
     * @return The value of the sine function sin (x)
     */
    static sin(x: number): number;
    /**
     * Find the value of the cosine function
     *
     * @param x angle value (radians)
     * @return The value of the cosine function cos (x)
     */
    static cos(x: number): number;
    /**
     * Find the absolute value of the value
     *
     * @param x Value for which the absolute value is calculated
     * Absolute value of @return value
     */
    static abs(x: number): number;
    /**
     * Find the square root (root)
     * @param x-> Value to find the square root
     * @return Square root of value
     */
    static sqrt(x: number): number;
    /**
     * Seek the cube root
     * @param x-> Value to find the cube root
     * @return Cube root of value
     */
    static cbrt(x: number): number;
    /**
     * Ask for an easing processed sign
     * Can be used for easing during fade-in / out
     *
     * @param value Value for easing
     * @return Eased sign value
     */
    static getEasingSine(value: number): number;
    /**
     * Returns the larger value
     *
     * @param left Left side value
     * @param right Right-hand side value
     * @return Larger value
     */
    static max(left: number, right: number): number;
    /**
     * Returns the smaller value
     *
     * @param left Left side value
     * @param right Right-hand side value
     * @return Smaller value
     */
    static min(left: number, right: number): number;
    /**
     * Convert angle values ​​to radians
     *
     * @param degrees angle value
     * @return Radian value converted from angle value
     */
    static degreesToRadian(degrees: number): number;
    /**
     * Convert radian values ​​to angle values
     *
     * @param radian radian value
     * @return Angle value converted from radian value
     */
    static radianToDegrees(radian: number): number;
    /**
     * Find the radian value from two vectors
     *
     * @param from start point vector
     * @param to endpoint vector
     * @return Direction vector obtained from radian value
     */
    static directionToRadian(from: CubismVector2, to: CubismVector2): number;
    /**
     * Find the angle value from two vectors
     *
     * @param from start point vector
     * @param to endpoint vector
     * @return Direction vector obtained from the angle value
     */
    static directionToDegrees(from: CubismVector2, to: CubismVector2): number;
    /**
     * Convert radian values ​​to direction vectors.
     *
     * @param totalAngle Radian value
     * @return Direction vector converted from radian value
     */
    static radianToDirection(totalAngle: number): CubismVector2;
    /**
     * Find the solution of the quadratic equation as a substitute when the coefficient of the cubic term of the cubic equation becomes 0.
     * a * x^2 + b * x + c = 0
     *
     * @param a-> Coefficient value of quadratic term
     * @param b-> Primary term coefficient value
     * @param c-> Constant term value
     * @return Solving quadratic equations
     */
    static quadraticEquation(a: number, b: number, c: number): number;
    /**
     * Find the solution of the cubic equation corresponding to the Bezier t-value by Cardano's formula.
     * Returns a solution with a value between 0.0 and 1.0 when it becomes a multiple solution.
     *
     * a * x^3 + b * x^2 + c * x + d = 0
     *
     * @param a-> Defect value of cubic term
     * @param b-> Coefficient value of quadratic term
     * @param c-> Primary term coefficient value
     * @param d-> Constant term value
     * @return Solutions between 0.0 and 1.0
     */
    static cardanoAlgorithmForBezier(a: number, b: number, c: number, d: number): number;
    /**
     * Constructor
     */
    private constructor();
}
import * as $ from './cubismmath';
export declare namespace Live2DCubismFramework {
    const CubismMath: typeof $.CubismMath;
    type CubismMath = $.CubismMath;
}
//# sourceMappingURL=cubismmath.d.ts.map