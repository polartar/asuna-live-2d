/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { Constant } from '../live2dcubismframework';
import { CubismMatrix44 } from '../math/cubismmatrix44';
import { csmMap } from '../type/csmmap';
import { csmRect } from '../type/csmrectf';
import { csmVector } from '../type/csmvector';
import { CubismLogError } from '../utils/cubismdebug';
import { CubismBlendMode, CubismRenderer, CubismTextureColor } from './cubismrenderer';
const ColorChannelCount = 4; // 1 for 1 channel in the experiment, 3 for RGB only, 4 for including alpha
const shaderCount = 10; // number of shaders = for mask generation + (normal + addition + multiplication) * (multiplied alpha compatible version without mask + multiplied alpha compatible version with mask + masked inverted multiplied alpha Corresponding version)
let s_instance;
let s_viewport;
let s_fbo;
/**
 * Class that performs clipping mask processing
 */
export class CubismClippingManager_WebGL {
    /**
     * Get the color channel (RGBA) flag
     * @param channelNo Color channel (RGBA) number (0: R, 1: G, 2: B, 3: A)
     */
    getChannelFlagAsColor(channelNo) {
        return this._channelColors.at(channelNo);
    }
    /**
     * Get the address of the temporary render texture
     * If FrameBufferObject does not exist, create a new one
     *
     * @return Render texture address
     */
    getMaskRenderTexture() {
        let ret = 0;
        // Get a temporary RenderTexture
        if (this._maskTexture && this._maskTexture.texture != 0) {
            // return what was used last time
            this._maskTexture.frameNo = this._currentFrameNo;
            ret = this._maskTexture.texture;
        }
        if (ret == 0) {
            // If FrameBufferObject does not exist, create a new one
            // Get the clipping buffer size
            const size = this._clippingMaskBufferSize;
            this._colorBuffer = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, this._colorBuffer);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, size, size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            ret = this.gl.createFramebuffer();
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, ret);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this._colorBuffer, 0);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo);
            this._maskTexture = new CubismRenderTextureResource(this._currentFrameNo, ret);
        }
        return ret;
    }
    /**
     * Set the WebGL rendering context
     * @param gl WebGL rendering context
     */
    setGL(gl) {
        this.gl = gl;
    }
    /**
     * Calculate the rectangle (model coordinate system) that surrounds the entire masked drawing object group.
     * @param model Model instance
     * @param clippingContext Clipping mask context
     */
    calcClippedDrawTotalBounds(model, clippingContext) {
        // The entire rectangle of the clipped mask (the drawing object to be masked)
        let clippedDrawTotalMinX = Number.MAX_VALUE;
        let clippedDrawTotalMinY = Number.MAX_VALUE;
        let clippedDrawTotalMaxX = Number.MIN_VALUE;
        let clippedDrawTotalMaxY = Number.MIN_VALUE;
        // Determine if this mask is really needed
        // If even one "drawing object" that uses this clipping can be used, it is necessary to generate a mask.
        const clippedDrawCount = clippingContext._clippedDrawableIndexList.length;
        for (let clippedDrawableIndex = 0; clippedDrawableIndex < clippedDrawCount; clippedDrawableIndex++) {
            // Find the drawn rectangle of the drawing object that uses the mask
            const drawableIndex = clippingContext._clippedDrawableIndexList[clippedDrawableIndex];
            const drawableVertexCount = model.getDrawableVertexCount(drawableIndex);
            const drawableVertexes = model.getDrawableVertices(drawableIndex);
            let minX = Number.MAX_VALUE;
            let minY = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE;
            let maxY = Number.MIN_VALUE;
            const loop = drawableVertexCount * Constant.vertexStep;
            for (let pi = Constant.vertexOffset; pi < loop; pi += Constant.vertexStep) {
                const x = drawableVertexes[pi];
                const y = drawableVertexes[pi + 1];
                if (x < minX) {
                    minX = x;
                }
                if (x > maxX) {
                    maxX = x;
                }
                if (y < minY) {
                    minY = y;
                }
                if (y > maxY) {
                    maxY = y;
                }
            }
            // Skip because I didn't get any valid points
            if (minX == Number.MAX_VALUE) {
                continue;
            }
            // Reflect on the entire rectangle
            if (minX < clippedDrawTotalMinX) {
                clippedDrawTotalMinX = minX;
            }
            if (minY < clippedDrawTotalMinY) {
                clippedDrawTotalMinY = minY;
            }
            if (maxX > clippedDrawTotalMaxX) {
                clippedDrawTotalMaxX = maxX;
            }
            if (maxY > clippedDrawTotalMaxY) {
                clippedDrawTotalMaxY = maxY;
            }
            if (clippedDrawTotalMinX == Number.MAX_VALUE) {
                clippingContext._allClippedDrawRect.x = 0.0;
                clippingContext._allClippedDrawRect.y = 0.0;
                clippingContext._allClippedDrawRect.width = 0.0;
                clippingContext._allClippedDrawRect.height = 0.0;
                clippingContext._isUsing = false;
            }
            else {
                clippingContext._isUsing = true;
                const w = clippedDrawTotalMaxX - clippedDrawTotalMinX;
                const h = clippedDrawTotalMaxY - clippedDrawTotalMinY;
                clippingContext._allClippedDrawRect.x = clippedDrawTotalMinX;
                clippingContext._allClippedDrawRect.y = clippedDrawTotalMinY;
                clippingContext._allClippedDrawRect.width = w;
                clippingContext._allClippedDrawRect.height = h;
            }
        }
    }
    /**
     * Constructor
     */
    constructor() {
        this.gl = null;
        this._maskRenderTexture = null;
        this._colorBuffer = null;
        this._currentFrameNo = 0;
        this._clippingMaskBufferSize = 256;
        this._clippingContextListForMask = new csmVector();
        this._clippingContextListForDraw = new csmVector();
        this._channelColors = new csmVector();
        this._tmpBoundsOnModel = new csmRect();
        this._tmpMatrix = new CubismMatrix44();
        this._tmpMatrixForMask = new CubismMatrix44();
        this._tmpMatrixForDraw = new CubismMatrix44();
        this._maskTexture = null;
        let tmp = new CubismTextureColor();
        tmp.R = 1.0;
        tmp.G = 0.0;
        tmp.B = 0.0;
        tmp.A = 0.0;
        this._channelColors.pushBack(tmp);
        tmp = new CubismTextureColor();
        tmp.R = 0.0;
        tmp.G = 1.0;
        tmp.B = 0.0;
        tmp.A = 0.0;
        this._channelColors.pushBack(tmp);
        tmp = new CubismTextureColor();
        tmp.R = 0.0;
        tmp.G = 0.0;
        tmp.B = 1.0;
        tmp.A = 0.0;
        this._channelColors.pushBack(tmp);
        tmp = new CubismTextureColor();
        tmp.R = 0.0;
        tmp.G = 0.0;
        tmp.B = 0.0;
        tmp.A = 1.0;
        this._channelColors.pushBack(tmp);
    }
    /**
     * Destructor-equivalent processing
     */
    release() {
        for (let i = 0; i < this._clippingContextListForMask.getSize(); i++) {
            if (this._clippingContextListForMask.at(i)) {
                this._clippingContextListForMask.at(i).release();
                this._clippingContextListForMask.set(i, void 0);
            }
            this._clippingContextListForMask.set(i, null);
        }
        this._clippingContextListForMask = null;
        // _clippingContextListForDraw points to an instance in _clippingContextListForMask. Due to the above processing, DELETE for each element is unnecessary.
        for (let i = 0; i < this._clippingContextListForDraw.getSize(); i++) {
            this._clippingContextListForDraw.set(i, null);
        }
        this._clippingContextListForDraw = null;
        if (this._maskTexture) {
            this.gl.deleteFramebuffer(this._maskTexture.texture);
            this._maskTexture = null;
        }
        for (let i = 0; i < this._channelColors.getSize(); i++) {
            this._channelColors.set(i, null);
        }
        this._channelColors = null;
        // Texture release
        this.gl.deleteTexture(this._colorBuffer);
        this._colorBuffer = null;
    }
    /**
     * Manager initialization process
     * Register a drawing object that uses a clipping mask
     * @param model Model instance
     * @param drawableCount Number of draw objects
     * @param drawableMasks List of indexes of drawing objects that mask drawing objects
     * @param drawableCounts Number of drawing objects to mask the drawing objects
     */
    initialize(model, drawableCount, drawableMasks, drawableMaskCounts) {
        // Register all drawing objects that use the clipping mask
        // Clipping masks are usually limited to a few.
        for (let i = 0; i < drawableCount; i++) {
            if (drawableMaskCounts[i] <= 0) {
                // Art mesh without clipping mask (often not used)
                this._clippingContextListForDraw.pushBack(null);
                continue;
            }
            // Check if it is the same as the existing ClipContext
            let clippingContext = this.findSameClip(drawableMasks[i], drawableMaskCounts[i]);
            if (clippingContext == null) {
                // Generate if the same mask does not exist
                clippingContext = new CubismClippingContext(this, drawableMasks[i], drawableMaskCounts[i]);
                this._clippingContextListForMask.pushBack(clippingContext);
            }
            clippingContext.addClippedDrawable(i);
            this._clippingContextListForDraw.pushBack(clippingContext);
        }
    }
    /**
     * Create a clipping context. Executed when drawing the model.
     * @param model Model instance
     * @param renderer Instance of renderer
     */
    setupClippingContext(model, renderer) {
        this._currentFrameNo++;
        // Prepare all clipping
        // Set only once when using the same clip (in the case of multiple clips, one clip at a time)
        let usingClipCount = 0;
        for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
            // Regarding one clipping mask
            const cc = this._clippingContextListForMask.at(clipIndex);
            // Calculate the rectangle that encloses the entire drawing object group that uses this clip
            this.calcClippedDrawTotalBounds(model, cc);
            if (cc._isUsing) {
                usingClipCount++; // Count as in use
            }
        }
        // Mask creation process
        if (usingClipCount > 0) {
            // Set the viewport with the same size as the generated FrameBuffer
            this.gl.viewport(0, 0, this._clippingMaskBufferSize, this._clippingMaskBufferSize);
            // Make the mask active
            this._maskRenderTexture = this.getMaskRenderTexture();
            // Transformation passed to DrawMeshNow when drawing the model (model to world coordinate transformation)
            const modelToWorldF = renderer.getMvpMatrix();
            renderer.preDraw(); // clear the buffer
            // Decide the layout of each mask
            this.setupLayoutBounds(usingClipCount);
            // ---------- Mask drawing process ----------
            // Set Render Texture for mask to active
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._maskRenderTexture);
            // Clear the mask
            // (Tentative specification) 1 is invalid (not drawn) area, 0 is valid (drawn) area. (Use the shader Cd * Cs to make a mask by multiplying it by a value close to 0. When 1 is multiplied, nothing happens)
            this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            // Actually generate a mask
            // Decide how to lay out and draw all masks and store them in ClipContext and ClippedDrawContext.
            for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
                // --- Actually draw one mask ---
                const clipContext = this._clippingContextListForMask.at(clipIndex);
                const allClipedDrawRect = clipContext._allClippedDrawRect; // Enclosed rectangle on the logical coordinates of all drawing objects using this mask
                const layoutBoundsOnTex01 = clipContext._layoutBounds; // Put the mask in this
                // Use the rectangle on the model coordinates with appropriate margins
                const MARGIN = 0.05;
                this._tmpBoundsOnModel.setRect(allClipedDrawRect);
                this._tmpBoundsOnModel.expand(allClipedDrawRect.width * MARGIN, allClipedDrawRect.height * MARGIN);
                // ########## Originally, the minimum required size is good without using the entire allocated area.
                // Find the formula for the shader. When rotation is not considered, it is as follows
                // movePeriod' = movePeriod * scaleX + offX		  [[ movePeriod' = (movePeriod - tmpBoundsOnModel.movePeriod)*scale + layoutBoundsOnTex01.movePeriod ]]
                const scaleX = layoutBoundsOnTex01.width / this._tmpBoundsOnModel.width;
                const scaleY = layoutBoundsOnTex01.height / this._tmpBoundsOnModel.height;
                // Find the matrix to use when generating the mask
                {
                    // Find the matrix to pass to the shader <<<<<<<<<<<<<<<<<<<<<< Optimization required (calculation in reverse order can be simple)
                    this._tmpMatrix.loadIdentity();
                    {
                        // Convert layout0..1 to -1..1
                        this._tmpMatrix.translateRelative(-1.0, -1.0);
                        this._tmpMatrix.scaleRelative(2.0, 2.0);
                    }
                    {
                        // view to layout0..1
                        this._tmpMatrix.translateRelative(layoutBoundsOnTex01.x, layoutBoundsOnTex01.y);
                        this._tmpMatrix.scaleRelative(scaleX, scaleY); // new = [translate][scale]
                        this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y);
                        // new = [translate][scale][translate]
                    }
                    // tmpMatrixForMask is the calculation result
                    this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray());
                }
                // --------- Calculate the mask reference matrix when drawing
                {
                    // Find the matrix to pass to the shader <<<<<<<<<<<<<<<<<<<<<< Optimization required (calculation in reverse order can be simple)
                    this._tmpMatrix.loadIdentity();
                    {
                        this._tmpMatrix.translateRelative(layoutBoundsOnTex01.x, layoutBoundsOnTex01.y);
                        this._tmpMatrix.scaleRelative(scaleX, scaleY); // new = [translate][scale]
                        this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y);
                        // new = [translate][scale][translate]
                    }
                    this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray());
                }
                clipContext._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray());
                clipContext._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
                const clipDrawCount = clipContext._clippingIdCount;
                for (let i = 0; i < clipDrawCount; i++) {
                    const clipDrawIndex = clipContext._clippingIdList[i];
                    // If the vertex information has not been updated and is unreliable, pass the drawing
                    if (!model.getDrawableDynamicFlagVertexPositionsDidChange(clipDrawIndex)) {
                        continue;
                    }
                    renderer.setIsCulling(model.getDrawableCulling(clipDrawIndex) != false);
                    // Draw by applying the special conversion this time
                    // You also need to switch channels (A, R, G, B)
                    renderer.setClippingContextBufferForMask(clipContext);
                    renderer.drawMesh(model.getDrawableTextureIndices(clipDrawIndex), model.getDrawableVertexIndexCount(clipDrawIndex), model.getDrawableVertexCount(clipDrawIndex), model.getDrawableVertexIndices(clipDrawIndex), model.getDrawableVertices(clipDrawIndex), model.getDrawableVertexUvs(clipDrawIndex), model.getDrawableOpacity(clipDrawIndex), CubismBlendMode.CubismBlendMode_Normal, // Clipping forces normal drawing
                    false // Inversion of clipping is completely irrelevant when generating masks
                    );
                }
            }
            // --- Post-processing ---
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo); // Return the drawing target
            renderer.setClippingContextBufferForMask(null);
            this.gl.viewport(s_viewport[0], s_viewport[1], s_viewport[2], s_viewport[3]);
        }
    }
    /**
     * Make sure you have already made a mask
     * If you are making it, return an instance of the corresponding clipping mask
     * Returns NULL if not created
     * @param drawableMasks List of drawing objects that mask drawing objects
     * @param drawableMaskCounts Number of drawing objects to mask drawing objects
     * @return Returns an instance if the corresponding clipping mask exists, returns NULL otherwise
     */
    findSameClip(drawableMasks, drawableMaskCounts) {
        // Check if it matches the created ClippingContext
        for (let i = 0; i < this._clippingContextListForMask.getSize(); i++) {
            const clippingContext = this._clippingContextListForMask.at(i);
            const count = clippingContext._clippingIdCount;
            // If the number is different, it is different
            if (count != drawableMaskCounts) {
                continue;
            }
            let sameCount = 0;
            // Check if they have the same ID. Since the number of arrays is the same, if the number of matches is the same, it is assumed that they have the same thing.
            for (let j = 0; j < count; j++) {
                const clipId = clippingContext._clippingIdList[j];
                for (let k = 0; k < count; k++) {
                    if (drawableMasks[k] == clipId) {
                        sameCount++;
                        break;
                    }
                }
            }
            if (sameCount == count) {
                return clippingContext;
            }
        }
        return null; // not found
    }
    /**
     * Layout to place the clipping context
     * Lay out the mask using one render texture as much as possible
     * If the number of mask groups is 4 or less, place one mask for each RGBA channel, and if it is 5 or more and 6 or less, place RGBA as 2,2,1,1.
     *
     * @param usingClipCount Number of clipping contexts to place
     */
    setupLayoutBounds(usingClipCount) {
        // Lay out the mask using one Render Texture as much as possible
        // If the number of mask groups is 4 or less, place one mask for each RGBA channel, and if it is 5 or more and 6 or less, place RGBA as 2,2,1,1.
        // Use RGBA in order
        let div = usingClipCount / ColorChannelCount; // Basic mask to place on one channel
        let mod = usingClipCount % ColorChannelCount; // Distribute one by one to the channel with this number.
        // Decimal point is truncated
        div = ~~div;
        mod = ~~mod;
        // Prepare each RGBA channel (0: R, 1: G, 2: B, 3: A)
        let curClipIndex = 0; // Set in order
        for (let channelNo = 0; channelNo < ColorChannelCount; channelNo++) {
            // Number to lay out on this channel
            const layoutCount = div + (channelNo < mod ? 1 : 0);
            // Decide how to split
            if (layoutCount == 0) {
                // do nothing
            }
            else if (layoutCount == 1) {
                // use everything as it is
                const clipContext = this._clippingContextListForMask.at(curClipIndex++);
                clipContext._layoutChannelNo = channelNo;
                clipContext._layoutBounds.x = 0.0;
                clipContext._layoutBounds.y = 0.0;
                clipContext._layoutBounds.width = 1.0;
                clipContext._layoutBounds.height = 1.0;
            }
            else if (layoutCount == 2) {
                for (let i = 0; i < layoutCount; i++) {
                    let xpos = i % 2;
                    // Decimal point is truncated
                    xpos = ~~xpos;
                    const cc = this._clippingContextListForMask.at(curClipIndex++);
                    cc._layoutChannelNo = channelNo;
                    cc._layoutBounds.x = xpos * 0.5;
                    cc._layoutBounds.y = 0.0;
                    cc._layoutBounds.width = 0.5;
                    cc._layoutBounds.height = 1.0;
                    // Divide UV into two and use
                }
            }
            else if (layoutCount <= 4) {
                // Divide into 4 and use
                for (let i = 0; i < layoutCount; i++) {
                    let xpos = i % 2;
                    let ypos = i / 2;
                    // Decimal point is truncated
                    xpos = ~~xpos;
                    ypos = ~~ypos;
                    const cc = this._clippingContextListForMask.at(curClipIndex++);
                    cc._layoutChannelNo = channelNo;
                    cc._layoutBounds.x = xpos * 0.5;
                    cc._layoutBounds.y = ypos * 0.5;
                    cc._layoutBounds.width = 0.5;
                    cc._layoutBounds.height = 0.5;
                }
            }
            else if (layoutCount <= 9) {
                // Divide into 9 and use
                for (let i = 0; i < layoutCount; i++) {
                    let xpos = i % 3;
                    let ypos = i / 3;
                    // Decimal point is truncated
                    xpos = ~~xpos;
                    ypos = ~~ypos;
                    const cc = this._clippingContextListForMask.at(curClipIndex++);
                    cc._layoutChannelNo = channelNo;
                    cc._layoutBounds.x = xpos / 3.0;
                    cc._layoutBounds.y = ypos / 3.0;
                    cc._layoutBounds.width = 1.0 / 3.0;
                    cc._layoutBounds.height = 1.0 / 3.0;
                }
            }
            else {
                CubismLogError('not supported mask count : {0}', layoutCount);
            }
        }
    }
    /**
     * Get the color buffer
     * @return color buffer
     */
    getColorBuffer() {
        return this._colorBuffer;
    }
    /**
     * Get a list of clipping masks used for screen drawing
     * @return List of clipping masks used for screen drawing
     */
    getClippingContextListForDraw() {
        return this._clippingContextListForDraw;
    }
    /**
     * Set the size of the clipping mask buffer
     * @param size Clipping mask buffer size
     */
    setClippingMaskBufferSize(size) {
        this._clippingMaskBufferSize = size;
    }
    /**
     * Get the size of the clipping mask buffer
     * @return Clipping mask buffer size
     */
    getClippingMaskBufferSize() {
        return this._clippingMaskBufferSize;
    }
}
/**
 * Structure that defines the resources of the render texture
 * Used with clipping mask
 */
