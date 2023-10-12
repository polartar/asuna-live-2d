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
export class CubismMath {
    /**
     * Returns a value that contains the value of the first argument within the range of the minimum and maximum values.
     *
     * @param value Value to be stored
     * @param min Minimum value in range
     * @param max Maximum value in range
     * @return Value within the range of minimum and maximum values
     */
    static range(value, min, max) {
        if (value < min) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        return value;
    }
    /**
     * Find the value of the sine function
     *
     * @param x angle value (radians)
     * @return The value of the sine function sin (x)
     */
    static sin(x) {
        return Math.sin(x);
    }
    /**
     * Find the value of the cosine function
     *
     * @param x angle value (radians)
     * @return The value of the cosine function cos (x)
     */
    static cos(x) {
        return Math.cos(x);
    }
    /**
     * Find the absolute value of the value
     *
     * @param x Value for which the absolute value is calculated
     * Absolute value of @return value
     */
    static abs(x) {
        return Math.abs(x);
    }
    /**
     * Find the square root (root)
     * @param x-> Value to find the square root
     * @return Square root of value
     */
    static sqrt(x) {
        return Math.sqrt(x);
    }
    /**
     * Seek the cube root
     * @param x-> Value to find the cube root
     * @return Cube root of value
     */
    static cbrt(x) {
        if (x === 0) {
            return x;
        }
        let cx = x;
        const isNegativeNumber = cx < 0;
        if (isNegativeNumber) {
            cx = -cx;
        }
        let ret;
        if (cx === Infinity) {
            ret = Infinity;
        }
        else {
            ret = Math.exp(Math.log(cx) / 3);
            ret = (cx / (ret * ret) + 2 * ret) / 3;
        }
        return isNegativeNumber ? -ret : ret;
    }
    /**
     * Ask for an easing processed sign
     * Can be used for easing during fade-in / out
     *
     * @param value Value for easing
     * @return Eased sign value
     */
    static getEasingSine(value) {
        if (value < 0.0) {
            return 0.0;
        }
        else if (value > 1.0) {
            return 1.0;
        }
        return 0.5 - 0.5 * this.cos(value * Math.PI);
    }
    /**
     * Returns the larger value
     *
     * @param left Left side value
     * @param right Right-hand side value
     * @return Larger value
     */
    static max(left, right) {
        return left > right ? left : right;
    }
    /**
     * Returns the smaller value
     *
     * @param left Left side value
     * @param right Right-hand side value
     * @return Smaller value
     */
    static min(left, right) {
        return left > right ? right : left;
    }
    /**
     * Convert angle values ​​to radians
     *
     * @param degrees angle value
     * @return Radian value converted from angle value
     */
    static degreesToRadian(degrees) {
        return (degrees / 180.0) * Math.PI;
    }
    /**
     * Convert radian values ​​to angle values
     *
     * @param radian radian value
     * @return Angle value converted from radian value
     */
    static radianToDegrees(radian) {
        return (radian * 180.0) / Math.PI;
    }
    /**
     * Find the radian value from two vectors
     *
     * @param from start point vector
     * @param to endpoint vector
     * @return Direction vector obtained from radian value
     */
    static directionToRadian(from, to) {
        const q1 = Math.atan2(to.y, to.x);
        const q2 = Math.atan2(from.y, from.x);
        let ret = q1 - q2;
        while (ret < -Math.PI) {
            ret += Math.PI * 2.0;
        }
        while (ret > Math.PI) {
            ret -= Math.PI * 2.0;
        }
        return ret;
    }
    /**
     * Find the angle value from two vectors
     *
     * @param from start point vector
     * @param to endpoint vector
     * @return Direction vector obtained from the angle value
     */
    static directionToDegrees(from, to) {
        const radian = this.directionToRadian(from, to);
        let degree = this.radianToDegrees(radian);
        if (to.x - from.x > 0.0) {
            degree = -degree;
        }
        return degree;
    }
    /**
     * Convert radian values ​​to direction vectors.
     *
     * @param totalAngle Radian value
     * @return Direction vector converted from radian value
     */
    static radianToDirection(totalAngle) {
        const ret = new CubismVector2();
        ret.x = this.sin(totalAngle);
        ret.y = this.cos(totalAngle);
        return ret;
    }
    /**
     * Find the solution of the quadratic equation as a substitute when the coefficient of the cubic term of the cubic equation becomes 0.
     * a * x^2 + b * x + c = 0
     *
     * @param a-> Coefficient value of quadratic term
     * @param b-> Primary term coefficient value
     * @param c-> Constant term value
     * @return Solving quadratic equations
     */
    static quadraticEquation(a, b, c) {
        if (this.abs(a) < CubismMath.Epsilon) {
            if (this.abs(b) < CubismMath.Epsilon) {
                return -c;
            }
            return -c / b;
        }
        return -(b + this.sqrt(b * b - 4.0 * a * c)) / (2.0 * a);
    }
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
    static cardanoAlgorithmForBezier(a, b, c, d) {
        if (this.sqrt(a) < CubismMath.Epsilon) {
            return this.range(this.quadraticEquation(b, c, d), 0.0, 1.0);
        }
        const ba = b / a;
        const ca = c / a;
        const da = d / a;
        const p = (3.0 * ca - ba * ba) / 3.0;
        const p3 = p / 3.0;
        const q = (2.0 * ba * ba * ba - 9.0 * ba * ca + 27.0 * da) / 27.0;
        const q2 = q / 2.0;
        const discriminant = q2 * q2 + p3 * p3 * p3;
        const center = 0.5;
        const threshold = center + 0.01;
        if (discriminant < 0.0) {
            const mp3 = -p / 3.0;
            const mp33 = mp3 * mp3 * mp3;
            const r = this.sqrt(mp33);
            const t = -q / (2.0 * r);
            const cosphi = this.range(t, -1.0, 1.0);
            const phi = Math.acos(cosphi);
            const crtr = this.cbrt(r);
            const t1 = 2.0 * crtr;
            const root1 = t1 * this.cos(phi / 3.0) - ba / 3.0;
            if (this.abs(root1 - center) < threshold) {
                return this.range(root1, 0.0, 1.0);
            }
            const root2 = t1 * this.cos((phi + 2.0 * Math.PI) / 3.0) - ba / 3.0;
            if (this.abs(root2 - center) < threshold) {
                return this.range(root2, 0.0, 1.0);
            }
            const root3 = t1 * this.cos((phi + 4.0 * Math.PI) / 3.0) - ba / 3.0;
            return this.range(root3, 0.0, 1.0);
        }
        if (discriminant == 0.0) {
            let u1;
            if (q2 < 0.0) {
                u1 = this.cbrt(-q2);
            }
            else {
                u1 = -this.cbrt(q2);
            }
            const root1 = 2.0 * u1 - ba / 3.0;
            if (this.abs(root1 - center) < threshold) {
                return this.range(root1, 0.0, 1.0);
            }
            const root2 = -u1 - ba / 3.0;
            return this.range(root2, 0.0, 1.0);
        }
        const sd = this.sqrt(discriminant);
        const u1 = this.cbrt(sd - q2);
        const v1 = this.cbrt(sd + q2);
        const root1 = u1 - v1 - ba / 3.0;
        return this.range(root1, 0.0, 1.0);
    }
    /**
     * Constructor
     */
    constructor() { }
}
CubismMath.Epsilon = 0.00001;
// Namespace definition for compatibility.
import * as $ from './cubismmath';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMath = $.CubismMath;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmath.js.map