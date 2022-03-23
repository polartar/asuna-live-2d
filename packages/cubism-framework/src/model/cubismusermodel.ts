/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismBreath } from '../effect/cubismbreath';
import { CubismEyeBlink } from '../effect/cubismeyeblink';
import { CubismPose } from '../effect/cubismpose';
import { CubismIdHandle } from '../id/cubismid';
import { Constant } from '../live2dcubismframework';
import { CubismModelMatrix } from '../math/cubismmodelmatrix';
import { CubismTargetPoint } from '../math/cubismtargetpoint';
import { ACubismMotion, FinishedMotionCallback } from '../motion/acubismmotion';
import { CubismExpressionMotion } from '../motion/cubismexpressionmotion';
import { CubismMotion } from '../motion/cubismmotion';
import { CubismMotionManager } from '../motion/cubismmotionmanager';
import { CubismMotionQueueManager } from '../motion/cubismmotionqueuemanager';
import { CubismPhysics } from '../physics/cubismphysics';
import { CubismRenderer_WebGL } from '../rendering/cubismrenderer_webgl';
import { csmString } from '../type/csmstring';
import { CubismLogError, CubismLogInfo } from '../utils/cubismdebug';
import { CubismMoc } from './cubismmoc';
import { CubismModel } from './cubismmodel';
import { CubismModelUserData } from './cubismmodeluserdata';

/**
 * The model actually used by the user
 *
 * The base class of the model that the user actually uses. This is inherited and implemented by the user.
 */
export class CubismUserModel {
  /**
   * Get initialization status
   *
   * Is it in the initialized state?
   *
   * @return true Initialized
   * @return false Not initialized
   */
  public isInitialized(): boolean {
    return this._initialized;
  }

  /**
   * Initialization state setting
   *
   * Set the initialization state.
   *
   * @param v initialization state
   */
  public setInitialized(v: boolean): void {
    this._initialized = v;
  }

  /**
   * Get update status
   *
   * Is it updated?
   *
   * @return true Updated
   * @return false Not updated
   */
  public isUpdating(): boolean {
    return this._updating;
  }

  /**
   * Update status setting
   *
   * Set the update status
   *
   * @param v update state
   */
  public setUpdating(v: boolean): void {
    this._updating = v;
  }

  /**
   * Mouse drag information settings
   * @param X position of the cursor you are dragging
   * @param Y position of the dragged cursor
   */
  public setDragging(x: number, y: number): void {
    this._dragManager.set(x, y);
  }

  /**
   * Set acceleration information
   * @param x X-axis acceleration
   * @param y Acceleration in the Y-axis direction
   * @param z Acceleration in the Z-axis direction
   */
  public setAcceleration(x: number, y: number, z: number): void {
    this._accelerationX = x;
    this._accelerationY = y;
    this._accelerationZ = z;
  }

  /**
   * Get the model matrix
   * @return model matrix
   */
  public getModelMatrix(): CubismModelMatrix {
    return this._modelMatrix;
  }

  /**
   * Opacity setting
   * @param a opacity
   */
  public setOpacity(a: number): void {
    this._opacity = a;
  }

  /**
   * Get opacity
   * @return opacity
   */
  public getOpacity(): number {
    return this._opacity;
  }

  /**
   * Read model data
   *
   * @param buffer moc3 The buffer in which the file is read
   */
  public loadModel(buffer: ArrayBuffer) {
    this._moc = CubismMoc.create(buffer);
    this._model = this._moc.createModel();
    this._model.saveParameters();

    if (this._moc == null || this._model == null) {
      CubismLogError('Failed to CreateModel().');
      return;
    }

    this._modelMatrix = new CubismModelMatrix(
      this._model.getCanvasWidth(),
      this._model.getCanvasHeight()
    );
  }

