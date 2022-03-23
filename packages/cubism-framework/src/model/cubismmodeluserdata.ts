/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { CubismFramework } from '../live2dcubismframework';
import { csmString } from '../type/csmstring';
import { csmVector } from '../type/csmvector';
import { CubismModelUserDataJson } from './cubismmodeluserdatajson';

const ArtMesh = 'ArtMesh';

/**
 * User data interface
 *
 * Structure for recording user data read from Json
 */
export class CubismModelUserDataNode {
  targetType: CubismIdHandle; // User data target type
  targetId: CubismIdHandle; // ID of the user data target
  value: csmString; // User data
}

/**
 * User data management class
 *
 * Load, manage, search interface, and even release user data.
 */
export class CubismModelUserData {
  /**
   * Create an instance
   *
   * @param buffer The buffer in which userdata3.json is loaded
   * @param size Buffer size
   * @return Created instance
   */
  public static create(buffer: ArrayBuffer, size: number): CubismModelUserData {
    const ret: CubismModelUserData = new CubismModelUserData();

    ret.parseUserData(buffer, size);

    return ret;
  }

  /**
   * Destroy the instance
   *
   * @param modelUserData Instance to discard
   */
  public static delete(modelUserData: CubismModelUserData): void {
    if (modelUserData != null) {
      modelUserData.release();
      modelUserData = null;
    }
  }

  /**
   * Get a list of ArtMesh user data
   *
   * @return User data list
   */
  public getArtMeshUserDatas(): csmVector<CubismModelUserDataNode> {
    return this._artMeshUserDataNode;
  }

  /**
   * Perth of userdata3.json
   *
   * @param buffer The buffer in which userdata3.json is loaded
   * @param size Buffer size
   */
  public parseUserData(buffer: ArrayBuffer, size: number): void {
    let json: CubismModelUserDataJson = new CubismModelUserDataJson(
      buffer,
      size
    );

    const typeOfArtMesh = CubismFramework.getIdManager().getId(ArtMesh);
    const nodeCount: number = json.getUserDataCount();

    for (let i = 0; i < nodeCount; i++) {
      const addNode: CubismModelUserDataNode = new CubismModelUserDataNode();

      addNode.targetId = json.getUserDataId(i);
      addNode.targetType = CubismFramework.getIdManager().getId(
        json.getUserDataTargetType(i)
      );
      addNode.value = new csmString(json.getUserDataValue(i));
      this._userDataNodes.pushBack(addNode);

      if (addNode.targetType == typeOfArtMesh) {
        this._artMeshUserDataNode.pushBack(addNode);
      }
    }

    json.release();
    json = void 0;
  }

  /**
   * Constructor
   */
  public constructor() {
    this._userDataNodes = new csmVector<CubismModelUserDataNode>();
    this._artMeshUserDataNode = new csmVector<CubismModelUserDataNode>();
  }

  /**
   * Destructor-equivalent processing
   *
   * Free the user data structure array
   */
  public release(): void {
    for (let i = 0; i < this._userDataNodes.getSize(); ++i) {
      this._userDataNodes.set(i, null);
    }

    this._userDataNodes = null;
  }

  private _userDataNodes: csmVector<CubismModelUserDataNode>; // User data structure array
  private _artMeshUserDataNode: csmVector<CubismModelUserDataNode>; // Keep browsing list
}

// Namespace definition for compatibility.
import * as $ from './cubismmodeluserdata';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismModelUserData = $.CubismModelUserData;
  export type CubismModelUserData = $.CubismModelUserData;
  export const CubismModelUserDataNode = $.CubismModelUserDataNode;
  export type CubismModelUserDataNode = $.CubismModelUserDataNode;
}