export class CubismRenderTextureResource {
    /**
     * Constructor with arguments
     * @param frameNo Renderer frame number
     * @param texture Texture address
     */
    constructor(frameNo, texture) {
        this.frameNo = frameNo;
        this.texture = texture;
    }
}
/**
 * Clipping mask context
 */
export class CubismClippingContext {
    /**
     * Constructor with arguments
     */
    constructor(manager, clippingDrawableIndices, clipCount) {
        this._owner = manager;
        // stupid
        this._isUsing = false;
        this._layoutChannelNo = 0;
        // Index list of the Drawable that is being clipped (= for mask)
        this._clippingIdList = clippingDrawableIndices;
        // Number of masks
        this._clippingIdCount = clipCount;
        this._allClippedDrawRect = new csmRect();
        this._layoutBounds = new csmRect();
        this._clippedDrawableIndexList = [];
        this._matrixForMask = new CubismMatrix44();
        this._matrixForDraw = new CubismMatrix44();
    }
    /**
     * Destructor-equivalent processing
     */
    release() {
        if (this._layoutBounds != null) {
            this._layoutBounds = null;
        }
        if (this._allClippedDrawRect != null) {
            this._allClippedDrawRect = null;
        }
        if (this._clippedDrawableIndexList != null) {
            this._clippedDrawableIndexList = null;
        }
    }
    /**
     * Add a drawing object to be clipped to this mask
     *
     * @param drawableIndex Index of drawing object to be added to clipping target
     */
    addClippedDrawable(drawableIndex) {
        this._clippedDrawableIndexList.push(drawableIndex);
    }
    /**
     * Get an instance of the manager that manages this mask
     * @return Instance of Clipping Manager
     */
    getClippingManager() {
        return this._owner;
    }
    setGl(gl) {
        this._owner.setGL(gl);
    }
}
/**
 * A class that creates and destroys shader programs for WebGL
 * It is a singleton class and is accessed from CubismShader_WebGL.getInstance.
 */
