import { CubismPhysics } from 'asuna-cubism-framework/dist/legacy/physics/cubismphysics'
import { Model as AsunaModel } from 'asuna-cubism-framework/dist/Model'
import { ModelJson } from 'asuna-cubism-framework/dist/model/Model'
import { PhysicsJson } from 'asuna-cubism-framework/dist/physics/Physics'

export type Live2dModelId = string

export class Live2dModel extends AsunaModel {
  id: Live2dModelId
  setting: ModelJson
  physics: CubismPhysics | null
  motions: { [name: string]: {} }

  constructor(args: { id: Live2dModelId, setting: ModelJson, physicsJSON: PhysicsJson, modelData: ArrayBuffer, gl: WebGLRenderingContext }) {
    super(args.modelData, args.gl)
    this.physics = args.physicsJSON ? CubismPhysics.create(args.physicsJSON) : null
    this.id = args.id
    this.setting = args.setting
    this.motions = {}
  }

  release() {
    super.release()
  }
}