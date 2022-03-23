/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

/**
 * String class.
 */
export class csmString {
  /**
   * Add a string to the back
   *
   * @param c Character string to add
   * @return Updated string
   */
  public append(c: string, length?: number): csmString {
    this.s += length !== undefined ? c.substr(0, length) : c;

    return this;
  }

  /**
   * Expand the font size to fill the font
   * @param length Number of characters to expand
   * @param v Character to fill
   * @return Updated string
   */
  public expansion(length: number, v: string): csmString {
    for (let i = 0; i < length; i++) {
      this.append(v);
    }

    return this;
  }

  /**
   * Get the length of the string in bytes
   */
  public getBytes(): number {
    return encodeURIComponent(this.s).replace(/%../g, 'x').length;
  }

  /**
   * Returns the length of the string
   */
  public getLength(): number {
    return this.s.length;
  }

  /**
   * String comparison <
   * @param s String to compare
   * @return true: less than the string to compare
   * @return false: Greater than the string to compare
   */
  public isLess(s: csmString): boolean {
    return this.s < s.s;
  }

  /**
   * Text column comparison>
   * @param s String to compare
   * @return true: Greater than the string to compare
   * @return false: less than the string to compare
   */
  public isGreat(s: csmString): boolean {
    return this.s > s.s;
  }

  /**
   * String comparison ==
   * @param s String to compare
   * @return true: equal to the string to compare
   * @return false: Different from the string to compare
   */
  public isEqual(s: string): boolean {
    return this.s == s;
  }

  /**
   * Whether the string is empty
   * @return true: empty string
   * @return false: Value is set
   */
  public isEmpty(): boolean {
    return this.s.length == 0;
  }

  /**
   * Constructor with arguments
   */
  public constructor(s: string) {
    this.s = s;
  }

  s: string;
}

// Namespace definition for compatibility.
import * as $ from './csmstring';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const csmString = $.csmString;
  export type csmString = $.csmString;
}