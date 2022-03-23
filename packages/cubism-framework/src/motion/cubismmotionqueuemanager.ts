/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { ACubismMotion } from './acubismmotion';
import { CubismMotionQueueEntry } from './cubismmotionqueueentry';
import { csmVector, iterator } from '../type/csmvector';
import { CubismModel } from '../model/cubismmodel';
import { csmString } from '../type/csmstring';

/**
 * Manage motion playback
 *
 * Motion playback management class. Used to play subclasses of ACubismMotion, such as CubismMotion motion.
 *
 * @note If another motion is StartMotion () during playback, it will smoothly change to the new motion and the old motion will be interrupted.
 * When the facial expression motion, body motion, etc. are divided into motions, etc.
 * If you want to play multiple motions at the same time, use multiple CubismMotionQueueManager instances.
 */
export class CubismMotionQueueManager {
  /**
   * Constructor
   */
  public constructor() {
    this._userTimeSeconds = 0.0;
    this._eventCallBack = null;
    this._eventCustomData = null;
    this._motions = new csmVector<CubismMotionQueueEntry>();
  }

  /**
   * Destructor
   */
  public release(): void {
    for (let i = 0; i < this._motions.getSize(); ++i) {
      if (this._motions.at(i)) {
        this._motions.at(i).release();
        this._motions.set(i, null);
      }
    }

    this._motions = null;
  }

  /**
   * Start of specified motion
   *
   * Start the specified motion. If you already have the same type of motion, flag the existing motion to end and start fading out.
   *
   * @param motion Motion to start
   * @param autoDelete true if you want to delete an instance of a motion that has finished playing
   * @param userTimeSeconds Cumulative value of delta time [seconds]
   * @return Returns the identification number of the started motion. Used in the argument of IsFinished () to determine whether an individual motion has ended. "-1" when you cannot start
   */
  public startMotion(
    motion: ACubismMotion,
    autoDelete: boolean,
    userTimeSeconds: number
  ): CubismMotionQueueEntryHandle {
    if (motion == null) {
      return InvalidMotionQueueEntryHandleValue;
    }

    let motionQueueEntry: CubismMotionQueueEntry = null;

    // Set the end flag if there is already motion
    for (let i = 0; i < this._motions.getSize(); ++i) {
      motionQueueEntry = this._motions.at(i);
      if (motionQueueEntry == null) {
        continue;
      }

      motionQueueEntry.setFadeOut(motionQueueEntry._motion.getFadeOutTime()); // Fade out setting
    }

    motionQueueEntry = new CubismMotionQueueEntry(); // Discard at exit
    motionQueueEntry._autoDelete = autoDelete;
    motionQueueEntry._motion = motion;

    this._motions.pushBack(motionQueueEntry);

    return motionQueueEntry._motionQueueEntryHandle;
  }

  /**
   * Confirmation of the end of all motions
   * @return true All finished
   * @return false Not finished
   */
  public isFinished(): boolean {
    // ------- Process -------
    // Set the end flag if there is already motion

    for (
      let ite: iterator<CubismMotionQueueEntry> = this._motions.begin();
      ite.notEqual(this._motions.end());

    ) {
      let motionQueueEntry: CubismMotionQueueEntry = ite.ptr();

      if (motionQueueEntry == null) {
        ite = this._motions.erase(ite); // 削除
        continue;
      }

      const motion: ACubismMotion = motionQueueEntry._motion;

      if (motion == null) {
        motionQueueEntry.release();
        motionQueueEntry = null;
        ite = this._motions.erase(ite); // 削除
        continue;
      }

      // ----- Delete any completed processing ------
      if (!motionQueueEntry.isFinished()) {
        return false;
      } else {
        ite.preIncrement();
      }
    }

    return true;
  }

