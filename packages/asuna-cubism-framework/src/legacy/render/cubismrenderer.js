"use strict";
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
exports.__esModule = true;
exports.Live2DCubismFramework = exports.CubismTextureColor = exports.CubismBlendMode = exports.CubismRenderer = void 0;
var cubismmatrix44_1 = require("../math/cubismmatrix44");
/**
 * Renderer to handle model drawing
 *
 * Write environment-dependent drawing instructions in the subclass.
 */
var CubismRenderer = /** @class */ (function () {
    /**
     * Constructor
     */
    function CubismRenderer() {
        this._isCulling = false;
        this._isPremultipliedAlpha = false;
        this._anisortopy = 0.0;
        this._model = null;
        this._modelColor = new CubismTextureColor();
        // Initialize to identity matrix
        this._mvpMatrix4x4 = new cubismmatrix44_1.CubismMatrix44();
        this._mvpMatrix4x4.loadIdentity();
    }
    /**
     * Execute the renderer initialization process
     * Information required for renderer initialization can be extracted from the model passed as an argument.
     * @param model Model instance
     */
    CubismRenderer.prototype.initialize = function (model) {
        this._model = model;
    };
    /**
     * Draw a model
     */
    CubismRenderer.prototype.drawModel = function () {
        if (this.getModel() == null)
            return;
        this.doDrawModel();
    };
    /**
     * Set the Model-View-Projection matrix
     * The array is duplicated, so the original array may be discarded outside
     * @param matrix44 Model-View-Projection 行列
     */
    CubismRenderer.prototype.setMvpMatrix = function (matrix44) {
        this._mvpMatrix4x4.setMatrix(matrix44.getArray());
    };
    /**
     * Get the Model-View-Projection matrix
     * @return Model-View-Projection 行列
     */
    CubismRenderer.prototype.getMvpMatrix = function () {
        return this._mvpMatrix4x4;
    };
    /**
     * Set the color of the model
     * Specify between 0.0 and 1.0 for each color (1.0 is the standard state)
     * @param red Red channel value
     * @param green Green channel value
     * @param blue Blue channel value
     * @param alpha α channel value
     */
    CubismRenderer.prototype.setModelColor = function (red, green, blue, alpha) {
        if (red < 0.0) {
            red = 0.0;
        }
        else if (red > 1.0) {
            red = 1.0;
        }
        if (green < 0.0) {
            green = 0.0;
        }
        else if (green > 1.0) {
            green = 1.0;
        }
        if (blue < 0.0) {
            blue = 0.0;
        }
        else if (blue > 1.0) {
            blue = 1.0;
        }
        if (alpha < 0.0) {
            alpha = 0.0;
        }
        else if (alpha > 1.0) {
            alpha = 1.0;
        }
        this._modelColor.R = red;
        this._modelColor.G = green;
        this._modelColor.B = blue;
        this._modelColor.A = alpha;
    };
    /**
     * Get the color of the model
     * Specify between 0.0 and 1.0 for each color (1.0 is the standard state)
     *
     * @return RGBA color information
     */
    CubismRenderer.prototype.getModelColor = function () {
        return JSON.parse(JSON.stringify(this._modelColor));
    };
    /**
     * Set valid / invalid of multiplied α
     * Set true to enable, false to disable
     */
    CubismRenderer.prototype.setIsPremultipliedAlpha = function (enable) {
        this._isPremultipliedAlpha = enable;
    };
    /**
     * Get valid / invalid of multiplied α
     * @return true Multiplied α is valid
     * @return false Multiplied α invalid
     */
    CubismRenderer.prototype.isPremultipliedAlpha = function () {
        return this._isPremultipliedAlpha;
    };
    /**
     * Set whether culling (single-sided drawing) is enabled or disabled.
     * Set true to enable, false to disable
     */
    CubismRenderer.prototype.setIsCulling = function (culling) {
        this._isCulling = culling;
    };
    /**
     * Get valid / invalid for culling (single-sided drawing).
     * @return true Culling enabled
     * @return false Culling disabled
     */
    CubismRenderer.prototype.isCulling = function () {
        return this._isCulling;
    };
    /**
     * Set texture anisotropic filtering parameters
     * The degree of influence of the parameter value depends on the implementation of the renderer.
     * @param n Parameter value
     */
    CubismRenderer.prototype.setAnisotropy = function (n) {
        this._anisortopy = n;
    };
    /**
     * Set texture anisotropic filtering parameters
     * @return Anisotropic filtering parameters
     */
    CubismRenderer.prototype.getAnisotropy = function () {
        return this._anisortopy;
    };
    /**
     * Get the model to render
     * @return Model to render
     */
    CubismRenderer.prototype.getModel = function () {
        return this._model;
    };
    return CubismRenderer;
}());
exports.CubismRenderer = CubismRenderer;
var CubismBlendMode;
(function (CubismBlendMode) {
    CubismBlendMode[CubismBlendMode["CubismBlendMode_Normal"] = 0] = "CubismBlendMode_Normal";
    CubismBlendMode[CubismBlendMode["CubismBlendMode_Additive"] = 1] = "CubismBlendMode_Additive";
    CubismBlendMode[CubismBlendMode["CubismBlendMode_Multiplicative"] = 2] = "CubismBlendMode_Multiplicative"; // Multiplication
})(CubismBlendMode = exports.CubismBlendMode || (exports.CubismBlendMode = {}));
/**
 * Class for handling texture colors in RGBA
 */
var CubismTextureColor = /** @class */ (function () {
    /**
     * Constructor
     */
    function CubismTextureColor() {
        this.R = 1.0;
        this.G = 1.0;
        this.B = 1.0;
        this.A = 1.0;
    }
    return CubismTextureColor;
}());
exports.CubismTextureColor = CubismTextureColor;
// Namespace definition for compatibility.
var $ = require("./cubismrenderer");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismBlendMode = $.CubismBlendMode;
    Live2DCubismFramework.CubismRenderer = $.CubismRenderer;
    Live2DCubismFramework.CubismTextureColor = $.CubismTextureColor;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));
