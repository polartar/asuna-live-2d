/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { CubismFramework } from '../live2dcubismframework';
import { CubismJson } from '../utils/cubismjson';

const Meta = 'Meta';
const UserDataCount = 'UserDataCount';
const TotalUserDataSize = 'TotalUserDataSize';
const UserData = 'UserData';
const Target = 'Target';
const Id = 'Id';
const Value = 'Value';

export class CubismModelUserDataJson {
  /**
   * Constructor
   * @param buffer The buffer in which userdata3.json is loaded
   * @param size Buffer size
   */
  public constructor(buffer: ArrayBuffer, size: number) {
    this._json = CubismJson.create(buffer, size);
  }

  /**
   * Destructor-equivalent processing
   */
  public release(): void {
    CubismJson.delete(this._json);
  }

  /**
   * Get the number of user data
   * @return Number of user data
   */
  public getUserDataCount(): number {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(UserDataCount)
      .toInt();
  }

  /**
   * Get the total number of user data strings
   *
   * @return Total number of user data strings
   */
  public getTotalUserDataSize(): number {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(TotalUserDataSize)
      .toInt();
  }

  /**
   * Get user data type
   *
   * @return User data type
   */
  public getUserDataTargetType(i: number): string {
    return this._json
      .getRoot()
      .getValueByString(UserData)
      .getValueByIndex(i)
      .getValueByString(Target)
      .getRawString();
  }

  /**
   * Get the target ID of user data
   *
   * @param i index
   * @return User data target ID
   */
  public getUserDataId(i: number): CubismIdHandle {
    return CubismFramework.getIdManager().getId(
      this._json
        .getRoot()
        .getValueByString(UserData)
        .getValueByIndex(i)
        .getValueByString(Id)
        .getRawString()
    );
  }

  /**
   * Get user data string
   *
   * @param i index
   * @return User data
   */
  public getUserDataValue(i: number): string {
    return this._json
      .getRoot()
      .getValueByString(UserData)
      .getValueByIndex(i)
      .getValueByString(Value)
      .getRawString();
  }

  private _json: CubismJson;
}

// Namespace definition for compatibility.
import * as $ from './cubismmodeluserdatajson';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismModelUserDataJson = $.CubismModelUserDataJson;
  export type CubismModelUserDataJson = $.CubismModelUserDataJson;
}