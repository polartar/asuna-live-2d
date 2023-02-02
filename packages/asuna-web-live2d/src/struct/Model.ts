import { CubismFramework } from 'cubism-framework/dist/live2dcubismframework'
import { Live2dModelId, Live2dModel } from '../asset/Live2dModel'
import { WorldState } from '../state/WorldState'

export class Model {
  id: number
  asset: Live2dModel

  constructor(asset: Live2dModel) {
    this.id = -1
    this.asset = asset
  }

  syncParams(params: WorldState['params']) {

    for (let [k, v] of Object.entries(params)) {
      let id = CubismFramework.getIdManager().getId(k)
      this.asset._model.setParameterValueById(id, v)
    }
  }
}