export class CubismShader_WebGL {
    /**
     * Get an instance (singleton)
     * @return instance
     */
    static getInstance() {
        if (s_instance == null) {
            s_instance = new CubismShader_WebGL();
            return s_instance;
        }
        return s_instance;
    }
    /**
     * Release the instance (singleton)
     */
    static deleteInstance() {
        if (s_instance) {
            s_instance.release();
            s_instance = null;
        }
    }
    /**
     * private constructor
     */
    constructor() {
        this.gl = null;
        this._shaderSets = new csmVector();
    }
    /**
     * Destructor-equivalent processing
     */
    release() {
        this.releaseShaderProgram();
    }
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
    setupShaderProgram(renderer, textureId, vertexCount, vertexArray, indexArray, uvArray, bufferData, opacity, colorBlendMode, baseColor, isPremultipliedAlpha, matrix4x4, invertedMask) {
        if (!isPremultipliedAlpha) {
            CubismLogError('NoPremultipliedAlpha is not allowed');
        }
        if (this._shaderSets.getSize() == 0) {
            this.generateShaders();
        }
        // Blending
        let SRC_COLOR;
        let DST_COLOR;
        let SRC_ALPHA;
        let DST_ALPHA;
        if (renderer.getClippingContextBufferForMask() != null) {
            // At the time of mask generation
            const shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_SetupMask);
            this.gl.useProgram(shaderSet.shaderProgram);
            // Texture settings
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
            this.gl.uniform1i(shaderSet.samplerTexture0Location, 0);
            // Vertex array setting (VBO)
            if (bufferData.vertex == null) {
                bufferData.vertex = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.vertex);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.DYNAMIC_DRAW);
            this.gl.enableVertexAttribArray(shaderSet.attributePositionLocation);
            this.gl.vertexAttribPointer(shaderSet.attributePositionLocation, 2, this.gl.FLOAT, false, 0, 0);
            // Texture vertex settings
            if (bufferData.uv == null) {
                bufferData.uv = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.uv);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
            this.gl.enableVertexAttribArray(shaderSet.attributeTexCoordLocation);
            this.gl.vertexAttribPointer(shaderSet.attributeTexCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
            // Channel
            const channelNo = renderer.getClippingContextBufferForMask()
                ._layoutChannelNo;
            const colorChannel = renderer
                .getClippingContextBufferForMask()
                .getClippingManager()
                .getChannelFlagAsColor(channelNo);
            this.gl.uniform4f(shaderSet.uniformChannelFlagLocation, colorChannel.R, colorChannel.G, colorChannel.B, colorChannel.A);
            this.gl.uniformMatrix4fv(shaderSet.uniformClipMatrixLocation, false, renderer.getClippingContextBufferForMask()._matrixForMask.getArray());
            const rect = renderer.getClippingContextBufferForMask()
                ._layoutBounds;
            this.gl.uniform4f(shaderSet.uniformBaseColorLocation, rect.x * 2.0 - 1.0, rect.y * 2.0 - 1.0, rect.getRight() * 2.0 - 1.0, rect.getBottom() * 2.0 - 1.0);
            SRC_COLOR = this.gl.ZERO;
            DST_COLOR = this.gl.ONE_MINUS_SRC_COLOR;
            SRC_ALPHA = this.gl.ZERO;
            DST_ALPHA = this.gl.ONE_MINUS_SRC_ALPHA;
        } // For other than mask generation
        else {
            const masked = renderer.getClippingContextBufferForDraw() != null; // Is this drawing object a mask target?
            const offset = masked ? (invertedMask ? 2 : 1) : 0;
            let shaderSet = new CubismShaderSet();
            switch (colorBlendMode) {
                case CubismBlendMode.CubismBlendMode_Normal:
                default:
                    shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_NormalPremultipliedAlpha + offset);
                    SRC_COLOR = this.gl.ONE;
                    DST_COLOR = this.gl.ONE_MINUS_SRC_ALPHA;
                    SRC_ALPHA = this.gl.ONE;
                    DST_ALPHA = this.gl.ONE_MINUS_SRC_ALPHA;
                    break;
                case CubismBlendMode.CubismBlendMode_Additive:
                    shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_AddPremultipliedAlpha + offset);
                    SRC_COLOR = this.gl.ONE;
                    DST_COLOR = this.gl.ONE;
                    SRC_ALPHA = this.gl.ZERO;
                    DST_ALPHA = this.gl.ONE;
                    break;
                case CubismBlendMode.CubismBlendMode_Multiplicative:
                    shaderSet = this._shaderSets.at(ShaderNames.ShaderNames_MultPremultipliedAlpha + offset);
                    SRC_COLOR = this.gl.DST_COLOR;
                    DST_COLOR = this.gl.ONE_MINUS_SRC_ALPHA;
                    SRC_ALPHA = this.gl.ZERO;
                    DST_ALPHA = this.gl.ONE;
                    break;
            }
            this.gl.useProgram(shaderSet.shaderProgram);
            // Vertex array settings
            if (bufferData.vertex == null) {
                bufferData.vertex = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.vertex);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.DYNAMIC_DRAW);
            this.gl.enableVertexAttribArray(shaderSet.attributePositionLocation);
            this.gl.vertexAttribPointer(shaderSet.attributePositionLocation, 2, this.gl.FLOAT, false, 0, 0);
            // Texture vertex settings
            if (bufferData.uv == null) {
                bufferData.uv = this.gl.createBuffer();
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferData.uv);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
            this.gl.enableVertexAttribArray(shaderSet.attributeTexCoordLocation);
            this.gl.vertexAttribPointer(shaderSet.attributeTexCoordLocation, 2, this.gl.FLOAT, false, 0, 0);
            if (masked) {
                this.gl.activeTexture(this.gl.TEXTURE1);
                const tex = renderer
                    .getClippingContextBufferForDraw()
                    .getClippingManager()
                    .getColorBuffer();
                this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
                this.gl.uniform1i(shaderSet.samplerTexture1Location, 1);
                // Set a matrix to convert view coordinates to ClippingContext coordinates
                this.gl.uniformMatrix4fv(shaderSet.uniformClipMatrixLocation, false, renderer.getClippingContextBufferForDraw()._matrixForDraw.getArray());
                // Set the color channel to use
                const channelNo = renderer.getClippingContextBufferForDraw()
                    ._layoutChannelNo;
                const colorChannel = renderer
                    .getClippingContextBufferForDraw()
                    .getClippingManager()
                    .getChannelFlagAsColor(channelNo);
                this.gl.uniform4f(shaderSet.uniformChannelFlagLocation, colorChannel.R, colorChannel.G, colorChannel.B, colorChannel.A);
            }
            // Texture settings
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
            this.gl.uniform1i(shaderSet.samplerTexture0Location, 0);
            // Coordinate transformation
            this.gl.uniformMatrix4fv(shaderSet.uniformMatrixLocation, false, matrix4x4.getArray());
            this.gl.uniform4f(shaderSet.uniformBaseColorLocation, baseColor.R, baseColor.G, baseColor.B, baseColor.A);
        }
        // Create an IBO and transfer the data
        if (bufferData.index == null) {
            bufferData.index = this.gl.createBuffer();
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferData.index);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indexArray, this.gl.DYNAMIC_DRAW);
        this.gl.blendFuncSeparate(SRC_COLOR, DST_COLOR, SRC_ALPHA, DST_ALPHA);
    }
    /**
     * Release the shader program
     */
    releaseShaderProgram() {
        for (let i = 0; i < this._shaderSets.getSize(); i++) {
            this.gl.deleteProgram(this._shaderSets.at(i).shaderProgram);
            this._shaderSets.at(i).shaderProgram = 0;
            this._shaderSets.set(i, void 0);
            this._shaderSets.set(i, null);
        }
    }
    /**
     * Initialize the shader program
     * @param vertShaderSrc Vertex shader source
     * @param fragShaderSrc Fragment shader source
     */
    generateShaders() {
        for (let i = 0; i < shaderCount; i++) {
            this._shaderSets.pushBack(new CubismShaderSet());
        }
        this._shaderSets.at(0).shaderProgram = this.loadShaderProgram(vertexShaderSrcSetupMask, fragmentShaderSrcsetupMask);
        this._shaderSets.at(1).shaderProgram = this.loadShaderProgram(vertexShaderSrc, fragmentShaderSrcPremultipliedAlpha);
        this._shaderSets.at(2).shaderProgram = this.loadShaderProgram(vertexShaderSrcMasked, fragmentShaderSrcMaskPremultipliedAlpha);
        this._shaderSets.at(3).shaderProgram = this.loadShaderProgram(vertexShaderSrcMasked, fragmentShaderSrcMaskInvertedPremultipliedAlpha);
        // Use the same shader for addition as usual
        this._shaderSets.at(4).shaderProgram = this._shaderSets.at(1).shaderProgram;
        this._shaderSets.at(5).shaderProgram = this._shaderSets.at(2).shaderProgram;
        this._shaderSets.at(6).shaderProgram = this._shaderSets.at(3).shaderProgram;
        // Multiply use the same shader as usual
        this._shaderSets.at(7).shaderProgram = this._shaderSets.at(1).shaderProgram;
        this._shaderSets.at(8).shaderProgram = this._shaderSets.at(2).shaderProgram;
        this._shaderSets.at(9).shaderProgram = this._shaderSets.at(3).shaderProgram;
        // SetupMask
        this._shaderSets.at(0).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(0).shaderProgram, 'a_position');
        this._shaderSets.at(0).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(0).shaderProgram, 'a_texCoord');
        this._shaderSets.at(0).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 's_texture0');
        this._shaderSets.at(0).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(0).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(0).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(0).shaderProgram, 'u_baseColor');
        // usually (PremultipliedAlpha)
        this._shaderSets.at(1).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(1).shaderProgram, 'a_position');
        this._shaderSets.at(1).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(1).shaderProgram, 'a_texCoord');
        this._shaderSets.at(1).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 's_texture0');
        this._shaderSets.at(1).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_matrix');
        this._shaderSets.at(1).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(1).shaderProgram, 'u_baseColor');
        // Normal (clipping, PremultipliedAlpha)
        this._shaderSets.at(2).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(2).shaderProgram, 'a_position');
        this._shaderSets.at(2).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(2).shaderProgram, 'a_texCoord');
        this._shaderSets.at(2).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 's_texture0');
        this._shaderSets.at(2).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 's_texture1');
        this._shaderSets.at(2).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_matrix');
        this._shaderSets.at(2).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(2).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(2).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(2).shaderProgram, 'u_baseColor');
        // Normal (clipping / inversion, PremultipliedAlpha)
        this._shaderSets.at(3).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(3).shaderProgram, 'a_position');
        this._shaderSets.at(3).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(3).shaderProgram, 'a_texCoord');
        this._shaderSets.at(3).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 's_texture0');
        this._shaderSets.at(3).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 's_texture1');
        this._shaderSets.at(3).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_matrix');
        this._shaderSets.at(3).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(3).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(3).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(3).shaderProgram, 'u_baseColor');
        // Addition (PremultipliedAlpha)
        this._shaderSets.at(4).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(4).shaderProgram, 'a_position');
        this._shaderSets.at(4).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(4).shaderProgram, 'a_texCoord');
        this._shaderSets.at(4).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 's_texture0');
        this._shaderSets.at(4).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_matrix');
        this._shaderSets.at(4).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(4).shaderProgram, 'u_baseColor');
        // Addition (clipping, PremultipliedAlpha)
        this._shaderSets.at(5).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(5).shaderProgram, 'a_position');
        this._shaderSets.at(5).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(5).shaderProgram, 'a_texCoord');
        this._shaderSets.at(5).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 's_texture0');
        this._shaderSets.at(5).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 's_texture1');
        this._shaderSets.at(5).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_matrix');
        this._shaderSets.at(5).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(5).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(5).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(5).shaderProgram, 'u_baseColor');
        // Addition (clipping / inversion, PremultipliedAlpha)
        this._shaderSets.at(6).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(6).shaderProgram, 'a_position');
        this._shaderSets.at(6).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(6).shaderProgram, 'a_texCoord');
        this._shaderSets.at(6).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 's_texture0');
        this._shaderSets.at(6).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 's_texture1');
        this._shaderSets.at(6).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_matrix');
        this._shaderSets.at(6).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(6).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(6).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(6).shaderProgram, 'u_baseColor');
        // Multiply (PremultipliedAlpha)
        this._shaderSets.at(7).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(7).shaderProgram, 'a_position');
        this._shaderSets.at(7).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(7).shaderProgram, 'a_texCoord');
        this._shaderSets.at(7).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 's_texture0');
        this._shaderSets.at(7).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_matrix');
        this._shaderSets.at(7).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(7).shaderProgram, 'u_baseColor');
        // Multiplication (clipping, PremultipliedAlpha)
        this._shaderSets.at(8).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(8).shaderProgram, 'a_position');
        this._shaderSets.at(8).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(8).shaderProgram, 'a_texCoord');
        this._shaderSets.at(8).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 's_texture0');
        this._shaderSets.at(8).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 's_texture1');
        this._shaderSets.at(8).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_matrix');
        this._shaderSets.at(8).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(8).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(8).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(8).shaderProgram, 'u_baseColor');
        // Multiplication (clipping / inversion, PremultipliedAlpha)
        this._shaderSets.at(9).attributePositionLocation = this.gl.getAttribLocation(this._shaderSets.at(9).shaderProgram, 'a_position');
        this._shaderSets.at(9).attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets.at(9).shaderProgram, 'a_texCoord');
        this._shaderSets.at(9).samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 's_texture0');
        this._shaderSets.at(9).samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 's_texture1');
        this._shaderSets.at(9).uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_matrix');
        this._shaderSets.at(9).uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_clipMatrix');
        this._shaderSets.at(9).uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_channelFlag');
        this._shaderSets.at(9).uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets.at(9).shaderProgram, 'u_baseColor');
    }
    /**
     * Load the shader program and return the address
     * @param vertexShaderSource Vertex shader source
     * @param fragmentShaderSource Fragment shader source
     * @return Shader program address
     */
    loadShaderProgram(vertexShaderSource, fragmentShaderSource) {
        // Create Shader Program
        let shaderProgram = this.gl.createProgram();
        let vertShader = this.compileShaderSource(this.gl.VERTEX_SHADER, vertexShaderSource);
        if (!vertShader) {
            CubismLogError('Vertex shader compile error!');
            return 0;
        }
        let fragShader = this.compileShaderSource(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!fragShader) {
            CubismLogError('Vertex shader compile error!');
            return 0;
        }
        // Attach vertex shader to program
        this.gl.attachShader(shaderProgram, vertShader);
        // Attach fragment shader to program
        this.gl.attachShader(shaderProgram, fragShader);
        // link program
        this.gl.linkProgram(shaderProgram);
        const linkStatus = this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS);
        // Remove shader if link fails
        if (!linkStatus) {
            CubismLogError('Failed to link program: {0}', shaderProgram);
            this.gl.deleteShader(vertShader);
            vertShader = 0;
            this.gl.deleteShader(fragShader);
            fragShader = 0;
            if (shaderProgram) {
                this.gl.deleteProgram(shaderProgram);
                shaderProgram = 0;
            }
            return 0;
        }
        // Release vertex and fragment shaders.
        this.gl.deleteShader(vertShader);
        this.gl.deleteShader(fragShader);
        return shaderProgram;
    }
    /**
     * Compile the shader program
     * @param shaderType Shader type (Vertex / Fragment)
     * @param shaderSource Shader source code
     *
     * @return Compiled shader program
     */
    compileShaderSource(shaderType, shaderSource) {
        const source = shaderSource;
        const shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!shader) {
            const log = this.gl.getShaderInfoLog(shader);
            CubismLogError('Shader compile log: {0} ', log);
        }
        const status = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!status) {
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    setGl(gl) {
        this.gl = gl;
    }
}
/**
 * CubismShader_WebGL inner class
 */
