/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdHandle } from '../id/cubismid';
import { csmString } from '../type/csmstring';
import { csmVector } from '../type/csmvector';

/**
 * @brief Motion curve type
 *
 * Motion curve type.
 */
export enum CubismMotionCurveTarget {
  CubismMotionCurveTarget_Model, // For the model
  CubismMotionCurveTarget_Parameter, // For parameters
  CubismMotionCurveTarget_PartOpacity // For part opacity
}

/**
 * @brief Motion curve segment types
 *
 * Motion curve segment type.
 */
export enum CubismMotionSegmentType {
  CubismMotionSegmentType_Linear = 0, // Linear
  CubismMotionSegmentType_Bezier = 1, // Bezier curve
  CubismMotionSegmentType_Stepped = 2, // Step
  CubismMotionSegmentType_InverseStepped = 3 // Inverse Stepped
}

/**
 * @brief Motion curve control points
 *
 * Motion curve control point.
 */
export class CubismMotionPoint {
  time = 0.0; // time [seconds]
  value = 0.0; // 値
}

/**
 * Evaluation function of the segment of the motion curve
 *
 * @param points Motion curve control point list
 * @param time Time to evaluate [seconds]
 */
export interface csmMotionSegmentEvaluationFunction {
  (points: CubismMotionPoint[], time: number): number;
}

/**
 * @brief Motion curve segment
 *
 * Motion curve segment.
 */
export class CubismMotionSegment {
  /**
   * @brief constructor
   *
   * Constructor.
   */
  public constructor() {
    this.evaluate = null;
    this.basePointIndex = 0;
    this.segmentType = 0;
  }

  evaluate: csmMotionSegmentEvaluationFunction; // Evaluation function to use
  basePointIndex: number; // Index to first segment
  segmentType: number; // Segment type
}

/**
 * @brief Motion curve
 *
 * Motion curve.
 */
export class CubismMotionCurve {
  public constructor() {
    this.type = CubismMotionCurveTarget.CubismMotionCurveTarget_Model;
    this.segmentCount = 0;
    this.baseSegmentIndex = 0;
    this.fadeInTime = 0.0;
    this.fadeOutTime = 0.0;
  }

  type: CubismMotionCurveTarget; // Curve type
  id: CubismIdHandle; // Curve ID
  segmentCount: number; // Number of segments
  baseSegmentIndex: number; // Index of the first segment
  fadeInTime: number; // Time to fade in [seconds]
  fadeOutTime: number; // Time to fade out [seconds]
}

/**
 * event.
 */
export class CubismMotionEvent {
  fireTime = 0.0;
  value: csmString;
}

/**
 * @brief motion data
 *
 * Motion data.
 */
export class CubismMotionData {
  public constructor() {
    this.duration = 0.0;
    this.loop = false;
    this.curveCount = 0;
    this.eventCount = 0;
    this.fps = 0.0;

    this.curves = new csmVector<CubismMotionCurve>();
    this.segments = new csmVector<CubismMotionSegment>();
    this.points = new csmVector<CubismMotionPoint>();
    this.events = new csmVector<CubismMotionEvent>();
  }

  duration: number; // Motion length [seconds]
  loop: boolean; // Whether to loop
  curveCount: number; // Number of curves
  eventCount: number; // Number of UserData
  fps: number; // frame rate
  curves: csmVector<CubismMotionCurve>; // List of curves
  segments: csmVector<CubismMotionSegment>; // List of segments
  points: csmVector<CubismMotionPoint>; // List of points
  events: csmVector<CubismMotionEvent>; // List of events
}

// Namespace definition for compatibility.
import * as $ from './cubismmotioninternal';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismMotionCurve = $.CubismMotionCurve;
  export type CubismMotionCurve = $.CubismMotionCurve;
  export const CubismMotionCurveTarget = $.CubismMotionCurveTarget;
  export type CubismMotionCurveTarget = $.CubismMotionCurveTarget;
  export const CubismMotionData = $.CubismMotionData;
  export type CubismMotionData = $.CubismMotionData;
  export const CubismMotionEvent = $.CubismMotionEvent;
  export type CubismMotionEvent = $.CubismMotionEvent;
  export const CubismMotionPoint = $.CubismMotionPoint;
  export type CubismMotionPoint = $.CubismMotionPoint;
  export const CubismMotionSegment = $.CubismMotionSegment;
  export type CubismMotionSegment = $.CubismMotionSegment;
  export const CubismMotionSegmentType = $.CubismMotionSegmentType;
  export type CubismMotionSegmentType = $.CubismMotionSegmentType;
  export type csmMotionSegmentEvaluationFunction = $.csmMotionSegmentEvaluationFunction;
}