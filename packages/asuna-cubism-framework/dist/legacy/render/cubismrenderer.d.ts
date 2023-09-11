/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismMatrix44 } from '../math/cubismmatrix44';
import { CubismModel } from '../model/cubismmodel';
/**
 * Renderer to handle model drawing
 *
 * Write environment-dependent drawing instructions in the subclass.
 */
export declare abstract class CubismRenderer {
    /**
     * Execute the renderer initialization process
     * Information required for renderer initialization can be extracted from the model passed as an argument.
     * @param model Model instance
     */
    initialize(model: CubismModel): void;
    /**
     * Draw a model
     */
    drawModel(): void;
    /**
     * Set the Model-View-Projection matrix
     * The array is duplicated, so the original array may be discarded outside
     * @param matrix44 Model-View-Projection 行列
     */
    setMvpMatrix(matrix44: CubismMatrix44): void;
    /**
     * Get the Model-View-Projection matrix
     * @return Model-View-Projection 行列
     */
    getMvpMatrix(): CubismMatrix44;
    /**
     * Set the color of the model
     * Specify between 0.0 and 1.0 for each color (1.0 is the standard state)
     * @param red Red channel value
     * @param green Green channel value
     * @param blue Blue channel value
     * @param alpha α channel value
     */
    setModelColor(red: number, green: number, blue: number, alpha: number): void;
    /**
     * Get the color of the model
     * Specify between 0.0 and 1.0 for each color (1.0 is the standard state)
     *
     * @return RGBA color information
     */
    getModelColor(): CubismTextureColor;
    /**
     * Set valid / invalid of multiplied α
     * Set true to enable, false to disable
     */
    setIsPremultipliedAlpha(enable: boolean): void;
    /**
     * Get valid / invalid of multiplied α
     * @return true Multiplied α is valid
     * @return false Multiplied α invalid
     */
    isPremultipliedAlpha(): boolean;
    /**
     * Set whether culling (single-sided drawing) is enabled or disabled.
     * Set true to enable, false to disable
     */
    setIsCulling(culling: boolean): void;
    /**
     * Get valid / invalid for culling (single-sided drawing).
     * @return true Culling enabled
     * @return false Culling disabled
     */
    isCulling(): boolean;
    /**
     * Set texture anisotropic filtering parameters
     * The degree of influence of the parameter value depends on the implementation of the renderer.
     * @param n Parameter value
     */
    setAnisotropy(n: number): void;
    /**
     * Set texture anisotropic filtering parameters
     * @return Anisotropic filtering parameters
     */
    getAnisotropy(): number;
    /**
     * Get the model to render
     * @return Model to render
     */
    getModel(): CubismModel;
    /**
     * Constructor
     */
    protected constructor();
    /**
     * Implementation of model drawing
     */
    abstract doDrawModel(): void;
    /**
     * Draw a drawing object (art mesh)
     * Pass the polygon mesh and texture number as a set.
     * @param textureNo Texture number to draw
     * @param indexCount Index value of the drawing object
     * @param vertexCount Number of vertices on the polygon mesh
     * @param indexArray Index array of polygon mesh vertices
     * @param vertexArray Polygon mesh vertex array
     * @param uvArray uv配列
     * @param opacity opacity
     * @param colorBlendMode Color blending type
     * @param invertedMask Using mask inversion when using mask
     */
    abstract drawMesh(textureNo: number, indexCount: number, vertexCount: number, indexArray: Uint16Array, vertexArray: Float32Array, uvArray: Float32Array, opacity: number, colorBlendMode: CubismBlendMode, invertedMask: boolean): void;
    /**
     * Release static resources held by the renderer
     */
    static staticRelease: Function;
    protected _mvpMatrix4x4: CubismMatrix44;
    protected _modelColor: CubismTextureColor;
    protected _isCulling: boolean;
    protected _isPremultipliedAlpha: boolean;
    protected _anisortopy: any;
    protected _model: CubismModel;
}
export declare enum CubismBlendMode {
    CubismBlendMode_Normal = 0,
    CubismBlendMode_Additive = 1,
    CubismBlendMode_Multiplicative = 2
}
/**
 * Class for handling texture colors in RGBA
 */
export declare class CubismTextureColor {
    /**
     * Constructor
     */
    constructor();
    R: number;
    G: number;
    B: number;
    A: number;
}
import * as $ from './cubismrenderer';
export declare namespace Live2DCubismFramework {
    const CubismBlendMode: typeof $.CubismBlendMode;
    type CubismBlendMode = $.CubismBlendMode;
    const CubismRenderer: typeof $.CubismRenderer;
    type CubismRenderer = $.CubismRenderer;
    const CubismTextureColor: typeof $.CubismTextureColor;
    type CubismTextureColor = $.CubismTextureColor;
}
//# sourceMappingURL=cubismrenderer.d.ts.map