export class CubismShaderSet {
    constructor() {
        this.shaderProgram = null;
        this.attributePositionLocation = null;
        this.attributeTexCoordLocation = null;
        this.uniformMatrixLocation = null;
        this.uniformClipMatrixLocation = null;
        this.uniformClipMatrixLocation = null;
        this.samplerTexture0Location = null;
        this.samplerTexture1Location = null;
        this.uniformBaseColorLocation = null;
        this.uniformChannelFlagLocation = null;
    }
}
export var ShaderNames;
(function (ShaderNames) {
    // SetupMask
    ShaderNames[ShaderNames["ShaderNames_SetupMask"] = 0] = "ShaderNames_SetupMask";
    // Normal
    ShaderNames[ShaderNames["ShaderNames_NormalPremultipliedAlpha"] = 1] = "ShaderNames_NormalPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_NormalMaskedPremultipliedAlpha"] = 2] = "ShaderNames_NormalMaskedPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_NomralMaskedInvertedPremultipliedAlpha"] = 3] = "ShaderNames_NomralMaskedInvertedPremultipliedAlpha";
    // Add
    ShaderNames[ShaderNames["ShaderNames_AddPremultipliedAlpha"] = 4] = "ShaderNames_AddPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_AddMaskedPremultipliedAlpha"] = 5] = "ShaderNames_AddMaskedPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_AddMaskedPremultipliedAlphaInverted"] = 6] = "ShaderNames_AddMaskedPremultipliedAlphaInverted";
    // A lot
    ShaderNames[ShaderNames["ShaderNames_MultPremultipliedAlpha"] = 7] = "ShaderNames_MultPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_MultMaskedPremultipliedAlpha"] = 8] = "ShaderNames_MultMaskedPremultipliedAlpha";
    ShaderNames[ShaderNames["ShaderNames_MultMaskedPremultipliedAlphaInverted"] = 9] = "ShaderNames_MultMaskedPremultipliedAlphaInverted";
})(ShaderNames || (ShaderNames = {}));
export const vertexShaderSrcSetupMask = 'attribute vec4     a_position;' +
    'attribute vec2     a_texCoord;' +
    'varying vec2       v_texCoord;' +
    'varying vec4       v_myPos;' +
    'uniform mat4       u_clipMatrix;' +
    'void main()' +
    '{' +
    '   gl_Position = u_clipMatrix * a_position;' +
    '   v_myPos = u_clipMatrix * a_position;' +
    '   v_texCoord = a_texCoord;' +
    ' v_texCoord.y = 1.0 - v_texCoord.y;' +
    '}';
