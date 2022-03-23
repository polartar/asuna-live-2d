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
  static readonly Epsilon: number = 0.00001;

  /**
   * Returns a value that contains the value of the first argument within the range of the minimum and maximum values.
   *
   * @param value Value to be stored
   * @param min Minimum value in range
   * @param max Maximum value in range
   * @return Value within the range of minimum and maximum values
   */
  static range(value: number, min: number, max: number): number {
    if (value < min) {
      value = min;
    } else if (value > max) {
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
  static sin(x: number): number {
    return Math.sin(x);
  }

  /**
   * Find the value of the cosine function
   *
   * @param x angle value (radians)
   * @return The value of the cosine function cos (x)
   */
  static cos(x: number): number {
    return Math.cos(x);
  }

  /**
   * Find the absolute value of the value
   *
   * @param x Value for which the absolute value is calculated
   * Absolute value of @return value
   */
  static abs(x: number): number {
    return Math.abs(x);
  }

  /**
   * Find the square root (root)
   * @param x-> Value to find the square root
   * @return Square root of value
   */
  static sqrt(x: number): number {
    return Math.sqrt(x);
  }

  /**
   * Seek the cube root
   * @param x-> Value to find the cube root
   * @return Cube root of value
   */
  static cbrt(x: number): number {
    if (x === 0) {
      return x;
    }

    let cx: number = x;
    const isNegativeNumber: boolean = cx < 0;

    if (isNegativeNumber) {
      cx = -cx;
    }

    let ret: number;
    if (cx === Infinity) {
      ret = Infinity;
    } else {
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
  static getEasingSine(value: number): number {
    if (value < 0.0) {
      return 0.0;
    } else if (value > 1.0) {
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
  static max(left: number, right: number): number {
    return left > right ? left : right;
  }

  /**
   * Returns the smaller value
   *
   * @param left Left side value
   * @param right Right-hand side value
   * @return Smaller value
   */
  static min(left: number, right: number): number {
    return left > right ? right : left;
  }

  /**
   * Convert angle values ​​to radians
   *
   * @param degrees angle value
   * @return Radian value converted from angle value
   */
  static degreesToRadian(degrees: number): number {
    return (degrees / 180.0) * Math.PI;
  }

  /**
   * Convert radian values ​​to angle values
   *
   * @param radian radian value
   * @return Angle value converted from radian value
   */
  static radianToDegrees(radian: number): number {
    return (radian * 180.0) / Math.PI;
  }

  /**
   * Find the radian value from two vectors
   *
   * @param from start point vector
   * @param to endpoint vector
   * @return Direction vector obtained from radian value
   */
  static directionToRadian(from: CubismVector2, to: CubismVector2): number {
    const q1: number = Math.atan2(to.y, to.x);
    const q2: number = Math.atan2(from.y, from.x);

    let ret: number = q1 - q2;

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
  static directionToDegrees(from: CubismVector2, to: CubismVector2): number {
    const radian: number = this.directionToRadian(from, to);
    let degree: number = this.radianToDegrees(radian);

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

  static radianToDirection(totalAngle: number): CubismVector2 {
    const ret: CubismVector2 = new CubismVector2();

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
  static quadraticEquation(a: number, b: number, c: number): number {
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
  static cardanoAlgorithmForBezier(
    a: number,
    b: number,
    c: number,
    d: number
  ): number {
    if (this.sqrt(a) < CubismMath.Epsilon) {
      return this.range(this.quadraticEquation(b, c, d), 0.0, 1.0);
    }

    const ba: number = b / a;
    const ca: number = c / a;
    const da: number = d / a;

    const p: number = (3.0 * ca - ba * ba) / 3.0;
    const p3: number = p / 3.0;
    const q: number = (2.0 * ba * ba * ba - 9.0 * ba * ca + 27.0 * da) / 27.0;
    const q2: number = q / 2.0;
    const discriminant: number = q2 * q2 + p3 * p3 * p3;

    const center = 0.5;
    const threshold: number = center + 0.01;

    if (discriminant < 0.0) {
      const mp3: number = -p / 3.0;
      const mp33: number = mp3 * mp3 * mp3;
      const r: number = this.sqrt(mp33);
      const t: number = -q / (2.0 * r);
      const cosphi: number = this.range(t, -1.0, 1.0);
      const phi: number = Math.acos(cosphi);
      const crtr: number = this.cbrt(r);
      const t1: number = 2.0 * crtr;

      const root1: number = t1 * this.cos(phi / 3.0) - ba / 3.0;
      if (this.abs(root1 - center) < threshold) {
        return this.range(root1, 0.0, 1.0);
      }

      const root2: number =
        t1 * this.cos((phi + 2.0 * Math.PI) / 3.0) - ba / 3.0;
      if (this.abs(root2 - center) < threshold) {
        return this.range(root2, 0.0, 1.0);
      }

      const root3: number =
        t1 * this.cos((phi + 4.0 * Math.PI) / 3.0) - ba / 3.0;
      return this.range(root3, 0.0, 1.0);
    }

    if (discriminant == 0.0) {
      let u1: number;
      if (q2 < 0.0) {
        u1 = this.cbrt(-q2);
      } else {
        u1 = -this.cbrt(q2);
      }

      const root1: number = 2.0 * u1 - ba / 3.0;
      if (this.abs(root1 - center) < threshold) {
        return this.range(root1, 0.0, 1.0);
      }

      const root2: number = -u1 - ba / 3.0;
      return this.range(root2, 0.0, 1.0);
    }

    const sd: number = this.sqrt(discriminant);
    const u1: number = this.cbrt(sd - q2);
    const v1: number = this.cbrt(sd + q2);
    const root1: number = u1 - v1 - ba / 3.0;
    return this.range(root1, 0.0, 1.0);
  }

  /**
   * Constructor
   */
  private constructor() { }
}

// Namespace definition for compatibility.
import * as $ from './cubismmath';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismMath = $.CubismMath;
  export type CubismMath = $.CubismMath;
}