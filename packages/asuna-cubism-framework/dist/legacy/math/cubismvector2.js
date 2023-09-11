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
export class CubismVector2 {
    /**
     * Constructor
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Vector addition
     *
     * @param vector2 Vector value to add
     * @return Addition result vector value
     */
    add(vector2) {
        const ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x + vector2.x;
        ret.y = this.y + vector2.y;
        return ret;
    }
    /**
     * Vector subtraction
     *
     * @ param vector2 Vector value to subtract
     * @return Subtraction result vector value
     */
    substract(vector2) {
        const ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x - vector2.x;
        ret.y = this.y - vector2.y;
        return ret;
    }
    /**
     * Vector multiplication
     *
     * @param vector2 Vector value to multiply
     * @return Multiplication result vector value
     */
    multiply(vector2) {
        const ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x * vector2.x;
        ret.y = this.y * vector2.y;
        return ret;
    }
    /**
     * Vector multiplication (scalar)
     *
     * @param scalar Scalar value to multiply
     * @return Multiplication result vector value
     */
    multiplyByScaler(scalar) {
        return this.multiply(new CubismVector2(scalar, scalar));
    }
    /**
     * Vector division
     *
     * @param vector2 Vector value to divide
     * @return Division result vector value
     */
    division(vector2) {
        const ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x / vector2.x;
        ret.y = this.y / vector2.y;
        return ret;
    }
    /**
     * Vector division (scalar)
     *
     * @param scalar Scalar value to divide
     * @return Division result vector value
     */
    divisionByScalar(scalar) {
        return this.division(new CubismVector2(scalar, scalar));
    }
    /**
     * Get the length of the vector
     *
     * @return Vector length
     */
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Get vector distance
     *
     * @param a point
     * @return vector distance
     */
    getDistanceWith(a) {
        return Math.sqrt((this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y));
    }
    /**
     * Dot product calculation
     *
     * @param a 値
     * @return result
     */
    dot(a) {
        return this.x * a.x + this.y * a.y;
    }
    /**
     * Apply normalization
     */
    normalize() {
        const length = Math.pow(this.x * this.x + this.y * this.y, 0.5);
        this.x = this.x / length;
        this.y = this.y / length;
    }
    /**
     * Confirmation of equality (is it equal?)
     *
     * Are the values ​​equal?
     *
     * @param rhs Value to check
     * @return true Values ​​are equal
     * @return false Values ​​are not equal
     */
    isEqual(rhs) {
        return this.x == rhs.x && this.y == rhs.y;
    }
    /**
     * Confirmation of equality (is it not equal?)
     *
     * Are the values ​​not equal?
     *
     * @param rhs Value to check
     * @return true Values ​​are not equal
     * @return false Values ​​are equal
     */
    isNotEqual(rhs) {
        return !this.isEqual(rhs);
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismvector2';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismVector2 = $.CubismVector2;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismvector2.js.map