export const fragmentShaderSrcsetupMask = 'precision mediump float;' +
    'varying vec2       v_texCoord;' +
    'varying vec4       v_myPos;' +
    'uniform vec4       u_baseColor;' +
    'uniform vec4       u_channelFlag;' +
    'uniform sampler2D  s_texture0;' +
    'void main()' +
    '{' +
    'float isInside =' +
    '       step(u_baseColor.x, v_myPos.x/v_myPos.w)' +
    '       * step(u_baseColor.y, v_myPos.y/v_myPos.w)' +
    '       * step(v_myPos.x/v_myPos.w, u_baseColor.z)' +
    '       * step(v_myPos.y/v_myPos.w, u_baseColor.w);' +
    '   gl_FragColor = u_channelFlag * texture2D(s_texture0, v_texCoord).a * isInside;' +
    '}';
// ----- Vertex shader program -----
// Normal & Add & Mult 共通
export const vertexShaderSrc = 'attribute vec4     a_position;' + //v.vertex
    'attribute vec2     a_texCoord;' + //v.texcoord
    'varying vec2       v_texCoord;' + //v2f.texcoord
    'uniform mat4       u_matrix;' +
    'void main()' +
    '{' +
    '   gl_Position = u_matrix * a_position;' +
    '   v_texCoord = a_texCoord;' +
    ' v_texCoord.y = 1.0 - v_texCoord.y;' +
    '}';
