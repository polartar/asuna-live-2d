/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismMatrix44 } from '../math/cubismmatrix44';
import { CubismModel } from '../model/cubismmodel';
import { csmMap } from '../type/csmmap';
import { csmRect } from '../type/csmrectf';
import { csmVector } from '../type/csmvector';
import { CubismBlendMode, CubismRenderer, CubismTextureColor } from './cubismrenderer';
/**
 * Class that performs clipping mask processing
 */
export declare class CubismClippingManager_WebGL {
    /**
     * Get the color channel (RGBA) flag
     * @param channelNo Color channel (RGBA) number (0: R, 1: G, 2: B, 3: A)
     */
    getChannelFlagAsColor(channelNo: number): CubismTextureColor;
    /**
     * Get the address of the temporary render texture
     * If FrameBufferObject does not exist, create a new one
     *
     * @return Render texture address
     */
    getMaskRenderTexture(): WebGLFramebuffer;
    /**
     * Set the WebGL rendering context
     * @param gl WebGL rendering context
     */
    setGL(gl: WebGLRenderingContext): void;
    /**
     * Calculate the rectangle (model coordinate system) that surrounds the entire masked drawing object group.
     * @param model Model instance
     * @param clippingContext Clipping mask context
     */
    calcClippedDrawTotalBounds(model: CubismModel, clippingContext: CubismClippingContext): void;
    /**
     * Constructor
     */
    constructor();
    /**
     * Destructor-equivalent processing
     */
    release(): void;
    /**
     * Manager initialization process
     * Register a drawing object that uses a clipping mask
     * @param model Model instance
     * @param drawableCount Number of draw objects
     * @param drawableMasks List of indexes of drawing objects that mask drawing objects
     * @param drawableCounts Number of drawing objects to mask the drawing objects
     */
    initialize(model: CubismModel, drawableCount: number, drawableMasks: Int32Array[], drawableMaskCounts: Int32Array): void;
    /**
     * Create a clipping context. Executed when drawing the model.
     * @param model Model instance
     * @param renderer Instance of renderer
     */
    setupClippingContext(model: CubismModel, renderer: CubismRenderer_WebGL): void;
    /**
     * Make sure you have already made a mask
     * If you are making it, return an instance of the corresponding clipping mask
     * Returns NULL if not created
     * @param drawableMasks List of drawing objects that mask drawing objects
     * @param drawableMaskCounts Number of drawing objects to mask drawing objects
     * @return Returns an instance if the corresponding clipping mask exists, returns NULL otherwise
     */
    findSameClip(drawableMasks: Int32Array, drawableMaskCounts: number): CubismClippingContext;
    /**
     * Layout to place the clipping context
     * Lay out the mask using one render texture as much as possible
     * If the number of mask groups is 4 or less, place one mask for each RGBA channel, and if it is 5 or more and 6 or less, place RGBA as 2,2,1,1.
     *
     * @param usingClipCount Number of clipping contexts to place
     */
    setupLayoutBounds(usingClipCount: number): void;
    /**
     * Get the color buffer
     * @return color buffer
     */
    getColorBuffer(): WebGLTexture;
    /**
     * Get a list of clipping masks used for screen drawing
     * @return List of clipping masks used for screen drawing
     */
    getClippingContextListForDraw(): csmVector<CubismClippingContext>;
    /**
     * Set the size of the clipping mask buffer
     * @param size Clipping mask buffer size
     */
    setClippingMaskBufferSize(size: number): void;
    /**
     * Get the size of the clipping mask buffer
     * @return Clipping mask buffer size
     */
    getClippingMaskBufferSize(): number;
    _maskRenderTexture: WebGLFramebuffer;
    _colorBuffer: WebGLTexture;
    _currentFrameNo: number;
    _channelColors: csmVector<CubismTextureColor>;
    _maskTexture: CubismRenderTextureResource;
    _clippingContextListForMask: csmVector<CubismClippingContext>;
    _clippingContextListForDraw: csmVector<CubismClippingContext>;
    _clippingMaskBufferSize: number;
    private _tmpMatrix;
    private _tmpMatrixForMask;
    private _tmpMatrixForDraw;
    private _tmpBoundsOnModel;
    gl: WebGLRenderingContext;
}
/**
 * Structure that defines the resources of the render texture
 * Used with clipping mask
 */
export declare class CubismRenderTextureResource {
    /**
     * Constructor with arguments
     * @param frameNo Renderer frame number
     * @param texture Texture address
     */
    constructor(frameNo: number, texture: WebGLFramebuffer);
    frameNo: number;
    texture: WebGLFramebuffer;
}
/**
 * Clipping mask context
 */
