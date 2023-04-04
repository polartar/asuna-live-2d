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
  x: number
  y: number

  /**
   * Constructor
   */
  public constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  /**
   * Vector addition
   *
   * @param vector2 Vector value to add
   * @return Addition result vector value
   */
  public add(vector2: CubismVector2): CubismVector2 {
    const ret: CubismVector2 = new CubismVector2(0.0, 0.0);
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
  public substract(vector2: CubismVector2): CubismVector2 {
    const ret: CubismVector2 = new CubismVector2(0.0, 0.0);
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
  public multiply(vector2: CubismVector2): CubismVector2 {
    const ret: CubismVector2 = new CubismVector2(0.0, 0.0);
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
  public multiplyByScaler(scalar: number): CubismVector2 {
    return this.multiply(new CubismVector2(scalar, scalar));
  }

  /**
   * Vector division
   *
   * @param vector2 Vector value to divide
   * @return Division result vector value
   */
  public division(vector2: CubismVector2): CubismVector2 {
    const ret: CubismVector2 = new CubismVector2(0.0, 0.0);
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
  public divisionByScalar(scalar: number): CubismVector2 {
    return this.division(new CubismVector2(scalar, scalar));
  }

  /**
   * Get the length of the vector
   *
   * @return Vector length
   */
  public getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Get vector distance
   *
   * @param a point
   * @return vector distance
   */
  public getDistanceWith(a: CubismVector2): number {
    return Math.sqrt(
      (this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y)
    );
  }

  /**
   * Dot product calculation
   *
   * @param a 値
   * @return result
   */
  public dot(a: CubismVector2): number {
    return this.x * a.x + this.y * a.y;
  }

  /**
   * Apply normalization
   */
  public normalize(): void {
    const length: number = Math.pow(this.x * this.x + this.y * this.y, 0.5);

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
  public isEqual(rhs: CubismVector2): boolean {
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
  public isNotEqual(rhs: CubismVector2): boolean {
    return !this.isEqual(rhs);
  }
}

// Namespace definition for compatibility.
import * as $ from './cubismvector2';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismVector2 = $.CubismVector2;
  export type CubismVector2 = $.CubismVector2;
}