// Normal & Add & Mult common (for drawing clipped things)
export const vertexShaderSrcMasked = 'attribute vec4     a_position;' +
    'attribute vec2     a_texCoord;' +
    'varying vec2       v_texCoord;' +
    'varying vec4       v_clipPos;' +
    'uniform mat4       u_matrix;' +
    'uniform mat4       u_clipMatrix;' +
    'void main()' +
    '{' +
    '   gl_Position = u_matrix * a_position;' +
    '   v_clipPos = u_clipMatrix * a_position;' +
    '   v_texCoord = a_texCoord;' +
    ' v_texCoord.y = 1.0 - v_texCoord.y;' +
    '}';
// ----- Fragment shader program -----
// Normal & Add & Mult 共通 （PremultipliedAlpha）
export const fragmentShaderSrcPremultipliedAlpha = 'precision mediump float;' +
    'varying vec2       v_texCoord;' + //v2f.texcoord
    'uniform vec4       u_baseColor;' +
    'uniform sampler2D  s_texture0;' + //_MainTex
    'void main()' +
    '{' +
    '   gl_FragColor = texture2D(s_texture0 , v_texCoord) * u_baseColor;' +
    '}';
// Normal (for drawing clipped things, also used as Premultiplied Alpha)
export const fragmentShaderSrcMaskPremultipliedAlpha = 'precision mediump float;' +
    'varying vec2       v_texCoord;' +
    'varying vec4       v_clipPos;' +
    'uniform vec4       u_baseColor;' +
    'uniform vec4       u_channelFlag;' +
    'uniform sampler2D  s_texture0;' +
    'uniform sampler2D  s_texture1;' +
    'void main()' +
    '{' +
    '   vec4 col_formask = texture2D(s_texture0 , v_texCoord) * u_baseColor;' +
    '   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;' +
    '   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;' +
    'col_formask = col_formask * maskVal;' +
    '   gl_FragColor = col_formask;' +
    '}';
