/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

//========================================================
// Log output function settings
//========================================================

// ---------- Log output level Selection item definition ----------
// Detailed log output settings
export const CSM_LOG_LEVEL_VERBOSE = 0;
// Debug log output settings
export const CSM_LOG_LEVEL_DEBUG = 1;
// Info log output settings
export const CSM_LOG_LEVEL_INFO = 2;
// Warning log output settings
export const CSM_LOG_LEVEL_WARNING = 3;
// Error log output settings
export const CSM_LOG_LEVEL_ERROR = 4;
// Log output off setting
export const CSM_LOG_LEVEL_OFF = 5;

/**
 * Log output level setting.
 *
 * Enable the definition when forcibly changing the log output level.
 * Select CSM_LOG_LEVEL_VERBOSE to CSM_LOG_LEVEL_OFF.
 */
export const CSM_LOG_LEVEL: number = CSM_LOG_LEVEL_VERBOSE;