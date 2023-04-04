"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
exports.__esModule = true;
exports.Live2DCubismFramework = exports.CubismMath = void 0;
var cubismvector2_1 = require("./cubismvector2");
/**
 * Utility class used for numerical calculation etc.
 */
var CubismMath = /** @class */ (function () {
    /**
     * Constructor
     */
    function CubismMath() {
    }
    /**
     * Returns a value that contains the value of the first argument within the range of the minimum and maximum values.
     *
     * @param value Value to be stored
     * @param min Minimum value in range
     * @param max Maximum value in range
     * @return Value within the range of minimum and maximum values
     */
    CubismMath.range = function (value, min, max) {
        if (value < min) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        return value;
    };
    /**
     * Find the value of the sine function
     *
     * @param x angle value (radians)
     * @return The value of the sine function sin (x)
     */
    CubismMath.sin = function (x) {
        return Math.sin(x);
    };
    /**
     * Find the value of the cosine function
     *
     * @param x angle value (radians)
     * @return The value of the cosine function cos (x)
     */
    CubismMath.cos = function (x) {
        return Math.cos(x);
    };
    /**
     * Find the absolute value of the value
     *
     * @param x Value for which the absolute value is calculated
     * Absolute value of @return value
     */
    CubismMath.abs = function (x) {
        return Math.abs(x);
    };
    /**
     * Find the square root (root)
     * @param x-> Value to find the square root
     * @return Square root of value
     */
    CubismMath.sqrt = function (x) {
        return Math.sqrt(x);
    };
    /**
     * Seek the cube root
     * @param x-> Value to find the cube root
     * @return Cube root of value
     */
    CubismMath.cbrt = function (x) {
        if (x === 0) {
            return x;
        }
        var cx = x;
        var isNegativeNumber = cx < 0;
        if (isNegativeNumber) {
            cx = -cx;
        }
        var ret;
        if (cx === Infinity) {
            ret = Infinity;
        }
        else {
            ret = Math.exp(Math.log(cx) / 3);
            ret = (cx / (ret * ret) + 2 * ret) / 3;
        }
        return isNegativeNumber ? -ret : ret;
    };
    /**
     * Ask for an easing processed sign
     * Can be used for easing during fade-in / out
     *
     * @param value Value for easing
     * @return Eased sign value
     */
    CubismMath.getEasingSine = function (value) {
        if (value < 0.0) {
            return 0.0;
        }
        else if (value > 1.0) {
            return 1.0;
        }
        return 0.5 - 0.5 * this.cos(value * Math.PI);
    };
    /**
     * Returns the larger value
     *
     * @param left Left side value
     * @param right Right-hand side value
     * @return Larger value
     */
    CubismMath.max = function (left, right) {
        return left > right ? left : right;
    };
    /**
     * Returns the smaller value
     *
     * @param left Left side value
     * @param right Right-hand side value
     * @return Smaller value
     */
    CubismMath.min = function (left, right) {
        return left > right ? right : left;
    };
    /**
     * Convert angle values ​​to radians
     *
     * @param degrees angle value
     * @return Radian value converted from angle value
     */
    CubismMath.degreesToRadian = function (degrees) {
        return (degrees / 180.0) * Math.PI;
    };
    /**
     * Convert radian values ​​to angle values
     *
     * @param radian radian value
     * @return Angle value converted from radian value
     */
    CubismMath.radianToDegrees = function (radian) {
        return (radian * 180.0) / Math.PI;
    };
    /**
     * Find the radian value from two vectors
     *
     * @param from start point vector
     * @param to endpoint vector
     * @return Direction vector obtained from radian value
     */
    CubismMath.directionToRadian = function (from, to) {
        var q1 = Math.atan2(to.y, to.x);
        var q2 = Math.atan2(from.y, from.x);
        var ret = q1 - q2;
        while (ret < -Math.PI) {
            ret += Math.PI * 2.0;
        }
        while (ret > Math.PI) {
            ret -= Math.PI * 2.0;
        }
        return ret;
    };
    /**
     * Find the angle value from two vectors
     *
     * @param from start point vector
     * @param to endpoint vector
     * @return Direction vector obtained from the angle value
     */
    CubismMath.directionToDegrees = function (from, to) {
        var radian = this.directionToRadian(from, to);
        var degree = this.radianToDegrees(radian);
        if (to.x - from.x > 0.0) {
            degree = -degree;
        }
        return degree;
    };
    /**
     * Convert radian values ​​to direction vectors.
     *
     * @param totalAngle Radian value
     * @return Direction vector converted from radian value
     */
    CubismMath.radianToDirection = function (totalAngle) {
        var ret = new cubismvector2_1.CubismVector2();
        ret.x = this.sin(totalAngle);
        ret.y = this.cos(totalAngle);
        return ret;
    };
    /**
     * Find the solution of the quadratic equation as a substitute when the coefficient of the cubic term of the cubic equation becomes 0.
     * a * x^2 + b * x + c = 0
     *
     * @param a-> Coefficient value of quadratic term
     * @param b-> Primary term coefficient value
     * @param c-> Constant term value
     * @return Solving quadratic equations
     */
    CubismMath.quadraticEquation = function (a, b, c) {
        if (this.abs(a) < CubismMath.Epsilon) {
            if (this.abs(b) < CubismMath.Epsilon) {
                return -c;
            }
            return -c / b;
        }
        return -(b + this.sqrt(b * b - 4.0 * a * c)) / (2.0 * a);
    };
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
    CubismMath.cardanoAlgorithmForBezier = function (a, b, c, d) {
        if (this.sqrt(a) < CubismMath.Epsilon) {
            return this.range(this.quadraticEquation(b, c, d), 0.0, 1.0);
        }
        var ba = b / a;
        var ca = c / a;
        var da = d / a;
        var p = (3.0 * ca - ba * ba) / 3.0;
        var p3 = p / 3.0;
        var q = (2.0 * ba * ba * ba - 9.0 * ba * ca + 27.0 * da) / 27.0;
        var q2 = q / 2.0;
        var discriminant = q2 * q2 + p3 * p3 * p3;
        var center = 0.5;
        var threshold = center + 0.01;
        if (discriminant < 0.0) {
            var mp3 = -p / 3.0;
            var mp33 = mp3 * mp3 * mp3;
            var r = this.sqrt(mp33);
            var t = -q / (2.0 * r);
            var cosphi = this.range(t, -1.0, 1.0);
            var phi = Math.acos(cosphi);
            var crtr = this.cbrt(r);
            var t1 = 2.0 * crtr;
            var root1_1 = t1 * this.cos(phi / 3.0) - ba / 3.0;
            if (this.abs(root1_1 - center) < threshold) {
                return this.range(root1_1, 0.0, 1.0);
            }
            var root2 = t1 * this.cos((phi + 2.0 * Math.PI) / 3.0) - ba / 3.0;
            if (this.abs(root2 - center) < threshold) {
                return this.range(root2, 0.0, 1.0);
            }
            var root3 = t1 * this.cos((phi + 4.0 * Math.PI) / 3.0) - ba / 3.0;
            return this.range(root3, 0.0, 1.0);
        }
        if (discriminant == 0.0) {
            var u1_1;
            if (q2 < 0.0) {
                u1_1 = this.cbrt(-q2);
            }
            else {
                u1_1 = -this.cbrt(q2);
            }
            var root1_2 = 2.0 * u1_1 - ba / 3.0;
            if (this.abs(root1_2 - center) < threshold) {
                return this.range(root1_2, 0.0, 1.0);
            }
            var root2 = -u1_1 - ba / 3.0;
            return this.range(root2, 0.0, 1.0);
        }
        var sd = this.sqrt(discriminant);
        var u1 = this.cbrt(sd - q2);
        var v1 = this.cbrt(sd + q2);
        var root1 = u1 - v1 - ba / 3.0;
        return this.range(root1, 0.0, 1.0);
    };
    CubismMath.Epsilon = 0.00001;
    return CubismMath;
}());
exports.CubismMath = CubismMath;
// Namespace definition for compatibility.
var $ = require("./cubismmath");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMath = $.CubismMath;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
