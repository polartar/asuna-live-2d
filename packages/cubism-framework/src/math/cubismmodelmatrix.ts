/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmMap, iterator } from '../type/csmmap';
import { CubismMatrix44 } from './cubismmatrix44';

/**
 * 4x4 matrix for setting model coordinates
 *
 * 4x4 matrix class for setting model coordinates
 */
export class CubismModelMatrix extends CubismMatrix44 {
  /**
   * Constructor
   *
   * @param w banner
   * @param h width
   */
  constructor(w?: number, h?: number) {
    super();

    this._width = w !== undefined ? w : 0.0;
    this._height = h !== undefined ? h : 0.0;

    this.setHeight(2.0);
  }

  /**
   * Set width
   *
   * @param w banner
   */
  public setWidth(w: number): void {
    const scaleX: number = w / this._width;
    const scaleY: number = scaleX;
    this.scale(scaleX, scaleY);
  }

  /**
   * Set vertical width
   * @param h width
   */
  public setHeight(h: number): void {
    const scaleX: number = h / this._height;
    const scaleY: number = scaleX;
    this.scale(scaleX, scaleY);
  }

  /**
   * Set position
   *
   * @param x X-axis position
   * @param y Y-axis position
   */
  public setPosition(x: number, y: number): void {
    this.translate(x, y);
  }

  /**
   * Set center position
   *
   * @param x center position of X axis
   * @param y Center position of Y axis
   *
   * Only after setting @note width or height, the enlargement ratio cannot be obtained correctly, so it will shift.
   */
  public setCenterPosition(x: number, y: number) {
    this.centerX(x);
    this.centerY(y);
  }

  /**
   * Set the position of the upper side
   *
   * @param y Y-axis position on the top side
   */
  public top(y: number): void {
    this.setY(y);
  }

  /**
   * Set the position of the bottom side
   *
   * @param y Y-axis position at the bottom
   */
  public bottom(y: number) {
    const h: number = this._height * this.getScaleY();

    this.translateY(y - h);
  }

  /**
   * Set the position of the left side
   *
   * @param x X-axis position on the left side
   */
  public left(x: number): void {
    this.setX(x);
  }

  /**
   * Set the position of the right side
   *
   * @param x X-axis position on the right side
   */
  public right(x: number): void {
    const w = this._width * this.getScaleX();

    this.translateX(x - w);
  }

  /**
   * Set the center position of the X-axis
   *
   * @param x center position of X axis
   */
  public centerX(x: number): void {
    const w = this._width * this.getScaleX();

    this.translateX(x - w / 2.0);
  }

  /**
   * Set X-axis position
   *
   * @param x X-axis position
   */
  public setX(x: number): void {
    this.translateX(x);
  }

  /**
   * Set the center position of the Y axis
   *
   * @param y Center position of Y axis
   */
  public centerY(y: number): void {
    const h: number = this._height * this.getScaleY();

    this.translateY(y - h / 2.0);
  }

  /**
   * Set the position of the Y axis
   *
   * @param y Y-axis position
   */
  public setY(y: number): void {
    this.translateY(y);
  }

  /**
   * Set the position from the layout information
   *
   * @param layout Layout information
   */
  public setupFromLayout(layout: csmMap<string, number>): void {
    const keyWidth = 'width';
    const keyHeight = 'height';
    const keyX = 'x';
    const keyY = 'y';
    const keyCenterX = 'center_x';
    const keyCenterY = 'center_y';
    const keyTop = 'top';
    const keyBottom = 'bottom';
    const keyLeft = 'left';
    const keyRight = 'right';

    for (
      const ite: iterator<string, number> = layout.begin();
      ite.notEqual(layout.end());
      ite.preIncrement()
    ) {
      const key: string = ite.ptr().first;
      const value: number = ite.ptr().second;

      if (key == keyWidth) {
        this.setWidth(value);
      } else if (key == keyHeight) {
        this.setHeight(value);
      }
    }

    for (
      const ite: iterator<string, number> = layout.begin();
      ite.notEqual(layout.end());
      ite.preIncrement()
    ) {
      const key: string = ite.ptr().first;
      const value: number = ite.ptr().second;

      if (key == keyX) {
        this.setX(value);
      } else if (key == keyY) {
        this.setY(value);
      } else if (key == keyCenterX) {
        this.centerX(value);
      } else if (key == keyCenterY) {
        this.centerY(value);
      } else if (key == keyTop) {
        this.top(value);
      } else if (key == keyBottom) {
        this.bottom(value);
      } else if (key == keyLeft) {
        this.left(value);
      } else if (key == keyRight) {
        this.right(value);
      }
    }
  }

  private _width: number; // banner
  private _height: number; // 縦幅
}

// Namespace definition for compatibility.
import * as $ from './cubismmodelmatrix';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismModelMatrix = $.CubismModelMatrix;
  export type CubismModelMatrix = $.CubismModelMatrix;
}