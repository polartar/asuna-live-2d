/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismModel } from '../model/cubismmodel';
import { ACubismMotion } from './acubismmotion';
import {
  CubismMotionQueueEntryHandle,
  CubismMotionQueueManager
} from './cubismmotionqueuemanager';

/**
 * Motion management
 *
 * Class that manages motion
 */
export class CubismMotionManager extends CubismMotionQueueManager {
  /**
   * Constructor
   */
  public constructor() {
    super();
    this._currentPriority = 0;
    this._reservePriority = 0;
  }

  /**
   * Get priority of motion during playback
   * @return Motion priority
   */
  public getCurrentPriority(): number {
    return this._currentPriority;
  }

  /**
   * Get the priority of the motion being reserved.
   * @return Motion priority
   */
  public getReservePriority(): number {
    return this._reservePriority;
  }

  /**
   * Set the priority of the reserved motion.
   * @param val priority
   */
  public setReservePriority(val: number): void {
    this._reservePriority = val;
  }

  /**
   * Set the priority and start the motion.
   *
   * @param motion motion
   * @param autoDelete true if playback deletes an instance of the hunted motion
   * @param priority priority
   * @return Returns the identification number of the started motion. Used in the argument of IsFinished () to determine whether an individual motion has ended. "-1" when you cannot start
   */
  public startMotionPriority(
    motion: ACubismMotion,
    autoDelete: boolean,
    priority: number
  ): CubismMotionQueueEntryHandle {
    if (priority == this._reservePriority) {
      this._reservePriority = 0; // Cancel reservation
    }

    this._currentPriority = priority; // Set the priority of the motion being played

    return super.startMotion(motion, autoDelete, this._userTimeSeconds);
  }

  /**
   * Update the motion to reflect the parameter values ​​in the model.
   *
   * @param model Target model
   * @param deltaTimeSeconds Delta time [seconds]
   * @return true Updated
   * @return false Not updated
   */
  public updateMotion(model: CubismModel, deltaTimeSeconds: number): boolean {
    this._userTimeSeconds += deltaTimeSeconds;

    const updated: boolean = super.doUpdateMotion(model, this._userTimeSeconds);

    if (this.isFinished()) {
      this._currentPriority = 0; // Cancel the priority of the motion being played
    }

    return updated;
  }

  /**
   * Book a motion.
   *
   * @param priority priority
   * @return true I was able to make a reservation
   * @return false Could not make a reservation
   */
  public reserveMotion(priority: number): boolean {
    if (
      priority <= this._reservePriority ||
      priority <= this._currentPriority
    ) {
      return false;
    }

    this._reservePriority = priority;

    return true;
  }

  _currentPriority: number; // Priority of the currently playing motion
  _reservePriority: number; // Priority of the motion to be played. It becomes 0 during playback. Function when reading a motion file in another thread.
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionmanager';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismMotionManager = $.CubismMotionManager;
  export type CubismMotionManager = $.CubismMotionManager;
}