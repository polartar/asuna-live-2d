import { CubismBlendMode } from '../render/cubismrenderer';
export declare class CubismModel {
    _model: Live2DCubismCore.Model;
    constructor();
    initialize(model: Live2DCubismCore.Model): void;
    getParameterIndex(id: string): number;
    getDrawableDrawOrders(): Int32Array;
    getDrawableRenderOrders(): Int32Array;
    getDrawableTextureIndices(drawableIndex: number): number;
    getDrawableVertexUvs(drawableIndex: number): Float32Array;
    getDrawableVertexIndexCount(drawableIndex: number): number;
    getDrawableVertexIndices(drawableIndex: number): Uint16Array;
    getDrawableVertexCount(drawableIndex: number): number;
    getDrawableVertices(drawableIndex: number): Float32Array;
    getDrawableCulling(drawableIndex: number): boolean;
    getDrawableOpacity(drawableIndex: number): number;
    getDrawableCount(): number;
    getDrawableMasks(): Int32Array[];
    getDrawableMaskCounts(): Int32Array;
    isUsingMasking(): boolean;
    getDrawableBlendMode(drawableIndex: number): CubismBlendMode;
    getDrawableInvertedMaskBit(drawableIndex: number): boolean;
    getDrawableDynamicFlagVertexPositionsDidChange(drawableIndex: number): boolean;
    getDrawableDynamicFlagIsVisible(drawableIndex: number): boolean;
}
//# sourceMappingURL=cubismmodel.d.ts.map