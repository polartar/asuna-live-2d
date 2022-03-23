/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { CubismFramework } from '../live2dcubismframework';
import { CubismModel } from '../model/cubismmodel';
import { csmVector, iterator } from '../type/csmvector';
import { CubismJson, Value } from '../utils/cubismjson';

const Epsilon = 0.001;
const DefaultFadeInSeconds = 0.5;

// Pose.json tag
const FadeIn = 'FadeInTime';
const Link = 'Link';
const Groups = 'Groups';
const Id = 'Id';

/**
 * Setting the opacity of the part
 *
 * Manage and set the opacity of parts.
 */
export class CubismPose {
  /**
   * Create an instance
   * @ param pose3json pose3.json data
   * @param size pose3.json data size [byte]
   * @return Created instance
   */
  public static create(pose3json: ArrayBuffer, size: number): CubismPose {
    const ret: CubismPose = new CubismPose();
    const json: CubismJson = CubismJson.create(pose3json, size);
    const root: Value = json.getRoot();

    // Specify fade time
    if (!root.getValueByString(FadeIn).isNull()) {
      ret._fadeTimeSeconds = root
        .getValueByString(FadeIn)
        .toFloat(DefaultFadeInSeconds);

      if (ret._fadeTimeSeconds <= 0.0) {
        ret._fadeTimeSeconds = DefaultFadeInSeconds;
      }
    }

    // Parts group
    const poseListInfo: Value = root.getValueByString(Groups);
    const poseCount: number = poseListInfo.getSize();

    for (let poseIndex = 0; poseIndex < poseCount; ++poseIndex) {
      const idListInfo: Value = poseListInfo.getValueByIndex(poseIndex);
      const idCount: number = idListInfo.getSize();
      let groupCount = 0;

      for (let groupIndex = 0; groupIndex < idCount; ++groupIndex) {
        const partInfo: Value = idListInfo.getValueByIndex(groupIndex);
        const partData: PartData = new PartData();
        const parameterId: CubismIdHandle = CubismFramework.getIdManager().getId(
          partInfo.getValueByString(Id).getRawString()
        );

        partData.partId = parameterId;

        // Setting the parts to link
        if (!partInfo.getValueByString(Link).isNull()) {
          const linkListInfo: Value = partInfo.getValueByString(Link);
          const linkCount: number = linkListInfo.getSize();

          for (let linkIndex = 0; linkIndex < linkCount; ++linkIndex) {
            const linkPart: PartData = new PartData();
            const linkId: CubismIdHandle = CubismFramework.getIdManager().getId(
              linkListInfo.getValueByIndex(linkIndex).getString()
            );

            linkPart.partId = linkId;

            partData.link.pushBack(linkPart);
          }
        }

        ret._partGroups.pushBack(partData.clone());

        ++groupCount;
      }

      ret._partGroupCounts.pushBack(groupCount);
    }

    CubismJson.delete(json);

    return ret;
  }

  /**
   * Destroy the instance
   * @param pose Target Cubism Pose
   */
  public static delete(pose: CubismPose): void {
    if (pose != null) {
      pose = null;
    }
  }

  /**
   * Update model parameters
   * @param model Target model
   * @param deltaTimeSeconds Delta time [seconds]
   */
  public updateParameters(model: CubismModel, deltaTimeSeconds: number): void {
    // Initialization is required if it is not the same as the previous model
    if (model != this._lastModel) {
      // Initialize parameter index
      this.reset(model);
    }

    this._lastModel = model;

    // If you change the time from the setting, the elapsed time may become negative, so it corresponds to the elapsed time 0
    if (deltaTimeSeconds < 0.0) {
      deltaTimeSeconds = 0.0;
    }

    let beginIndex = 0;

    for (let i = 0; i < this._partGroupCounts.getSize(); i++) {
      const partGroupCount: number = this._partGroupCounts.at(i);

      this.doFade(model, deltaTimeSeconds, beginIndex, partGroupCount);

      beginIndex += partGroupCount;
    }

    this.copyPartOpacities(model);
  }

  /**
   * Initialize the display
   * @param model Target model
   * @note For parameters where the initial value of opacity is not 0, set opacity to 1.
   */
  public reset(model: CubismModel): void {
    let beginIndex = 0;

    for (let i = 0; i < this._partGroupCounts.getSize(); ++i) {
      const groupCount: number = this._partGroupCounts.at(i);

      for (let j: number = beginIndex; j < beginIndex + groupCount; ++j) {
        this._partGroups.at(j).initialize(model);

        const partsIndex: number = this._partGroups.at(j).partIndex;
        const paramIndex: number = this._partGroups.at(j).parameterIndex;

        if (partsIndex < 0) {
          continue;
        }

        model.setPartOpacityByIndex(partsIndex, j == beginIndex ? 1.0 : 0.0);
        model.setParameterValueByIndex(paramIndex, j == beginIndex ? 1.0 : 0.0);

        for (let k = 0; k < this._partGroups.at(j).link.getSize(); ++k) {
          this._partGroups
            .at(j)
            .link.at(k)
            .initialize(model);
        }
      }

      beginIndex += groupCount;
    }
  }

  /**
   * Copy the opacity of the part
   *
   * @param model Target model
   */
  public copyPartOpacities(model: CubismModel): void {
    for (
      let groupIndex = 0;
      groupIndex < this._partGroups.getSize();
      ++groupIndex
    ) {
      const partData: PartData = this._partGroups.at(groupIndex);

      if (partData.link.getSize() == 0) {
        continue; // No parameters to work with
      }

      const partIndex: number = this._partGroups.at(groupIndex).partIndex;
      const opacity: number = model.getPartOpacityByIndex(partIndex);

      for (
        let linkIndex = 0;
        linkIndex < partData.link.getSize();
        ++linkIndex
      ) {
        const linkPart: PartData = partData.link.at(linkIndex);
        const linkPartIndex: number = linkPart.partIndex;

        if (linkPartIndex < 0) {
          continue;
        }

        model.setPartOpacityByIndex(linkPartIndex, opacity);
      }
    }
  }

