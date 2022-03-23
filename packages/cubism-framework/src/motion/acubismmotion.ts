/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMath } from '../math/cubismmath';
import { CubismModel } from '../model/cubismmodel';
import { csmString } from '../type/csmstring';
import { csmVector } from '../type/csmvector';
import { CSM_ASSERT } from '../utils/cubismdebug';
import { CubismMotionQueueEntry } from './cubismmotionqueueentry';

/** Motion playback end callback function definition */
export type FinishedMotionCallback = (self: ACubismMotion) => void;

/**
 * Motion abstract base class
 *
 * An abstract base class for motion. Manage motion playback with MotionQueueManager.
 */
export abstract class ACubismMotion {
  /**
   * Destroy the instance
   */
  public static delete(motion: ACubismMotion): void {
    motion.release();
    motion = null;
  }

  /**
   * Constructor
   */
  public constructor() {
    this._fadeInSeconds = -1.0;
    this._fadeOutSeconds = -1.0;
    this._weight = 1.0;
    this._offsetSeconds = 0.0; // Playback start time
    this._firedEventValues = new csmVector<csmString>();
  }

  /**
   * Destructor-equivalent processing
   */
  public release(): void {
    this._weight = 0.0;
  }

  /**
   * Model parameters
   * @param model Target model
   * @param motionQueueEntry Motion managed by CubismMotionQueueManager
   * @param userTimeSeconds Cumulative value of delta time [seconds]
   */
  public updateParameters(
    model: CubismModel,
    motionQueueEntry: CubismMotionQueueEntry,
    userTimeSeconds: number
  ): void {
    if (!motionQueueEntry.isAvailable() || motionQueueEntry.isFinished()) {
      return;
    }

    if (!motionQueueEntry.isStarted()) {
      motionQueueEntry.setIsStarted(true);
      motionQueueEntry.setStartTime(userTimeSeconds - this._offsetSeconds); // Record the start time of the motion
      motionQueueEntry.setFadeInStartTime(userTimeSeconds); // Fade-in start time

      const duration: number = this.getDuration();

      if (motionQueueEntry.getEndTime() < 0) {
        // It may be set to end before it has started.
        motionQueueEntry.setEndTime(
          duration <= 0 ? -1 : motionQueueEntry.getStartTime() + duration
        );
        // Loop if duration == -1
      }
    }

    let fadeWeight: number = this._weight; // Percentage to multiply by current value

    // ---- Fade in / out processing ----
    // Ease with a simple sine function
    const fadeIn: number =
      this._fadeInSeconds == 0.0
        ? 1.0
        : CubismMath.getEasingSine(
          (userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
          this._fadeInSeconds
        );

    const fadeOut: number =
      this._fadeOutSeconds == 0.0 || motionQueueEntry.getEndTime() < 0.0
        ? 1.0
        : CubismMath.getEasingSine(
          (motionQueueEntry.getEndTime() - userTimeSeconds) /
          this._fadeOutSeconds
        );

    fadeWeight = fadeWeight * fadeIn * fadeOut;

    motionQueueEntry.setState(userTimeSeconds, fadeWeight);

    CSM_ASSERT(0.0 <= fadeWeight && fadeWeight <= 1.0);

    // ---- Loop all parameter IDs ----
    this.doUpdateParameters(
      model,
      userTimeSeconds,
      fadeWeight,
      motionQueueEntry
    );

    // Post-processing
    // Set the end flag after the end time (CubismMotionQueueManager)
    if (
      motionQueueEntry.getEndTime() > 0 &&
      motionQueueEntry.getEndTime() < userTimeSeconds
    ) {
      motionQueueEntry.setIsFinished(true); // 終了
    }
  }

  /**
   * Set the fade-in time
   * @param fadeInSeconds Time to fade in [seconds]
   */
  public setFadeInTime(fadeInSeconds: number): void {
    this._fadeInSeconds = fadeInSeconds;
  }

  /**
   * Set the fade-out time
   * @param fadeOutSeconds Time to fade out [seconds]
   */
  public setFadeOutTime(fadeOutSeconds: number): void {
    this._fadeOutSeconds = fadeOutSeconds;
  }

  /**
   * Get the time it takes to fade out
   * @return Time to fade out [seconds]
   */
  public getFadeOutTime(): number {
    return this._fadeOutSeconds;
  }

  /**
   * Get the time it takes to fade in
   * @return Time to fade in [seconds]
   */
  public getFadeInTime(): number {
    return this._fadeInSeconds;
  }

  /**
   * Setting motion application weights
   * @param weight Weight (0.0 --1.0)
   */
  public setWeight(weight: number): void {
    this._weight = weight;
  }

  /**
   * Get motion application weights
   * @return Weight (0.0 --1.0)
   */
  public getWeight(): number {
    return this._weight;
  }

  /**
   * Get motion length
   * @return Motion length [seconds]
   *
   * @note "-1" for loops.
   * Override if not a loop.
   * If the value is positive, it ends at the time of acquisition.
   * When "-1", the process does not end unless there is a stop command from the outside.
   */
  public getDuration(): number {
    return -1.0;
  }

  /**
   * Get the length of one motion loop
   * @return Length of one motion loop [seconds]
   *
   * @note Returns the same value as getDuration () if not looping
   * If the length of one loop cannot be defined (such as a subclass that keeps running programmatically), "-1" is returned.
   */
  public getLoopDuration(): number {
    return -1.0;
  }

  /**
   * Setting the start time of motion playback
   * @param offsetSeconds Motion playback start time [seconds]
   */
  public setOffsetTime(offsetSeconds: number): void {
    this._offsetSeconds = offsetSeconds;
  }

  /**
   * Model parameter updates
   *
   * Check for event ignition.
   * Input time is the number of seconds with the called motion timing as 0.
   *
   * @param beforeCheckTimeSeconds Last event check time [seconds]
   * @param motionTimeSeconds This playback time [seconds]
   */
  public getFiredEvent(
    beforeCheckTimeSeconds: number,
    motionTimeSeconds: number
  ): csmVector<csmString> {
    return this._firedEventValues;
  }

  /**
   * Update the motion to reflect the parameter values ​​in the model
   * @param model Target model
   * @param userTimeSeconds Cumulative value of delta time [seconds]
   * @param weight Motion weight
   * @param motionQueueEntry Motion managed by CubismMotionQueueManager
   * @return true Parameter value is reflected in the model
   * @return false No parameter value reflected in model (no change in motion)
   */
  public abstract doUpdateParameters(
    model: CubismModel,
    userTimeSeconds: number,
    weight: number,
    motionQueueEntry: CubismMotionQueueEntry
  ): void;

  /**
   * Motion playback end callback registration
   *
   * Register the motion playback end callback.
   * Called when the isFinished flag is set.
   * Not called in the following situations:
   * 1. When the motion being played is set as a "loop"
   * 2. When the callback is not registered
   *
   * @param onFinishedMotionHandler Motion playback end callback function
   */
  public setFinishedMotionHandler = (
    onFinishedMotionHandler: FinishedMotionCallback
  ) => (this._onFinishedMotion = onFinishedMotionHandler);

  /**
   * Get motion playback end callback
   *
   * Get the motion playback end callback.
   *
   * @return Registered motion playback end callback function
   */
  public getFinishedMotionHandler = () => this._onFinishedMotion;

  public _fadeInSeconds: number; // Time to fade in [seconds]
  public _fadeOutSeconds: number; // Time to fade out [seconds]
  public _weight: number; // Motion weight
  public _offsetSeconds: number; // Motion playback start time [seconds]

  public _firedEventValues: csmVector<csmString>;

  // Motion playback end callback function
  public _onFinishedMotion?: FinishedMotionCallback;
}

// Namespace definition for compatibility.
import * as $ from './acubismmotion';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const ACubismMotion = $.ACubismMotion;
  export type ACubismMotion = $.ACubismMotion;
  export type FinishedMotionCallback = $.FinishedMotionCallback;
}