  /**
   * Read motion data
   * @param buffer motion3. The buffer in which the json file is loaded
   * @param size Buffer size
   * @param name The name of the motion
   * @param onFinishedMotionHandler Callback function called at the end of motion playback
   * @return motion class
   */
  public loadMotion = (
    buffer: ArrayBuffer,
    size: number,
    name: string,
    onFinishedMotionHandler?: FinishedMotionCallback
  ) => CubismMotion.create(buffer, size, onFinishedMotionHandler);

  /**
   * Reading facial expression data
   * @param buffer exp The buffer in which the file is read
   * @param size Buffer size
   * @param name Facial expression name
   */
  public loadExpression(
    buffer: ArrayBuffer,
    size: number,
    name: string
  ): ACubismMotion {
    return CubismExpressionMotion.create(buffer, size);
  }

  /**
   * Reading pose data
   * @param buffer pose3. The buffer in which json is loaded
   * @param size Buffer size
   */
  public loadPose(buffer: ArrayBuffer, size: number): void {
    this._pose = CubismPose.create(buffer, size);
  }

  /**
   * Load the user data that comes with the model
   * @param buffer The buffer in which userdata3.json is loaded
   * @param size Buffer size
   */
  public loadUserData(buffer: ArrayBuffer, size: number): void {
    this._modelUserData = CubismModelUserData.create(buffer, size);
  }

  /**
   * Reading physics data
   * @param buffer The buffer in which physics3.json is loaded
   * @param size Buffer size
   */
  public loadPhysics(buffer: ArrayBuffer, size: number): void {
    this._physics = CubismPhysics.create(buffer, size);
  }

  /**
   * Obtaining collision detection
   * @param drawableId ID of the Drawable you want to verify
   * @param pointX X position
   * @param pointY Y position
   * @return true Hit
   * @return false No hit
   */
  public isHit(
    drawableId: CubismIdHandle,
    pointX: number,
    pointY: number
  ): boolean {
    const drawIndex: number = this._model.getDrawableIndex(drawableId);

    if (drawIndex < 0) {
      return false; // false if it does not exist
    }

    const count: number = this._model.getDrawableVertexCount(drawIndex);
    const vertices: Float32Array = this._model.getDrawableVertices(drawIndex);

    let left: number = vertices[0];
    let right: number = vertices[0];
    let top: number = vertices[1];
    let bottom: number = vertices[1];

    for (let j = 1; j < count; ++j) {
      const x = vertices[Constant.vertexOffset + j * Constant.vertexStep];
      const y = vertices[Constant.vertexOffset + j * Constant.vertexStep + 1];

      if (x < left) {
        left = x; // Min x
      }

      if (x > right) {
        right = x; // Max x
      }

      if (y < top) {
        top = y; // Min and
      }

      if (y > bottom) {
        bottom = y; // Max y
      }
    }

    const tx: number = this._modelMatrix.invertTransformX(pointX);
    const ty: number = this._modelMatrix.invertTransformY(pointY);

    return left <= tx && tx <= right && top <= ty && ty <= bottom;
  }

  /**
   * Get the model
   * @return model
   */
  public getModel(): CubismModel {
    return this._model;
  }

  /**
   * Acquisition of renderer
   * @return Renderer
   */
  public getRenderer(): CubismRenderer_WebGL {
    return this._renderer;
  }

  /**
   * Create a renderer and perform initialization
   */
  public createRenderer(): void {
    if (this._renderer) {
      this.deleteRenderer();
    }

    this._renderer = new CubismRenderer_WebGL();
    this._renderer.initialize(this._model);
  }

  /**
   * Release of renderer
   */
  public deleteRenderer(): void {
    if (this._renderer != null) {
      this._renderer.release();
      this._renderer = null;
    }
  }

  /**
   * Standard processing when an event fires
   *
   * Performs processing when Event is in the playback process.
   * It is supposed to be overwritten by inheritance.
   * If not overwritten, log output.
   *
   * @param eventValue Character string data of the fired event
   */
  public motionEventFired(eventValue: csmString): void {
    CubismLogInfo('{0}', eventValue.s);
  }