export declare class CubismClippingContext {
    /**
     * Constructor with arguments
     */
    constructor(manager: CubismClippingManager_WebGL, clippingDrawableIndices: Int32Array, clipCount: number);
    /**
     * Destructor-equivalent processing
     */
    release(): void;
    /**
     * Add a drawing object to be clipped to this mask
     *
     * @param drawableIndex Index of drawing object to be added to clipping target
     */
    addClippedDrawable(drawableIndex: number): void;
    /**
     * Get an instance of the manager that manages this mask
     * @return Instance of Clipping Manager
     */
    getClippingManager(): CubismClippingManager_WebGL;
    setGl(gl: WebGLRenderingContext): void;
    _isUsing: boolean;
    readonly _clippingIdList: Int32Array;
    _clippingIdCount: number;
    _layoutChannelNo: number;
    _layoutBounds: csmRect;
    _allClippedDrawRect: csmRect;
    _matrixForMask: CubismMatrix44;
    _matrixForDraw: CubismMatrix44;
    _clippedDrawableIndexList: number[];
    private _owner;
}
/**
 * A class that creates and destroys shader programs for WebGL
 * It is a singleton class and is accessed from CubismShader_WebGL.getInstance.
 */
export declare class CubismShader_WebGL {
    /**
     * Get an instance (singleton)
     * @return instance
     */
    static getInstance(): CubismShader_WebGL;
    /**
     * Release the instance (singleton)
     */
    static deleteInstance(): void;
    /**
     * private constructor
     */
    private constructor();
    /**
     * Destructor-equivalent processing
     */
    release(): void;
    /**
     * Perform a series of shader program setups
     * @param renderer Instance of renderer
     * @param textureId GPU texture ID
     * @param vertexCount Number of vertices on the polygon mesh
     * @param vertexArray Polygon mesh vertex array
     * @param indexArray Vertex array of index buffer
     * @param uvArray uv配列
     * @param opacity opacity
     * @param colorBlendMode Color blending type
     * @param baseColor Base color
     * @param isPremultipliedAlpha Whether it is a multiplied alpha
     * @param matrix4x4 Model-View-Projection row and column
     * @param invertedMask Flag to invert the mask
     */
    setupShaderProgram(renderer: CubismRenderer_WebGL, textureId: WebGLTexture, vertexCount: number, vertexArray: Float32Array, indexArray: Uint16Array, uvArray: Float32Array, bufferData: {
        vertex: WebGLBuffer;
        uv: WebGLBuffer;
        index: WebGLBuffer;
    }, opacity: number, colorBlendMode: CubismBlendMode, baseColor: CubismTextureColor, isPremultipliedAlpha: boolean, matrix4x4: CubismMatrix44, invertedMask: boolean): void;
    /**
     * Release the shader program
     */
    releaseShaderProgram(): void;
    /**
     * Initialize the shader program
     * @param vertShaderSrc Vertex shader source
     * @param fragShaderSrc Fragment shader source
     */
    generateShaders(): void;
    /**
     * Load the shader program and return the address
     * @param vertexShaderSource Vertex shader source
     * @param fragmentShaderSource Fragment shader source
     * @return Shader program address
     */
    loadShaderProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
    /**
     * Compile the shader program
     * @param shaderType Shader type (Vertex / Fragment)
     * @param shaderSource Shader source code
     *
     * @return Compiled shader program
     */
    compileShaderSource(shaderType: GLenum, shaderSource: string): WebGLProgram;
    setGl(gl: WebGLRenderingContext): void;
    _shaderSets: csmVector<CubismShaderSet>;
    gl: WebGLRenderingContext;
}
/**
 * CubismShader_WebGL inner class
 */
export declare class CubismShaderSet {
    shaderProgram: WebGLProgram;
    attributePositionLocation: GLuint;
    attributeTexCoordLocation: GLuint;
    uniformMatrixLocation: WebGLUniformLocation;
    uniformClipMatrixLocation: WebGLUniformLocation;
    samplerTexture0Location: WebGLUniformLocation;
    samplerTexture1Location: WebGLUniformLocation;
    uniformBaseColorLocation: WebGLUniformLocation;
    uniformChannelFlagLocation: WebGLUniformLocation;
    constructor();
}
export declare enum ShaderNames {
    ShaderNames_SetupMask = 0,
    ShaderNames_NormalPremultipliedAlpha = 1,
    ShaderNames_NormalMaskedPremultipliedAlpha = 2,
    ShaderNames_NomralMaskedInvertedPremultipliedAlpha = 3,
    ShaderNames_AddPremultipliedAlpha = 4,
    ShaderNames_AddMaskedPremultipliedAlpha = 5,
    ShaderNames_AddMaskedPremultipliedAlphaInverted = 6,
    ShaderNames_MultPremultipliedAlpha = 7,
    ShaderNames_MultMaskedPremultipliedAlpha = 8,
    ShaderNames_MultMaskedPremultipliedAlphaInverted = 9
}
export declare const vertexShaderSrcSetupMask: string;
export declare const fragmentShaderSrcsetupMask: string;
export declare const vertexShaderSrc: string;
export declare const vertexShaderSrcMasked: string;
export declare const fragmentShaderSrcPremultipliedAlpha: string;
export declare const fragmentShaderSrcMaskPremultipliedAlpha: string;
export declare const fragmentShaderSrcMaskInvertedPremultipliedAlpha: string;
/**
 * A class that implements drawing instructions for WebGL
 */
