import { CubismModel } from '../legacy/model/cubismmodel';
import { CubismRenderer_WebGL } from '../legacy/render/cubismrenderer_webgl';
export type ModelJson = {
    Version: number;
    FileReferences: {
        Moc: string;
        Textures: string[];
        Physics: string;
        DisplayInfo: string;
        Motions?: {
            [group: string]: {
                File: string;
            }[];
        };
    };
};
export declare class Model extends CubismModel {
    renderer: CubismRenderer_WebGL;
    constructor(mocData: ArrayBuffer, gl: WebGLRenderingContext);
    release(): void;
    setParam(param: string, value: number): void;
}
//# sourceMappingURL=Model.d.ts.map