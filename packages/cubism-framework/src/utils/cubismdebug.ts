/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {
  CSM_LOG_LEVEL,
  CSM_LOG_LEVEL_DEBUG,
  CSM_LOG_LEVEL_ERROR,
  CSM_LOG_LEVEL_INFO,
  CSM_LOG_LEVEL_VERBOSE,
  CSM_LOG_LEVEL_WARNING
} from '../cubismframeworkconfig';
import { CubismFramework, LogLevel } from '../live2dcubismframework';

export const CubismLogPrint = (level: LogLevel, fmt: string, args: any[]) => {
  CubismDebug.print(level, '[CSM]' + fmt, args);
};

export const CubismLogPrintIn = (level: LogLevel, fmt: string, args: any[]) => {
  CubismLogPrint(level, fmt + '\n', args);
};

export const CSM_ASSERT = (expr: any) => {
  console.assert(expr);
};

export let CubismLogVerbose: (fmt: string, ...args: any[]) => void;
export let CubismLogDebug: (fmt: string, ...args: any[]) => void;
export let CubismLogInfo: (fmt: string, ...args: any[]) => void;
export let CubismLogWarning: (fmt: string, ...args: any[]) => void;
export let CubismLogError: (fmt: string, ...args: any[]) => void;

if (CSM_LOG_LEVEL <= CSM_LOG_LEVEL_VERBOSE) {
  CubismLogVerbose = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Verbose, '[V]' + fmt, args);
  };

  CubismLogDebug = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Debug, '[D]' + fmt, args);
  };

  CubismLogInfo = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Info, '[I]' + fmt, args);
  };

  CubismLogWarning = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Warning, '[W]' + fmt, args);
  };

  CubismLogError = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Error, '[E]' + fmt, args);
  };
} else if (CSM_LOG_LEVEL == CSM_LOG_LEVEL_DEBUG) {
  CubismLogDebug = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Debug, '[D]' + fmt, args);
  };

  CubismLogInfo = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Info, '[I]' + fmt, args);
  };

  CubismLogWarning = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Warning, '[W]' + fmt, args);
  };

  CubismLogError = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Error, '[E]' + fmt, args);
  };
} else if (CSM_LOG_LEVEL == CSM_LOG_LEVEL_INFO) {
  CubismLogInfo = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Info, '[I]' + fmt, args);
  };

  CubismLogWarning = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Warning, '[W]' + fmt, args);
  };

  CubismLogError = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Error, '[E]' + fmt, args);
  };
} else if (CSM_LOG_LEVEL == CSM_LOG_LEVEL_WARNING) {
  CubismLogWarning = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Warning, '[W]' + fmt, args);
  };

  CubismLogError = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Error, '[E]' + fmt, args);
  };
} else if (CSM_LOG_LEVEL == CSM_LOG_LEVEL_ERROR) {
  CubismLogError = (fmt: string, ...args: any[]) => {
    CubismLogPrintIn(LogLevel.LogLevel_Error, '[E]' + fmt, args);
  };
}

/**
 * Utility class for debugging.
 * Log output, byte dump, etc.
 */
export class CubismDebug {
  /**
   * Output the log. Set the log level in the first argument.
   * If the log output level is lower than the option set at the time of CubismFramework.initialize (), it will not be logged.
   *
   * @param logLevel Setting the log level
   * @param format Formatted string
   * @param args Variadic arguments
   */
  public static print(logLevel: LogLevel, format: string, args?: any[]): void {
    // Do not log if it is below the log output level set in the option
    if (logLevel < CubismFramework.getLoggingLevel()) {
      return;
    }

    const logPrint: Live2DCubismCore.csmLogFunction =
      CubismFramework.coreLogFunction;

    if (!logPrint) return;

    const buffer: string = format.replace(/\{(\d+)\}/g, (m, k) => {
      return args[k];
    });
    logPrint(buffer);
  }

  /**
   * Dump output only the specified length from the data.
   * If the log output level is lower than the option set at the time of CubismFramework.initialize (), it will not be logged.
   *
   * @param logLevel Setting the log level
   * @param data Dump data
   * @param length The length to dump
   */
  public static dumpBytes(
    logLevel: LogLevel,
    data: Uint8Array,
    length: number
  ): void {
    for (let i = 0; i < length; i++) {
      if (i % 16 == 0 && i > 0) this.print(logLevel, '\n');
      else if (i % 8 == 0 && i > 0) this.print(logLevel, '  ');
      this.print(logLevel, '{0} ', [data[i] & 0xff]);
    }

    this.print(logLevel, '\n');
  }

  /**
   * private constructor
   */
  private constructor() { }
}

// Namespace definition for compatibility.
import * as $ from './cubismdebug';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismDebug = $.CubismDebug;
  export type CubismDebug = $.CubismDebug;
}