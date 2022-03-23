/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { ACubismMotion } from './acubismmotion';
import { CubismMotionQueueEntryHandle } from './cubismmotionqueuemanager';

/**
 * CubismMotion The management class for each motion playing in QueueManager.
 */
export class CubismMotionQueueEntry {
  /**
   * Constructor
   */
  public constructor() {
    this._autoDelete = false;
    this._motion = null;
    this._available = true;
    this._finished = false;
    this._started = false;
    this._startTimeSeconds = -1.0;
    this._fadeInStartTimeSeconds = 0.0;
    this._endTimeSeconds = -1.0;
    this._stateTimeSeconds = 0.0;
    this._stateWeight = 0.0;
    this._lastEventCheckSeconds = 0.0;
    this._motionQueueEntryHandle = this;
    this._fadeOutSeconds = 0.0;
    this._isTriggeredFadeOut = false;
  }

  /**
   * Destructor-equivalent processing
   */
  public release(): void {
    if (this._autoDelete && this._motion) {
      ACubismMotion.delete(this._motion); //
    }
  }

  /**
   * Fade out time and start judgment settings
   * @param fadeOutSeconds Time to fade out [seconds]
   */
  public setFadeOut(fadeOutSeconds: number): void {
    this._fadeOutSeconds = fadeOutSeconds;
    this._isTriggeredFadeOut = true;
  }

  /**
   * Start of fade out
   * @param fadeOutSeconds Time to fade out [seconds]
   * @param userTimeSeconds Cumulative value of delta time [seconds]
   */
  public startFadeOut(fadeOutSeconds: number, userTimeSeconds: number): void {
    const newEndTimeSeconds: number = userTimeSeconds + fadeOutSeconds;
    this._isTriggeredFadeOut = true;

    if (
      this._endTimeSeconds < 0.0 ||
      newEndTimeSeconds < this._endTimeSeconds
    ) {
      this._endTimeSeconds = newEndTimeSeconds;
    }
  }

  /**
   * Confirmation of the end of motion
   *
   * @return true The motion has ended
   * @return false Not finished
   */
  public isFinished(): boolean {
    return this._finished;
  }

  /**
   * Confirm the start of motion
   * @return true Motion has started
   * @return false Not started
   */
  public isStarted(): boolean {
    return this._started;
  }

  /**
   * Get the start time of the motion
   * @return Motion start time [seconds]
   */
  public getStartTime(): number {
    return this._startTimeSeconds;
  }

  /**
   * Get the fade-in start time
   * @return Fade-in start time [seconds]
   */
  public getFadeInStartTime(): number {
    return this._fadeInStartTimeSeconds;
  }

  /**
   * Get the fade-in end time
   * @return Get fade-in end time
   */
  public getEndTime(): number {
    return this._endTimeSeconds;
  }

  /**
   * Setting the start time of the motion
   * @param startTime Motion start time
   */
  public setStartTime(startTime: number): void {
    this._startTimeSeconds = startTime;
  }

  /**
   * Setting the fade-in start time
   * @param startTime Fade-in start time [seconds]
   */
  public setFadeInStartTime(startTime: number): void {
    this._fadeInStartTimeSeconds = startTime;
  }

  /**
   * Setting the end time of fade-in
   * @param endTime Fade-in end time [seconds]
   */
  public setEndTime(endTime: number): void {
    this._endTimeSeconds = endTime;
  }

  /**
   * Setting the end of motion
   * @param f If true, end of motion
   */
  public setIsFinished(f: boolean): void {
    this._finished = f;
  }

  /**
   * Motion start setting
   * @param f If true, start motion
   */
  public setIsStarted(f: boolean): void {
    this._started = f;
  }

  /**
   * Checking the effectiveness of motion
   * @return true Motion is valid
   * @return false Motion is disabled
   */
  public isAvailable(): boolean {
    return this._available;
  }

  /**
   * Motion effectiveness settings
   * @param v If true, motion is valid
   */
  public setIsAvailable(v: boolean): void {
    this._available = v;
  }

  /**
   * Motion state setting
   * @param timeSeconds present time [seconds]
   * @param weight Motion tail weight
   */
  public setState(timeSeconds: number, weight: number): void {
    this._stateTimeSeconds = timeSeconds;
    this._stateWeight = weight;
  }

  /**
   * Get the current time of motion
   * @return Current time of motion [seconds]
   */
  public getStateTime(): number {
    return this._stateTimeSeconds;
  }

  /**
   * Get motion weights
   * @return Motion weight
   */
  public getStateWeight(): number {
    return this._stateWeight;
  }

  /**
   * Get the last time you checked the firing of the event
   *
   * @return Last time the event fire was checked [seconds]
   */
  public getLastCheckEventSeconds(): number {
    return this._lastEventCheckSeconds;
  }

  /**
   * Set the time when the last event was checked
   * @param checkSeconds The last time the event was checked [seconds]
   */
  public setLastCheckEventSeconds(checkSeconds: number): void {
    this._lastEventCheckSeconds = checkSeconds;
  }

  /**
   * Obtaining fade-out start judgment
   * @return Whether to start fading out
   */
  public isTriggeredFadeOut(): boolean {
    return this._isTriggeredFadeOut;
  }

  /**
   * Get fade-out time
   * @return Fade out time [seconds]
   */
  public getFadeOutSeconds(): number {
    return this._fadeOutSeconds;
  }

  _autoDelete: boolean; // Automatic deletion
  _motion: ACubismMotion; // Motion

  _available: boolean; // enable flag
  _finished: boolean; // Finished flag
  _started: boolean; // Start flag
  _startTimeSeconds: number; // モーション Regeneration start time [seconds]
  _fadeInStartTimeSeconds: number; // Fade-in start time (only the first time in a loop) [seconds]
  _endTimeSeconds: number; // Scheduled end time [seconds]
  _stateTimeSeconds: number; // Time state [seconds]
  _stateWeight: number; // Weight state
  _lastEventCheckSeconds: number; // Time checked on the last Motion side
  private _fadeOutSeconds: number; // Fade out time [seconds]
  private _isTriggeredFadeOut: boolean; // Fade out start flag

  _motionQueueEntryHandle: CubismMotionQueueEntryHandle; // Identification number with a unique value for each instance
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionqueueentry';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismMotionQueueEntry = $.CubismMotionQueueEntry;
  export type CubismMotionQueueEntry = $.CubismMotionQueueEntry;
}