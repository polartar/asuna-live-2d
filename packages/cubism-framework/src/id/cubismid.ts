/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmString } from '../type/csmstring';

/**
 * Holds parameter name, part name, and Drawable name
 *
 * A class that holds parameter names, part names, and Drawable names.
 */
export class CubismId {
  /**
   * Get ID name
   */
  public getString(): csmString {
    return this._id;
  }

  /**
   * Constructor
   */
  public constructor(id: string | csmString) {
    if (typeof id === 'string') {
      this._id = new csmString(id);
      return;
    }

    this._id = id;
  }

  /**
   * Compare id
   * @param c id to compare
   * @return Returns true if they are the same, false if they are different
   */
  public isEqual(c: string | csmString | CubismId): boolean {
    if (typeof c === 'string') {
      return this._id.isEqual(c);
    } else if (c instanceof csmString) {
      return this._id.isEqual(c.s);
    } else if (c instanceof CubismId) {
      return this._id.isEqual(c._id.s);
    }
    return false;
  }

  /**
   * Compare id
   * @param c id to compare
   * @return Returns true if they are the same, false if they are different
   */
  public isNotEqual(c: string | csmString | CubismId): boolean {
    if (typeof c == 'string') {
      return !this._id.isEqual(c);
    } else if (c instanceof csmString) {
      return !this._id.isEqual(c.s);
    } else if (c instanceof CubismId) {
      return !this._id.isEqual(c._id.s);
    }
    return false;
  }

  private _id: csmString; // ID名
}

export declare type CubismIdHandle = CubismId;

// Namespace definition for compatibility.
import * as $ from './cubismid';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismId = $.CubismId;
  export type CubismId = $.CubismId;
  export type CubismIdHandle = $.CubismIdHandle;
}