// Normal & Add & Mult common (for drawing with clipping and inversion, for Premultiplied Alpha)
export const fragmentShaderSrcMaskInvertedPremultipliedAlpha = 'precision mediump float;' +
    'varying vec2 v_texCoord;' +
    'varying vec4 v_clipPos;' +
    'uniform sampler2D s_texture0;' +
    'uniform sampler2D s_texture1;' +
    'uniform vec4 u_channelFlag;' +
    'uniform vec4 u_baseColor;' +
    'void main()' +
    '{' +
    'vec4 col_formask = texture2D(s_texture0, v_texCoord) * u_baseColor;' +
    'vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;' +
    'float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;' +
    'col_formask = col_formask * (1.0 - maskVal);' +
    'gl_FragColor = col_formask;' +
    '}';
/**
 * A class that implements drawing instructions for WebGL
 */
export class CubismRenderer_WebGL extends CubismRenderer {
    /**
     * Execute the renderer initialization process
     * Information required for renderer initialization can be extracted from the model passed as an argument.
     *
     * @param model Model instance
     */
    initialize(model) {
        if (model.isUsingMasking()) {
            this._clippingManager = new CubismClippingManager_WebGL(); // Initialize clipping mask buffer preprocessing method
            this._clippingManager.initialize(model, model.getDrawableCount(), model.getDrawableMasks(), model.getDrawableMaskCounts());
        }
        this._sortedDrawableIndexList.resize(model.getDrawableCount(), 0);
        super.initialize(model); // call the process of the parent class
    }
    /**
     * WebGL texture binding process
     * Set a texture in CubismRenderer and use the Index value for referencing the image in CubismRenderer as the return value.
     * @param modelTextureNo Model texture number to set
     * @param glTextureNo WebGL texture number
     */
    bindTexture(modelTextureNo, glTexture) {
        this._textures.setValue(modelTextureNo, glTexture);
    }
    /**
     * Get a list of textures bound to WebGL
     * @return List of textures
     */
    getBindedTextures() {
        return this._textures;
    }
    /**
     * Set the size of the clipping mask buffer
     * Processing cost is high because FrameBuffer for mask is discarded and recreated.
     * @param size Clipping mask buffer size
     */
    setClippingMaskBufferSize(size) {
        // Destroy / recreate the instance to resize the FrameBuffer
        this._clippingManager.release();
        this._clippingManager = void 0;
        this._clippingManager = null;
        this._clippingManager = new CubismClippingManager_WebGL();
        this._clippingManager.setClippingMaskBufferSize(size);
        this._clippingManager.initialize(this.getModel(), this.getModel().getDrawableCount(), this.getModel().getDrawableMasks(), this.getModel().getDrawableMaskCounts());
    }
    /**
     * Get the size of the clipping mask buffer
     * @return Clipping mask buffer size
     */
    getClippingMaskBufferSize() {
        return this._clippingManager.getClippingMaskBufferSize();
    }
    /**
     * Constructor
     */
    constructor() {
        super();
        this.gl = null;
        this._clippingContextBufferForMask = null;
        this._clippingContextBufferForDraw = null;
        this._clippingManager = new CubismClippingManager_WebGL();
        this.firstDraw = true;
        this._textures = new csmMap();
        this._sortedDrawableIndexList = new csmVector();
        this._bufferData = {
            vertex: WebGLBuffer = null,
            uv: WebGLBuffer = null,
            index: WebGLBuffer = null
        };
        // Reserve the capacity of the texture compatible map
        this._textures.prepareCapacity(32, true);
    }
    /**
     * Destructor-equivalent processing
     */
    release() {
        this._clippingManager.release();
        this._clippingManager = void 0;
        this._clippingManager = null;
        this.gl.deleteBuffer(this._bufferData.vertex);
        this._bufferData.vertex = null;
        this.gl.deleteBuffer(this._bufferData.uv);
        this._bufferData.uv = null;
        this.gl.deleteBuffer(this._bufferData.index);
        this._bufferData.index = null;
        this._bufferData = null;
        this._textures = null;
    }
    /**
     * The actual process of drawing the model
     */
    doDrawModel() {
        // ------------ For clipping mask / buffer preprocessing method ------------
        if (this._clippingManager != null) {
            this.preDraw();
            this._clippingManager.setupClippingContext(this.getModel(), this);
        }
        // Note that PreDraw is called once even in the above clipping process !!
        this.preDraw();
        const drawableCount = this.getModel().getDrawableCount();
        const renderOrder = this.getModel().getDrawableRenderOrders();
        // Sort indexes by drawing order
        for (let i = 0; i < drawableCount; ++i) {
            const order = renderOrder[i];
            this._sortedDrawableIndexList.set(order, i);
        }
        // Drawing
        for (let i = 0; i < drawableCount; ++i) {
            const drawableIndex = this._sortedDrawableIndexList.at(i);
            // Pass the process if Drawable is not displayed
            if (!this.getModel().getDrawableDynamicFlagIsVisible(drawableIndex)) {
                continue;
            }
            // Set the clipping mask
            this.setClippingContextBufferForDraw(this._clippingManager != null
                ? this._clippingManager
                    .getClippingContextListForDraw()
                    .at(drawableIndex)
                : null);
            this.setIsCulling(this.getModel().getDrawableCulling(drawableIndex));
            this.drawMesh(this.getModel().getDrawableTextureIndices(drawableIndex), this.getModel().getDrawableVertexIndexCount(drawableIndex), this.getModel().getDrawableVertexCount(drawableIndex), this.getModel().getDrawableVertexIndices(drawableIndex), this.getModel().getDrawableVertices(drawableIndex), this.getModel().getDrawableVertexUvs(drawableIndex), this.getModel().getDrawableOpacity(drawableIndex), this.getModel().getDrawableBlendMode(drawableIndex), this.getModel().getDrawableInvertedMaskBit(drawableIndex));
        }
    }
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
    drawMesh(textureNo, indexCount, vertexCount, indexArray, vertexArray, uvArray, opacity, colorBlendMode, invertedMask) {
        // Enable / disable backside drawing
        if (this.isCulling()) {
            this.gl.enable(this.gl.CULL_FACE);
        }
        else {
            this.gl.disable(this.gl.CULL_FACE);
        }
        this.gl.frontFace(this.gl.CCW); // Cubism SDK OpenGL has CCW on the surface for both mask and art mesh.
        const modelColorRGBA = this.getModelColor();
        if (this.getClippingContextBufferForMask() == null) {
            // Other than when mask is generated
            modelColorRGBA.A *= opacity;
            if (this.isPremultipliedAlpha()) {
                modelColorRGBA.R *= modelColorRGBA.A;
                modelColorRGBA.G *= modelColorRGBA.A;
                modelColorRGBA.B *= modelColorRGBA.A;
            }
        }
        let drawtexture; // Texture to pass to the shader
        // Get the bound texture ID from the texture map
        // Set a dummy texture ID if not bound
        if (this._textures.getValue(textureNo) != null) {
            drawtexture = this._textures.getValue(textureNo);
        }
        else {
            drawtexture = null;
        }
        CubismShader_WebGL.getInstance().setupShaderProgram(this, drawtexture, vertexCount, vertexArray, indexArray, uvArray, this._bufferData, opacity, colorBlendMode, modelColorRGBA, this.isPremultipliedAlpha(), this.getMvpMatrix(), invertedMask);
        // Draw a polygon mesh
        this.gl.drawElements(this.gl.TRIANGLES, indexCount, this.gl.UNSIGNED_SHORT, 0);
        // Post-processing
        this.gl.useProgram(null);
        this.setClippingContextBufferForDraw(null);
        this.setClippingContextBufferForMask(null);
    }
    /**
     * Free the static resources held by the renderer
     * Release WebGL static shader programs
     */
    static doStaticRelease() {
        CubismShader_WebGL.deleteInstance();
    }
    /**
     * Set the render state
     * @param fbo Frame buffer specified on the application side
     * @param viewport viewport
     */
    setRenderState(fbo, viewport) {
        s_fbo = fbo;
        s_viewport = viewport;
    }
    /**
     * Additional processing at the start of drawing
     * Implements the necessary processing for clipping mask before drawing the model
     */
    preDraw() {
        if (this.firstDraw) {
            this.firstDraw = false;
            // Enable extensions
            this._anisortopy =
                this.gl.getExtension('EXT_texture_filter_anisotropic') ||
                    this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') ||
                    this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
        }
        this.gl.disable(this.gl.SCISSOR_TEST);
        this.gl.disable(this.gl.STENCIL_TEST);
        this.gl.disable(this.gl.DEPTH_TEST);
        // Culling (1.0beta3)
        this.gl.frontFace(this.gl.CW);
        this.gl.enable(this.gl.BLEND);
        this.gl.colorMask(true, true, true, true);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null); // If the buffer was previously bound, it should be destroyed
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
    /**
     * Set the clipping context to draw on the mask texture
     */
    setClippingContextBufferForMask(clip) {
        this._clippingContextBufferForMask = clip;
    }
    /**
     * Get the clipping context to draw on the mask texture
     * @return Clipping context to draw on the mask texture
     */
    getClippingContextBufferForMask() {
        return this._clippingContextBufferForMask;
    }
    /**
     * Set the clipping context to draw on the screen
     */
    setClippingContextBufferForDraw(clip) {
        this._clippingContextBufferForDraw = clip;
    }
    /**
     * Get the clipping context to draw on the screen
     * @return Clipping context to draw on the screen
     */
    getClippingContextBufferForDraw() {
        return this._clippingContextBufferForDraw;
    }
    /**
     * gl setting
     */
    startUp(gl) {
        this.gl = gl;
        this._clippingManager.setGL(gl);
        CubismShader_WebGL.getInstance().setGl(gl);
    }
}
/**
 * Release static resources held by the renderer
 */
CubismRenderer.staticRelease = () => {
    CubismRenderer_WebGL.doStaticRelease();
};
// Namespace definition for compatibility.
import * as $ from './cubismrenderer_webgl';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismClippingContext = $.CubismClippingContext;
    Live2DCubismFramework.CubismClippingManager_WebGL = $.CubismClippingManager_WebGL;
    Live2DCubismFramework.CubismRenderTextureResource = $.CubismRenderTextureResource;
    Live2DCubismFramework.CubismRenderer_WebGL = $.CubismRenderer_WebGL;
    Live2DCubismFramework.CubismShaderSet = $.CubismShaderSet;
    Live2DCubismFramework.CubismShader_WebGL = $.CubismShader_WebGL;
    Live2DCubismFramework.ShaderNames = $.ShaderNames;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismrenderer_webgl.js.map