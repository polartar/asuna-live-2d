import { CubismUserModel } from 'cubism-framework/dist/model/cubismusermodel'

export type Live2dModelId = string

export class Live2dModel extends CubismUserModel {
  id: Live2dModelId

  /*
  CubismUserModel call order:
  - .loadModel(...)
  - .load{{System}}(...)
  - .resetRenderer()
  - .getRenderer().bindTexture(...)
  */
  constructor(id: Live2dModelId) {
    super()
    this.id = id
  }

  resetRenderer(gl: WebGLRenderingContext) {
    this.deleteRenderer()
    this.createRenderer()
    this.getRenderer().setIsPremultipliedAlpha(true)
    this.getRenderer().startUp(gl)
  }
}