  /**
   * Confirmation of the end of the specified motion
   * @param motionQueueEntryNumber Motion identification number
   * @return true All finished
   * @return false Not finished
   */
  public isFinishedByHandle(
    motionQueueEntryNumber: CubismMotionQueueEntryHandle
  ): boolean {
    for (
      let ite: iterator<CubismMotionQueueEntry> = this._motions.begin();
      ite.notEqual(this._motions.end());
      ite.increment()
    ) {
      const motionQueueEntry: CubismMotionQueueEntry = ite.ptr();

      if (motionQueueEntry == null) {
        continue;
      }

      if (
        motionQueueEntry._motionQueueEntryHandle == motionQueueEntryNumber &&
        !motionQueueEntry.isFinished()
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * Stop all motions
   */
  public stopAllMotions(): void {
    // ------- Process -------
    // Set the end flag if there is already motion

    for (
      let ite: iterator<CubismMotionQueueEntry> = this._motions.begin();
      ite.notEqual(this._motions.end());

    ) {
      let motionQueueEntry: CubismMotionQueueEntry = ite.ptr();

      if (motionQueueEntry == null) {
        ite = this._motions.erase(ite);

        continue;
      }

      // ----- Delete any completed processing ------
      motionQueueEntry.release();
      motionQueueEntry = null;
      ite = this._motions.erase(ite); // 削除
    }
  }

  /**
       * Get the specified CubismMotionQueueEntry
 
        * @param motionQueueEntryNumber Motion identification number
        * @return Specified CubismMotionQueueEntry
        * @return null Not found
        */
  public getCubismMotionQueueEntry(
    motionQueueEntryNumber: any
  ): CubismMotionQueueEntry {
    // ------- Process -------
    for (
      let ite: iterator<CubismMotionQueueEntry> = this._motions.begin();
      ite.notEqual(this._motions.end());
      ite.preIncrement()
    ) {
      const motionQueueEntry: CubismMotionQueueEntry = ite.ptr();

      if (motionQueueEntry == null) {
        continue;
      }

      if (motionQueueEntry._motionQueueEntryHandle == motionQueueEntryNumber) {
        return motionQueueEntry;
      }
    }

    return null;
  }

  /**
   * Registering a Callback to receive the event
   *
   * @param callback callback function
   * @param customData Data returned in the callback
   */
  public setEventCallback(
    callback: CubismMotionEventFunction,
    customData: any = null
  ): void {
    this._eventCallBack = callback;
    this._eventCustomData = customData;
  }

  /**
   * Update the motion to reflect the parameter values ​​in the model.
   *
   * @param model Target model
   * @param userTimeSeconds Cumulative value of delta time [seconds]
   * @return true Parameter value is reflected in the model
   * @return false No parameter value reflected in model (no change in motion)
   */
  public doUpdateMotion(model: CubismModel, userTimeSeconds: number): boolean {
    let updated = false;

    // ------- Process --------
    // Set the end flag if there is already motion

    for (
      let ite: iterator<CubismMotionQueueEntry> = this._motions.begin();
      ite.notEqual(this._motions.end());

    ) {
      let motionQueueEntry: CubismMotionQueueEntry = ite.ptr();

      if (motionQueueEntry == null) {
        ite = this._motions.erase(ite); // 削除
        continue;
      }

      const motion: ACubismMotion = motionQueueEntry._motion;

      if (motion == null) {
        motionQueueEntry.release();
        motionQueueEntry = null;
        ite = this._motions.erase(ite); // 削除

        continue;
      }

      // ------ Reflect the value ------
      motion.updateParameters(model, motionQueueEntry, userTimeSeconds);
      updated = true;

      // ------ Check for user-triggered events ----
      const firedList: csmVector<csmString> = motion.getFiredEvent(
        motionQueueEntry.getLastCheckEventSeconds() -
        motionQueueEntry.getStartTime(),
        userTimeSeconds - motionQueueEntry.getStartTime()
      );

      for (let i = 0; i < firedList.getSize(); ++i) {
        this._eventCallBack(this, firedList.at(i), this._eventCustomData);
      }

      motionQueueEntry.setLastCheckEventSeconds(userTimeSeconds);

      // ------ Delete any completed processing ------
      if (motionQueueEntry.isFinished()) {
        motionQueueEntry.release();
        motionQueueEntry = null;
        ite = this._motions.erase(ite); // 削除
      } else {
        if (motionQueueEntry.isTriggeredFadeOut()) {
          motionQueueEntry.startFadeOut(
            motionQueueEntry.getFadeOutSeconds(),
            userTimeSeconds
          );
        }
        ite.preIncrement();
      }
    }

    return updated;
  }
  _userTimeSeconds: number; // Integrated value of delta time [seconds]

  _motions: csmVector<CubismMotionQueueEntry>; // Motion
  _eventCallBack: CubismMotionEventFunction; // Callback function
  _eventCustomData: any; // Data returned in the callback
}

/**
 * Define event callback function
 *
 * Function type information that can be registered in the event callback
 * @param caller CubismMotionQueueManager that played the fired event
 * @param eventValue Character string data of the fired event
 * @param customData The data specified during registration returned in the callback
 */
export interface CubismMotionEventFunction {
  (
    caller: CubismMotionQueueManager,
    eventValue: csmString,
    customData: any
  ): void;
}

/**
 * Motion identification number
 *
 * Definition of motion identification number
 */
export declare type CubismMotionQueueEntryHandle = any;
export const InvalidMotionQueueEntryHandleValue: CubismMotionQueueEntryHandle = -1;

// Namespace definition for compatibility.
import * as $ from './cubismmotionqueuemanager';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismMotionQueueManager = $.CubismMotionQueueManager;
  export type CubismMotionQueueManager = $.CubismMotionQueueManager;
  export const InvalidMotionQueueEntryHandleValue =
    $.InvalidMotionQueueEntryHandleValue;
  export type CubismMotionQueueEntryHandle = $.CubismMotionQueueEntryHandle;
  export type CubismMotionEventFunction = $.CubismMotionEventFunction;
}