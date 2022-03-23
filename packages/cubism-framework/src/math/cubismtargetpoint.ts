/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismMath } from './cubismmath';

const FrameRate = 30;
const Epsilon = 0.01;

/**
 * Face orientation control function
 *
 * A class that provides face orientation control.
 */
export class CubismTargetPoint {
  /**
   * Constructor
   */
  public constructor() {
    this._faceTargetX = 0.0;
    this._faceTargetY = 0.0;
    this._faceX = 0.0;
    this._faceY = 0.0;
    this._faceVX = 0.0;
    this._faceVY = 0.0;
    this._lastTimeSeconds = 0.0;
    this._userTimeSeconds = 0.0;
  }

  /**
   * Update process
   */
  public update(deltaTimeSeconds: number): void {
    // Add delta time
    this._userTimeSeconds += deltaTimeSeconds;

    // The average speed when shaking the head from the center to the left and right is the second speed. Considering acceleration and deceleration, double that speed is the maximum speed.
    // Set the face swing from the center (0.0) to the left and right (+ -1.0).
    const faceParamMaxV: number = 40.0 / 10.0; // Move 40 minutes in 7.5 seconds (5.3 / sc)
    const maxV: number = (faceParamMaxV * 1.0) / FrameRate; // Upper limit of speed that can be changed per frame

    if (this._lastTimeSeconds == 0.0) {
      this._lastTimeSeconds = this._userTimeSeconds;
      return;
    }

    const deltaTimeWeight: number =
      (this._userTimeSeconds - this._lastTimeSeconds) * FrameRate;
    this._lastTimeSeconds = this._userTimeSeconds;

    // Time to reach maximum speed
    const timeToMaxSpeed = 0.15;
    const frameToMaxSpeed: number = timeToMaxSpeed * FrameRate; // sec * frame/sec
    const maxA: number = (deltaTimeWeight * maxV) / frameToMaxSpeed; // Acceleration per frame

    // The target direction is a vector in the (dx, dy) direction.
    const dx: number = this._faceTargetX - this._faceX;
    const dy: number = this._faceTargetY - this._faceY;

    if (CubismMath.abs(dx) <= Epsilon && CubismMath.abs(dy) <= Epsilon) {
      return; // No change
    }

    // If it is greater than the maximum speed, slow it down
    const d: number = CubismMath.sqrt(dx * dx + dy * dy);

    // Maximum velocity vector in the direction of travel
    const vx: number = (maxV * dx) / d;
    const vy: number = (maxV * dy) / d;

    // Find the change (acceleration) from the current speed to the new speed
    let ax: number = vx - this._faceVX;
    let ay: number = vy - this._faceVY;

    const a: number = CubismMath.sqrt(ax * ax + ay * ay);

    // When accelerating
    if (a < -maxA || a > maxA) {
      ax *= maxA / a;
      ay *= maxA / a;
    }

    // Add the acceleration to the original speed to get the new speed
    this._faceVX += ax;
    this._faceVY += ay;

    // Processing to decelerate smoothly when approaching the desired direction
    // From the relationship between the distance and speed that can be stopped at the set acceleration
    // Calculate the maximum speed that can be taken now, and slow down if it is higher than that
    // * Originally, humans can adjust the force (acceleration) with muscle strength, so it has a higher degree of freedom, but it is a simple process.
    {
      // Relational expression of acceleration, velocity and distance.
      //            2  6           2               3
      //      sqrt(a  t  + 16 a h t  - 8 a h) - a t
      // v = --------------------------------------
      //                    2
      //                 4 t  - 2
      // (t=1)
      // At time t, the acceleration and velocity are set to 1/60 (frame rate, no unit) in advance.
      // I'm thinking, so you can erase it with t = 1 (* unverified)

      const maxV: number =
        0.5 *
        (CubismMath.sqrt(maxA * maxA + 16.0 * maxA * d - 8.0 * maxA * d) -
          maxA);
      const curV: number = CubismMath.sqrt(
        this._faceVX * this._faceVX + this._faceVY * this._faceVY
      );

      if (curV > maxV) {
        // Current speed> Decelerate to maximum speed at maximum speed
        this._faceVX *= maxV / curV;
        this._faceVY *= maxV / curV;
      }
    }

    this._faceX += this._faceVX;
    this._faceY += this._faceVY;
  }

  /**
   * Get the X-axis face orientation value
   *
   * @return X-axis face orientation value (-1.0 ~ 1.0)
   */
  public getX(): number {
    return this._faceX;
  }

  /**
   * Get the value of Y-axis face orientation
   *
   * @return Y-axis face orientation value (-1.0 ~ 1.0)
   */
  public getY(): number {
    return this._faceY;
  }

  /**
   * Set a target value for face orientation
   *
   * @param x X-axis face orientation value (-1.0 ~ 1.0)
   * @param y Y-axis face orientation value (-1.0 ~ 1.0)
   */
  public set(x: number, y: number): void {
    this._faceTargetX = x;
    this._faceTargetY = y;
  }

  private _faceTargetX: number; // X target value for face orientation (approaching this value)
  private _faceTargetY: number; // Y target value for face orientation (approaching this value)
  private _faceX: number; // Face orientation X (-1.0 ~ 1.0)
  private _faceY: number; // Face orientation Y (-1.0 ~ 1.0)
  private _faceVX: number; // Change rate of face orientation X
  private _faceVY: number; // Change rate of face orientation Y
  private _lastTimeSeconds: number; // Last run time [seconds]
  private _userTimeSeconds: number; // Cumulative delta time [seconds]
}

// Namespace definition for compatibility.
import * as $ from './cubismtargetpoint';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismTargetPoint = $.CubismTargetPoint;
  export type CubismTargetPoint = $.CubismTargetPoint;
}