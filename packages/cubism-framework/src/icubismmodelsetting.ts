/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from './id/cubismid';
import { csmMap } from './type/csmmap';

/**
 * A pure virtual class that declares a function that handles model configuration information.
 *
 * By inheriting this class, it becomes a class that handles model setting information.
 */
export abstract class ICubismModelSetting {
  /**
   * Get the name of the Moc file
   * @return Moc File name
   */
  public abstract getModelFileName(): string;

  /**
   * Get the number of textures used by the model
   * Number of textures
   */
  public abstract getTextureCount(): number;

  /**
   * Get the name of the directory where the texture is placed
   * @return The name of the directory where the texture is located
   */
  public abstract getTextureDirectory(): string;

  /**
   * Get the name of the texture used by the model
   * @param index Array index value
   * @return Texture name
   */
  public abstract getTextureFileName(index: number): string;

  /**
   * Get the number of collision detections set in the model
   * @return Number of collision detections set in the model
   */
  public abstract getHitAreasCount(): number;

  /**
   * Get the ID set for collision detection
   *
   * @param index Array index
   * @return ID set for collision detection
   */
  public abstract getHitAreaId(index: number): CubismIdHandle;

  /**
   * Get the name set for collision detection
   * @param index Array index value
   * @return The name set for collision detection
   */
  public abstract getHitAreaName(index: number): string;

  /**
   * Get the name of the physics configuration file
   * @return The name of the physics configuration file
   */
  public abstract getPhysicsFileName(): string;

  /**
   * Get the name of the parts switching setting file
   * @return Name of parts switching configuration file
   */
  public abstract getPoseFileName(): string;

  /**
   * Get the number of facial expression setting files
   * @return Number of facial expression setting files
   */
  public abstract getExpressionCount(): number;

  /**
   * Get the name (alias) that identifies the facial expression setting file
   * @param index Array index value
   * @return Facial expression name
   */
  public abstract getExpressionName(index: number): string;

  /**
   * Get the name of the facial expression setting file
   * @param index Array index value
   * @return The name of the facial expression setting file
   */
  public abstract getExpressionFileName(index: number): string;

  /**
   * Get the number of motion groups
   * @return Number of motion groups
   */
  public abstract getMotionGroupCount(): number;

  /**
   * Get the name of the motion group
   * @param index Array index value
   * @return Motion group name
   */
  public abstract getMotionGroupName(index: number): string;

  /**
   * Get the number of motions contained in a motion group
   * @param groupName The name of the motion group
   * @return Number of motion groups
   */
  public abstract getMotionCount(groupName: string): number;

  /**
   * Get the motion file name from the group name and index value
   * @param groupName The name of the motion group
   * @param index Array index value
   * @return The name of the motion file
   */
  public abstract getMotionFileName(groupName: string, index: number): string;

  /**
   * Get the name of the sound file that corresponds to the motion
   * @param groupName The name of the motion group
   * @param index Array index value
   * @return The name of the sound file
   */
  public abstract getMotionSoundFileName(
    groupName: string,
    index: number
  ): string;

  /**
   * Get the fade-in processing time at the start of motion
   * @param groupName The name of the motion group
   * @param index Array index value
   * @return Fade-in processing time [seconds]
   */
  public abstract getMotionFadeInTimeValue(
    groupName: string,
    index: number
  ): number;

  /**
   * Get the fade-out processing time at the end of the motion
   * @param groupName The name of the motion group
   * @param index Array index value
   * @return Fade out processing time [seconds]
   */
  public abstract getMotionFadeOutTimeValue(
    groupName: string,
    index: number
  ): number;

  /**
   * Get the file name of user data
   * @return File name of user data
   */
  public abstract getUserDataFile(): string;

  /**
   * Get layout information
   * @param outLayoutMap An instance of the csmMap class
   * @return true Layout information exists
   * @return false Layout information does not exist
   */
  public abstract getLayoutMap(outLayoutMap: csmMap<string, number>): boolean;

  /**
   * Get the number of parameters associated with the eye crack
   * @return Number of parameters associated with eye cracks
   */
  public abstract getEyeBlinkParameterCount(): number;

  /**
   * Get the ID of the parameter associated with the eye crack
   * @param index Array index value
   * @return Parameter ID
   */
  public abstract getEyeBlinkParameterId(index: number): CubismIdHandle;

  /**
   * Get the number of parameters associated with lip sync
   * @return Number of parameters associated with lip sync
   */
  public abstract getLipSyncParameterCount(): number;

  /**
   * Get the number of parameters associated with lip sync
   * @param index Array index value
   * @return Parameter ID
   */
  public abstract getLipSyncParameterId(index: number): CubismIdHandle;
}

// Namespace definition for compatibility.
import * as $ from './icubismmodelsetting';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const ICubismModelSetting = $.ICubismModelSetting;
  export type ICubismModelSetting = $.ICubismModelSetting;
}