  /**
   * Callback for the event
   *
   * Callback to register for the event in CubismMotionQueueManager.
   * Call EventFired, the inheritance destination of CubismUserModel.
   *
   * @param caller Motion manager that managed the fired event, for comparison
   * @param eventValue Character string data of the fired event
   * @param customData Assuming an instance that inherits CubismUserModel
   */
  public static cubismDefaultMotionEventCallback(
    caller: CubismMotionQueueManager,
    eventValue: csmString,
    customData: CubismUserModel
  ): void {
    const model: CubismUserModel = customData;

    if (model != null) {
      model.motionEventFired(eventValue);
    }
  }

  /**
   * Constructor
   */
  public constructor() {
    // Initialize each variable
    this._moc = null;
    this._model = null;
    this._motionManager = null;
    this._expressionManager = null;
    this._eyeBlink = null;
    this._breath = null;
    this._modelMatrix = null;
    this._pose = null;
    this._dragManager = null;
    this._physics = null;
    this._modelUserData = null;
    this._initialized = false;
    this._updating = false;
    this._opacity = 1.0;
    this._lipsync = true;
    this._lastLipSyncValue = 0.0;
    this._dragX = 0.0;
    this._dragY = 0.0;
    this._accelerationX = 0.0;
    this._accelerationY = 0.0;
    this._accelerationZ = 0.0;
    this._debugMode = false;
    this._renderer = null;

    // Create a motion manager
    this._motionManager = new CubismMotionManager();
    this._motionManager.setEventCallback(
      CubismUserModel.cubismDefaultMotionEventCallback,
      this
    );

    // Create a facial expression manager
    this._expressionManager = new CubismMotionManager();

    // Animation by dragging
    this._dragManager = new CubismTargetPoint();
  }

  /**
   * Processing equivalent to destructor
   */
  public release() {
    if (this._motionManager != null) {
      this._motionManager.release();
      this._motionManager = null;
    }

    if (this._expressionManager != null) {
      this._expressionManager.release();
      this._expressionManager = null;
    }

    if (this._moc != null) {
      this._moc.deleteModel(this._model);
      this._moc.release();
      this._moc = null;
    }

    this._modelMatrix = null;

    CubismPose.delete(this._pose);
    CubismEyeBlink.delete(this._eyeBlink);
    CubismBreath.delete(this._breath);

    this._dragManager = null;

    CubismPhysics.delete(this._physics);
    CubismModelUserData.delete(this._modelUserData);

    this.deleteRenderer();
  }

  public _moc: CubismMoc; // Moc デ ー タ
  public _model: CubismModel; // Model instance

  public _motionManager: CubismMotionManager; // Motion management
  public _expressionManager: CubismMotionManager; // Expression management
  public _eyeBlink: CubismEyeBlink; // Automatic blinking
  public _breath: CubismBreath; // breathe
  public _modelMatrix: CubismModelMatrix; // Model matrix
  public _pose: CubismPose; // Pose management
  public _dragManager: CubismTargetPoint; // Mouse drag
  public _physics: CubismPhysics; // physics calculation
  public _modelUserData: CubismModelUserData; // User data

  public _initialized: boolean; // Whether it was initialized
  public _updating: boolean; // whether it has been updated
  public _opacity: number; // opacity
  public _lipsync: boolean; // Whether to lip sync
  public _lastLipSyncValue: number; // Control area of ​​the last lip sync
  public _dragX: number; // X position of mouse drag
  public _dragY: number; // Y position of mouse drag
  public _accelerationX: number; // Acceleration along the X axis
  public _accelerationY: number; // Acceleration along the Y axis
  public _accelerationZ: number; // Acceleration along the Z axis
  public _debugMode: boolean; // Whether in debug mode

  public _renderer: CubismRenderer_WebGL; // Renderer
}

// Namespace definition for compatibility.
import * as $ from './cubismusermodel';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismUserModel = $.CubismUserModel;
  export type CubismUserModel = $.CubismUserModel;
}