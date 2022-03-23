/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { CubismFramework } from '../live2dcubismframework';
import { CubismVector2 } from '../math/cubismvector2';
import { CubismJson } from '../utils/cubismjson';

// JSON keys
const Position = 'Position';
const X = 'X';
const Y = 'Y';
const Angle = 'Angle';
const Type = 'Type';
const Id = 'Id';

// Meta
const Meta = 'Meta';
const EffectiveForces = 'EffectiveForces';
const TotalInputCount = 'TotalInputCount';
const TotalOutputCount = 'TotalOutputCount';
const PhysicsSettingCount = 'PhysicsSettingCount';
const Gravity = 'Gravity';
const Wind = 'Wind';
const VertexCount = 'VertexCount';

// PhysicsSettings
const PhysicsSettings = 'PhysicsSettings';
const Normalization = 'Normalization';
const Minimum = 'Minimum';
const Maximum = 'Maximum';
const Default = 'Default';
const Reflect = 'Reflect';
const Weight = 'Weight';

// Input
const Input = 'Input';
const Source = 'Source';

// Output
const Output = 'Output';
const Scale = 'Scale';
const VertexIndex = 'VertexIndex';
const Destination = 'Destination';

// Particle
const Vertices = 'Vertices';
const Mobility = 'Mobility';
const Delay = 'Delay';
const Radius = 'Radius';
const Acceleration = 'Acceleration';

/**
 * physics3.json container.
 */
export class CubismPhysicsJson {
  /**
   * Constructor
   * @param buffer The buffer in which physics3.json is loaded
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
   * Gravity acquisition
   * @return gravity
   */
  public getGravity(): CubismVector2 {
    const ret: CubismVector2 = new CubismVector2(0, 0);
    ret.x = this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(EffectiveForces)
      .getValueByString(Gravity)
      .getValueByString(X)
      .toFloat();
    ret.y = this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(EffectiveForces)
      .getValueByString(Gravity)
      .getValueByString(Y)
      .toFloat();
    return ret;
  }

  /**
   * Get the wind
   * @return wind
   */
  public getWind(): CubismVector2 {
    const ret: CubismVector2 = new CubismVector2(0, 0);
    ret.x = this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(EffectiveForces)
      .getValueByString(Wind)
      .getValueByString(X)
      .toFloat();
    ret.y = this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(EffectiveForces)
      .getValueByString(Wind)
      .getValueByString(Y)
      .toFloat();
    return ret;
  }

  /**
   * Obtaining the number of physical store management
   * @return Number of physical store management
   */
  public getSubRigCount(): number {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(PhysicsSettingCount)
      .toInt();
  }

  /**
   * Get total input
   * @return Total input
   */
  public getTotalInputCount(): number {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(TotalInputCount)
      .toInt();
  }

  /**
   * Get total output
   * @return Total output
   */
  public getTotalOutputCount(): number {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(TotalOutputCount)
      .toInt();
  }

  /**
   * Get the number of physical points
   * @return Number of physical points
   */
  public getVertexCount(): number {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(VertexCount)
      .toInt();
  }

