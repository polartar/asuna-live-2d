/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismIdManager } from './id/cubismidmanager';
import { CubismRenderer } from './rendering/cubismrenderer';
import {
  CSM_ASSERT,
  CubismLogInfo,
  CubismLogWarning
} from './utils/cubismdebug';
import { Value } from './utils/cubismjson';

export function strtod(s: string, endPtr: string[]): number {
  let index = 0;
  for (let i = 1; ; i++) {
    const testC: string = s.slice(i - 1, i);

    // Skip because there is a possibility of exponent / minus
    if (testC == 'e' || testC == '-' || testC == 'E') {
      continue;
    } // Expand the range of strings

    const test: string = s.substring(0, i);
    const number = Number(test);
    if (isNaN(number)) {
      // Finished because it can no longer be recognized as a numerical value
      break;
    } // Store the index created as a numerical value at the end

    index = i;
  }
  let d = parseFloat(s); // parsed number

  if (isNaN(d)) {
    // Finished because it can no longer be recognized as a numerical value
    d = NaN;
  }

  endPtr[0] = s.slice(index); // Subsequent string
  return d;
}

// Initialize file scope variables

let s_isStarted = false;
let s_isInitialized = false;
let s_option: Option = null;
let s_cubismIdManager: CubismIdManager = null;

/**
 * Declaration of constants used in Framework
 */
export const Constant = Object.freeze<Record<string, number>>({
  vertexOffset: 0, // Offset value of the mesh vertex
  vertexStep: 2 // Step value of the mesh vertex
});

export function csmDelete<T>(address: T): void {
  if (!address) {
    return;
  }

  address = void 0;
}

/**
 * Live2D Cubism SDK Original Workflow SDK entry point
 * At the beginning of use, call CubismFramework.initialize () and end with CubismFramework.dispose ().
 */
export class CubismFramework {
  /**
   * Enable the Cubism Framework API.
   * Be sure to execute this function before executing the API.
   * Once the preparation is completed, the internal processing will be skipped even if it is executed again.
   *
   * @param option An instance of the Option class
   *
   * @return true is returned when the preparation process is completed.
   */
  public static startUp(option: Option = null): boolean {
    if (s_isStarted) {
      CubismLogInfo('CubismFramework.startUp() is already done.');
      return s_isStarted;
    }

    s_option = option;

    if (s_option != null) {
      Live2DCubismCore.Logging.csmSetLogFunction(s_option.logFunction);
    }

    s_isStarted = true;

    // Display Live2D Cubism Core version information
    if (s_isStarted) {
      const version: number = Live2DCubismCore.Version.csmGetVersion();
      const major: number = (version & 0xff000000) >> 24;
      const minor: number = (version & 0x00ff0000) >> 16;
      const patch: number = version & 0x0000ffff;
      const versionNumber: number = version;

      CubismLogInfo(
        `Live2D Cubism Core version: {0}.{1}.{2} ({3})`,
        ('00' + major).slice(-2),
        ('00' + minor).slice(-2),
        ('0000' + patch).slice(-4),
        versionNumber
      );
    }

    CubismLogInfo('CubismFramework.startUp() is complete.');

    return s_isStarted;
  }

  /**
   * Clear each parameter of Cubism Framework initialized by StartUp ().
   * Please use it when reusing the Cubism Framework that has been dispose ().
   */
  public static cleanUp(): void {
    s_isStarted = false;
    s_isInitialized = false;
    s_option = null;
    s_cubismIdManager = null;
  }

  /**
   * Initialize the resources in the Cubism Framework to make the model visible. <br>
   * You need to execute Dispose () before you can Initialize () again.
   */
  public static initialize(): void {
    CSM_ASSERT(s_isStarted);
    if (!s_isStarted) {
      CubismLogWarning('CubismFramework is not started.');
      return;
    }

    // --- Continuous initialization guard by s_isInitialized ---
    // Prevent continuous resource reservation.
    // You need to execute Dispose () first to Initialize () again.
    if (s_isInitialized) {
      CubismLogWarning(
        'CubismFramework.initialize() skipped, already initialized.'
      );
      return;
    }

    //---- static initialization----
    Value.staticInitializeNotForClientCall();

    s_cubismIdManager = new CubismIdManager();

    s_isInitialized = true;

    CubismLogInfo('CubismFramework.initialize() is complete.');
  }

  /**
   * Free all resources in the Cubism Framework.
   * However, resources allocated externally will not be released.
   * Must be properly destroyed externally.
   */
  public static dispose(): void {
    CSM_ASSERT(s_isStarted);
    if (!s_isStarted) {
      CubismLogWarning('CubismFramework is not started.');
      return;
    }

    // --- Uninitialized release guard by s_isInitialized ---
    // You need to execute initialize () first to dispose ().
    if (!s_isInitialized) {
      // false ... If resources are not secured
      CubismLogWarning('CubismFramework.dispose() skipped, not initialized.');
      return;
    }

    Value.staticReleaseNotForClientCall();

    s_cubismIdManager.release();
    s_cubismIdManager = null;

    // Release the renderer's static resources (shader program, etc.)
    CubismRenderer.staticRelease();

    s_isInitialized = false;

    CubismLogInfo('CubismFramework.dispose() is complete.');
  }

  /**
   * Are you ready to use the Cubism Framework API?
   * Returns true if you are ready to use the @return API.
   */
  public static isStarted(): boolean {
    return s_isStarted;
  }

  /**
   * Whether the Cubism Framework resource has already been initialized
   * @return Returns true if resource allocation is complete
   */
  public static isInitialized(): boolean {
    return s_isInitialized;
  }

  /**
   * Execute the log function bound to the Core API
   *
   * @praram message Log message
   */
  public static coreLogFunction(message: string): void {
    // Return if logging not possible.
    if (!Live2DCubismCore.Logging.csmGetLogFunction()) {
      return;
    }

    Live2DCubismCore.Logging.csmGetLogFunction()(message);
  }

  /**
   * Returns the value of the current log output level setting.
   *
   * @return Current log output level setting value
   */
  public static getLoggingLevel(): LogLevel {
    if (s_option != null) {
      return s_option.loggingLevel;
    }
    return LogLevel.LogLevel_Off;
  }

  /**
   * Get an instance of ID Manager
   * @return An instance of the CubismManager class
   */
  public static getIdManager(): CubismIdManager {
    return s_cubismIdManager;
  }

  /**
   * Use as a static class
   * Do not instantiate
   */
  private constructor() { }
}

export class Option {
  logFunction: Live2DCubismCore.csmLogFunction; // Function object for log output
  loggingLevel: LogLevel; // Setting the log output level
}

/**
 * Log output level
 */
export enum LogLevel {
  LogLevel_Verbose = 0, // Detailed log
  LogLevel_Debug, // Debug log
  LogLevel_Info, // Info log
  LogLevel_Warning, // Warning log
  LogLevel_Error, // Error log
  LogLevel_Off // Log output disabled
}

// Namespace definition for compatibility.
import * as $ from './live2dcubismframework';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const Constant = $.Constant;
  export const csmDelete = $.csmDelete;
  export const CubismFramework = $.CubismFramework;
  export type CubismFramework = $.CubismFramework;
}