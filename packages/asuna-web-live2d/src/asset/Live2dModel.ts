import { ICubismModelSetting } from 'cubism-framework/dist/icubismmodelsetting'
import { CubismUserModel } from 'cubism-framework/dist/model/cubismusermodel'
import { CubismMotion } from 'cubism-framework/dist/motion/cubismmotion'

export type Live2dModelId = string

export class Live2dModel extends CubismUserModel {
  id: Live2dModelId
  setting: ICubismModelSetting
  motions: { [name: string]: CubismMotion }

  /*
  CubismUserModel call order:
  - .loadModel(...)
  - .load{{System}}(...)
  - .resetRenderer()
  - .getRenderer().bindTexture(...)
  */
  constructor(id: Live2dModelId, setting: ICubismModelSetting) {
    super()
    this.id = id
    this.setting = setting
    this.motions = {}
  }

  resetRenderer(gl: WebGLRenderingContext) {
    this.deleteRenderer()
    this.createRenderer()
    this.getRenderer().setIsPremultipliedAlpha(true)
    this.getRenderer().startUp(gl)
  }
}