export declare class CubismRenderer_WebGL extends CubismRenderer {
    /**
     * Execute the renderer initialization process
     * Information required for renderer initialization can be extracted from the model passed as an argument.
     *
     * @param model Model instance
     */
    initialize(model: CubismModel): void;
    /**
     * WebGL texture binding process
     * Set a texture in CubismRenderer and use the Index value for referencing the image in CubismRenderer as the return value.
     * @param modelTextureNo Model texture number to set
     * @param glTextureNo WebGL texture number
     */
    bindTexture(modelTextureNo: number, glTexture: WebGLTexture): void;
    /**
     * Get a list of textures bound to WebGL
     * @return List of textures
     */
    getBindedTextures(): csmMap<number, WebGLTexture>;
    /**
     * Set the size of the clipping mask buffer
     * Processing cost is high because FrameBuffer for mask is discarded and recreated.
     * @param size Clipping mask buffer size
     */
    setClippingMaskBufferSize(size: number): void;
    /**
     * Get the size of the clipping mask buffer
     * @return Clipping mask buffer size
     */
    getClippingMaskBufferSize(): number;
    /**
     * Constructor
     */
    constructor();
    /**
     * Destructor-equivalent processing
     */
    release(): void;
    /**
     * The actual process of drawing the model
     */
    doDrawModel(): void;
    /**
     * [Override]
     * Draw a drawing object (art mesh).
     * Pass the polygon mesh and texture number as a set.
     * @param textureNo Texture number to draw
     * @param indexCount Index value of the drawing object
     * @param vertexCount Number of vertices on the polygon mesh
     * @param indexArray Index array of polygon mesh
     * @param vertexArray Polygon mesh vertex array
     * @param uvArray uv配列
     * @param opacity opacity
     * @param colorBlendMode Color composition type
     * @param invertedMask Using mask inversion when using mask
     */
    drawMesh(textureNo: number, indexCount: number, vertexCount: number, indexArray: Uint16Array, vertexArray: Float32Array, uvArray: Float32Array, opacity: number, colorBlendMode: CubismBlendMode, invertedMask: boolean): void;
    /**
     * Free the static resources held by the renderer
     * Release WebGL static shader programs
     */
    static doStaticRelease(): void;
    /**
     * Set the render state
     * @param fbo Frame buffer specified on the application side
     * @param viewport viewport
     */
    setRenderState(fbo: WebGLFramebuffer, viewport: number[]): void;
    /**
     * Additional processing at the start of drawing
     * Implements the necessary processing for clipping mask before drawing the model
     */
    preDraw(): void;
    /**
     * Set the clipping context to draw on the mask texture
     */
    setClippingContextBufferForMask(clip: CubismClippingContext): void;
    /**
     * Get the clipping context to draw on the mask texture
     * @return Clipping context to draw on the mask texture
     */
    getClippingContextBufferForMask(): CubismClippingContext;
    /**
     * Set the clipping context to draw on the screen
     */
    setClippingContextBufferForDraw(clip: CubismClippingContext): void;
    /**
     * Get the clipping context to draw on the screen
     * @return Clipping context to draw on the screen
     */
    getClippingContextBufferForDraw(): CubismClippingContext;
    /**
     * gl setting
     */
    startUp(gl: WebGLRenderingContext): void;
    _textures: csmMap<number, WebGLTexture>;
    _sortedDrawableIndexList: csmVector<number>;
    _clippingManager: CubismClippingManager_WebGL;
    _clippingContextBufferForMask: CubismClippingContext;
    _clippingContextBufferForDraw: CubismClippingContext;
    firstDraw: boolean;
    _bufferData: {
        vertex: WebGLBuffer;
        uv: WebGLBuffer;
        index: WebGLBuffer;
    };
    gl: WebGLRenderingContext;
}
import * as $ from './cubismrenderer_webgl';
export declare namespace Live2DCubismFramework {
    const CubismClippingContext: typeof $.CubismClippingContext;
    type CubismClippingContext = $.CubismClippingContext;
    const CubismClippingManager_WebGL: typeof $.CubismClippingManager_WebGL;
    type CubismClippingManager_WebGL = $.CubismClippingManager_WebGL;
    const CubismRenderTextureResource: typeof $.CubismRenderTextureResource;
    type CubismRenderTextureResource = $.CubismRenderTextureResource;
    const CubismRenderer_WebGL: typeof $.CubismRenderer_WebGL;
    type CubismRenderer_WebGL = $.CubismRenderer_WebGL;
    const CubismShaderSet: typeof $.CubismShaderSet;
    type CubismShaderSet = $.CubismShaderSet;
    const CubismShader_WebGL: typeof $.CubismShader_WebGL;
    type CubismShader_WebGL = $.CubismShader_WebGL;
    const ShaderNames: typeof $.ShaderNames;
    type ShaderNames = $.ShaderNames;
}
//# sourceMappingURL=cubismrenderer_webgl.d.ts.map