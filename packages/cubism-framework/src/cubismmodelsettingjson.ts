/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { ICubismModelSetting } from './icubismmodelsetting';
import { CubismIdHandle } from './id/cubismid';
import { CubismFramework } from './live2dcubismframework';
import { csmMap, iterator } from './type/csmmap';
import { csmVector } from './type/csmvector';
import { CubismJson, Value } from './utils/cubismjson';

/**
 * Model3Json key string
 */

// JSON Keys
const Version = 'Version';
const FileReferences = 'FileReferences';
const Groups = 'Groups';
const Layout = 'Layout';
const HitAreas = 'HitAreas';

const Moc = 'Moc';
const Textures = 'Textures';
const Physics = 'Physics';
const Pose = 'Pose';
const Expressions = 'Expressions';
const Motions = 'Motions';

const UserData = 'UserData';
const Name = 'Name';
const FilePath = 'File';
const Id = 'Id';
const Ids = 'Ids';
const Target = 'Target';

// Motions
const Idle = 'Idle';
const TapBody = 'TapBody';
const PinchIn = 'PinchIn';
const PinchOut = 'PinchOut';
const Shake = 'Shake';
const FlickHead = 'FlickHead';
const Parameter = 'Parameter';

const SoundPath = 'Sound';
const FadeInTime = 'FadeInTime';
const FadeOutTime = 'FadeOutTime';

// Layout
const CenterX = 'CenterX';
const CenterY = 'CenterY';
const X = 'X';
const Y = 'Y';
const Width = 'Width';
const Height = 'Height';

const LipSync = 'LipSync';
const EyeBlink = 'EyeBlink';

const InitParameter = 'init_param';
const InitPartsVisible = 'init_parts_visible';
const Val = 'val';

enum FrequestNode {
  FrequestNode_Groups, // getRoot().getValueByString(Groups)
  FrequestNode_Moc, // getRoot().getValueByString(FileReferences).getValueByString(Moc)
  FrequestNode_Motions, // getRoot().getValueByString(FileReferences).getValueByString(Motions)
  FrequestNode_Expressions, // getRoot().getValueByString(FileReferences).getValueByString(Expressions)
  FrequestNode_Textures, // getRoot().getValueByString(FileReferences).getValueByString(Textures)
  FrequestNode_Physics, // getRoot().getValueByString(FileReferences).getValueByString(Physics)
  FrequestNode_Pose, // getRoot().getValueByString(FileReferences).getValueByString(Pose)
  FrequestNode_HitAreas // getRoot().getValueByString(HitAreas)
}

/**
 * Model3Json parser
 *
 * Parse the model3.json file to get the value
 */
export class CubismModelSettingJson extends ICubismModelSetting {
  /**
   * Constructor with arguments
   *
   * @param buffer A data buffer that reads Model3Json as a byte array
   * @param size Model3 Json data size
   */
  public constructor(buffer: ArrayBuffer, size: number) {
    super();
    this._json = CubismJson.create(buffer, size);

    if (this._json) {
      this._jsonValue = new csmVector<Value>();

      // The order matches the enum FrequestNode
      this._jsonValue.pushBack(this._json.getRoot().getValueByString(Groups));
      this._jsonValue.pushBack(
        this._json
          .getRoot()
          .getValueByString(FileReferences)
          .getValueByString(Moc)
      );
      this._jsonValue.pushBack(
        this._json
          .getRoot()
          .getValueByString(FileReferences)
          .getValueByString(Motions)
      );
      this._jsonValue.pushBack(
        this._json
          .getRoot()
          .getValueByString(FileReferences)
          .getValueByString(Expressions)
      );
      this._jsonValue.pushBack(
        this._json
          .getRoot()
          .getValueByString(FileReferences)
          .getValueByString(Textures)
      );
      this._jsonValue.pushBack(
        this._json
          .getRoot()
          .getValueByString(FileReferences)
          .getValueByString(Physics)
      );
      this._jsonValue.pushBack(
        this._json
          .getRoot()
          .getValueByString(FileReferences)
          .getValueByString(Pose)
      );
      this._jsonValue.pushBack(this._json.getRoot().getValueByString(HitAreas));
    }
  }

  /**
   * Destructor-equivalent processing
   */
  public release(): void {
    CubismJson.delete(this._json);

    this._jsonValue = null;
  }