  /**
   * Fade parts.
   * @param model Target model
   * @param deltaTimeSeconds Delta time [seconds]
   * @param beginIndex The first index of the part group that performs the fade operation
   * @param partGroupCount Number of parts groups to perform fade operations
   */
  public doFade(
    model: CubismModel,
    deltaTimeSeconds: number,
    beginIndex: number,
    partGroupCount: number
  ): void {
    let visiblePartIndex = -1;
    let newOpacity = 1.0;

    const phi = 0.5;
    const backOpacityThreshold = 0.15;

    // Get the currently displayed parts
    for (let i: number = beginIndex; i < beginIndex + partGroupCount; ++i) {
      const partIndex: number = this._partGroups.at(i).partIndex;
      const paramIndex: number = this._partGroups.at(i).parameterIndex;

      if (model.getParameterValueByIndex(paramIndex) > Epsilon) {
        if (visiblePartIndex >= 0) {
          break;
        }

        visiblePartIndex = i;
        newOpacity = model.getPartOpacityByIndex(partIndex);

        // Calculate new opacity
        newOpacity += deltaTimeSeconds / this._fadeTimeSeconds;

        if (newOpacity > 1.0) {
          newOpacity = 1.0;
        }
      }
    }

    if (visiblePartIndex < 0) {
      visiblePartIndex = 0;
      newOpacity = 1.0;
    }

    // Set the opacity of visible and hidden parts
    for (let i: number = beginIndex; i < beginIndex + partGroupCount; ++i) {
      const partsIndex: number = this._partGroups.at(i).partIndex;

      // Display part settings
      if (visiblePartIndex == i) {
        model.setPartOpacityByIndex(partsIndex, newOpacity); // Set first
      }
      // Settings for hidden parts
      else {
        let opacity: number = model.getPartOpacityByIndex(partsIndex);
        let a1: number; // Opacity calculated by calculation

        if (newOpacity < phi) {
          a1 = (newOpacity * (phi - 1)) / phi + 1.0; // Straight line through (0,1), (phi, phi)
        } else {
          a1 = ((1 - newOpacity) * phi) / (1.0 - phi); // Straight line through(1, 0), (phi, phi)
        }

        // When limiting the visible ratio of the background
        const backOpacity: number = (1.0 - a1) * (1.0 - newOpacity);

        if (backOpacity > backOpacityThreshold) {
          a1 = 1.0 - backOpacityThreshold / (1.0 - newOpacity);
        }

        if (opacity > a1) {
          opacity = a1; // Increase the opacity if it is greater than (darker) the opacity of the calculation
        }

        model.setPartOpacityByIndex(partsIndex, opacity);
      }
    }
  }

  /**
   * Constructor
   */
  public constructor() {
    this._fadeTimeSeconds = DefaultFadeInSeconds;
    this._lastModel = null;
    this._partGroups = new csmVector<PartData>();
    this._partGroupCounts = new csmVector<number>();
  }

  _partGroups: csmVector<PartData>; // Partsgroups
  _partGroupCounts: csmVector<number>; // Number of each part group
  _fadeTimeSeconds: number; // Fade time [seconds]
  _lastModel: CubismModel; // Last operated model
}

/**
 * Manage data related to parts
 */
export class PartData {
  /**
   * Constructor
   */
  constructor(v?: PartData) {
    this.parameterIndex = 0;
    this.partIndex = 0;
    this.link = new csmVector<PartData>();

    if (v != undefined) {
      this.partId = v.partId;

      for (
        const ite: iterator<PartData> = v.link.begin();
        ite.notEqual(v.link.end());
        ite.preIncrement()
      ) {
        this.link.pushBack(ite.ptr().clone());
      }
    }
  }

  /**
   * = Operator overload
   */
  public assignment(v: PartData): PartData {
    this.partId = v.partId;

    for (
      const ite: iterator<PartData> = v.link.begin();
      ite.notEqual(v.link.end());
      ite.preIncrement()
    ) {
      this.link.pushBack(ite.ptr().clone());
    }

    return this;
  }

  /**
   * Initialization
   * @param model Model used for initialization
   */
  public initialize(model: CubismModel): void {
    this.parameterIndex = model.getParameterIndex(this.partId);
    this.partIndex = model.getPartIndex(this.partId);

    model.setParameterValueByIndex(this.parameterIndex, 1);
  }

  /**
   * Make a copy of the object
   */
  public clone(): PartData {
    const clonePartData: PartData = new PartData();

    clonePartData.partId = this.partId;
    clonePartData.parameterIndex = this.parameterIndex;
    clonePartData.partIndex = this.partIndex;
    clonePartData.link = new csmVector<PartData>();

    for (
      let ite: iterator<PartData> = this.link.begin();
      ite.notEqual(this.link.end());
      ite.increment()
    ) {
      clonePartData.link.pushBack(ite.ptr().clone());
    }

    return clonePartData;
  }

  partId: CubismIdHandle; // Part ID
  parameterIndex: number; // Parameter index
  partIndex: number; // index of parts
  link: csmVector<PartData>; // Linked parameters
}

// Namespace definition for compatibility.
import * as $ from './cubismpose';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismPose = $.CubismPose;
  export type CubismPose = $.CubismPose;
  export const PartData = $.PartData;
  export type PartData = $.PartData;
}