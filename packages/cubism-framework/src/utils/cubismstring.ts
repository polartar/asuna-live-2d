/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

export class CubismString {
  /**
   * Get the string with the standard output format applied.
   * @param format Standard output format string
   * @param ... args String to pass to format string
   * @return Formatted string
   */
  public static getFormatedString(format: string, ...args: any[]): string {
    const ret: string = format;
    return ret.replace(
      /\{(\d+)\}/g,
      (
        m,
        k // m="{0}", k="0"
      ) => {
        return args[k];
      }
    );
  }

  /**
   * Returns whether text starts with startWord
   * @param test Character string to be inspected
   * @param startWord Character string to be compared
   * @return true text starts with startWord
   * @return false text does not start with startWord
   */
  public static isStartWith(text: string, startWord: string): boolean {
    let textIndex = 0;
    let startWordIndex = 0;
    while (startWord[startWordIndex] != '\0') {
      if (
        text[textIndex] == '\0' ||
        text[textIndex++] != startWord[startWordIndex++]
      ) {
        return false;
      }
    }
    return false;
  }

  /**
   * position Analyze numbers from the letters at the position.
   *
   * @param string literal column
   * @param length The length of the string
   * @param position The position of the character you want to analyze
   * @param outEndPos If no character is read, an error value (-1) will be entered.
   * @return Numerical value of analysis result
   */
  public static stringToFloat(
    string: string,
    length: number,
    position: number,
    outEndPos: number[]
  ): number {
    let i: number = position;
    let minus = false; // minus flag
    let period = false;
    let v1 = 0;

    // Confirmation of negative issue
    let c: number = parseInt(string[i]);
    if (c < 0) {
      minus = true;
      i++;
    }

    // Check the integer part
    for (; i < length; i++) {
      const c = string[i];
      if (0 <= parseInt(c) && parseInt(c) <= 9) {
        v1 = v1 * 10 + (parseInt(c) - 0);
      } else if (c == '.') {
        period = true;
        i++;
        break;
      } else {
        break;
      }
    }

    // Check the fractional part
    if (period) {
      let mul = 0.1;
      for (; i < length; i++) {
        c = parseFloat(string[i]) & 0xff;
        if (0 <= c && c <= 9) {
          v1 += mul * (c - 0);
        } else {
          break;
        }
        mul *= 0.1; // Decrease by one digit
        if (!c) break;
      }
    }

    if (i == position) {
      // If no character is read
      outEndPos[0] = -1; // An error value will be entered, so the caller will take appropriate action.
      return 0;
    }

    if (minus) v1 = -v1;

    outEndPos[0] = i;
    return v1;
  }

  /**
   * Make it a static class that cannot be called by the constructor.
   */
  private constructor() { }
}

// Namespace definition for compatibility.
import * as $ from './cubismstring';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismString = $.CubismString;
  export type CubismString = $.CubismString;
}