/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * A class that defines a rectangular shape (coordinates and length are float values)
 */
export class csmRect {
    /**
     * Constructor
     * @param x left X coordinate
     * @param y upper Y coordinate
     * @param w width
     * @param h height
     */
    constructor(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 0;
        this.height = h || 0;
    }
    /**
     * Get the X coordinate of the center of the rectangle
     */
    getCenterX() {
        return this.x + 0.5 * this.width;
    }
    /**
     * Get the Y coordinate of the center of the rectangle
     */
    getCenterY() {
        return this.y + 0.5 * this.height;
    }
    /**
     * Get the right X coordinate
     */
    getRight() {
        return this.x + this.width;
    }
    /**
     * Get the Y coordinate of the bottom edge
     */
    getBottom() {
        return this.y + this.height;
    }
    /**
     * Set the value to the rectangle
     * @param r Rectangle instance
     */
    setRect(r) {
        this.x = r.x;
        this.y = r.y;
        this.width = r.width;
        this.height = r.height;
    }
    /**
     * Scales vertically and horizontally around the center of the rectangle
     * @param w Amount to scale in the width direction
     * @param h Amount of scaling in the height direction
     */
    expand(w, h) {
        this.x -= w;
        this.y -= h;
        this.width += w * 2.0;
        this.height += h * 2.0;
    }
}
// Namespace definition for compatibility.
import * as $ from './csmrectf';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmRect = $.csmRect;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=csmrectf.js.map