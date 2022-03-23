/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMatrix44 } from './cubismmatrix44';

/**
 * 4x4 matrix useful for repositioning the camera
 *
 * A 4x4 matrix class that is useful for repositioning the camera.
 */
export class CubismViewMatrix extends CubismMatrix44 {
  /**
   * Constructor
   */
  public constructor() {
    super();
    this._screenLeft = 0.0;
    this._screenRight = 0.0;
    this._screenTop = 0.0;
    this._screenBottom = 0.0;
    this._maxLeft = 0.0;
    this._maxRight = 0.0;
    this._maxTop = 0.0;
    this._maxBottom = 0.0;
    this._maxScale = 0.0;
    this._minScale = 0.0;
  }

  /**
   * Adjust movement
   *
   * @param x X-axis movement
   * @param y Y-axis movement
   */
  public adjustTranslate(x: number, y: number): void {
    if (this._tr[0] * this._maxLeft + (this._tr[12] + x) > this._screenLeft) {
      x = this._screenLeft - this._tr[0] * this._maxLeft - this._tr[12];
    }

    if (this._tr[0] * this._maxRight + (this._tr[12] + x) < this._screenRight) {
      x = this._screenRight - this._tr[0] * this._maxRight - this._tr[12];
    }

    if (this._tr[5] * this._maxTop + (this._tr[13] + y) < this._screenTop) {
      y = this._screenTop - this._tr[5] * this._maxTop - this._tr[13];
    }

    if (
      this._tr[5] * this._maxBottom + (this._tr[13] + y) >
      this._screenBottom
    ) {
      y = this._screenBottom - this._tr[5] * this._maxBottom - this._tr[13];
    }

    const tr1: Float32Array = new Float32Array([
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      x,
      y,
      0.0,
      1.0
    ]);

    CubismMatrix44.multiply(tr1, this._tr, this._tr);
  }

  /**
   * Adjust the magnification
   *
   * @param cx Center position of X-axis to expand
   * @param cy Center position of Y-axis to expand
   * @param scale Scale ratio
   */
  public adjustScale(cx: number, cy: number, scale: number): void {
    const maxScale: number = this.getMaxScale();
    const minScale: number = this.getMinScale();

    const targetScale = scale * this._tr[0];

    if (targetScale < minScale) {
      if (this._tr[0] > 0.0) {
        scale = minScale / this._tr[0];
      }
    } else if (targetScale > maxScale) {
      if (this._tr[0] > 0.0) {
        scale = maxScale / this._tr[0];
      }
    }

    const tr1: Float32Array = new Float32Array([
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      cx,
      cy,
      0.0,
      1.0
    ]);

    const tr2: Float32Array = new Float32Array([
      scale,
      0.0,
      0.0,
      0.0,
      0.0,
      scale,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    ]);

    const tr3: Float32Array = new Float32Array([
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
      0.0,
      -cx,
      -cy,
      0.0,
      1.0
    ]);

    CubismMatrix44.multiply(tr3, this._tr, this._tr);
    CubismMatrix44.multiply(tr2, this._tr, this._tr);
    CubismMatrix44.multiply(tr1, this._tr, this._tr);
  }

  /**
   * Setting the range of logical cure for the device
   *
   * @param left X-axis position on the left side
   * @param right X-axis position on the right side
   * @param bottom Y-axis position at the bottom
   * @param top Y-axis position on the top side
   */
  public setScreenRect(
    left: number,
    right: number,
    bottom: number,
    top: number
  ): void {
    this._screenLeft = left;
    this._screenRight = right;
    this._screenBottom = bottom;
    this._screenTop = top;
  }

  /**
   * Setting the range of movement on the logical coordinates corresponding to the device
   * @param left X-axis position on the left side
   * @param right X-axis position on the right side
   * @param bottom Y-axis position at the bottom
   * @param top Y-axis position on the top side
   */
  public setMaxScreenRect(
    left: number,
    right: number,
    bottom: number,
    top: number
  ): void {
    this._maxLeft = left;
    this._maxRight = right;
    this._maxTop = top;
    this._maxBottom = bottom;
  }

