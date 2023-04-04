import { CubismModel } from '../legacy/model/cubismmodel'
import { CubismRenderer_WebGL } from '../legacy/render/cubismrenderer_webgl'

export type ModelJson = {
  Version: number,
  FileReferences: {
    Moc: string,
    Textures: string[],
    Physics: string,
    DisplayInfo: string,
    Motions?: {
      [group: string]: {
        File: string
      }[]
    }
  }
}

export class Model extends CubismModel {
  renderer: CubismRenderer_WebGL

  constructor(mocData: ArrayBuffer, gl: WebGLRenderingContext) {
    super()

    const moc = Live2DCubismCore.Moc.fromArrayBuffer(mocData)
    this._model = Live2DCubismCore.Model.fromMoc(moc)
    this.initialize(this._model)

    this.renderer = new CubismRenderer_WebGL()
    this.renderer.initialize(this)
    this.renderer.setIsPremultipliedAlpha(true)
    this.renderer.startUp(gl)
  }

  release() {
    this._model.release()
    this.renderer.release()
  }

  setParam(param: string, value: number) {
    let idx = this._model.parameters.ids.indexOf(param)

    value = Math.max(value, this._model.parameters.minimumValues[idx])
    value = Math.min(value, this._model.parameters.maximumValues[idx])

    this._model.parameters.values[idx] = value
  }
}