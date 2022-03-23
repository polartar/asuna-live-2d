/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMatrix44 } from '../math/cubismmatrix44';
import { CubismModel } from '../model/cubismmodel';

/**
 * Renderer to handle model drawing
 *
 * Write environment-dependent drawing instructions in the subclass.
 */
export abstract class CubismRenderer {
  /**
   * Create and get an instance of the renderer
   *
   * @return Instance of renderer
   */
  public static create(): CubismRenderer {
    return null;
  }

  /**
   * Release an instance of the renderer
   */
  public static delete(renderer: CubismRenderer): void {
    renderer = null;
  }

  /**
   * Execute the renderer initialization process
   * Information required for renderer initialization can be extracted from the model passed as an argument.
   * @param model Model instance
   */
  public initialize(model: CubismModel): void {
    this._model = model;
  }

  /**
   * Draw a model
   */
  public drawModel(): void {
    if (this.getModel() == null) return;

    this.doDrawModel();
  }

  /**
   * Set the Model-View-Projection matrix
   * The array is duplicated, so the original array may be discarded outside
   * @param matrix44 Model-View-Projection 行列
   */
  public setMvpMatrix(matrix44: CubismMatrix44): void {
    this._mvpMatrix4x4.setMatrix(matrix44.getArray());
  }

  /**
   * Get the Model-View-Projection matrix
   * @return Model-View-Projection 行列
   */
  public getMvpMatrix(): CubismMatrix44 {
    return this._mvpMatrix4x4;
  }

  /**
   * Set the color of the model
   * Specify between 0.0 and 1.0 for each color (1.0 is the standard state)
   * @param red Red channel value
   * @param green Green channel value
   * @param blue Blue channel value
   * @param alpha α channel value
   */
  public setModelColor(
    red: number,
    green: number,
    blue: number,
    alpha: number
  ): void {
    if (red < 0.0) {
      red = 0.0;
    } else if (red > 1.0) {
      red = 1.0;
    }

    if (green < 0.0) {
      green = 0.0;
    } else if (green > 1.0) {
      green = 1.0;
    }

    if (blue < 0.0) {
      blue = 0.0;
    } else if (blue > 1.0) {
      blue = 1.0;
    }

    if (alpha < 0.0) {
      alpha = 0.0;
    } else if (alpha > 1.0) {
      alpha = 1.0;
    }

    this._modelColor.R = red;
    this._modelColor.G = green;
    this._modelColor.B = blue;
    this._modelColor.A = alpha;
  }

  /**
   * Get the color of the model
   * Specify between 0.0 and 1.0 for each color (1.0 is the standard state)
   *
   * @return RGBA color information
   */
  public getModelColor(): CubismTextureColor {
    return JSON.parse(JSON.stringify(this._modelColor));
  }

  /**
   * Set valid / invalid of multiplied α
   * Set true to enable, false to disable
   */
  public setIsPremultipliedAlpha(enable: boolean): void {
    this._isPremultipliedAlpha = enable;
  }

  /**
   * Get valid / invalid of multiplied α
   * @return true Multiplied α is valid
   * @return false Multiplied α invalid
   */
  public isPremultipliedAlpha(): boolean {
    return this._isPremultipliedAlpha;
  }

  /**
   * Set whether culling (single-sided drawing) is enabled or disabled.
   * Set true to enable, false to disable
   */
  public setIsCulling(culling: boolean): void {
    this._isCulling = culling;
  }

  /**
   * Get valid / invalid for culling (single-sided drawing).
   * @return true Culling enabled
   * @return false Culling disabled
   */
  public isCulling(): boolean {
    return this._isCulling;
  }

  /**
   * Set texture anisotropic filtering parameters
   * The degree of influence of the parameter value depends on the implementation of the renderer.
   * @param n Parameter value
   */
  public setAnisotropy(n: number): void {
    this._anisortopy = n;
  }

  /**
   * Set texture anisotropic filtering parameters
   * @return Anisotropic filtering parameters
   */
  public getAnisotropy(): number {
    return this._anisortopy;
  }

  /**
   * Get the model to render
   * @return Model to render
   */
  public getModel(): CubismModel {
    return this._model;
  }

  /**
   * Constructor
   */
  protected constructor() {
    this._isCulling = false;
    this._isPremultipliedAlpha = false;
    this._anisortopy = 0.0;
    this._model = null;
    this._modelColor = new CubismTextureColor();

    // Initialize to identity matrix
    this._mvpMatrix4x4 = new CubismMatrix44();
    this._mvpMatrix4x4.loadIdentity();
  }

  /**
   * Implementation of model drawing
   */
  public abstract doDrawModel(): void;

  /**
   * Draw a drawing object (art mesh)
   * Pass the polygon mesh and texture number as a set.
   * @param textureNo Texture number to draw
   * @param indexCount Index value of the drawing object
   * @param vertexCount Number of vertices on the polygon mesh
   * @param indexArray Index array of polygon mesh vertices
   * @param vertexArray Polygon mesh vertex array
   * @param uvArray uv配列
   * @param opacity opacity
   * @param colorBlendMode Color blending type
   * @param invertedMask Using mask inversion when using mask
   */
  public abstract drawMesh(
    textureNo: number,
    indexCount: number,
    vertexCount: number,
    indexArray: Uint16Array,
    vertexArray: Float32Array,
    uvArray: Float32Array,
    opacity: number,
    colorBlendMode: CubismBlendMode,
    invertedMask: boolean
  ): void;

  /**
   * Release static resources held by the renderer
   */
  public static staticRelease: Function;

  protected _mvpMatrix4x4: CubismMatrix44; // Model-View-Projection 行列
  protected _modelColor: CubismTextureColor; // Color of the model itself (RGBA)
  protected _isCulling: boolean; // true if culling is enabled
  protected _isPremultipliedAlpha: boolean; // true if multiplied α
  protected _anisortopy: any; // Texture anisotropic filtering parameters
  protected _model: CubismModel; // Model to render
}

export enum CubismBlendMode {
  CubismBlendMode_Normal = 0, // normally
  CubismBlendMode_Additive = 1, // Add
  CubismBlendMode_Multiplicative = 2 // Multiplication
}

/**
 * Class for handling texture colors in RGBA
 */
export class CubismTextureColor {
  /**
   * Constructor
   */
  constructor() {
    this.R = 1.0;
    this.G = 1.0;
    this.B = 1.0;
    this.A = 1.0;
  }

  R: number; // Red channel
  G: number; // Green channel
  B: number; // Blue channel
  A: number; // α channel
}

// Namespace definition for compatibility.
import * as $ from './cubismrenderer';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismBlendMode = $.CubismBlendMode;
  export type CubismBlendMode = $.CubismBlendMode;
  export const CubismRenderer = $.CubismRenderer;
  export type CubismRenderer = $.CubismRenderer;
  export const CubismTextureColor = $.CubismTextureColor;
  export type CubismTextureColor = $.CubismTextureColor;
}