  /**
   * Get a CubismJson object
   *
   * @return CubismJson
   */
  public GetJson(): CubismJson {
    return this._json;
  }

  /**
   * Get the name of the Moc file
   * @return Moc File name
   */
  public getModelFileName(): string {
    if (!this.isExistModelFile()) {
      return '';
    }
    return this._jsonValue.at(FrequestNode.FrequestNode_Moc).getRawString();
  }

  /**
   * Get the number of textures used by the model
   * Number of textures
   */
  public getTextureCount(): number {
    if (!this.isExistTextureFiles()) {
      return 0;
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_Textures).getSize();
  }

  /**
   * Get the name of the directory where the texture is placed
   * @return The name of the directory where the texture is located
   */
  public getTextureDirectory(): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_Textures)
      .getRawString();
  }

  /**
   * Get the name of the texture used by the model
   * @param index Array index value
   * @return Texture name
   */
  public getTextureFileName(index: number): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_Textures)
      .getValueByIndex(index)
      .getRawString();
  }

  /**
   * Get the number of collision detections set in the model
   * @return Number of collision detections set in the model
   */
  public getHitAreasCount(): number {
    if (!this.isExistHitAreas()) {
      return 0;
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_HitAreas).getSize();
  }

  /**
   * Get the ID set for collision detection
   *
   * @param index Array index
   * @return ID set for collision detection
   */
  public getHitAreaId(index: number): CubismIdHandle {
    return CubismFramework.getIdManager().getId(
      this._jsonValue
        .at(FrequestNode.FrequestNode_HitAreas)
        .getValueByIndex(index)
        .getValueByString(Id)
        .getRawString()
    );
  }

  /**
   * Get the name set for collision detection
   * @param index Array index value
   * @return The name set for collision detection
   */
  public getHitAreaName(index: number): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_HitAreas)
      .getValueByIndex(index)
      .getValueByString(Name)
      .getRawString();
  }

  /**
   * Get the name of the physics configuration file
   * @return The name of the physics configuration file
   */
  public getPhysicsFileName(): string {
    if (!this.isExistPhysicsFile()) {
      return '';
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_Physics).getRawString();
  }

  /**
   * Get the name of the parts switching setting file
   * @return Name of parts switching configuration file
   */
  public getPoseFileName(): string {
    if (!this.isExistPoseFile()) {
      return '';
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_Pose).getRawString();
  }

  /**
   * Get the number of facial expression setting files
   * @return Number of facial expression setting files
   */
  public getExpressionCount(): number {
    if (!this.isExistExpressionFile()) {
      return 0;
    }

    return this._jsonValue.at(FrequestNode.FrequestNode_Expressions).getSize();
  }

  /**
   * Get the name (alias) that identifies the facial expression setting file
   * @param index Array index value
   * @return Facial expression name
   */
  public getExpressionName(index: number): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_Expressions)
      .getValueByIndex(index)
      .getValueByString(Name)
      .getRawString();
  }

  /**
   * Get the name of the facial expression setting file
   * @param index Array index value
   * @return The name of the facial expression setting file
   */
  public getExpressionFileName(index: number): string {
    return this._jsonValue
      .at(FrequestNode.FrequestNode_Expressions)
      .getValueByIndex(index)
      .getValueByString(FilePath)
      .getRawString();
  }

  /**
   * Get the number of motion groups
   * @return Number of motion groups
   */
  public getMotionGroupCount(): number {
    if (!this.isExistMotionGroups()) {
      return 0;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getKeys()
      .getSize();
  }

  /**
   * Get the name of the motion group
   * @param index Array index value
   * @return Motion group name
   */
  public getMotionGroupName(index: number): string {
    if (!this.isExistMotionGroups()) {
      return null;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getKeys()
      .at(index);
  }

  /**
   * Get the number of motions contained in a motion group
   * @param groupName The name of the motion group
   * @return Number of motion groups
   */
  public getMotionCount(groupName: string): number {
    if (!this.isExistMotionGroupName(groupName)) {
      return 0;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getSize();
  }

  /**
   * Get the motion file name from the group name and index value
   * @param groupName The name of the motion group
   * @param index Array index value
   * @return The name of the motion file
   */
  public getMotionFileName(groupName: string, index: number): string {
    if (!this.isExistMotionGroupName(groupName)) {
      return '';
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(FilePath)
      .getRawString();
  }

  /**
   * Get the name of the sound file that corresponds to the motion
   * @param groupName The name of the motion group
   * @param index Array index value
   * @return The name of the sound file
   */
  public getMotionSoundFileName(groupName: string, index: number): string {
    if (!this.isExistMotionSoundFile(groupName, index)) {
      return '';
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(SoundPath)
      .getRawString();
  }

  /**
   * Get the fade-in processing time at the start of motion
   * @param groupName The name of the motion group
   * @param index Array index value
   * @return Fade-in processing time [seconds]
   */
  public getMotionFadeInTimeValue(groupName: string, index: number): number {
    if (!this.isExistMotionFadeIn(groupName, index)) {
      return -1.0;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(FadeInTime)
      .toFloat();
  }

  /**
   * Get the fade-out processing time at the end of the motion
   * @param groupName The name of the motion group
   * @param index Array index value
   * @return Fade out processing time [seconds]
   */
  public getMotionFadeOutTimeValue(groupName: string, index: number): number {
    if (!this.isExistMotionFadeOut(groupName, index)) {
      return -1.0;
    }

    return this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(FadeOutTime)
      .toFloat();
  }

  /**
   * Get the file name of user data
   * @return File name of user data
   */
  public getUserDataFile(): string {
    if (!this.isExistUserDataFile()) {
      return '';
    }

    return this._json
      .getRoot()
      .getValueByString(FileReferences)
      .getValueByString(UserData)
      .getRawString();
  }

  /**
   * Get layout information
   * @param outLayoutMap An instance of the csmMap class
   * @return true Layout information exists
   * @return false Layout information does not exist
   */
  public getLayoutMap(outLayoutMap: csmMap<string, number>): boolean {
    // If an element that does not exist is accessed, an error will occur, so if Value is null, assign null.
    const map: csmMap<string, Value> = this._json
      .getRoot()
      .getValueByString(Layout)
      .getMap();

    if (map == null) {
      return false;
    }

    let ret = false;

    for (
      const ite: iterator<string, Value> = map.begin();
      ite.notEqual(map.end());
      ite.preIncrement()
    ) {
      outLayoutMap.setValue(ite.ptr().first, ite.ptr().second.toFloat());
      ret = true;
    }

    return ret;
  }

  /**
   * Get the number of parameters associated with the eye crack
   * @return Number of parameters associated with eye cracks
   */
  public getEyeBlinkParameterCount(): number {
    if (!this.isExistEyeBlinkParameters()) {
      return 0;
    }

    let num = 0;
    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      i++
    ) {
      const refI: Value = this._jsonValue
        .at(FrequestNode.FrequestNode_Groups)
        .getValueByIndex(i);
      if (refI.isNull() || refI.isError()) {
        continue;
      }

      if (refI.getValueByString(Name).getRawString() == EyeBlink) {
        num = refI
          .getValueByString(Ids)
          .getVector()
          .getSize();
        break;
      }
    }

    return num;
  }

  /**
   * Get the ID of the parameter associated with the eye crack
   * @param index Array index value
   * @return Parameter ID
   */
  public getEyeBlinkParameterId(index: number): CubismIdHandle {
    if (!this.isExistEyeBlinkParameters()) {
      return null;
    }

    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      i++
    ) {
      const refI: Value = this._jsonValue
        .at(FrequestNode.FrequestNode_Groups)
        .getValueByIndex(i);
      if (refI.isNull() || refI.isError()) {
        continue;
      }

      if (refI.getValueByString(Name).getRawString() == EyeBlink) {
        return CubismFramework.getIdManager().getId(
          refI
            .getValueByString(Ids)
            .getValueByIndex(index)
            .getRawString()
        );
      }
    }
    return null;
  }

  /**
   * Get the number of parameters associated with lip sync
   * @return Number of parameters associated with lip sync
   */
  public getLipSyncParameterCount(): number {
    if (!this.isExistLipSyncParameters()) {
      return 0;
    }

    let num = 0;
    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      i++
    ) {
      const refI: Value = this._jsonValue
        .at(FrequestNode.FrequestNode_Groups)
        .getValueByIndex(i);
      if (refI.isNull() || refI.isError()) {
        continue;
      }

      if (refI.getValueByString(Name).getRawString() == LipSync) {
        num = refI
          .getValueByString(Ids)
          .getVector()
          .getSize();
        break;
      }
    }

    return num;
  }

  /**
   * Get the number of parameters associated with lip sync
   * @param index Array index value
   * @return Parameter ID
   */
  public getLipSyncParameterId(index: number): CubismIdHandle {
    if (!this.isExistLipSyncParameters()) {
      return null;
    }

    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      i++
    ) {
      const refI: Value = this._jsonValue
        .at(FrequestNode.FrequestNode_Groups)
        .getValueByIndex(i);
      if (refI.isNull() || refI.isError()) {
        continue;
      }

      if (refI.getValueByString(Name).getRawString() == LipSync) {
        return CubismFramework.getIdManager().getId(
          refI
            .getValueByString(Ids)
            .getValueByIndex(index)
            .getRawString()
        );
      }
    }
    return null;
  }

  /**
   * Check if the model file key exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistModelFile(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Moc);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the key for the texture file exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistTextureFiles(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Textures);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the key for collision detection exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistHitAreas(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_HitAreas);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the key of the physics file exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistPhysicsFile(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Physics);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the key of the pose setting file exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistPoseFile(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Pose);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the key of the facial expression setting file exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistExpressionFile(): boolean {
    const node: Value = this._jsonValue.at(
      FrequestNode.FrequestNode_Expressions
    );
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the motion group key exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistMotionGroups(): boolean {
    const node: Value = this._jsonValue.at(FrequestNode.FrequestNode_Motions);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the key of the motion group specified by the argument exists
   * @param groupName Group name
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistMotionGroupName(groupName: string): boolean {
    const node: Value = this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the key of the sound file corresponding to the motion specified by the argument exists.
   * @param groupName Group name
   * @param index Array index value
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistMotionSoundFile(groupName: string, index: number): boolean {
    const node: Value = this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(SoundPath);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the fade-in time key corresponding to the motion specified by the argument exists.
   * @param groupName Group name
   * @param index Array index value
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistMotionFadeIn(groupName: string, index: number): boolean {
    const node: Value = this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(FadeInTime);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if there is a fade-out time key corresponding to the motion specified by the argument
   * @param groupName Group name
   * @param index Array index value
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistMotionFadeOut(groupName: string, index: number): boolean {
    const node: Value = this._jsonValue
      .at(FrequestNode.FrequestNode_Motions)
      .getValueByString(groupName)
      .getValueByIndex(index)
      .getValueByString(FadeOutTime);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if the UserData file name exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistUserDataFile(): boolean {
    const node: Value = this._json
      .getRoot()
      .getValueByString(FileReferences)
      .getValueByString(UserData);
    return !node.isNull() && !node.isError();
  }

  /**
   * Check if there is a parameter associated with the eye patch
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistEyeBlinkParameters(): boolean {
    if (
      this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
      this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()
    ) {
      return false;
    }

    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      ++i
    ) {
      if (
        this._jsonValue
          .at(FrequestNode.FrequestNode_Groups)
          .getValueByIndex(i)
          .getValueByString(Name)
          .getRawString() == EyeBlink
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if the parameter associated with LipSync exists
   * @return true Key exists
   * @return false Key does not exist
   */
  private isExistLipSyncParameters(): boolean {
    if (
      this._jsonValue.at(FrequestNode.FrequestNode_Groups).isNull() ||
      this._jsonValue.at(FrequestNode.FrequestNode_Groups).isError()
    ) {
      return false;
    }
    for (
      let i = 0;
      i < this._jsonValue.at(FrequestNode.FrequestNode_Groups).getSize();
      ++i
    ) {
      if (
        this._jsonValue
          .at(FrequestNode.FrequestNode_Groups)
          .getValueByIndex(i)
          .getValueByString(Name)
          .getRawString() == LipSync
      ) {
        return true;
      }
    }
    return false;
  }

  private _json: CubismJson;
  private _jsonValue: csmVector<Value>;
}

// Namespace definition for compatibility.
import * as $ from './cubismmodelsettingjson';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismModelSettingJson = $.CubismModelSettingJson;
  export type CubismModelSettingJson = $.CubismModelSettingJson;
}