  /**
   * Get the minimum value of the normalized position
   * @param physicsSettingIndex Index of physics settings
   * @return Minimum value of normalized position
   */
  public getNormalizationPositionMinimumValue(
    physicsSettingIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Normalization)
      .getValueByString(Position)
      .getValueByString(Minimum)
      .toFloat();
  }

  /**
   * Get the maximum value of the normalized position
   * @param physicsSettingIndex Index of physics settings
   * @return Maximum value of normalized position
   */
  public getNormalizationPositionMaximumValue(
    physicsSettingIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Normalization)
      .getValueByString(Position)
      .getValueByString(Maximum)
      .toFloat();
  }

  /**
   * Get the default value for the normalized position
   * @param physicsSettingIndex Index of physics settings
   * @return Default value for normalized position
   */
  public getNormalizationPositionDefaultValue(
    physicsSettingIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Normalization)
      .getValueByString(Position)
      .getValueByString(Default)
      .toFloat();
  }

  /**
   * Get the minimum normalized angle
   * @param physicsSettingIndex Index of physics settings
   * @return Minimum normalized angle
   */
  public getNormalizationAngleMinimumValue(
    physicsSettingIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Normalization)
      .getValueByString(Angle)
      .getValueByString(Minimum)
      .toFloat();
  }

  /**
   * Get the maximum value of the normalized angle
   * @param physicsSettingIndex
   * @return Maximum normalized angle
   */
  public getNormalizationAngleMaximumValue(
    physicsSettingIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Normalization)
      .getValueByString(Angle)
      .getValueByString(Maximum)
      .toFloat();
  }

  /**
   * Get the default value for the normalized angle
   * @param physicsSettingIndex Index of physics settings
   * @return Default value for normalized angles
   */
  public getNormalizationAngleDefaultValue(
    physicsSettingIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Normalization)
      .getValueByString(Angle)
      .getValueByString(Default)
      .toFloat();
  }

  /**
   * Get the number of inputs
   * @param physicsSettingIndex Index of physics settings
   * @return Number of inputs
   */
  public getInputCount(physicsSettingIndex: number): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Input)
      .getVector()
      .getSize();
  }

  /**
   * Get input weights
   * @param physicsSettingIndex Index of physics settings
   * @param inputIndex Input index
   * @return Input weight
   */
  public getInputWeight(
    physicsSettingIndex: number,
    inputIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Input)
      .getValueByIndex(inputIndex)
      .getValueByString(Weight)
      .toFloat();
  }

  /**
   * Get input inversion
   * @param physicsSettingIndex Index of physics settings
   * @param inputIndex Input index
   * @return Input inversion
   */
  public getInputReflect(
    physicsSettingIndex: number,
    inputIndex: number
  ): boolean {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Input)
      .getValueByIndex(inputIndex)
      .getValueByString(Reflect)
      .toBoolean();
  }

  /**
   * Get input type
   * @param physicsSettingIndex Index of physics settings
   * @param inputIndex Input index
   * @return Input type
   */
  public getInputType(physicsSettingIndex: number, inputIndex: number): string {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Input)
      .getValueByIndex(inputIndex)
      .getValueByString(Type)
      .getRawString();
  }

  /**
   * Get the ID of the input source
   * @param physicsSettingIndex Index of physics settings
   * @param inputIndex Input index
   * @return Input source ID
   */
  public getInputSourceId(
    physicsSettingIndex: number,
    inputIndex: number
  ): CubismIdHandle {
    return CubismFramework.getIdManager().getId(
      this._json
        .getRoot()
        .getValueByString(PhysicsSettings)
        .getValueByIndex(physicsSettingIndex)
        .getValueByString(Input)
        .getValueByIndex(inputIndex)
        .getValueByString(Source)
        .getValueByString(Id)
        .getRawString()
    );
  }

  /**
   * Get the number of outputs
   * @param physicsSettingIndex Index of physics settings
   * @return Number of outputs
   */
  public getOutputCount(physicsSettingIndex: number): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Output)
      .getVector()
      .getSize();
  }

  /**
   * Get index of physical points of output
   * @param physicsSettingIndex Index of physics settings
   * @param outputIndex Output index
   * @return Index of physical points in output
   */
  public getOutputVertexIndex(
    physicsSettingIndex: number,
    outputIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Output)
      .getValueByIndex(outputIndex)
      .getValueByString(VertexIndex)
      .toInt();
  }

  /**
   * Get the scale of the output angle
   * @param physicsSettingIndex Index of physics settings
   * @param outputIndex Output index
   * @return Output angle scale
   */
  public getOutputAngleScale(
    physicsSettingIndex: number,
    outputIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Output)
      .getValueByIndex(outputIndex)
      .getValueByString(Scale)
      .toFloat();
  }

  /**
   * Get output weights
   * @param physicsSettingIndex Index of physics settings
   * @param outputIndex Output index
   * @return Output weight
   */
  public getOutputWeight(
    physicsSettingIndex: number,
    outputIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Output)
      .getValueByIndex(outputIndex)
      .getValueByString(Weight)
      .toFloat();
  }

  /**
   * Get the output destination ID
   * @param physicsSettingIndex Index of physics settings
   * @param outputIndex Output index
   * @return Output destination ID
   */
  public getOutputDestinationId(
    physicsSettingIndex: number,
    outputIndex: number
  ): CubismIdHandle {
    return CubismFramework.getIdManager().getId(
      this._json
        .getRoot()
        .getValueByString(PhysicsSettings)
        .getValueByIndex(physicsSettingIndex)
        .getValueByString(Output)
        .getValueByIndex(outputIndex)
        .getValueByString(Destination)
        .getValueByString(Id)
        .getRawString()
    );
  }

  /**
   * Get output type
   * @param physicsSettingIndex Index of physics settings
   * @param outputIndex Output index
   * @return Output type
   */
  public getOutputType(
    physicsSettingIndex: number,
    outputIndex: number
  ): string {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Output)
      .getValueByIndex(outputIndex)
      .getValueByString(Type)
      .getRawString();
  }

  /**
   * Get output inversion
   * @param physicsSettingIndex Physics index
   * @param outputIndex Output index
   * @return Inversion of output
   */
  public getOutputReflect(
    physicsSettingIndex: number,
    outputIndex: number
  ): boolean {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Output)
      .getValueByIndex(outputIndex)
      .getValueByString(Reflect)
      .toBoolean();
  }

  /**
   * Get the number of physical points
   * @param physicsSettingIndex Index of physics man setting
   * @return Number of physical points
   */
  public getParticleCount(physicsSettingIndex: number): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Vertices)
      .getVector()
      .getSize();
  }

  /**
   * Acquisition of ease of movement of physical points
   * @param physicsSettingIndex Index of physics settings
   * @param vertexIndex Physical point index
   * @return Ease of movement of physical points
   */
  public getParticleMobility(
    physicsSettingIndex: number,
    vertexIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Vertices)
      .getValueByIndex(vertexIndex)
      .getValueByString(Mobility)
      .toFloat();
  }

  /**
   * Get the delay of the physical point
   * @param physicsSettingIndex Index of physics settings
   * @param vertexIndex Physical point index
   * @return Physical point delay
   */
  public getParticleDelay(
    physicsSettingIndex: number,
    vertexIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Vertices)
      .getValueByIndex(vertexIndex)
      .getValueByString(Delay)
      .toFloat();
  }

  /**
   * Get the acceleration of the physical point
   * @param physicsSettingIndex Physics settings
   * @param vertexIndex Physical point index
   * @return Acceleration of physical points
   */
  public getParticleAcceleration(
    physicsSettingIndex: number,
    vertexIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Vertices)
      .getValueByIndex(vertexIndex)
      .getValueByString(Acceleration)
      .toFloat();
  }

  /**
   * Obtaining the distance of physical points
   * @param physicsSettingIndex Index of physics settings
   * @param vertexIndex Physical point index
   * @return Physical point distance
   */
  public getParticleRadius(
    physicsSettingIndex: number,
    vertexIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Vertices)
      .getValueByIndex(vertexIndex)
      .getValueByString(Radius)
      .toFloat();
  }

  /**
   * Get the position of the physical point
   * @param physicsSettingIndex Index of physics settings
   * @param vertexInde Physical point index
   * @return Position of physical point
   */
  public getParticlePosition(
    physicsSettingIndex: number,
    vertexIndex: number
  ): CubismVector2 {
    const ret: CubismVector2 = new CubismVector2(0, 0);
    ret.x = this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Vertices)
      .getValueByIndex(vertexIndex)
      .getValueByString(Position)
      .getValueByString(X)
      .toFloat();
    ret.y = this._json
      .getRoot()
      .getValueByString(PhysicsSettings)
      .getValueByIndex(physicsSettingIndex)
      .getValueByString(Vertices)
      .getValueByIndex(vertexIndex)
      .getValueByString(Position)
      .getValueByString(Y)
      .toFloat();
    return ret;
  }

  _json: CubismJson; // physics3.jsonデータ
}

// Namespace definition for compatibility.
import * as $ from './cubismphysicsjson';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismPhysicsJson = $.CubismPhysicsJson;
  export type CubismPhysicsJson = $.CubismPhysicsJson;
}