  /**
   * Maximum magnification setting
   * @param maxScale maximum scaling ratio
   */
  public setMaxScale(maxScale: number): void {
    this._maxScale = maxScale;
  }

  /**
   * Minimum magnification setting
   * @param minScale Minimum scaling ratio
   */
  public setMinScale(minScale: number): void {
    this._minScale = minScale;
  }

  /**
   * Get maximum magnification
   * @return maximum sizing rate
   */
  public getMaxScale(): number {
    return this._maxScale;
  }

  /**
   * Get the minimum magnification
   * @return Minimum magnification
   */
  public getMinScale(): number {
    return this._minScale;
  }

  /**
   * Check if the magnification is maximized
   *
   * @return true Maximum magnification
   * @return false Magnification is not maximum
   */
  public isMaxScale(): boolean {
    return this.getScaleX() >= this._maxScale;
  }

  /**
   * Check if the magnification is minimized
   *
   * @return true The magnification is the minimum
   * @return false The magnification is not the minimum
   */
  public isMinScale(): boolean {
    return this.getScaleX() <= this._minScale;
  }

  /**
   * Get the X-axis position of the left side of the logical coordinates corresponding to the device
   * @return X-axis position on the left side of the logical coordinates corresponding to the device
   */
  public getScreenLeft(): number {
    return this._screenLeft;
  }

  /**
   * Get the X-axis position on the right side of the logical coordinates corresponding to the device
   * @return X-axis position on the right side of the logical coordinates corresponding to the device
   */
  public getScreenRight(): number {
    return this._screenRight;
  }

  /**
   * Get the Y-axis position of the bottom of the logical coordinates corresponding to the device
   * @return Y-axis position at the bottom of the logical coordinates corresponding to the device
   */
  public getScreenBottom(): number {
    return this._screenBottom;
  }

  /**
   * Get the Y-axis position of the upper side of the logical coordinates corresponding to the device
   * @return Y-axis position of the upper side of the logical coordinates corresponding to the device
   */
  public getScreenTop(): number {
    return this._screenTop;
  }

  /**
   * Get the maximum value of the X-axis position on the left side
   * @return Maximum value of X-axis position on the left side
   */
  public getMaxLeft(): number {
    return this._maxLeft;
  }

  /**
   * Get the maximum value of the X-axis position on the right side
   * @return Maximum value of X-axis position on the right side
   */
  public getMaxRight(): number {
    return this._maxRight;
  }

  /**
   * Get the maximum value of the lower Y-axis position
   * @return Maximum value of Y-axis position on the lower side
   */
  public getMaxBottom(): number {
    return this._maxBottom;
  }

  /**
   * Get the maximum value of the Y-axis position on the upper side
   * @return Maximum value of Y-axis position on the upper side
   */
  public getMaxTop(): number {
    return this._maxTop;
  }

  private _screenLeft: number; // Range on the logical coordinates corresponding to the device (X-axis position on the left side)
  private _screenRight: number; // Range on logical coordinates corresponding to the device (right side X-axis position)
  private _screenTop: number; // Range on logical coordinates corresponding to the device (upper side Y-axis position)
  private _screenBottom: number; // Range on logical coordinates corresponding to the device (bottom Y-axis position)
  private _maxLeft: number; // Movable range on logical coordinates (left side X-axis position)
  private _maxRight: number; // Movable range on logical coordinates (right side X-axis position)
  private _maxTop: number; // Movable range on logical coordinates (upper side Y-axis position)
  private _maxBottom: number; // Movable range on logical coordinates (bottom Y-axis position)
  private _maxScale: number; // Maximum magnification
  private _minScale: number; // Minimum magnification
}

// Namespace definition for compatibility.
import * as $ from './cubismviewmatrix';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismViewMatrix = $.CubismViewMatrix;
  export type CubismViewMatrix = $.CubismViewMatrix;
}